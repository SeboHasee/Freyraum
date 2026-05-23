import { createScopedDiagnostics } from '../utils/Diagnostics';

const log = createScopedDiagnostics('KeyboardHelp');

const SHORTCUTS: Array<[string, string]> = [
  ['←  →', 'Nächstes / vorheriges Bild'],
  ['+  −', 'Heran-/Herauszoomen'],
  ['R', 'Ansicht zurücksetzen'],
  ['F', 'Vollbild ein-/ausschalten'],
  ['Esc', 'Dialog schließen'],
  ['?', 'Diese Hilfe anzeigen'],
];

export class KeyboardHelp {
  private readonly dialog: HTMLElement;
  private opener: HTMLElement | null = null;

  private readonly onKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') this.close();
    if (e.key === 'Tab') this.trapFocus(e);
  };

  constructor() {
    this.dialog = this.build();
    document.body.appendChild(this.dialog);
    log.debug('init', 'KeyboardHelp component created');
  }

  private build(): HTMLElement {
    const el = document.createElement('div');
    el.id = 'keyboard-help';
    el.className = 'keyboard-help';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-labelledby', 'keyboard-help-title');
    el.hidden = true;

    el.innerHTML = `
      <div class="keyboard-help__panel">
        <h2 id="keyboard-help-title" class="keyboard-help__title">Tastaturkürzel</h2>
        <table class="keyboard-help__table">
          <tbody>
            ${SHORTCUTS.map(
              ([key, desc]) =>
                `<tr><td><kbd class="keyboard-help__key">${key}</kbd></td><td>${desc}</td></tr>`
            ).join('')}
          </tbody>
        </table>
        <button class="keyboard-help__close nav-btn" aria-label="Hilfe schließen">✕</button>
      </div>`;

    el.querySelector('.keyboard-help__close')!.addEventListener('click', () => this.close());
    el.addEventListener('click', (e) => {
      if (e.target === el) this.close();
    });
    return el;
  }

  open(opener?: HTMLElement): void {
    this.opener = opener ?? null;
    this.dialog.hidden = false;
    document.addEventListener('keydown', this.onKeyDown);
    (this.dialog.querySelector('.keyboard-help__close') as HTMLElement)?.focus();
    log.debug('open', 'keyboard help opened');
  }

  close(): void {
    this.dialog.hidden = true;
    document.removeEventListener('keydown', this.onKeyDown);
    this.opener?.focus();
    this.opener = null;
    log.debug('close', 'keyboard help closed');
  }

  private trapFocus(e: KeyboardEvent): void {
    const focusable = Array.from(
      this.dialog.querySelectorAll<HTMLElement>('button, [tabindex]:not([tabindex="-1"])')
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  dispose(): void {
    document.removeEventListener('keydown', this.onKeyDown);
    this.dialog.remove();
    log.debug('dispose', 'KeyboardHelp component disposed');
  }
}
