# FREYRAUM Editor — desktop app (v1.40)
> Latest markdown audit: 2026-10-21 (v1.42 merge readiness).

The desktop app is the placement editor as a normal Windows/macOS program. It
opens the customer's FREYRAUM project folder (the Git checkout), saves new
pictures, backgrounds and `museum-hub.json` directly into it, and runs
"Update Gallery" itself. **No Node.js installation is needed**; the app runs the
importer with Electron's bundled Node.

Customer instructions: `docs/CUSTOMER_PICTURE_GUIDE.md` → "FREYRAUM Editor (App)".

## What lives where

| Part | Location |
| --- | --- |
| App (main process, preload, `freyraum://` address, settings) | `desktop/src/` |
| App build (esbuild + editor bundle copy + app pages) | `desktop/scripts/build.mjs` → `desktop/dist/` |
| Packaging (electron-builder config) | `desktop/package.json` → `"build"` |
| Save logic shared by app and tests | `scripts/local-project/projectStore.ts` |
| Save rules shared with the online save service | `src/online/publishRules.ts` |
| Editor side (save target "desktop") | `src/hub/editor/onlineEditor.ts`, `src/online/desktopBridge.ts` |
| Release workflow | `.github/workflows/desktop-release.yml` |

The app ships **the editor, not the gallery content**. Gallery data, images
and backgrounds always come from the opened project folder. The app has its
own `package.json`, so the Pages deploy never downloads Electron.

## Build and run locally

```bash
npm ci && npm run import:artworks && npm run build   # repository root: editor bundle
cd desktop
npm ci
npm run typecheck
npm start                                            # build + start (asks for the project folder)
npx electron . --project=/path/to/Freyraum           # open a folder directly
```

Installers (written to `desktop/release/`):

```bash
npm run dist:win   # Windows: NSIS installer + portable .exe (best built on Windows)
npm run dist:mac   # macOS: .dmg for Intel (x64) and Apple Silicon (arm64), must run on macOS
npm run icon       # regenerate build-resources/icon.png (pure Node, no dependencies)
```

The Windows installer (NSIS) is German by default (English as fallback), asks
for the folder (per user, no admin rights), creates "FREYRAUM Editor"
shortcuts on the desktop and in the Start menu, and its uninstaller removes
only the app — never the project folder.

## Tests

- `npm run test:local-project` (root, no browser): store rules, all-or-nothing
  writes, history/restore, importer `--root`.
- `npm run test:desktop-app` (root): needs the root build, `desktop/npm ci` +
  `npm run build`, and `npm i --no-save playwright`. On Linux run it with
  `xvfb-run -a npm run test:desktop-app`. It starts the built app on a
  temporary project copy, checks the lockdown (no Node, no other sites or
  files, no inline scripts, no new windows), uploads a background and an
  artwork, places it, saves, and checks the files and the reloaded editor.
  CI runs it on Linux **and** Windows (no xvfb on Windows).
- `npm run smoke:desktop-package -- --exe <app executable>` (root, needs
  Playwright): starts a **packaged** app on a temporary project in a folder
  with a space ("FREYRAUM Projekt") and checks that the bundled importer
  generated the preview, the editor opens at `freyraum://app/` with "Im
  Projekt speichern", and `museum-hub.json` is unchanged. Example:
  `npx electron-builder --linux dir --publish never` in `desktop/`, then
  `xvfb-run -a npm run smoke:desktop-package -- --exe desktop/release/linux-unpacked/freyraum-editor`.

## Release

`desktop-release.yml` always runs the Electron test on Linux and Windows, then
builds the Windows installer and portable `.exe`, smoke-tests the unpacked app,
installs the installer silently (`/S /D=…`), smoke-tests the installed app and
uninstalls it again (checking a project folder survives).

| Run | Installers | Where to download |
| --- | --- | --- |
| Pull request or push to a `copilot/**` branch touching the app | Windows | Actions → run → **Artifacts** → `FREYRAUM-Editor-Windows` (zip, needs GitHub login, kept 90 days) |
| **Run workflow** (Actions → "Desktop app (FREYRAUM Editor)") | Windows, + macOS if "macos" is ticked | same, plus `FREYRAUM-Editor-macOS` |
| **Run workflow** on `main` with "publish" ticked | Windows + macOS | pre-release `desktop-v<desktop/package.json version>` on the Releases page |
| Tag `desktop-vX.Y.Z` | Windows + macOS | GitHub Release `desktop-vX.Y.Z` |

