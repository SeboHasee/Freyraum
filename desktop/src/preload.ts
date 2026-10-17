/**
 * v1.39 — Preload script of the FREYRAUM Editor desktop app.
 *
 * Runs sandboxed with context isolation: the editor page gets exactly the
 * small `window.freyraumDesktop` API below (see src/online/desktopBridge.ts)
 * and nothing else from Node or Electron.
 */
import { contextBridge, ipcRenderer } from 'electron';
import type { DesktopBridge, DesktopSaveRequest } from '../../src/online/desktopBridge';

const bridge: DesktopBridge = {
  kind: 'freyraum-desktop',
  projectInfo: () => ipcRenderer.invoke('freyraum:project-info'),
  save: (request: DesktopSaveRequest) => ipcRenderer.invoke('freyraum:save', request),
  updateGallery: () => ipcRenderer.invoke('freyraum:update-gallery'),
  history: () => ipcRenderer.invoke('freyraum:history'),
  restore: (id: string, baseVersion: string | null) => ipcRenderer.invoke('freyraum:restore', id, baseVersion),
  setUnsavedChanges: (unsaved: boolean) => ipcRenderer.send('freyraum:unsaved', Boolean(unsaved)),
  chooseProject: () => ipcRenderer.invoke('freyraum:choose-project'),
};

contextBridge.exposeInMainWorld('freyraumDesktop', bridge);
