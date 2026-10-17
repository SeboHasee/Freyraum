/**
 * Room controls for the placement editor (v1.35): an always-visible switcher
 * ("Raum 2 von 3" with arrows and one chip per room) and the room manager in
 * the "Raum" tab (new, duplicate, delete with confirmation, rename, reorder).
 */
import { countLabel, roomLabel, type RoomStatus } from './editorText';

export interface RoomBarRoom {
  id: string;
  name: string;
  artworkCount: number;
  status: RoomStatus;
  issueCount: number;
}

export interface RoomBarCallbacks {
  onSelect(pageIndex: number): void;
  onAdd(): void;
  onDuplicate(): void;
  onDelete(artworkTarget: 'unplaced' | 'previous'): void;
  onRename(name: string): void;
  onMove(delta: -1 | 1): void;
}

const STATUS_TEXT: Record<RoomStatus, string> = {
  ok: 'ohne Meldungen',
  hint: 'mit Hinweisen',
  error: 'mit Fehlern',
};

export class EditorRoomBar {
  readonly switcher: HTMLElement;
  readonly manager: HTMLElement;
  private readonly prev: HTMLButtonElement;
  private readonly next: HTMLButtonElement;
  private readonly counter: HTMLElement;
  private readonly chips: HTMLElement;
  private readonly nameInput: HTMLInputElement;
  private readonly deleteButton: HTMLButtonElement;
  private readonly moveEarlier: HTMLButtonElement;
  private readonly moveLater: HTMLButtonElement;
  private readonly dialog: HTMLDialogElement;
  private readonly dialogText: HTMLParagraphElement;
  private readonly dialogPrevious: HTMLButtonElement;
  private readonly dialogUnplaced: HTMLButtonElement;
  private rooms: RoomBarRoom[] = [];
  private current = 0;
  private signature = '';

  constructor(private readonly callbacks: RoomBarCallbacks, nameMaxLength: number) {
    const switcher = document.createElement('nav');
    switcher.className = 'museum-hub__room-switcher';
    switcher.setAttribute('aria-label', 'Räume');
    const prev = this.makeButton('◀', 'museum-hub__room-arrow', () => this.callbacks.onSelect(this.current - 1));
    const next = this.makeButton('▶', 'museum-hub__room-arrow', () => this.callbacks.onSelect(this.current + 1));
    const counter = document.createElement('span');
    counter.className = 'museum-hub__room-counter';
    const chips = document.createElement('div');
    chips.className = 'museum-hub__room-chips';
    chips.setAttribute('role', 'group');
    chips.setAttribute('aria-label', 'Raum wählen');
    switcher.append(prev, counter, next, chips);

    const manager = document.createElement('section');
    manager.className = 'museum-hub__editor-section museum-hub__room-manager';
    manager.setAttribute('aria-labelledby', 'editor-room-manager-title');
    const title = document.createElement('h3');
    title.id = 'editor-room-manager-title';
    title.textContent = 'Räume';
    const actions = document.createElement('div');
    actions.className = 'museum-hub__editor-actions';
    const add = this.makeButton('+ Neuer Raum', 'museum-hub__calibration-action is-primary', () => this.callbacks.onAdd());
    add.title = 'Fügt nach dem aktuellen Raum einen leeren Raum mit derselben Platzaufteilung hinzu.';
    const duplicate = this.makeButton('Raum duplizieren', 'museum-hub__calibration-action', () => this.callbacks.onDuplicate());
    duplicate.title = 'Kopiert die Platzaufteilung des aktuellen Raums, ohne Bilder.';
    const remove = this.makeButton('Raum löschen', 'museum-hub__calibration-action is-danger', () => this.confirmDelete());
    actions.append(add, duplicate, remove);

    const nameLabel = document.createElement('label');
    nameLabel.className = 'museum-hub__calibration-label';
    nameLabel.textContent = 'Raumname (optional)';
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.maxLength = nameMaxLength;
    nameInput.placeholder = 'z. B. Foyer';
    nameInput.addEventListener('change', () => this.callbacks.onRename(nameInput.value));
    nameLabel.appendChild(nameInput);

    const order = document.createElement('div');
    order.className = 'museum-hub__editor-actions';
    order.setAttribute('role', 'group');
    order.setAttribute('aria-label', 'Reihenfolge der Räume');
    const moveEarlier = this.makeButton('◀ Früher', 'museum-hub__calibration-action', () => this.callbacks.onMove(-1));
    moveEarlier.setAttribute('aria-label', 'Raum in der Besuchsreihenfolge nach vorne verschieben');
    const moveLater = this.makeButton('Später ▶', 'museum-hub__calibration-action', () => this.callbacks.onMove(1));
    moveLater.setAttribute('aria-label', 'Raum in der Besuchsreihenfolge nach hinten verschieben');
    order.append(moveEarlier, moveLater);
    const orderHint = document.createElement('p');
    orderHint.className = 'museum-hub__editor-hint';
    orderHint.textContent = 'Die Reihenfolge ist die Reihenfolge, in der Besucher die Räume durchgehen.';

    const dialog = document.createElement('dialog');
    dialog.className = 'museum-hub__editor-dialog';
    dialog.setAttribute('aria-labelledby', 'editor-room-delete-title');
    const dialogTitle = document.createElement('h3');
    dialogTitle.id = 'editor-room-delete-title';
    dialogTitle.textContent = 'Raum löschen?';
    const dialogText = document.createElement('p');
    const dialogActions = document.createElement('div');
    dialogActions.className = 'museum-hub__editor-actions';
    const dialogPrevious = this.makeButton('Bilder in den vorherigen Raum', 'museum-hub__calibration-action is-danger', () => {
      dialog.close();
      this.callbacks.onDelete('previous');
    });
    const dialogUnplaced = this.makeButton('Bilder nicht platzieren', 'museum-hub__calibration-action is-danger', () => {
      dialog.close();
      this.callbacks.onDelete('unplaced');
    });
    const dialogCancel = this.makeButton('Abbrechen', 'museum-hub__calibration-action', () => dialog.close());
    dialogActions.append(dialogPrevious, dialogUnplaced, dialogCancel);
    dialog.append(dialogTitle, dialogText, dialogActions);

    manager.append(title, actions, nameLabel, order, orderHint, dialog);

    this.switcher = switcher;
    this.manager = manager;
    this.prev = prev;
    this.next = next;
    this.counter = counter;
    this.chips = chips;
    this.nameInput = nameInput;
    this.deleteButton = remove;
    this.moveEarlier = moveEarlier;
    this.moveLater = moveLater;
    this.dialog = dialog;
    this.dialogText = dialogText;
    this.dialogPrevious = dialogPrevious;
    this.dialogUnplaced = dialogUnplaced;
  }

