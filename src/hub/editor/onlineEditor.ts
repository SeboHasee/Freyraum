/**
 * v1.38 — Online editing for the deployed placement editor: login, pending
 * uploads (background + new artworks), browser drafts, and the
 * "Veröffentlichen" flow with progress, approval wait, live check, history,
 * and restore. MainMuseumHub provides the editor state through
 * `OnlineEditorHost`; the save service lives in `worker/`.
 *
 * v1.39 — One controller, interchangeable save targets:
 *   - online: the save service (deployed site with `editor-online.json`);
 *   - desktop: the FREYRAUM Editor app (`window.freyraumDesktop`), which
 *     writes into the project folder and runs "Update Gallery";
 *   - download only: `file://` preview (plus a hint pointing to the app).
 * Uploads, drafts, the pending list and history/restore are shared.
 */
import {
  MAX_PACKAGE_BYTES,
  chooseUploadArtworkId,
  safeUploadFileName,
  uniqueFileName,
  type PublishPackage,
} from '../../online/publishRules';
import {
  SaveServiceClient,
  ServiceError,
  loadOnlineSettings,
  refreshCachedSiteFiles,
  waitForLiveCommit,
  type OnlineSettings,
  type PublishResult,
} from './onlineClient';
import {
  PendingUploads,
  clearDraft,
  draftFromPending,
  loadDraft,
  prepareImageUpload,
  saveDraft,
  type EditorDraft,
  type PendingArtwork,
} from './pendingUploads';
import {
  getDesktopBridge,
  type DesktopBridge,
  type DesktopResult,
  type DesktopSaveValue,
} from '../../online/desktopBridge';

export interface BackgroundOption {
  src: string;
  width: number;
  height: number;
  /** Object URL for pending uploads; null for backgrounds already online. */
  url: string | null;
  pending: boolean;
}

export interface OnlineEditorHost {
  configJson(): string;
  backgroundSrc(): string;
  backgroundAspect(): number;
  exportValid(): boolean;
  knownArtworkIds(): string[];
  addArtwork(entry: PendingArtwork): void;
  removeArtwork(id: string): void;
  useBackground(option: BackgroundOption): void;
  applyConfig(json: string): void;
  setReadOnly(readOnly: boolean): void;
  announce(message: string): void;
  openSaveTab(): void;
}

type PublishStage =
  | 'idle'
  | 'upload'
  | 'check'
  | 'review'
  | 'deploy'
  | 'online'
  | 'saving'
  | 'updating'
  | 'saved'
  | 'error';

export type SaveTargetKind = 'online' | 'desktop' | 'download';

