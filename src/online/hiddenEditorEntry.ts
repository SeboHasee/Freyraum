/**
 * v1.38 — Discreet way from the gallery into the placement editor:
 * typing "bearbeiten" anywhere (outside text fields) or a 1.5 s long press on
 * the FREYRAUM logo / museum title. This is only a shortcut, not protection;
 * the save service password is the real protection.
 */
import { usesProjectFolderLayout } from './desktopBridge';

const SECRET_WORD = 'bearbeiten';
const LONG_PRESS_MS = 1500;
const LONG_PRESS_SELECTOR = '.topbar__brand, #museum-hub-title, [data-editor-entry]';

export function placementEditorUrl(): string {
  if (usesProjectFolderLayout()) return new URL('placement-editor.html', window.location.href).href;
  return new URL(`${import.meta.env.BASE_URL}placement-editor.html`, window.location.href).href;
}

function isTextTarget(target: EventTarget | null): boolean {
  return target instanceof HTMLInputElement
    || target instanceof HTMLTextAreaElement
    || target instanceof HTMLSelectElement
    || (target instanceof HTMLElement && target.isContentEditable);
}

/** Installs the shortcuts; returns a cleanup function. */
export function installHiddenEditorEntry(open: (url: string) => void = (url) => window.location.assign(url)): () => void {
  let typed = '';
  let pressTimer: ReturnType<typeof setTimeout> | null = null;

  const onKeydown = (event: KeyboardEvent): void => {
    if (event.ctrlKey || event.metaKey || event.altKey || isTextTarget(event.target)) return;
    if (event.key.length !== 1) return;
    typed = (typed + event.key.toLowerCase()).slice(-SECRET_WORD.length);
    if (typed === SECRET_WORD) {
      typed = '';
      open(placementEditorUrl());
    }
  };
  const cancelPress = (): void => {
    if (pressTimer !== null) clearTimeout(pressTimer);
    pressTimer = null;
  };
  const onPointerDown = (event: PointerEvent): void => {
    if (!(event.target instanceof Element) || !event.target.closest(LONG_PRESS_SELECTOR)) return;
    cancelPress();
    pressTimer = setTimeout(() => {
      pressTimer = null;
      open(placementEditorUrl());
    }, LONG_PRESS_MS);
  };

  const onPointerMove = (event: PointerEvent): void => {
    if (pressTimer !== null && Math.hypot(event.movementX, event.movementY) > 8) cancelPress();
  };

  window.addEventListener('keydown', onKeydown);
  document.addEventListener('pointerdown', onPointerDown);
  document.addEventListener('pointerup', cancelPress);
  document.addEventListener('pointercancel', cancelPress);
  document.addEventListener('pointermove', onPointerMove);
  return () => {
    cancelPress();
    window.removeEventListener('keydown', onKeydown);
    document.removeEventListener('pointerdown', onPointerDown);
    document.removeEventListener('pointerup', cancelPress);
    document.removeEventListener('pointercancel', cancelPress);
    document.removeEventListener('pointermove', onPointerMove);
  };
}
