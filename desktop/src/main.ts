/**
 * v1.39 — FREYRAUM Editor desktop app (Electron main process).
 *
 * Opens the customer's FREYRAUM project folder, shows the bundled placement
 * editor at `freyraum://app/…` (see appProtocol.ts), and gives the editor a
 * narrow, checked API (preload.ts → src/online/desktopBridge.ts):
 *   project info · save into the project · run "Update Gallery" ·
 *   history · restore · choose another project folder.
 *
 * Security model (docs/DESKTOP_APP.md):
 *   - the page has no Node access (contextIsolation, sandbox, no
 *     nodeIntegration) and a strict Content Security Policy;
 *   - it can only show the app's own pages; web links open in the browser;
 *   - every write goes through scripts/local-project/projectStore.ts, which
 *     applies the same rules as the online save service;
 *   - IPC calls are accepted only from the editor window's own page.
 */
import {
  BrowserWindow,
  Menu,
  app,
  dialog,
  ipcMain,
  protocol,
  screen,
  session,
  shell,
  type IpcMainEvent,
  type IpcMainInvokeEvent,
  type MenuItemConstructorOptions,
  type WebContents,
} from 'electron';
import { existsSync, realpathSync } from 'node:fs';
import { readFile, realpath } from 'node:fs/promises';
import { join } from 'node:path';
import {
  PREVIEW_DATA_PATH,
  ProjectStoreError,
  checkProjectFolder,
  isInside,
  listHistory,
  previewNeedsImport,
  readProjectInfo,
  restoreFromHistory,
  runProjectImport,
  saveToProject,
  type ImportRunResult,
} from '../../scripts/local-project/projectStore';
import type { PublishFile } from '../../src/online/publishRules';
import type { DesktopResult } from '../../src/online/desktopBridge';
import {
  APP_CONTENT_SECURITY_POLICY,
  APP_SCHEME,
  EDITOR_URL,
  GALLERY_URL,
  LOADING_URL,
  isAppPageUrl,
  isExternalWebUrl,
  resolveAppRequest,
} from './appProtocol';
import { readSettings, writeSettings, type AppSettings } from './settings';

const APP_TITLE = 'FREYRAUM Editor';
const RELEASES_URL = 'https://github.com/SeboHasee/Freyraum/releases';
const GUIDE_URL = 'https://github.com/SeboHasee/Freyraum/blob/main/docs/CUSTOMER_PICTURE_GUIDE.md';
/** Clipboard writes ("Kopieren" in the Speichern tab) and full screen only. */
const ALLOWED_PERMISSIONS = new Set(['clipboard-sanitized-write', 'fullscreen']);

protocol.registerSchemesAsPrivileged([
  { scheme: APP_SCHEME, privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true } },
]);

// Tests run the unpackaged app with a throw-away settings folder.
if (!app.isPackaged && process.env['FREYRAUM_EDITOR_USER_DATA']) {
  app.setPath('userData', process.env['FREYRAUM_EDITOR_USER_DATA']);
}

const settingsFile = join(app.getPath('userData'), 'settings.json');
const settings: AppSettings = readSettings(settingsFile);
let projectRoot: string | null = null;
let mainWindow: BrowserWindow | null = null;
let previewWindow: BrowserWindow | null = null;
let unsavedChanges = false;
let runningImport: Promise<ImportRunResult> | null = null;

function editorDir(): string {
  return join(__dirname, 'editor');
}

function importerPath(): string {
  return app.isPackaged
    ? join(process.resourcesPath, 'importer', 'import-artworks.mjs')
    : join(__dirname, 'importer', 'import-artworks.mjs');
}

function projectFromArgs(argv: readonly string[]): string | null {
  const arg = argv.find((entry) => entry.startsWith('--project='));
  return arg && arg.length > '--project='.length ? arg.slice('--project='.length) : null;
}

// ── freyraum://app/ ──────────────────────────────────────────────────────────

