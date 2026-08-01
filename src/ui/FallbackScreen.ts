/**
 * Lightweight fallback screen shown when WebGL is unavailable or the
 * renderer fails to initialize. Keeps the customer informed without
 * leaving them on a blank canvas.
 *
 * v0.11 — mobile-friendly:
 *   - Adds a tip about private browsing / hardware acceleration when
 *     the device is coarse-pointer (common cause of WebGL failures on
 *     mobile Safari in private mode).
 *   - Restricts the technical "reason" string to diagnostic modes so
 *     normal end-users see a clean, localized message.
 *   - Card width honours safe-area insets (see `main.scss`).
 */
import { getDiagnostics } from '../utils/Diagnostics';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function showFallbackScreen(container: HTMLElement, reason: string): void {
  const diagnostics = getDiagnostics();
  const fallback = document.createElement('section');
  fallback.className = 'fallback-screen';
  fallback.setAttribute('role', 'alert');
  fallback.setAttribute('aria-live', 'assertive');

  const coarse = window.matchMedia?.('(pointer: coarse)')?.matches ?? false;
  const mobileTip = coarse
    ? `<p class="fallback-screen__body">
        Tipp: Deaktivieren Sie den privaten Browser-Modus und stellen Sie
        sicher, dass Hardware-Beschleunigung aktiviert ist.
       </p>`
    : '';

  const showDetail = diagnostics.getMode() !== 'default';
  const detailHtml = showDetail
    ? `<p class="fallback-screen__detail">Technischer Hinweis: ${escapeHtml(reason)}</p>`
    : '';

  fallback.innerHTML = `
    <div class="fallback-screen__card">
      <p class="fallback-screen__eyebrow">freyraum</p>
      <h1 class="fallback-screen__title">3D-Vorschau nicht verfügbar</h1>
      <p class="fallback-screen__body">
        Für die immersive Galerie wird WebGL benötigt. Bitte aktivieren Sie
        Hardware-Beschleunigung oder öffnen Sie die Vorschau in einem aktuellen
        Browser (Chrome, Edge, Firefox oder Safari).
      </p>
      ${mobileTip}
      ${detailHtml}
    </div>
  `;

  container.appendChild(fallback);
  const rootStyle = getComputedStyle(document.documentElement);
  const fallbackStyle = getComputedStyle(fallback);
  diagnostics.info('fallback', 'surface-snapshot', 'Fallback surface colors resolved', {
    rootGalleryWall: rootStyle.getPropertyValue('--color-gallery-wall').trim(),
    rootMuseumWall: rootStyle.getPropertyValue('--color-museum-wall').trim(),
    fallbackBackgroundColor: fallbackStyle.backgroundColor,
    fallbackBackgroundImage: fallbackStyle.backgroundImage,
  });
}