function formatBytes(bytes: number): string {
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? iso
    : date.toLocaleString('de-DE', { dateStyle: 'medium', timeStyle: 'short' });
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function button(text: string, className: string, action: () => void): HTMLButtonElement {
  const element = el('button', className, text);
  element.type = 'button';
  element.addEventListener('click', action);
  return element;
}

declare global {
  interface Window {
    __FREYRAUM_BACKGROUNDS?: { src: string; width: number; height: number }[];
  }
}

export class OnlineEditor {
  readonly pending = new PendingUploads();
  /** Section for the "Speichern" tab (login, publish, pending list, history). */
  readonly publishSection: HTMLElement;
  /** "Bild hinzufügen" section for the "Bilder" tab. */
  readonly uploadSection: HTMLElement;

  private settings: OnlineSettings | null = null;
  private client: SaveServiceClient | null = null;
  private desktop: DesktopBridge | null = null;
  /** Desktop: fingerprint of museum-hub.json the editor opened. */
  private projectVersion: string | null = null;
  private unsavedReported: boolean | null = null;
  private initialConfig = '';
  private stage: PublishStage = 'idle';
  private busy = false;
  private draftTimer: ReturnType<typeof setTimeout> | null = null;
  /** Bumped by every publish so an older approval wait stops. */
  private followToken = 0;
  private disposed = false;

  private readonly loginForm: HTMLFormElement;
  private readonly loginPassword: HTMLInputElement;
  private readonly loginError: HTMLElement;
  private readonly sessionRow: HTMLElement;
  private readonly sessionText: HTMLElement;
  private readonly logoutButton: HTMLButtonElement;
  private readonly sectionTitle: HTMLElement;
  private readonly pendingTitle: HTMLElement;
  private readonly localHint: HTMLElement;
  private readonly uploadHint: HTMLElement;
  private readonly publishBody: HTMLElement;
  private readonly pendingList: HTMLUListElement;
  private readonly publishButton: HTMLButtonElement;
  private readonly progress: HTMLProgressElement;
  private readonly statusText: HTMLElement;
  private readonly resultLinks: HTMLElement;
  private readonly errorList: HTMLUListElement;
  private readonly draftBanner: HTMLElement;
  private readonly historyDetails: HTMLDetailsElement;
  private readonly historyList: HTMLUListElement;
  private readonly uploadList: HTMLUListElement;
  private readonly uploadStatus: HTMLElement;
  private readonly uploadTitle: HTMLInputElement;
  private readonly uploadCredit: HTMLInputElement;

  constructor(private readonly host: OnlineEditorHost) {
    // ── Speichern tab section ───────────────────────────────────────────────
    const section = el('section', 'museum-hub__editor-section museum-hub__publish');
    section.setAttribute('aria-labelledby', 'editor-publish-title');
    section.hidden = true;
    const title = el('h3', undefined, 'Online veröffentlichen');
    title.id = 'editor-publish-title';
    const localHint = el('p', 'museum-hub__editor-hint museum-hub__local-save-hint');
    localHint.hidden = true;

    const loginForm = el('form', 'museum-hub__publish-login');
    loginForm.setAttribute('aria-labelledby', 'editor-login-title');
    const loginTitle = el('p', 'museum-hub__publish-login-title', 'Bearbeiten anmelden');
    loginTitle.id = 'editor-login-title';
    const loginHint = el('p', 'museum-hub__editor-hint', 'Ohne Anmeldung ist der Editor nur eine Vorschau.');
    const passwordLabel = el('label', 'museum-hub__calibration-label', 'Passwort');
    const password = el('input');
    password.type = 'password';
    password.autocomplete = 'current-password';
    password.required = true;
    password.className = 'museum-hub__publish-password';
    passwordLabel.appendChild(password);
    const loginButton = el('button', 'museum-hub__calibration-action museum-hub__publish-primary', 'Anmelden');
    loginButton.type = 'submit';
    const loginError = el('p', 'museum-hub__publish-error');
    loginError.setAttribute('role', 'alert');
    loginForm.append(loginTitle, loginHint, passwordLabel, loginButton, loginError);
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      void this.login(password.value);
    });

    const sessionRow = el('div', 'museum-hub__publish-session');
    const sessionText = el('span');
    const logoutButton = button('Abmelden', 'museum-hub__calibration-action', () => this.logout());
    sessionRow.append(sessionText, logoutButton);

    const draftBanner = el('div', 'museum-hub__publish-draft');
    draftBanner.hidden = true;

    const publishBody = el('div', 'museum-hub__publish-body');
    const pendingTitle = el('h4', undefined, 'Wird veröffentlicht');
    const pendingList = el('ul', 'museum-hub__publish-pending');
    pendingList.setAttribute('aria-label', 'Wird veröffentlicht');
    const publishButton = button('Veröffentlichen', 'museum-hub__calibration-action museum-hub__publish-primary museum-hub__publish-button', () => void this.publish());
    const progress = el('progress', 'museum-hub__publish-progress');
    progress.max = 1;
    progress.value = 0;
    progress.hidden = true;
    const statusText = el('p', 'museum-hub__publish-status');
    statusText.setAttribute('role', 'status');
    statusText.setAttribute('aria-live', 'polite');
    const errorList = el('ul', 'museum-hub__calibration-warnings museum-hub__publish-errors');
    const resultLinks = el('p', 'museum-hub__publish-links');
    const historyDetails = el('details', 'museum-hub__calibration-advanced museum-hub__publish-history');
    const historySummary = el('summary', undefined, 'Frühere Version wiederherstellen');
    const historyList = el('ul', 'museum-hub__publish-history-list');
    historyDetails.append(historySummary, historyList);
    historyDetails.addEventListener('toggle', () => {
      if (historyDetails.open) void this.loadHistory();
    });
    publishBody.append(pendingTitle, pendingList, publishButton, progress, statusText, errorList, resultLinks, historyDetails);
    section.append(title, localHint, loginForm, sessionRow, draftBanner, publishBody);

    // ── Bilder tab section ──────────────────────────────────────────────────
    const upload = el('section', 'museum-hub__editor-section museum-hub__artwork-upload');
    upload.setAttribute('aria-labelledby', 'editor-upload-title');
    upload.hidden = true;
    const uploadTitleHeading = el('h3', undefined, 'Bild hinzufügen');
    uploadTitleHeading.id = 'editor-upload-title';
    const titleLabel = el('label', 'museum-hub__calibration-label', 'Titel');
    const titleInput = el('input');
    titleInput.type = 'text';
    titleInput.maxLength = 120;
    titleInput.className = 'museum-hub__upload-title';
    titleLabel.appendChild(titleInput);
    const creditLabel = el('label', 'museum-hub__calibration-label', 'Künstler/in');
    const creditInput = el('input');
    creditInput.type = 'text';
    creditInput.maxLength = 120;
    creditInput.className = 'museum-hub__upload-credit';
    creditLabel.appendChild(creditInput);
    const drop = el('label', 'museum-hub__upload-drop');
    drop.append(el('span', undefined, 'Bild hierher ziehen oder auswählen (JPG, PNG, WebP)'));
    const fileInput = el('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/png,image/jpeg,image/webp';
    fileInput.className = 'museum-hub__file-input museum-hub__upload-input';
    fileInput.addEventListener('change', () => {
      const file = fileInput.files?.[0];
      fileInput.value = '';
      if (file) void this.addArtworkFile(file);
    });
    drop.appendChild(fileInput);
    drop.addEventListener('dragover', (event) => {
      event.preventDefault();
      drop.classList.add('is-dragover');
    });
    drop.addEventListener('dragleave', () => drop.classList.remove('is-dragover'));
    drop.addEventListener('drop', (event) => {
      event.preventDefault();
      drop.classList.remove('is-dragover');
      const file = event.dataTransfer?.files?.[0];
      if (file) void this.addArtworkFile(file);
    });
    const uploadHint = el(
      'p',
      'museum-hub__editor-hint',
      'Große Bilder werden auf höchstens 4096 px verkleinert. Das neue Bild erscheint unten in der Liste und kann sofort platziert werden; es wird mit „Veröffentlichen“ hochgeladen.'
    );
    const uploadStatus = el('p', 'museum-hub__publish-status museum-hub__upload-status');
    uploadStatus.setAttribute('role', 'status');
    const uploadList = el('ul', 'museum-hub__upload-list');
    uploadList.setAttribute('aria-label', 'Neue Bilder');
    upload.append(uploadTitleHeading, titleLabel, creditLabel, drop, uploadHint, uploadStatus, uploadList);

    this.publishSection = section;
    this.uploadSection = upload;
    this.loginForm = loginForm;
    this.loginPassword = password;
    this.loginError = loginError;
    this.sessionRow = sessionRow;
    this.sessionText = sessionText;
    this.logoutButton = logoutButton;
    this.sectionTitle = title;
    this.pendingTitle = pendingTitle;
    this.localHint = localHint;
    this.uploadHint = uploadHint;
    this.publishBody = publishBody;
    this.pendingList = pendingList;
    this.publishButton = publishButton;
    this.progress = progress;
    this.statusText = statusText;
    this.resultLinks = resultLinks;
    this.errorList = errorList;
    this.draftBanner = draftBanner;
    this.historyDetails = historyDetails;
    this.historyList = historyList;
    this.uploadList = uploadList;
    this.uploadStatus = uploadStatus;
    this.uploadTitle = titleInput;
    this.uploadCredit = creditInput;
  }

  /** True when the deployed site has a save service configured. */
  get online(): boolean {
    return Boolean(this.client);
  }

  /** True inside the FREYRAUM Editor desktop app. */
  get desktopMode(): boolean {
    return Boolean(this.desktop);
  }

  get saveTarget(): SaveTargetKind {
    return this.desktop ? 'desktop' : this.client ? 'online' : 'download';
  }

  get loggedIn(): boolean {
    return Boolean(this.desktop) || Boolean(this.client?.loggedIn);
  }

  /** Version the drafts and conflict checks refer to (commit online, file fingerprint on the desktop). */
  private get baseVersion(): string | null {
    return this.desktop ? this.projectVersion : this.settings?.commit ?? null;
  }

  async init(initialConfig: string): Promise<void> {
    this.initialConfig = initialConfig;
    const desktop = getDesktopBridge();
    if (desktop) {
      await this.initDesktop(desktop);
      return;
    }
    if (window.location.protocol === 'file:') {
      // Download-only preview: point to the desktop app for direct saving.
      this.sectionTitle.textContent = 'Direkt im Projekt speichern';
      this.localHint.textContent =
        'Hier im Browser wird die Konfiguration nur heruntergeladen. Direkt im Projektordner speichern – mit neuen Bildern, Hintergrund und automatischer Galerie-Aktualisierung – geht mit der App „FREYRAUM Editor“ (Anleitung: docs/CUSTOMER_PICTURE_GUIDE.md).';
      this.localHint.hidden = false;
      this.loginForm.hidden = true;
      this.sessionRow.hidden = true;
      this.publishBody.hidden = true;
      this.publishSection.hidden = false;
      return;
    }
    this.settings = await loadOnlineSettings();
    if (this.disposed || !this.settings?.saveServiceUrl) return;
    this.client = new SaveServiceClient(this.settings.saveServiceUrl);
    this.publishSection.hidden = false;
    this.uploadSection.hidden = false;
    this.syncLoginState();
    if (!this.client.loggedIn) {
      this.host.openSaveTab();
      this.loginPassword.focus({ preventScroll: true });
    }
    const draft = await loadDraft();
    if (draft && !this.disposed) this.showDraftBanner(draft);
    this.refresh();
  }

  private async initDesktop(desktop: DesktopBridge): Promise<void> {
    const info = await desktop.projectInfo().catch(() => null);
    if (this.disposed) return;
    if (!info || !info.ok) {
      this.sectionTitle.textContent = 'Im Projekt speichern';
      this.localHint.textContent = info && !info.ok ? info.message : 'Der Projektordner ist nicht erreichbar.';
      this.localHint.hidden = false;
      this.loginForm.hidden = true;
      this.sessionRow.hidden = true;
      this.publishBody.hidden = true;
      this.publishSection.hidden = false;
      return;
    }
    this.desktop = desktop;
    this.projectVersion = info.value.version;
    this.sectionTitle.textContent = 'Im Projekt speichern';
    this.pendingTitle.textContent = 'Wird gespeichert';
    this.pendingList.setAttribute('aria-label', 'Wird gespeichert');
    this.publishButton.textContent = 'Im Projekt speichern';
    this.localHint.textContent =
      'Speichert direkt in den Projektordner und aktualisiert die Galerie. Online geht die Änderung erst mit dem üblichen Veröffentlichen (Git: Commit + Push).';
    this.localHint.hidden = false;
    this.uploadHint.textContent =
      'Große Bilder werden auf höchstens 4096 px verkleinert. Das neue Bild erscheint unten in der Liste und kann sofort platziert werden; es wird mit „Im Projekt speichern“ in customer-artworks/inbox abgelegt.';
    this.logoutButton.hidden = true;
    this.sessionText.textContent = `Projekt: ${info.value.name} · ${info.value.root}`;
    this.sessionText.title = info.value.root;
    const changeFolder = button('Anderen Projektordner öffnen', 'museum-hub__calibration-action museum-hub__desktop-folder', () => {
      void desktop.chooseProject();
    });
    this.sessionRow.appendChild(changeFolder);
    this.loginForm.hidden = true;
    this.sessionRow.hidden = false;
    this.publishBody.hidden = false;
    this.publishSection.hidden = false;
    this.uploadSection.hidden = false;
    this.host.setReadOnly(false);
    const draft = await loadDraft();
    if (draft && !this.disposed) this.showDraftBanner(draft);
    this.refresh();
  }

  /** Existing backgrounds (from the importer) plus a pending upload. */
  backgroundOptions(): BackgroundOption[] {
    const options: BackgroundOption[] = (window.__FREYRAUM_BACKGROUNDS ?? [])
      .filter((entry) => typeof entry?.src === 'string')
      .map((entry) => ({ src: entry.src, width: entry.width, height: entry.height, url: null, pending: false }));
    const pending = this.pending.background;
    if (pending) {
      options.push({ src: pending.src, width: pending.width, height: pending.height, url: pending.objectUrl, pending: true });
    }
    // A background saved this session stays selectable until the reload.
    const saved = this.pending.publishedBackground(this.host.backgroundSrc());
    if (saved && !options.some((option) => option.src === saved.src)) {
      options.push({ src: saved.src, width: saved.width, height: saved.height, url: saved.objectUrl, pending: false });
    }
    return options;
  }

  pendingBackgroundUrl(src: string): string | null {
    if (this.pending.background?.src === src) return this.pending.background.objectUrl;
    return this.pending.publishedBackground(src)?.objectUrl ?? null;
  }

  /** Background from the computer: lowercase safe name, kept as pending upload. */
  async uploadBackground(file: File): Promise<string> {
    const prepared = await prepareImageUpload(file);
    const existing = (window.__FREYRAUM_BACKGROUNDS ?? []).map((entry) => entry.src.replace(/^Backgrounds\//, ''));
    const name = uniqueFileName(safeUploadFileName(file.name, prepared.extension), existing);
    const previousAspect = this.host.backgroundAspect();
    const background = this.pending.setBackground({
      name,
      src: `Backgrounds/${name}`,
      blob: prepared.blob,
      width: prepared.width,
      height: prepared.height,
    });
    this.host.useBackground({
      src: background.src,
      width: background.width,
      height: background.height,
      url: background.objectUrl,
      pending: true,
    });
    const aspect = prepared.width / prepared.height;
    const aspectHint = Math.abs(aspect - previousAspect) / previousAspect > 0.01
      ? ` Das Seitenverhältnis (${aspect.toFixed(3)}) weicht vom bisherigen (${previousAspect.toFixed(3)}) ab – bitte die Wände prüfen.`
      : '';
    const where = this.desktop
      ? 'Wird mit „Im Projekt speichern“ gespeichert.'
      : this.online
        ? 'Wird mit veröffentlicht.'
        : 'Datei unter diesem Namen nach customer-artworks/Backgrounds kopieren.';
    this.notifyChange();
    return `${name} · ${prepared.width}×${prepared.height}px${prepared.resized ? ' (verkleinert)' : ''}. ${where}${aspectHint}`;
  }

  private async addArtworkFile(file: File): Promise<void> {
    this.uploadStatus.textContent = `${file.name} wird vorbereitet…`;
    try {
      const prepared = await prepareImageUpload(file);
      const id = chooseUploadArtworkId(file.name, [
        ...this.host.knownArtworkIds(),
        ...this.pending.artworks.map((entry) => entry.id),
      ]);
      const title = this.uploadTitle.value.trim() || file.name.replace(/\.[^.]*$/, '');
      const entry = this.pending.addArtwork({
        id,
        fileName: `${id}.${prepared.extension}`,
        blob: prepared.blob,
        width: prepared.width,
        height: prepared.height,
        title,
        credit: this.uploadCredit.value.trim(),
      });
      this.host.addArtwork(entry);
      this.uploadTitle.value = '';
      this.uploadCredit.value = '';
      const message = `„${title}“ hinzugefügt (${prepared.width}×${prepared.height}px${prepared.resized ? ', verkleinert' : ''}). Jetzt in der Liste unten platzieren.`;
      this.uploadStatus.textContent = message;
      this.host.announce(message);
      this.notifyChange();
    } catch {
      this.uploadStatus.textContent = `${file.name} konnte nicht gelesen werden. Bitte ein JPG-, PNG- oder WebP-Bild wählen.`;
    }
  }

  private removePendingArtwork(id: string): void {
    const removed = this.pending.removeArtwork(id);
    if (!removed) return;
    this.host.removeArtwork(id);
    URL.revokeObjectURL(removed.objectUrl);
    this.host.announce(`„${removed.title}“ wurde entfernt.`);
    this.notifyChange();
  }

  /** Called by the hub after every editor change. */
  notifyChange(): void {
    this.refresh();
    if ((!this.online && !this.desktop) || this.disposed) return;
    if (this.draftTimer !== null) clearTimeout(this.draftTimer);
    this.draftTimer = setTimeout(() => {
      this.draftTimer = null;
      const config = this.host.configJson();
      if (config === this.initialConfig && this.pending.isEmpty) {
        void clearDraft();
        return;
      }
      void saveDraft(draftFromPending(this.pending, this.baseVersion, config));
    }, 800);
  }

  private showDraftBanner(draft: EditorDraft): void {
    const base = this.baseVersion;
    const stale = Boolean(draft.baseCommit && base && draft.baseCommit !== base);
    this.draftBanner.replaceChildren();
    const text = el(
      'p',
      undefined,
      stale
        ? `Ein Entwurf vom ${formatDate(draft.savedAt)} gehört zu einer älteren Version der Galerie.`
        : `Ungespeicherter Entwurf vom ${formatDate(draft.savedAt)} gefunden.`
    );
    const actions = el('div', 'museum-hub__editor-actions');
    if (!stale) {
      actions.appendChild(button('Entwurf wiederherstellen', 'museum-hub__calibration-action', () => this.restoreDraft(draft)));
    }
    actions.appendChild(button('Entwurf verwerfen', 'museum-hub__calibration-action', () => {
      void clearDraft();
      this.draftBanner.hidden = true;
    }));
    this.draftBanner.append(text, actions);
    this.draftBanner.hidden = false;
  }

  private restoreDraft(draft: EditorDraft): void {
    for (const artwork of draft.artworks) {
      if (this.pending.artworks.some((entry) => entry.id === artwork.id)) continue;
      this.host.addArtwork(this.pending.addArtwork(artwork));
    }
    if (draft.background) this.pending.setBackground(draft.background);
    this.host.applyConfig(draft.config);
    this.draftBanner.hidden = true;
    this.host.announce('Entwurf wiederhergestellt.');
    this.notifyChange();
  }

  private syncLoginState(): void {
    if (this.desktop) return;
    const loggedIn = this.loggedIn;
    this.loginForm.hidden = loggedIn;
    this.sessionRow.hidden = !loggedIn;
    this.publishBody.hidden = !loggedIn;
    this.uploadSection.hidden = !loggedIn;
    this.sessionText.textContent = loggedIn
      ? `Angemeldet · ${this.client?.mode === 'auto-merge' ? 'Änderungen gehen direkt online' : 'Änderungen warten auf Freigabe'}`
      : '';
    this.host.setReadOnly(Boolean(this.client) && !loggedIn);
  }

  private async login(password: string): Promise<void> {
    if (!this.client || this.busy) return;
    this.loginError.textContent = '';
    this.busy = true;
    try {
      await this.client.login(password);
      this.loginPassword.value = '';
      this.host.announce('Angemeldet. Änderungen können jetzt veröffentlicht werden.');
    } catch (error) {
      this.loginError.textContent = error instanceof ServiceError ? error.message : 'Anmeldung fehlgeschlagen.';
    } finally {
      this.busy = false;
      this.syncLoginState();
      this.refresh();
    }
  }

  private logout(): void {
    this.client?.logout();
    this.syncLoginState();
    this.host.announce('Abgemeldet. Der Editor ist jetzt nur eine Vorschau.');
  }

  private refresh(): void {
    if (this.disposed) return;
    const backgroundSrc = this.host.backgroundSrc();
    const items: HTMLLIElement[] = [];
    const layoutChanged = this.host.configJson() !== this.initialConfig;
    if (layoutChanged) items.push(el('li', undefined, 'Geändertes Layout (museum-hub.json)'));
    const background = this.pending.background;
    if (background && background.src === backgroundSrc) {
      items.push(el('li', undefined, `Neuer Hintergrund: ${background.name} · ${formatBytes(background.blob.size)}`));
    }
    const uploadItems: HTMLLIElement[] = [];
    for (const artwork of this.pending.artworks) {
      const text = `Neues Bild: ${artwork.title} (${artwork.fileName}) · ${formatBytes(artwork.blob.size)}`;
      const item = el('li', undefined, text);
      items.push(item);
      const uploadItem = el('li', 'museum-hub__publish-pending-item');
      uploadItem.append(
        el('span', undefined, `${artwork.title} · ${artwork.width}×${artwork.height}px`),
        button('Entfernen', 'museum-hub__calibration-action', () => this.removePendingArtwork(artwork.id))
      );
      uploadItems.push(uploadItem);
    }
    if (items.length === 0) items.push(el('li', 'is-empty', 'Keine Änderungen seit dem Öffnen.'));
    const total = this.pending.totalBytes(backgroundSrc);
    if (total > 0) items.push(el('li', 'is-total', `${this.desktop ? 'Neue Dateien gesamt' : 'Upload gesamt'}: ${formatBytes(total)}`));
    this.pendingList.replaceChildren(...items);
    this.uploadList.replaceChildren(...uploadItems);
    const hasChanges = layoutChanged || total > 0;
    if (this.desktop && this.unsavedReported !== hasChanges) {
      this.unsavedReported = hasChanges;
      this.desktop.setUnsavedChanges(hasChanges);
    }
    this.publishButton.disabled = this.busy || !this.loggedIn || !hasChanges || !this.host.exportValid() || total > MAX_PACKAGE_BYTES;
    this.publishButton.title = !this.host.exportValid()
      ? 'Zuerst die Fehler beheben (siehe oben).'
      : total > MAX_PACKAGE_BYTES
        ? `Höchstens ${formatBytes(MAX_PACKAGE_BYTES)} pro ${this.desktop ? 'Speichern' : 'Veröffentlichung'}.`
        : '';
  }

  private setStage(stage: PublishStage, message: string, progress: number | null = null): void {
    this.stage = stage;
    this.publishSection.dataset['publishStage'] = stage;
    this.statusText.textContent = message;
    this.progress.hidden = progress === null;
    if (progress !== null) this.progress.value = Math.max(0, Math.min(1, progress));
    this.host.announce(message);
  }

  private showErrors(errors: readonly string[]): void {
    this.errorList.replaceChildren(
      ...errors.map((text) => {
        const item = el('li', 'is-error', text);
        return item;
      })
    );
  }

  private link(text: string, href: string): HTMLAnchorElement {
    const anchor = el('a', 'museum-hub__publish-link', text);
    anchor.href = href;
    anchor.target = '_blank';
    anchor.rel = 'noopener';
    return anchor;
  }

  private async publish(): Promise<void> {
    if (this.desktop) {
      await this.saveToProject();
      return;
    }
    if (!this.client || this.busy) return;
    if (!this.host.exportValid()) {
      this.setStage('error', 'Veröffentlichen ist gesperrt, bis die Fehler behoben sind.');
      return;
    }
    this.busy = true;
    this.refresh();
    this.showErrors([]);
    this.resultLinks.replaceChildren();
    try {
      this.setStage('upload', 'Wird hochgeladen…', 0);
      const config = JSON.parse(this.host.configJson()) as unknown;
      const pkg: PublishPackage = {
        baseCommit: this.settings?.commit ?? null,
        message: this.publishMessage(),
        config,
        files: await this.pending.toFiles(this.host.backgroundSrc()),
      };
      const result = await this.client.publish(pkg, (fraction) => {
        if (fraction >= 1) this.setStage('check', 'Wird geprüft…', null);
        else this.setStage('upload', `Wird hochgeladen… ${Math.round(fraction * 100)} %`, fraction);
      });
      await this.follow(result);
    } catch (error) {
      this.handleError(error);
    } finally {
      this.busy = false;
      this.refresh();
    }
  }

  /** Desktop: write into the project folder, then run "Update Gallery" and reload. */
  private async saveToProject(): Promise<void> {
    const desktop = this.desktop;
    if (!desktop || this.busy) return;
    if (!this.host.exportValid()) {
      this.setStage('error', 'Speichern ist gesperrt, bis die Fehler behoben sind.');
      return;
    }
    this.busy = true;
    this.refresh();
    this.showErrors([]);
    this.resultLinks.replaceChildren();
    try {
      this.setStage('saving', 'Wird gespeichert…', null);
      const config = JSON.parse(this.host.configJson()) as unknown;
      const files = await this.pending.toFiles(this.host.backgroundSrc());
      const result = await desktop.save({ baseVersion: this.projectVersion, config, files });
      await this.afterDesktopWrite(desktop, result);
    } catch {
      this.setStage('error', 'Speichern fehlgeschlagen. Bitte erneut versuchen.');
    } finally {
      this.busy = false;
      this.refresh();
    }
  }

  private async afterDesktopWrite(desktop: DesktopBridge, result: DesktopResult<DesktopSaveValue>): Promise<void> {
    if (!result.ok) {
      this.setStage(
        'error',
        result.code === 'stale'
          ? 'Neuere Version vorhanden – bitte neu laden. Ihr Entwurf bleibt gespeichert.'
          : result.message
      );
      this.showErrors(result.errors);
      return;
    }
    this.pending.markPublished();
    await clearDraft();
    this.projectVersion = result.value.version;
    this.initialConfig = this.host.configJson();
    this.refresh();
    this.setStage('updating', 'Galerie wird aktualisiert…', null);
    const update = await desktop.updateGallery().catch(() => null);
    if (!update || !update.ok || !update.value.ok) {
      const report = update && update.ok ? update.value.report : update && !update.ok ? update.message : '';
      this.setStage('error', 'Gespeichert. Die Galerie-Aktualisierung meldet Fehler – bitte den Bericht prüfen.');
      this.showErrors(
        report
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line.startsWith('!') || line.startsWith('✗'))
          .slice(0, 12)
      );
      this.resultLinks.replaceChildren(button('Neu laden', 'museum-hub__calibration-action', () => window.location.reload()));
      return;
    }
    this.setStage('saved', 'Gespeichert ✓ · Lokal gespeichert – noch nicht online', null);
    setTimeout(() => {
      if (!this.disposed) window.location.reload();
    }, 1200);
  }

  private publishMessage(): string {
    const parts: string[] = [];
    if (this.pending.artworks.length > 0) parts.push(`${this.pending.artworks.length} neue(s) Bild(er)`);
    if (this.pending.background?.src === this.host.backgroundSrc()) parts.push('neuer Hintergrund');
    if (this.host.configJson() !== this.initialConfig) parts.push('Layout');
    return parts.join(', ') || 'Änderungen';
  }

  /** Waits for approval (pull-request mode) and the deploy, then reloads. */
  private async follow(result: PublishResult): Promise<void> {
    this.followToken += 1;
    this.pending.markPublished();
    await clearDraft();
    this.initialConfig = this.host.configJson();
    this.refresh();
    const pullLink = this.link('Änderung auf GitHub ansehen', result.pullRequest.url);
    if (!result.liveCommit) {
      // Waiting for approval must not block further edits: the next publish
      // is stacked onto the same pull request by the save service.
      this.setStage('review', 'Wartet auf Freigabe. Die Galerie wird nach der Freigabe automatisch aktualisiert.');
      this.resultLinks.replaceChildren(pullLink);
      void this.waitForApproval(result.pullRequest.number);
      return;
    }
    await this.waitForDeploy(result.liveCommit);
  }

  private async waitForApproval(pullNumber: number): Promise<void> {
    const client = this.client!;
    const token = ++this.followToken;
    while (!this.disposed && token === this.followToken) {
      await new Promise((resolve) => setTimeout(resolve, 20_000));
      if (this.disposed || token !== this.followToken) return;
      try {
        const status = await client.status({ pr: pullNumber });
        if (status.pullRequest?.merged && status.pullRequest.mergeCommit) {
          await this.waitForDeploy(status.pullRequest.mergeCommit);
          return;
        }
        if (status.pullRequest && status.pullRequest.state === 'closed') {
          this.setStage('error', 'Die Änderung wurde nicht freigegeben.');
          return;
        }
      } catch {
        // Keep waiting; the service may be briefly unavailable.
      }
    }
  }

  private async waitForDeploy(liveCommit: string): Promise<void> {
    const client = this.client!;
    this.setStage('deploy', 'Wird veröffentlicht (~2 Min)…', null);
    const live = await waitForLiveCommit(liveCommit, {
      intervalMs: 10_000,
      isCancelled: () => this.disposed,
    });
    if (!live) {
      let deployUrl: string | null = null;
      try {
        const status = await client.status({ commit: liveCommit });
        deployUrl = status.deploy?.url ?? null;
        if (status.deploy?.conclusion && status.deploy.conclusion !== 'success') {
          this.setStage('error', 'Die Veröffentlichung ist fehlgeschlagen; die Galerie zeigt weiter die letzte gute Version.');
          if (deployUrl) this.resultLinks.replaceChildren(this.link('Details ansehen', deployUrl));
          return;
        }
      } catch {
        deployUrl = null;
      }
      this.setStage('error', 'Die neue Version ist noch nicht online. Bitte später neu laden.');
      return;
    }
    this.setStage('online', 'Online ✓', null);
    const galleryHref = new URL(import.meta.env.BASE_URL, window.location.href).href;
    this.resultLinks.replaceChildren(this.link('Galerie ansehen', galleryHref));
    await refreshCachedSiteFiles();
    setTimeout(() => {
      if (!this.disposed) window.location.reload();
    }, 3000);
  }

  private handleError(error: unknown): void {
    if (error instanceof ServiceError) {
      if (error.status === 401) {
        this.syncLoginState();
        this.setStage('error', 'Die Anmeldung ist abgelaufen. Bitte neu anmelden; die Änderungen bleiben erhalten.');
        return;
      }
      if (error.code === 'stale') {
        this.setStage('error', 'Neuere Version vorhanden – bitte neu laden. Ihr Entwurf bleibt im Browser gespeichert.');
        return;
      }
      this.setStage('error', error.message);
      this.showErrors(error.errors);
      return;
    }
    this.setStage('error', 'Veröffentlichen fehlgeschlagen. Bitte erneut versuchen.');
  }

  private async loadHistory(): Promise<void> {
    if (this.desktop) {
      await this.loadDesktopHistory(this.desktop);
      return;
    }
    if (!this.client) return;
    this.historyList.replaceChildren(el('li', undefined, 'Wird geladen…'));
    try {
      const versions = await this.client.history();
      this.historyList.replaceChildren(
        ...versions.map((version, index) => {
          const item = el('li', 'museum-hub__publish-history-item');
          const label = el('span', undefined, `${formatDate(version.date)} · ${version.message}${index === 0 ? ' (aktuell)' : ''}`);
          item.appendChild(label);
          if (index > 0) {
            item.appendChild(button('Wiederherstellen', 'museum-hub__calibration-action', () => void this.restore(version.sha, version.date)));
          }
          return item;
        })
      );
      if (versions.length === 0) this.historyList.replaceChildren(el('li', undefined, 'Noch keine Versionen.'));
    } catch (error) {
      this.historyList.replaceChildren(el('li', 'is-error', error instanceof ServiceError ? error.message : 'Verlauf nicht verfügbar.'));
    }
  }

  private async loadDesktopHistory(desktop: DesktopBridge): Promise<void> {
    this.historyList.replaceChildren(el('li', undefined, 'Wird geladen…'));
    const result = await desktop.history().catch(() => null);
    if (!result || !result.ok) {
      this.historyList.replaceChildren(el('li', 'is-error', result && !result.ok ? result.message : 'Verlauf nicht verfügbar.'));
      return;
    }
    const items = result.value.map((entry) => {
      const item = el('li', 'museum-hub__publish-history-item');
      item.appendChild(el('span', undefined, `${formatDate(entry.savedAt)}${entry.current ? ' (aktuell)' : ' · gesicherte Version'}`));
      if (!entry.current) {
        item.appendChild(button('Wiederherstellen', 'museum-hub__calibration-action', () => void this.restoreDesktop(desktop, entry.id, entry.savedAt)));
      }
      return item;
    });
    this.historyList.replaceChildren(...(items.length > 0 ? items : [el('li', undefined, 'Noch keine Versionen.')]));
  }

  private async restoreDesktop(desktop: DesktopBridge, id: string, date: string): Promise<void> {
    if (this.busy) return;
    if (!window.confirm(`Die Version vom ${formatDate(date)} wiederherstellen? Die aktuelle Anordnung wird vorher gesichert (Bilder bleiben erhalten).`)) return;
    this.busy = true;
    this.refresh();
    this.historyDetails.open = false;
    try {
      this.setStage('saving', 'Frühere Version wird wiederhergestellt…', null);
      await this.afterDesktopWrite(desktop, await desktop.restore(id, this.projectVersion));
    } catch {
      this.setStage('error', 'Wiederherstellen fehlgeschlagen. Bitte erneut versuchen.');
    } finally {
      this.busy = false;
      this.refresh();
    }
  }

  private async restore(sha: string, date: string): Promise<void> {
    if (!this.client || this.busy) return;
    if (!window.confirm(`Die Version vom ${formatDate(date)} wiederherstellen? Die aktuelle Anordnung wird ersetzt (Bilder bleiben erhalten).`)) return;
    this.busy = true;
    this.refresh();
    this.historyDetails.open = false;
    try {
      this.setStage('check', 'Frühere Version wird geprüft…', null);
      await this.follow(await this.client.restore(sha));
    } catch (error) {
      this.handleError(error);
    } finally {
      this.busy = false;
      this.refresh();
    }
  }

  get publishStage(): PublishStage {
    return this.stage;
  }

  dispose(): void {
    this.disposed = true;
    if (this.draftTimer !== null) clearTimeout(this.draftTimer);
    this.pending.clear();
  }
}