  update(rooms: readonly RoomBarRoom[], current: number): void {
    this.rooms = [...rooms];
    this.current = Math.max(0, Math.min(rooms.length - 1, current));
    const room = this.rooms[this.current];
    const total = this.rooms.length;
    const fullLabel = roomLabel(this.current, room?.name);
    this.counter.textContent = `Raum ${this.current + 1} von ${total}${fullLabel.slice(`Raum ${this.current + 1}`.length)}`;
    this.prev.disabled = this.current <= 0;
    this.next.disabled = this.current >= total - 1;
    this.setArrowStatus(this.prev, this.rooms[this.current - 1], 'Vorheriger Raum');
    this.setArrowStatus(this.next, this.rooms[this.current + 1], 'Nächster Raum');
    this.deleteButton.disabled = total <= 1;
    this.deleteButton.title = total <= 1 ? 'Der einzige Raum kann nicht gelöscht werden.' : '';
    this.moveEarlier.disabled = this.current <= 0;
    this.moveLater.disabled = this.current >= total - 1;
    if (document.activeElement !== this.nameInput) this.nameInput.value = room?.name ?? '';

    const signature = JSON.stringify([this.current, this.rooms]);
    if (signature === this.signature) return;
    this.signature = signature;
    this.chips.replaceChildren();
    this.rooms.forEach((entry, index) => {
      const chip = this.makeButton(String(index + 1), `museum-hub__room-chip is-${entry.status}`, () => this.callbacks.onSelect(index));
      chip.setAttribute(
        'aria-label',
        `${roomLabel(index, entry.name)}, ${countLabel(entry.artworkCount, 'Bild', 'Bilder')}, ${STATUS_TEXT[entry.status]}`
      );
      if (index === this.current) chip.setAttribute('aria-current', 'true');
      this.chips.appendChild(chip);
    });
  }

  private setArrowStatus(button: HTMLButtonElement, room: RoomBarRoom | undefined, label: string): void {
    button.classList.toggle('has-error', room?.status === 'error');
    button.classList.toggle('has-hint', room?.status === 'hint');
    button.setAttribute('aria-label', room && room.status !== 'ok' ? `${label} (${STATUS_TEXT[room.status]})` : label);
  }

  private confirmDelete(): void {
    const room = this.rooms[this.current];
    if (!room || this.rooms.length <= 1) return;
    const label = roomLabel(this.current, room.name);
    this.dialogText.textContent = room.artworkCount > 0
      ? `${label} enthält ${countLabel(room.artworkCount, 'Bild', 'Bilder')}. Wohin sollen sie?`
      : `${label} ist leer und wird entfernt.`;
    this.dialogPrevious.hidden = room.artworkCount === 0;
    this.dialogPrevious.textContent = this.current === 0 ? 'Bilder in den nächsten Raum' : 'Bilder in den vorherigen Raum';
    this.dialogUnplaced.textContent = room.artworkCount > 0 ? 'Bilder nicht platzieren' : 'Raum löschen';
    if (typeof this.dialog.showModal === 'function') this.dialog.showModal();
    else if (window.confirm(`${label} löschen?`)) this.callbacks.onDelete('unplaced');
  }

  private makeButton(text: string, className: string, action: () => void): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.textContent = text;
    button.addEventListener('click', action);
    return button;
  }
}
