import type { ResolvedHubHotspot } from '../config/hubHotspots';
import { createScopedDiagnostics } from '../utils/Diagnostics';

const HUB_BACKGROUND_BASE_URL =
  window.location.protocol === 'file:'
    ? '../customer-artworks/Backgrounds/'
    : `${import.meta.env.BASE_URL}backgrounds/`;
const HUB_IMAGE_URL = `${HUB_BACKGROUND_BASE_URL}museum-target.png`;
const HUB_IMAGE_FALLBACK_URL = `${HUB_BACKGROUND_BASE_URL}museum-empty.png`;
const HUB_IMAGE_TIMEOUT_MS = 5000;

const percent = (value: number): string => `${(value * 100).toFixed(3)}%`;

const isCalibrationRequested = (): boolean => {
  try {
    return new URLSearchParams(window.location.search).get('hubCalibrate') === '1';
  } catch {
    return false;
  }
};

interface CalibrationDrag {
  hotspot: ResolvedHubHotspot;
  button: HTMLButtonElement;
  pointerId: number;
  mode: 'move' | 'resize';
  startX: number;
  startY: number;
  startCx: number;
  startCy: number;
  startW: number;
  startH: number;
}

export class MainMuseumHub {
  readonly element: HTMLElement;
  private readonly diagnostics = createScopedDiagnostics('hub');
  private readonly visual: HTMLElement;
  private readonly entryButton: HTMLButtonElement;
  private readonly status: HTMLElement;
  private readonly imageReady: Promise<void>;
  private readonly hotspots: readonly ResolvedHubHotspot[];
  private readonly hotspotButtons: HTMLButtonElement[] = [];
  private readonly calibrating: boolean;
  private calibrationOutput: HTMLTextAreaElement | null = null;
  private calibrationDrag: CalibrationDrag | null = null;
  private activateCallback: (() => void) | null = null;
  private selectArtworkCallback: ((hotspot: ResolvedHubHotspot) => void) | null = null;
  private disposed = false;

