/**
 * Short confirmation with an undo button after an artwork or room change
 * (v1.36), e.g. "Fraktal → Raum 2 · Linke Wand · Rückgängig". Screen readers
 * already hear the full message through the editor's live status, so the
 * toast itself is not a live region.
 */
export class EditorToast {
  readonly element: HTMLElement;
  private readonly text: HTMLElement;
  private readonly undo: HTMLButtonElement;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private undoAction: (() => void) | null = null;

  constructor() {
    const element = document.createElement('div');
    element.className = 'museum-hub__toast';
    element.hidden = true;
    const text = document.createElement('span');
    text.className = 'museum-hub__toast-text';
    const undo = document.createElement('button');
    undo.type = 'button';
    undo.className = 'museum-hub__toast-undo';
    undo.textContent = 'Rückgängig';
    undo.addEventListener('click', () => {
      const action = this.undoAction;
      this.hide();
      action?.();
    });
    element.append(text, undo);
    this.element = element;
    this.text = text;
    this.undo = undo;
  }

  show(message: string, undoAction: (() => void) | null): void {
    this.text.textContent = message;
    this.undoAction = undoAction;
    this.undo.hidden = !undoAction;
    this.element.hidden = false;
    if (this.timer !== null) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.hide(), 6000);
  }

  hide(): void {
    if (this.timer !== null) clearTimeout(this.timer);
    this.timer = null;
    this.undoAction = null;
    this.element.hidden = true;
  }

  dispose(): void {
    this.hide();
    this.element.remove();
  }
}