function notFound(): Response {
  return new Response('Nicht gefunden', { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8' } });
}

async function handleAppRequest(request: Request): Promise<Response> {
  if (request.method !== 'GET' && request.method !== 'HEAD') return new Response(null, { status: 405 });
  const target = resolveAppRequest(request.url, { editorDir: editorDir(), projectRoot });
  if (!target) return notFound();
  try {
    if (target.source === 'project') {
      // Symbolic links must not lead out of the project's folders.
      const [file, base] = await Promise.all([realpath(target.file), realpath(target.base)]);
      if (!isInside(base, file)) return notFound();
    }
    const body = await readFile(target.file);
    const headers: Record<string, string> = {
      'content-type': target.contentType,
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
    };
    if (target.contentType.startsWith('text/html')) headers['content-security-policy'] = APP_CONTENT_SECURITY_POLICY;
    return new Response(
      request.method === 'HEAD' ? null : new Uint8Array(body.buffer, body.byteOffset, body.byteLength),
      { status: 200, headers }
    );
  } catch {
    return notFound();
  }
}

// ── Windows ──────────────────────────────────────────────────────────────────

function guardWebContents(contents: WebContents, allow: (url: string) => boolean): void {
  contents.on('will-navigate', (event) => {
    if (allow(event.url)) return;
    event.preventDefault();
    if (isExternalWebUrl(event.url)) void shell.openExternal(event.url);
  });
  contents.on('will-redirect', (event) => {
    if (!allow(event.url)) event.preventDefault();
  });
  contents.setWindowOpenHandler(({ url }) => {
    if (isExternalWebUrl(url)) void shell.openExternal(url);
    return { action: 'deny' };
  });
}

function visibleBounds(): Partial<Pick<Electron.Rectangle, 'x' | 'y'>> & { width: number; height: number } {
  const saved = settings.window;
  if (!saved) return { width: 1440, height: 900 };
  const onScreen =
    saved.x !== undefined
    && saved.y !== undefined
    && screen.getAllDisplays().some(({ workArea }) =>
      saved.x! < workArea.x + workArea.width - 80
      && saved.x! + saved.width > workArea.x + 80
      && saved.y! >= workArea.y - 20
      && saved.y! < workArea.y + workArea.height - 80
    );
  return onScreen ? { x: saved.x, y: saved.y, width: saved.width, height: saved.height } : { width: saved.width, height: saved.height };
}

function rememberBounds(window: BrowserWindow): void {
  const bounds = window.getNormalBounds();
  settings.window = { ...bounds, maximized: window.isMaximized() };
  writeSettings(settingsFile, settings);
}

function updateTitle(): void {
  const name = projectRoot ? projectRoot.split(/[\\/]/).filter(Boolean).pop() : null;
  mainWindow?.setTitle(name ? `${APP_TITLE} — ${name}` : APP_TITLE);
}

function confirmDiscard(action: string): boolean {
  if (!unsavedChanges || !mainWindow) return true;
  const choice = dialog.showMessageBoxSync(mainWindow, {
    type: 'warning',
    title: APP_TITLE,
    message: 'Es gibt ungespeicherte Änderungen.',
    detail: 'Mit „Im Projekt speichern“ sichern – oder die Änderungen verwerfen. Ein Entwurf bleibt im Editor erhalten und kann beim nächsten Öffnen wiederhergestellt werden.',
    buttons: ['Abbrechen', `Ohne Speichern ${action}`],
    defaultId: 0,
    cancelId: 0,
    noLink: true,
  });
  if (choice !== 1) return false;
  unsavedChanges = false;
  return true;
}

function createMainWindow(): BrowserWindow {
  const window = new BrowserWindow({
    ...visibleBounds(),
    minWidth: 960,
    minHeight: 640,
    title: APP_TITLE,
    backgroundColor: '#12171b',
    show: false,
    webPreferences: {
      preload: join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
      webSecurity: true,
      webviewTag: false,
      navigateOnDragDrop: false,
      spellcheck: false,
    },
  });
  if (settings.window?.maximized) window.maximize();
  window.once('ready-to-show', () => window.show());
  window.on('page-title-updated', (event) => event.preventDefault());
  guardWebContents(window.webContents, (url) => isAppPageUrl(url) && !url.startsWith(GALLERY_URL));
  window.on('close', (event) => {
    if (!confirmDiscard('schließen')) {
      event.preventDefault();
      return;
    }
    rememberBounds(window);
  });
  window.on('closed', () => {
    mainWindow = null;
    previewWindow?.close();
  });
  mainWindow = window;
  return window;
}

function openGalleryPreview(): void {
  if (!projectRoot) return;
  if (previewWindow && !previewWindow.isDestroyed()) {
    previewWindow.focus();
    void previewWindow.loadURL(GALLERY_URL);
    return;
  }
  const window = new BrowserWindow({
    width: 1280,
    height: 800,
    title: `${APP_TITLE} — Galerie-Vorschau`,
    backgroundColor: '#12171b',
    webPreferences: { contextIsolation: true, sandbox: true, nodeIntegration: false, webviewTag: false, navigateOnDragDrop: false },
  });
  window.on('page-title-updated', (event) => event.preventDefault());
  // The preview shows the gallery only; the editor stays in the main window.
  guardWebContents(window.webContents, (url) => url.startsWith(GALLERY_URL));
  window.on('closed', () => {
    previewWindow = null;
  });
  previewWindow = window;
  void window.loadURL(GALLERY_URL);
}

// ── Project ──────────────────────────────────────────────────────────────────

function runImport(root: string): Promise<ImportRunResult> {
  if (!runningImport) {
    runningImport = runProjectImport(root, {
      importerPath: importerPath(),
      execPath: process.execPath,
      env: { ...process.env, ELECTRON_RUN_AS_NODE: '1' },
    }).finally(() => {
      runningImport = null;
    });
  }
  return runningImport;
}

function reportExcerpt(report: string): string {
  const lines = report.split('\n').filter((line) => line.trim());
  return lines.slice(-20).join('\n');
}

async function showImportProblem(result: ImportRunResult): Promise<void> {
  if (!mainWindow) return;
  await dialog.showMessageBox(mainWindow, {
    type: 'warning',
    title: APP_TITLE,
    message: 'Die Galerie-Aktualisierung meldet Fehler.',
    detail: `${reportExcerpt(result.report)}\n\nDer vollständige Bericht steht in customer-artworks/last-import-report.txt.`,
    buttons: ['OK'],
  });
}

async function loadEditor(refresh: 'if-needed' | 'always'): Promise<void> {
  const window = mainWindow;
  const root = projectRoot;
  if (!window || !root) return;
  unsavedChanges = false;
  if (refresh === 'always' || previewNeedsImport(root)) {
    await window.loadURL(LOADING_URL);
    const result = await runImport(root);
    if (!result.ok) await showImportProblem(result);
  }
  if (!existsSync(join(root, PREVIEW_DATA_PATH))) {
    await dialog.showMessageBox(window, {
      type: 'error',
      title: APP_TITLE,
      message: 'Die Galerie-Daten fehlen.',
      detail: 'customer-preview/customer-artworks.js konnte nicht erzeugt werden. Bitte den Bericht in customer-artworks/last-import-report.txt prüfen.',
    });
  }
  if (mainWindow === window && projectRoot === root) await window.loadURL(EDITOR_URL);
}

async function openProject(root: string): Promise<void> {
  projectRoot = realpathSync(root);
  settings.projectRoot = projectRoot;
  writeSettings(settingsFile, settings);
  updateTitle();
  previewWindow?.close();
  await loadEditor('if-needed');
}

async function pickProjectFolder(): Promise<string | null> {
  for (;;) {
    const options: Electron.OpenDialogOptions = {
      title: 'FREYRAUM-Projektordner wählen',
      buttonLabel: 'Diesen Ordner öffnen',
      properties: ['openDirectory'],
      ...(settings.projectRoot ? { defaultPath: settings.projectRoot } : {}),
    };
    const result = mainWindow ? await dialog.showOpenDialog(mainWindow, options) : await dialog.showOpenDialog(options);
    const folder = result.filePaths[0];
    if (result.canceled || !folder) return null;
    const check = checkProjectFolder(folder);
    if (check.ok) return folder;
    const retry = {
      type: 'warning' as const,
      title: APP_TITLE,
      message: 'Das ist kein FREYRAUM-Projektordner.',
      detail: `${check.reason ?? ''}\n\nGesucht wird der Ordner mit „customer-artworks“, „package.json“ und „Update Gallery“.`,
      buttons: ['Anderen Ordner wählen', 'Abbrechen'],
      defaultId: 0,
      cancelId: 1,
    };
    const answer = mainWindow ? await dialog.showMessageBox(mainWindow, retry) : await dialog.showMessageBox(retry);
    if (answer.response !== 0) return null;
  }
}

async function chooseProject(): Promise<void> {
  if (!confirmDiscard('wechseln')) return;
  const folder = await pickProjectFolder();
  if (folder) await openProject(folder);
}

function openGuide(): void {
  const local = projectRoot ? join(projectRoot, 'docs', 'CUSTOMER_PICTURE_GUIDE.md') : null;
  if (local && existsSync(local)) void shell.openPath(local);
  else void shell.openExternal(GUIDE_URL);
}

function showAbout(): void {
  const detail = [
    `Version ${app.getVersion()}`,
    `Electron ${process.versions.electron} · Chromium ${process.versions.chrome}`,
    projectRoot ? `Projekt: ${projectRoot}` : 'Kein Projekt geöffnet',
  ].join('\n');
  const options = { type: 'info' as const, title: APP_TITLE, message: APP_TITLE, detail, buttons: ['OK'] };
  if (mainWindow) void dialog.showMessageBox(mainWindow, options);
  else void dialog.showMessageBox(options);
}

function buildMenu(): void {
  const isMac = process.platform === 'darwin';
  const appMenu: MenuItemConstructorOptions[] = isMac
    ? [{
        label: APP_TITLE,
        submenu: [
          { label: `Über ${APP_TITLE}`, click: showAbout },
          { type: 'separator' },
          { role: 'hide', label: 'Ausblenden' },
          { role: 'hideOthers', label: 'Andere ausblenden' },
          { role: 'unhide', label: 'Alle einblenden' },
          { type: 'separator' },
          { role: 'quit', label: `${APP_TITLE} beenden` },
        ],
      }]
    : [];
  const template: MenuItemConstructorOptions[] = [
    ...appMenu,
    {
      label: 'Datei',
      submenu: [
        { label: 'Projektordner öffnen…', accelerator: 'CmdOrCtrl+O', click: () => void chooseProject() },
        { label: isMac ? 'Im Finder zeigen' : 'Im Explorer zeigen', click: () => projectRoot && void shell.openPath(projectRoot) },
        { type: 'separator' },
        { label: 'Galerie-Vorschau öffnen', click: openGalleryPreview },
        {
          label: 'Galerie aktualisieren',
          click: () => {
            if (confirmDiscard('aktualisieren')) void loadEditor('always');
          },
        },
        ...(isMac ? [] : [{ type: 'separator' as const }, { role: 'quit' as const, label: 'Beenden' }]),
      ],
    },
    {
      label: 'Bearbeiten',
      submenu: [
        { role: 'undo', label: 'Rückgängig' },
        { role: 'redo', label: 'Wiederholen' },
        { type: 'separator' },
        { role: 'cut', label: 'Ausschneiden' },
        { role: 'copy', label: 'Kopieren' },
        { role: 'paste', label: 'Einfügen' },
        { role: 'selectAll', label: 'Alles auswählen' },
      ],
    },
    {
      label: 'Ansicht',
      submenu: [
        {
          label: 'Neu laden',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            if (confirmDiscard('neu laden')) void loadEditor('if-needed');
          },
        },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Originalgröße' },
        { role: 'zoomIn', label: 'Vergrößern' },
        { role: 'zoomOut', label: 'Verkleinern' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Vollbild' },
        ...(app.isPackaged ? [] : [{ type: 'separator' as const }, { role: 'toggleDevTools' as const, label: 'Entwicklerwerkzeuge' }]),
      ],
    },
    {
      label: 'Hilfe',
      submenu: [
        { label: 'Anleitung öffnen', click: openGuide },
        { label: 'Neue Version herunterladen…', click: () => void shell.openExternal(RELEASES_URL) },
        ...(isMac ? [] : [{ type: 'separator' as const }, { label: `Über ${APP_TITLE}`, click: showAbout }]),
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// ── Editor API (preload.ts) ──────────────────────────────────────────────────

function fromSender(event: IpcMainInvokeEvent | IpcMainEvent): boolean {
  return Boolean(mainWindow)
    && event.sender === mainWindow!.webContents
    && isAppPageUrl(event.senderFrame?.url ?? '');
}

function failure<T>(code: string, message: string, errors: readonly string[] = []): DesktopResult<T> {
  return { ok: false, code, message, errors: [...errors] };
}

function fromError<T>(error: unknown): DesktopResult<T> {
  if (error instanceof ProjectStoreError) return failure(error.code, error.message, error.errors);
  return failure('io', `Unerwarteter Fehler: ${error instanceof Error ? error.message : String(error)}`);
}

function handle<T>(channel: string, action: (...args: unknown[]) => T | Promise<T>): void {
  ipcMain.handle(channel, async (event, ...args: unknown[]): Promise<DesktopResult<T>> => {
    if (!fromSender(event)) return failure('forbidden', 'Nicht erlaubt.');
    if (!projectRoot) return failure('not-found', 'Kein Projektordner geöffnet.');
    try {
      return { ok: true, value: await action(...args) };
    } catch (error) {
      return fromError(error);
    }
  });
}

function packageFiles(raw: unknown): PublishFile[] {
  if (raw === undefined) return [];
  if (!Array.isArray(raw)) throw new ProjectStoreError('Die Dateiliste ist ungültig.', 'invalid');
  return raw.map((entry) => {
    const file = entry as Partial<PublishFile> | null;
    if (!file || typeof file.path !== 'string' || typeof file.contentBase64 !== 'string') {
      throw new ProjectStoreError('Eine Datei im Paket ist ungültig.', 'invalid');
    }
    return { path: file.path, contentBase64: file.contentBase64 };
  });
}

function baseVersionOf(raw: unknown): string | null {
  return typeof raw === 'string' ? raw : null;
}

function registerIpc(): void {
  handle('freyraum:project-info', () => {
    const info = readProjectInfo(projectRoot!);
    return { name: info.name, root: info.root, version: info.version, appVersion: app.getVersion() };
  });
  handle('freyraum:save', (raw) => {
    const request = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
    return saveToProject(projectRoot!, {
      baseVersion: baseVersionOf(request['baseVersion']),
      config: request['config'],
      files: packageFiles(request['files']),
    });
  });
  handle('freyraum:update-gallery', async () => {
    const result = await runImport(projectRoot!);
    return { ok: result.ok, report: result.report };
  });
  handle('freyraum:history', () => listHistory(projectRoot!));
  handle('freyraum:restore', (id, baseVersion) =>
    restoreFromHistory(projectRoot!, typeof id === 'string' ? id : '', baseVersionOf(baseVersion))
  );
  ipcMain.handle('freyraum:choose-project', async (event) => {
    if (fromSender(event)) await chooseProject();
  });
  ipcMain.on('freyraum:unsaved', (event, unsaved: unknown) => {
    if (fromSender(event)) unsavedChanges = unsaved === true;
  });
}

// ── Start ────────────────────────────────────────────────────────────────────

async function start(): Promise<void> {
  session.defaultSession.setPermissionRequestHandler((_contents, permission, callback) => callback(ALLOWED_PERMISSIONS.has(permission)));
  session.defaultSession.setPermissionCheckHandler((_contents, permission) => ALLOWED_PERMISSIONS.has(permission));
  protocol.handle(APP_SCHEME, handleAppRequest);
  registerIpc();
  buildMenu();

  const requested = projectFromArgs(process.argv);
  const remembered = requested ?? settings.projectRoot;
  let root = remembered && checkProjectFolder(remembered).ok ? remembered : null;
  if (!root) {
    await dialog.showMessageBox({
      type: 'info',
      title: APP_TITLE,
      message: remembered ? 'Der Projektordner wurde nicht gefunden.' : `Willkommen beim ${APP_TITLE}`,
      detail: remembered
        ? `${remembered}\n\nBitte den FREYRAUM-Projektordner neu wählen.`
        : 'Bitte im nächsten Schritt den FREYRAUM-Projektordner wählen – den Ordner mit „customer-artworks“ und „Update Gallery“.',
      buttons: ['Ordner wählen'],
    });
    root = await pickProjectFolder();
    if (!root) {
      app.quit();
      return;
    }
  }
  createMainWindow();
  await openProject(root);
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (!mainWindow) return;
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  });
  app.on('web-contents-created', (_event, contents) => {
    contents.on('will-attach-webview', (event) => event.preventDefault());
  });
  app.on('window-all-closed', () => app.quit());
  void app.whenReady().then(start);
}