Files: `FREYRAUM-Editor-Setup-<version>.exe`, `FREYRAUM-Editor-<version>-portable.exe`,
`FREYRAUM-Editor-<version>-arm64.dmg`, `…-x64.dmg`. Nothing is published
from pull request, branch or plain manual runs.

To publish:

1. Raise `"version"` in `desktop/package.json` (for example `1.40.1`).
2. Either push a tag `desktop-v1.40.1` (must match the version or the
   workflow stops), or after merging click **Run workflow** on `main` with
   "publish" ticked (creates a pre-release; fails if that tag already exists).

Runs started by the Copilot agent or other bots wait for **Approve and run** by the
repository owner.

### Signing (optional)

Without certificates the builds are **unsigned**:

- Windows SmartScreen shows "Unbekannter Herausgeber" → *Weitere Informationen → Trotzdem ausführen* (once).
- macOS: the first start must be *Rechtsklick → Öffnen → Öffnen* (once).

To sign, add these repository secrets (only the ones that are set are used):

| Secret | Purpose |
| --- | --- |
| `WIN_CSC_LINK`, `WIN_CSC_KEY_PASSWORD` | Windows code-signing certificate (.pfx as base64 or URL) and password |
| `MAC_CSC_LINK`, `MAC_CSC_KEY_PASSWORD` | Apple "Developer ID Application" certificate (.p12) and password |
| `APPLE_ID`, `APPLE_APP_SPECIFIC_PASSWORD`, `APPLE_TEAM_ID` | macOS notarization (Apple Developer Program, about €99 per year) |

### Updates

The first version has no automatic update. "Hilfe → Neue Version
herunterladen…" opens the Releases page. Automatic updates
(`electron-updater` over GitHub Releases) need signed builds — on macOS they
do not work unsigned — so they are planned together with signing.

## Security model

- **Window:** `contextIsolation`, `sandbox`, no `nodeIntegration`, no
  `<webview>`, no navigation on drag-and-drop. Permissions are refused except
  clipboard writing and full screen.
- **Content Security Policy** on every app page: `script-src 'self'`, no
  inline scripts, no remote code, no frames, no form posts. The app pages are
  generated without inline scripts for this reason.
- **Navigation:** the main window may only show the app's own editor pages;
  the preview window only the gallery page. `http(s)` links open in the
  system browser; new windows are refused.
- **Private address `freyraum://app/`:** serves only the bundled editor files
  and, from the project folder, `customer-preview/customer-artworks.js`,
  `customer-audio.js`, `customer-preview/images|audio/<file>` and
  `customer-artworks/Backgrounds/<image>`. Path tricks (`..`, encoded slashes,
  backslashes) and symbolic links leading out of these folders are refused.
  `museum-hub.json`, `package.json` and everything else are not readable from
  the page.
- **Bridge:** the page gets only `window.freyraumDesktop` with project info,
  save, update gallery, history, restore, "unsaved changes" and choose folder.
  The main process accepts these calls only from the editor window's own page.
- **Writes** go through `projectStore.ts`: the same checks as the online save
  service (`validatePublishPackage`: allowed paths, lowercase names, real
  PNG/JPEG/WebP, size limits, locked fields, known artworks), no overwriting
  of existing images, stale-version refusal, temporary files + rename with
  rollback, and every target must stay inside the project folder.
- **Importer:** runs as a separate process with `ELECTRON_RUN_AS_NODE=1`, so
  the `RunAsNode` Electron fuse must stay enabled. A possible later hardening
  is to run it through `utilityProcess` and disable that fuse.

## Known limits

- `npm audit` in `desktop/` reports moderate findings in `sprintf-js` (pulled in
  by `electron-builder` → `@electron/get` → `global-agent`). They affect only the
  build machine while downloading Electron, not the shipped app; there is no
  fix without downgrading electron-builder.
- Going live is still the usual Git flow (commit + push, for example with
  GitHub Desktop). The app shows "Lokal gespeichert – noch nicht online".
