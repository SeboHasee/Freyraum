const HUB_IMAGE_URL =
  'https://github.com/user-attachments/assets/2f42c69d-b6b2-4c3c-9044-a3477900657c';

export class MainMuseumHub {
  readonly element: HTMLElement;
  private readonly entryButton: HTMLButtonElement;
  private readonly status: HTMLElement;
  private readonly imageReady: Promise<void>;
  private activateCallback: (() => void) | null = null;
  private disposed = false;

  constructor(app: HTMLElement) {
    const hub = document.createElement('section');
    hub.className = 'museum-hub';
    hub.setAttribute('aria-labelledby', 'museum-hub-title');

    const image = document.createElement('img');
    image.className = 'museum-hub__image';
    image.alt = '';
    image.decoding = 'async';
    image.draggable = false;
    this.imageReady = new Promise<void>((resolve) => {
      image.addEventListener('load', () => resolve(), { once: true });
      image.addEventListener(
        'error',
        () => {
          hub.classList.add('has-image-error');
          resolve();
        },
        { once: true }
      );
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
    this.entryButton = entryButton;
    this.status = status;
    this.entryButton.addEventListener('click', this.handleActivate);
  }

  onActivate(callback: () => void): void {
    this.activateCallback = callback;
  }

  prepare(): Promise<void> {
    return this.imageReady;
  }

  enter(): void {
    if (this.disposed) return;
    this.element.hidden = false;
    this.element.classList.remove('is-exiting');
    this.entryButton.disabled = false;
    this.status.textContent = '';
    requestAnimationFrame(() => this.entryButton.focus({ preventScroll: true }));
  }

  async exit(reducedMotion: boolean): Promise<void> {
    if (this.disposed) return;
    this.entryButton.disabled = true;
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
    this.entryButton.disabled = false;
    this.status.textContent = 'Die Ausstellung konnte nicht geöffnet werden. Bitte versuchen Sie es erneut.';
    this.entryButton.focus({ preventScroll: true });
  }

  private handleActivate = (): void => {
    if (this.entryButton.disabled) return;
    this.entryButton.disabled = true;
    this.activateCallback?.();
  };

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.entryButton.removeEventListener('click', this.handleActivate);
    this.activateCallback = null;
    this.element.remove();
  }
}