  constructor(app: HTMLElement, hotspots: readonly ResolvedHubHotspot[] = []) {
    this.hotspots = hotspots;
    this.calibrating = isCalibrationRequested();
    const hub = document.createElement('section');
    hub.className = 'museum-hub';
    hub.setAttribute('aria-labelledby', 'museum-hub-title');
    if (this.calibrating) hub.classList.add('is-calibrating');

    const image = document.createElement('img');
    image.className = 'museum-hub__image';
    image.alt = '';
    image.decoding = 'async';
    image.draggable = false;
    this.imageReady = new Promise<void>((resolve) => {
      let settled = false;
      let fallbackRequested = false;
      const finish = (): void => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeout);
        resolve();
      };
      const timeout = window.setTimeout(() => {
        hub.classList.add('has-image-error');
        finish();
      }, HUB_IMAGE_TIMEOUT_MS);
      image.addEventListener('load', () => {
        hub.classList.remove('has-image-error');
        finish();
      });
      image.addEventListener('error', () => {
        if (!fallbackRequested) {
          fallbackRequested = true;
          image.src = HUB_IMAGE_FALLBACK_URL;
        } else {
          hub.classList.add('has-image-error');
          finish();
        }
      });
    });
    image.src = HUB_IMAGE_URL;

    const visual = document.createElement('div');
    visual.className = 'museum-hub__visual';

    const shade = document.createElement('div');
    shade.className = 'museum-hub__shade';
    shade.setAttribute('aria-hidden', 'true');

    const header = document.createElement('header');
    header.className = 'museum-hub__header';
    const eyebrow = document.createElement('p');
    eyebrow.className = 'museum-hub__eyebrow';
    eyebrow.textContent = 'FREYRAUM';
    const title = document.createElement('h1');
    title.id = 'museum-hub-title';
    title.className = 'museum-hub__title';
    title.textContent = 'Museum';
    const introduction = document.createElement('p');
    introduction.className = 'museum-hub__introduction';
    introduction.textContent = 'Wählen Sie ein Kunstwerk, um die Ausstellung zu betreten.';
    header.append(eyebrow, title, introduction);

    const entryButton = document.createElement('button');
    entryButton.className = 'museum-hub__destination';
    entryButton.type = 'button';
    entryButton.setAttribute('aria-describedby', 'museum-hub-entry-description');
    entryButton.innerHTML = `
      <span class="museum-hub__destination-frame" aria-hidden="true"></span>
      <span class="museum-hub__destination-label">Ausstellung betreten</span>
    `;

    const description = document.createElement('p');
    description.id = 'museum-hub-entry-description';
    description.className = 'sr-only';
    description.textContent =
      'Öffnet die interaktive Galerie mit Navigation, Detailansicht und Informationen zu den Kunstwerken.';

    const status = document.createElement('p');
    status.className = 'museum-hub__status sr-only';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');

    visual.append(image, entryButton);
    hub.append(visual, shade, header, description, status);
    app.appendChild(hub);

    this.element = hub;
    this.visual = visual;
    this.entryButton = entryButton;
    this.status = status;
    this.entryButton.addEventListener('click', this.handleActivate);

    this.buildHotspots();
    this.entryButton.hidden = this.hotspotButtons.length > 0;
    if (this.calibrating) this.buildCalibrationPanel(hub);
  }

  onActivate(callback: () => void): void {
    this.activateCallback = callback;
  }

  onSelectArtwork(callback: (hotspot: ResolvedHubHotspot) => void): void {
    this.selectArtworkCallback = callback;
  }

  prepare(): Promise<void> {
    return this.imageReady;
  }

  enter(): void {
    if (this.disposed) return;
    this.element.hidden = false;
    this.element.classList.remove('is-exiting');
    this.setButtonsDisabled(false);
    this.status.textContent = '';
    requestAnimationFrame(() => this.focusInitialTarget());
  }

  async exit(reducedMotion: boolean): Promise<void> {
    if (this.disposed) return;
    this.setButtonsDisabled(true);
    this.status.textContent = 'Ausstellung wird geöffnet.';
    this.element.classList.add('is-exiting');
    if (!reducedMotion) {
      await new Promise<void>((resolve) => window.setTimeout(resolve, 520));
    }
    if (!this.disposed) this.element.hidden = true;
  }

  showError(): void {
    if (this.disposed) return;
    this.element.hidden = false;
    this.element.classList.remove('is-exiting');
    this.setButtonsDisabled(false);
    this.status.textContent = 'Die Ausstellung konnte nicht geöffnet werden. Bitte versuchen Sie es erneut.';
    this.focusInitialTarget();
  }

  private setButtonsDisabled(disabled: boolean): void {
    this.entryButton.disabled = disabled;
    for (const button of this.hotspotButtons) button.disabled = disabled;
  }

  focusInitialTarget(): void {
    (this.hotspotButtons[0] ?? this.entryButton).focus({ preventScroll: true });
  }

  private handleActivate = (): void => {
    if (this.entryButton.disabled) return;
    this.setButtonsDisabled(true);
    this.activateCallback?.();
  };

  // ── Hotspots ──────────────────────────────────────────────────────────────

  private buildHotspots(): void {
    for (const hotspot of this.hotspots) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'museum-hub__hotspot';
      button.dataset['slot'] = hotspot.slot;
      button.setAttribute('aria-label', `Kunstwerk „${hotspot.displayLabel}“ in der Ausstellung öffnen`);
      this.applyHotspotGeometry(button, hotspot);
      const frame = document.createElement('span');
      frame.className = 'museum-hub__hotspot-frame';
      frame.setAttribute('aria-hidden', 'true');
      const label = document.createElement('span');
      label.className = 'museum-hub__hotspot-label';
      label.setAttribute('aria-hidden', 'true');
      label.textContent = this.calibrating ? `${hotspot.slot} · ${hotspot.displayLabel}` : hotspot.displayLabel;
      button.append(frame, label);
      if (this.calibrating) {
        const handle = document.createElement('span');
        handle.className = 'museum-hub__hotspot-handle';
        handle.setAttribute('aria-hidden', 'true');
        button.appendChild(handle);
        button.addEventListener('pointerdown', (event) => this.startCalibrationDrag(event, hotspot, button));
      } else {
        button.addEventListener('click', () => this.handleHotspotClick(hotspot));
      }
      this.visual.appendChild(button);
      this.hotspotButtons.push(button);
    }
  }

  private applyHotspotGeometry(button: HTMLButtonElement, hotspot: ResolvedHubHotspot): void {
    button.style.left = percent(hotspot.cx - hotspot.w / 2);
    button.style.top = percent(hotspot.cy - hotspot.h / 2);
    button.style.width = percent(hotspot.w);
    button.style.height = percent(hotspot.h);
  }

  private handleHotspotClick(hotspot: ResolvedHubHotspot): void {
    if (this.entryButton.disabled) return;
    this.setButtonsDisabled(true);
    this.status.textContent = 'Ausstellung wird geöffnet.';
    this.selectArtworkCallback?.(hotspot);
  }

  // ── Calibration mode (?hubCalibrate=1) ───────────────────────────────────
  // Non-dev calibration flow: drag a hotspot to move it, drag the corner
  // handle to resize. On release the JSON config block is refreshed in the
  // on-screen copy panel and logged via diagnostics. Paste the JSON into
  // `customer-artworks/hub-hotspots.json` and re-run the gallery update.

  private buildCalibrationPanel(hub: HTMLElement): void {
    const panel = document.createElement('div');
    panel.className = 'museum-hub__calibration';
    const heading = document.createElement('p');
    heading.className = 'museum-hub__calibration-title';
    heading.textContent = 'Hotspot-Kalibrierung — JSON in customer-artworks/hub-hotspots.json einfügen';
    const output = document.createElement('textarea');
    output.className = 'museum-hub__calibration-output';
    output.readOnly = true;
    output.rows = 8;
    output.setAttribute('aria-label', 'Hotspot-Konfiguration als JSON');
    panel.append(heading, output);
    hub.appendChild(panel);
    this.calibrationOutput = output;
    this.updateCalibrationOutput();
  }

  private startCalibrationDrag(
    event: PointerEvent,
    hotspot: ResolvedHubHotspot,
    button: HTMLButtonElement
  ): void {
    event.preventDefault();
    const target = event.target as HTMLElement | null;
    this.calibrationDrag = {
      hotspot,
      button,
      pointerId: event.pointerId,
      mode: target?.classList.contains('museum-hub__hotspot-handle') ? 'resize' : 'move',
      startX: event.clientX,
      startY: event.clientY,
      startCx: hotspot.cx,
      startCy: hotspot.cy,
      startW: hotspot.w,
      startH: hotspot.h,
    };
    button.setPointerCapture(event.pointerId);
    button.addEventListener('pointermove', this.handleCalibrationMove);
    button.addEventListener('pointerup', this.handleCalibrationEnd);
    button.addEventListener('pointercancel', this.handleCalibrationEnd);
  }

  private handleCalibrationMove = (event: PointerEvent): void => {
    const drag = this.calibrationDrag;
    if (!drag || event.pointerId !== drag.pointerId) return;
    const rect = this.visual.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const dx = (event.clientX - drag.startX) / rect.width;
    const dy = (event.clientY - drag.startY) / rect.height;
    const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));
    if (drag.mode === 'move') {
      drag.hotspot.cx = clamp01(drag.startCx + dx);
      drag.hotspot.cy = clamp01(drag.startCy + dy);
    } else {
      drag.hotspot.w = clamp01(Math.max(0.02, drag.startW + dx * 2));
      drag.hotspot.h = clamp01(Math.max(0.02, drag.startH + dy * 2));
    }
    this.applyHotspotGeometry(drag.button, drag.hotspot);
  };

  private handleCalibrationEnd = (event: PointerEvent): void => {
    const drag = this.calibrationDrag;
    if (!drag || event.pointerId !== drag.pointerId) return;
    this.calibrationDrag = null;
    drag.button.removeEventListener('pointermove', this.handleCalibrationMove);
    drag.button.removeEventListener('pointerup', this.handleCalibrationEnd);
    drag.button.removeEventListener('pointercancel', this.handleCalibrationEnd);
    this.updateCalibrationOutput();
  };

  private updateCalibrationOutput(): void {
    const config = this.hotspots.map(({ slot, artworkId, cx, cy, w, h, label }) => ({
      slot,
      artworkId,
      cx: Math.round(cx * 1000) / 1000,
      cy: Math.round(cy * 1000) / 1000,
      w: Math.round(w * 1000) / 1000,
      h: Math.round(h * 1000) / 1000,
      ...(label ? { label } : {}),
    }));
    const json = JSON.stringify(config, null, 2);
    if (this.calibrationOutput) this.calibrationOutput.value = json;
    this.diagnostics.info('hotspot-calibration', 'Hub hotspot calibration snapshot', { config });
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.entryButton.removeEventListener('click', this.handleActivate);
    this.activateCallback = null;
    this.selectArtworkCallback = null;
    this.hotspotButtons.length = 0;
    this.element.remove();
  }
}
