import { createScopedDiagnostics } from '../utils/Diagnostics';

const log = createScopedDiagnostics('KeyboardHelp');

type HelpContext = 'gallery' | 'room';

const SHORTCUTS: Record<HelpContext, { title: string; entries: Array<[string[], string]>; hint: string }> = {
  gallery: {
    title: 'Tastaturkürzel',
    entries: [
      [['←', '→'], 'Vorheriges / nächstes Bild'],
      [['+', '='], 'Heranzoomen'],
      [['-', '_'], 'Herauszoomen'],
      [['0', 'R'], 'Ansicht zurücksetzen'],
      [['🖱 ↕'], 'Mit dem Mausrad zoomen'],
      [['Doppelklick'], 'An der Stelle heranzoomen, erneut zurück zur Gesamtansicht'],
      [['🖱 Ziehen'], 'Bei vergrößerter Ansicht verschieben; in der Übersicht horizontal zum nächsten Bild wechseln'],
      [['Zwei Finger'], 'Auf Touchscreens zoomen und verschieben'],
      [['F'], 'Vollbild ein-/ausschalten'],
      [['Esc'], 'Dialog schließen oder zum Museum zurückkehren'],
      [['?'], 'Diese Hilfe anzeigen'],
    ],
    hint: 'Mausbewegung zum unteren oder linken Bildschirmrand enthüllt Zeitleiste, Navigation und Bildinformationen.',
  },
  room: {
    title: 'Bedienung im Fotoraum',
    entries: [
      [['+', '='], 'Heranzoomen, auf das Kunstwerk zentriert'],
      [['-'], 'Herauszoomen'],
      [['0', 'Home'], 'Fotoansicht zurücksetzen'],
      [['Esc'], 'Zur Galerie zurückkehren'],
      [['🖱 Ziehen'], 'Bei vergrößerter Ansicht das Foto verschieben'],
      [['🖱 ↕'], 'Mit dem Mausrad auf das Kunstwerk zoomen'],
      [['Doppelklick'], 'An der Stelle heranzoomen, erneut zurück zur Fotoansicht'],
      [['Zwei Finger'], 'Auf Touchscreens zoomen und verschieben'],
      [['Tab'], 'Zwischen den Raumansicht-Steuerelementen wechseln'],
    ],
    hint: 'Im Einstellungsdialog schließt Escape zuerst den Dialog.',
  },
};

export class KeyboardHelp {
  private readonly dialog: HTMLElement;
  private opener: HTMLElement | null = null;

  private readonly onKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      this.close();
      return;
    }
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
          <tbody></tbody>
        </table>
        <p class="keyboard-help__hint"></p>
        <button class="keyboard-help__close nav-btn" aria-label="Hilfe schließen">✕</button>
      </div>`;
    el.querySelector('.keyboard-help__close')!.addEventListener('click', () => this.close());
    el.addEventListener('click', (e) => {
      if (e.target === el) this.close();
    });
    return el;
  }

  open(opener?: HTMLElement, context: HelpContext = 'gallery'): void {
    this.opener = opener ?? null;
    const content = SHORTCUTS[context];
    this.dialog.querySelector('.keyboard-help__title')!.textContent = content.title;
    const rows = content.entries.map(([keys, description]) => {
      const row = document.createElement('tr');
      const keyCell = document.createElement('td');
      for (const [index, key] of keys.entries()) {
        if (index > 0) keyCell.append(document.createTextNode(' '));
        const keycap = document.createElement('kbd');
        keycap.className = 'keyboard-help__key';
        keycap.textContent = key;
        keyCell.appendChild(keycap);
      }
      const descriptionCell = document.createElement('td');
      descriptionCell.textContent = description;
      row.append(keyCell, descriptionCell);
      return row;
    });
    this.dialog.querySelector('tbody')!.replaceChildren(...rows);
    this.dialog.querySelector('.keyboard-help__hint')!.textContent = content.hint;
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
