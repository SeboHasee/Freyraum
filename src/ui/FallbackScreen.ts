/**
 * Lightweight fallback screen shown when WebGL is unavailable or the
 * renderer fails to initialize. Keeps the customer informed without
 * leaving them on a blank canvas.
 */

export function showFallbackScreen(container: HTMLElement, reason: string): void {
  const fallback = document.createElement('section');
  fallback.className = 'fallback-screen';
  fallback.setAttribute('role', 'alert');
  fallback.setAttribute('aria-live', 'assertive');

  fallback.innerHTML = `
    <div class="fallback-screen__card">
      <p class="fallback-screen__eyebrow">freyraum</p>
      <h1 class="fallback-screen__title">3D-Vorschau nicht verfügbar</h1>
      <p class="fallback-screen__body">
        Für die immersive Galerie wird WebGL benötigt. Bitte aktivieren Sie
        Hardware-Beschleunigung oder öffnen Sie die Vorschau in einem aktuellen
        Browser (Chrome, Edge, Firefox oder Safari).
      </p>
      <p class="fallback-screen__detail">Technischer Hinweis: ${reason}</p>
    </div>
  `;

  container.appendChild(fallback);
}
