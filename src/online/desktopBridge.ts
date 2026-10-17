/**
 * v1.39 — Bridge between the placement editor and the FREYRAUM Editor
 * desktop app (`desktop/`).
 *
 * The app's preload script (`desktop/src/preload.ts`) exposes exactly this
 * object as `window.freyraumDesktop`; the page itself has no Node access.
 * In a normal browser (GitHub Pages, `file://`) the object does not exist and
 * the editor keeps its online / download behaviour.
 */
import type { PublishFile } from './publishRules';

export const DESKTOP_BRIDGE_KIND = 'freyraum-desktop';

export type DesktopResult<T> =
  | { ok: true; value: T }
  | { ok: false; code: string; message: string; errors: string[] };

export interface DesktopProjectInfo {
  /** Project folder name, e.g. "Freyraum". */
  name: string;
  /** Full folder path (shown to the customer). */
  root: string;
  /** Fingerprint of museum-hub.json when the editor opened the project. */
  version: string;
  appVersion: string;
}

export interface DesktopSaveRequest {
  baseVersion: string | null;
  config: unknown;
  files: PublishFile[];
}

export interface DesktopSaveValue {
  version: string;
  files: string[];
  backup: string | null;
}

export interface DesktopImportValue {
  ok: boolean;
  report: string;
}

export interface DesktopHistoryEntry {
  id: string;
  savedAt: string;
  current: boolean;
}

export interface DesktopBridge {
  readonly kind: typeof DESKTOP_BRIDGE_KIND;
  projectInfo(): Promise<DesktopResult<DesktopProjectInfo>>;
  /** Validates and writes the package into the project folder. */
  save(request: DesktopSaveRequest): Promise<DesktopResult<DesktopSaveValue>>;
  /** Runs "Update Gallery" (the importer) for the project. */
  updateGallery(): Promise<DesktopResult<DesktopImportValue>>;
  history(): Promise<DesktopResult<DesktopHistoryEntry[]>>;
  restore(id: string, baseVersion: string | null): Promise<DesktopResult<DesktopSaveValue>>;
  /** Lets the app warn before closing with unsaved changes. */
  setUnsavedChanges(unsaved: boolean): void;
  /** Opens the folder picker ("Anderen Projektordner öffnen"). */
  chooseProject(): Promise<void>;
}

declare global {
  interface Window {
    freyraumDesktop?: DesktopBridge;
  }
}

/** The desktop bridge, or null in a normal browser. */
export function getDesktopBridge(): DesktopBridge | null {
  if (typeof window === 'undefined') return null;
  const bridge = window.freyraumDesktop;
  return bridge && bridge.kind === DESKTOP_BRIDGE_KIND ? bridge : null;
}

/**
 * True when the page uses the project-folder layout (`file://` preview or the
 * desktop app's `freyraum://app/`), where backgrounds live in
 * `../customer-artworks/` instead of the deployed `backgrounds/` folder.
 */
export function usesProjectFolderLayout(): boolean {
  if (typeof window === 'undefined' || !window.location) return false;
  return window.location.protocol === 'file:' || window.location.protocol === 'freyraum:';
}
