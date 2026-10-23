/**
 * v1.42 — phone "more" menu. On touch phones the audio, settings, fullscreen
 * and help controls collapse behind one topbar button instead of floating as
 * a second row over the artwork. `main.ts` decides where the shared controls
 * live (desktop cluster, photo-room utilities, or this menu); this class only
 * owns the toggle, the popover and its dismissal.
 */
export class PhoneUtilityMenu {
  readonly element: HTMLDivElement;
  private readonly toggle: HTMLButtonElement;
  private readonly panel: HTMLDivElement;
  private open = false;

  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'phone-menu';

    this.toggle = document.createElement('button');
    this.toggle.type = 'button';
    this.toggle.className = 'phone-menu__toggle';
    this.toggle.setAttribute('aria-label', 'Weitere Bedienelemente');
    this.toggle.setAttribute('aria-expanded', 'false');
    this.toggle.setAttribute('aria-controls', 'freyraum-phone-menu');
    this.toggle.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
        <circle cx="4" cy="10" r="1.8" fill="currentColor" />
        <circle cx="10" cy="10" r="1.8" fill="currentColor" />
        <circle cx="16" cy="10" r="1.8" fill="currentColor" />
      </svg>`;
    this.toggle.addEventListener('click', () => this.setOpen(!this.open));

    this.panel = document.createElement('div');
    this.panel.id = 'freyraum-phone-menu';
    this.panel.className = 'phone-menu__panel';
    this.panel.setAttribute('role', 'group');
    this.panel.setAttribute('aria-label', 'Ton, Einstellungen, Vollbild und Hilfe');
    this.panel.hidden = true;
    // Help and fullscreen hand over to another surface; close behind them.
    this.panel.addEventListener('click', (event) => {
      if ((event.target as Element | null)?.closest('.topbar__help-btn, .fullscreen-btn')) {
        this.setOpen(false);
      }
    });

    this.element.append(this.toggle, this.panel);
  }

  get isOpen(): boolean {
    return this.open;
  }

  setControls(controls: readonly HTMLElement[]): void {
    this.panel.replaceChildren(...controls);
  }

  setOpen(open: boolean): void {
    if (this.open === open) return;
    this.open = open;
    this.panel.hidden = !open;
    this.toggle.setAttribute('aria-expanded', String(open));
    this.element.classList.toggle('is-open', open);
    if (open) {
      document.addEventListener('pointerdown', this.handleOutsidePointer, true);
      window.addEventListener('keydown', this.handleKeyDown);
    } else {
      document.removeEventListener('pointerdown', this.handleOutsidePointer, true);
      window.removeEventListener('keydown', this.handleKeyDown);
    }
  }

  dispose(): void {
    this.setOpen(false);
    this.element.remove();
  }

  private handleOutsidePointer = (event: PointerEvent): void => {
    if (event.target instanceof Node && this.element.contains(event.target)) return;
    this.setOpen(false);
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    // An open settings panel inside the menu consumes Escape first.
    if (event.key !== 'Escape' || event.defaultPrevented) return;
    this.setOpen(false);
    this.toggle.focus({ preventScroll: true });
  };
}
