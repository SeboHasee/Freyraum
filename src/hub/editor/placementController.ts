/**
 * Artwork placement controller for the placement editor (v1.36).
 *
 * One rule for every input: "pick an artwork, then pick a place". The list,
 * the place cards, and the museum scene all go through this controller, so
 * click → click, dragging from the list (into the scene, onto a place card, or
 * back onto the list), and keyboard use behave the same and show the same
 * feedback. Pointer events are used instead of native HTML drag and drop,
 * which is unreliable on touch screens and cannot target the projected scene.
 */
import { countLabel } from './editorText';
import { thumbnailElement } from './thumbnails';

/** A place of the current room. */
export interface PlacementPlace {
  slotId: string;
  label: string;
  artworkId: string | null;
}

export interface PlacementArtwork {
  id: string;
  title: string;
  thumbnail: string | null;
  /** Slot that currently holds the artwork, if any. */
  slotId: string | null;
  location: 'here' | 'other' | 'unplaced';
  /** "Raum 2 · Linke Wand" for placed artworks. */
  placeText: string | null;
}

export interface PlacementHost {
  /** Places of the room that is currently open. */
  currentPlaces(): PlacementPlace[];
  artworks(): PlacementArtwork[];
  /** Projected scene element for a place of the current room. */
  sceneElement(slotId: string): HTMLElement | null;
  assign(slotId: string, artworkId: string): void;
  unplace(artworkId: string): void;
  selectPlace(slotId: string): void;
  /** Adds a room after the current one and hangs the artwork in its first place. */
  placeInNewRoom(artworkId: string): void;
  /** Opens the room of a placed artwork and selects it. */
  showArtwork(artworkId: string): void;
  announce(message: string): void;
}

type DropTarget =
  | { kind: 'place'; slotId: string; element: HTMLElement }
  | { kind: 'unplace'; element: HTMLElement };

interface PendingPointer {
  pointerId: number;
  artworkId: string;
  sourceSlotId: string | null;
  startX: number;
  startY: number;
  started: boolean;
  /** Runs when the pointer is released without dragging. */
  onClick: () => void;
  /** Element the gesture started on (excluded from hit testing). */
  origin: HTMLElement;
}

const DRAG_START_PX = 6;
const CANDIDATE_CLASSES = ['is-drop-candidate', 'is-drop-free', 'is-drop-swap', 'is-drop-same', 'is-drop-hover'];

export class PlacementController {
  private chosenArtworkId: string | null = null;
  private armedSlotId: string | null = null;
  private pointer: PendingPointer | null = null;
  private ghost: HTMLElement | null = null;
  private ghostLabel: HTMLElement | null = null;
  private hoverTarget: DropTarget | null = null;
  private highlighted: HTMLElement[] = [];
  private popover: HTMLElement | null = null;
  private popoverAnchor: HTMLElement | null = null;
  private listeners = new Set<() => void>();

  constructor(private readonly host: PlacementHost) {
    document.addEventListener('keydown', this.handleKeydown, true);
  }

  /** Notified whenever the chosen artwork or armed place changes. */
  onChange(listener: () => void): void {
    this.listeners.add(listener);
  }

  get chosenArtwork(): string | null {
    return this.chosenArtworkId;
  }

  get armedPlace(): string | null {
    return this.armedSlotId;
  }

  get isDragging(): boolean {
    return Boolean(this.pointer?.started);
  }

  dispose(): void {
    document.removeEventListener('keydown', this.handleKeydown, true);
    this.endPointer();
    this.closePopover(false);
    this.clearHighlights();
    this.listeners.clear();
  }

  // ── Click → click ──────────────────────────────────────────────────────────

  /** List click: fill an armed empty place, or pick the artwork for placing. */
  chooseArtwork(artworkId: string): void {
    this.closePopover(false);
    if (this.armedSlotId) {
      const slotId = this.armedSlotId;
      this.reset();
      this.host.assign(slotId, artworkId);
      return;
    }
    if (this.chosenArtworkId === artworkId) {
      this.cancel('Auswahl aufgehoben.');
      return;
    }
    this.chosenArtworkId = artworkId;
    this.armedSlotId = null;
    this.highlightPlaces(artworkId);
    this.emit();
    const title = this.titleOf(artworkId);
    const free = this.host.currentPlaces().filter((place) => !place.artworkId).length;
    this.host.announce(
      `„${title}“ ausgewählt. Jetzt einen Platz im Bild oder in der Liste anklicken${
        free > 0 ? ` (${countLabel(free, 'freier Platz', 'freie Plätze')})` : ''
      }. Esc bricht ab.`
    );
  }

  /**
   * Place click (card, scene keyboard): drops the chosen artwork there, arms
   * an empty place for the next artwork click, or simply selects the place.
   */
  choosePlace(slotId: string): void {
    this.closePopover(false);
    if (this.chosenArtworkId) {
      const artworkId = this.chosenArtworkId;
      this.reset();
      this.host.assign(slotId, artworkId);
      return;
    }
    const place = this.host.currentPlaces().find((candidate) => candidate.slotId === slotId);
    this.host.selectPlace(slotId);
    if (place && !place.artworkId) {
      this.armedSlotId = slotId;
      this.emit();
      this.host.announce(`${place.label} ist leer. Jetzt ein Bild aus der Liste anklicken. Esc bricht ab.`);
    } else if (this.armedSlotId) {
      this.armedSlotId = null;
      this.emit();
    }
  }

  /** Scene press: true when the press dropped a chosen artwork (no move drag). */
  handleSceneSlotPress(slotId: string): boolean {
    if (!this.chosenArtworkId) return false;
    this.choosePlace(slotId);
    return true;
  }

  cancel(message = 'Platzieren abgebrochen.'): void {
    const wasActive = Boolean(this.chosenArtworkId || this.armedSlotId || this.pointer?.started);
    this.endPointer();
    this.reset();
    if (wasActive) this.host.announce(message);
  }

  // ── Pointer drag from the list or a place card ────────────────────────────

  /**
   * Starts tracking a press on a list entry or place card. Moving more than a
   * few pixels turns it into a drag; releasing earlier runs `onClick`.
   */
  beginPointer(
    event: PointerEvent,
    artworkId: string,
    sourceSlotId: string | null,
    onClick: () => void
  ): void {
    if (this.pointer || !event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
    const origin = event.currentTarget as HTMLElement;
    this.pointer = {
      pointerId: event.pointerId,
      artworkId,
      sourceSlotId,
      startX: event.clientX,
      startY: event.clientY,
      started: false,
      onClick,
      origin,
    };
    window.addEventListener('pointermove', this.handlePointerMove);
    window.addEventListener('pointerup', this.handlePointerUp);
    window.addEventListener('pointercancel', this.handlePointerCancel);
  }

  /**
   * Hover feedback while an artwork is dragged inside the scene: returns the
   * other place under the pointer (dropping there swaps the two artworks).
   */
  sceneDragHover(clientX: number, clientY: number, sourceSlotId: string, sourceElement: HTMLElement): string | null {
    const target = this.hitTest(clientX, clientY, sourceElement);
    const slotId = target?.kind === 'place' && target.slotId !== sourceSlotId ? target.slotId : null;
    const element = slotId && target?.kind === 'place' ? target.element : null;
    if (element !== (this.hoverTarget?.element ?? null)) {
      this.hoverTarget?.element.classList.remove('is-drop-hover', 'is-drop-swap');
      this.removeBadge(this.hoverTarget?.element ?? null);
      this.hoverTarget = slotId && element ? { kind: 'place', slotId, element } : null;
      if (element) {
        element.classList.add('is-drop-hover', 'is-drop-swap');
        this.setBadge(element, 'Loslassen zum Tauschen');
      }
    }
    return slotId;
  }

  sceneDragEnd(): void {
    this.hoverTarget?.element.classList.remove('is-drop-hover', 'is-drop-swap');
    this.removeBadge(this.hoverTarget?.element ?? null);
    this.hoverTarget = null;
  }

  private handlePointerMove = (event: PointerEvent): void => {
    const pointer = this.pointer;
    if (!pointer || event.pointerId !== pointer.pointerId) return;
    if (!pointer.started) {
      if (Math.hypot(event.clientX - pointer.startX, event.clientY - pointer.startY) < DRAG_START_PX) return;
      pointer.started = true;
      this.closePopover(false);
      this.chosenArtworkId = null;
      this.armedSlotId = null;
      this.startGhost(pointer.artworkId);
      this.highlightPlaces(pointer.artworkId, pointer.sourceSlotId);
      document.documentElement.classList.add('is-placing-artwork');
      this.emit();
    }
    event.preventDefault();
    this.moveGhost(event.clientX, event.clientY);
    this.updateHover(this.hitTest(event.clientX, event.clientY, null), pointer);
  };

  private handlePointerUp = (event: PointerEvent): void => {
    const pointer = this.pointer;
    if (!pointer || event.pointerId !== pointer.pointerId) return;
    if (!pointer.started) {
      this.endPointer();
      pointer.onClick();
      return;
    }
    const target = this.hitTest(event.clientX, event.clientY, null);
    this.endPointer();
    this.reset();
    if (target?.kind === 'place') {
      if (target.slotId === pointer.sourceSlotId) {
        this.host.announce('Bild bleibt auf seinem Platz.');
        return;
      }
      this.host.assign(target.slotId, pointer.artworkId);
    } else if (target?.kind === 'unplace' && pointer.sourceSlotId) {
      this.host.unplace(pointer.artworkId);
    } else {
      this.host.announce('Kein Platz getroffen – nichts geändert.');
    }
  };

  private handlePointerCancel = (event: PointerEvent): void => {
    if (!this.pointer || event.pointerId !== this.pointer.pointerId) return;
    const started = this.pointer.started;
    this.endPointer();
    if (started) this.reset();
  };

  private endPointer(): void {
    window.removeEventListener('pointermove', this.handlePointerMove);
    window.removeEventListener('pointerup', this.handlePointerUp);
    window.removeEventListener('pointercancel', this.handlePointerCancel);
    this.pointer = null;
    this.ghost?.remove();
    this.ghost = null;
    this.ghostLabel = null;
    document.documentElement.classList.remove('is-placing-artwork');
  }

  private hitTest(clientX: number, clientY: number, exclude: HTMLElement | null): DropTarget | null {
    for (const element of document.elementsFromPoint(clientX, clientY)) {
      if (!(element instanceof Element)) continue;
      if (exclude && (element === exclude || exclude.contains(element))) continue;
      const place = element.closest<HTMLElement>('[data-drop-slot]');
      if (place && (!exclude || place !== exclude)) {
        const slotId = place.dataset['dropSlot'];
        if (slotId && this.host.currentPlaces().some((candidate) => candidate.slotId === slotId)) {
          return { kind: 'place', slotId, element: place };
        }
      }
      const unplace = element.closest<HTMLElement>('[data-drop-unplace]');
      if (unplace) return { kind: 'unplace', element: unplace };
    }
    return null;
  }

  private updateHover(target: DropTarget | null, pointer: PendingPointer): void {
    if (target?.element !== this.hoverTarget?.element) {
      this.hoverTarget?.element.classList.remove('is-drop-hover');
      this.hoverTarget = target;
      target?.element.classList.add('is-drop-hover');
    }
    if (!this.ghostLabel) return;
    let text = 'Auf einen Platz ziehen';
    let state = 'none';
    if (target?.kind === 'place') {
      const place = this.host.currentPlaces().find((candidate) => candidate.slotId === target.slotId);
      if (target.slotId === pointer.sourceSlotId) {
        text = 'Bereits hier';
      } else if (place?.artworkId) {
        text = pointer.sourceSlotId ? 'Loslassen zum Tauschen' : 'Loslassen zum Ersetzen';
        state = 'swap';
      } else {
        text = 'Loslassen zum Platzieren';
        state = 'free';
      }
    } else if (target?.kind === 'unplace') {
      text = pointer.sourceSlotId ? 'Loslassen: nicht platzieren' : 'Auf einen Platz ziehen';
      state = pointer.sourceSlotId ? 'unplace' : 'none';
    }
    this.ghostLabel.textContent = text;
    if (this.ghost) this.ghost.dataset['state'] = state;
  }

  private startGhost(artworkId: string): void {
    const artwork = this.host.artworks().find((candidate) => candidate.id === artworkId);
    const ghost = document.createElement('div');
    ghost.className = 'museum-hub__drag-ghost';
    ghost.setAttribute('aria-hidden', 'true');
    ghost.appendChild(thumbnailElement(artwork?.thumbnail ?? null));
    const title = document.createElement('strong');
    title.textContent = artwork?.title ?? artworkId;
    const label = document.createElement('span');
    label.className = 'museum-hub__drag-ghost-label';
    label.textContent = 'Auf einen Platz ziehen';
    ghost.append(title, label);
    document.body.appendChild(ghost);
    this.ghost = ghost;
    this.ghostLabel = label;
  }

  private moveGhost(clientX: number, clientY: number): void {
    if (this.ghost) this.ghost.style.transform = `translate3d(${clientX + 14}px, ${clientY + 14}px, 0)`;
  }

  // ── Target highlighting ────────────────────────────────────────────────────

  private highlightPlaces(artworkId: string, sourceSlotId: string | null = null): void {
    this.clearHighlights();
    const placedIn = sourceSlotId ?? this.host.artworks().find((artwork) => artwork.id === artworkId)?.slotId ?? null;
    for (const place of this.host.currentPlaces()) {
      const elements = [
        this.host.sceneElement(place.slotId),
        ...document.querySelectorAll<HTMLElement>(`.museum-hub__place-card[data-drop-slot="${CSS.escape(place.slotId)}"]`),
      ].filter((element): element is HTMLElement => Boolean(element));
      const same = place.slotId === placedIn;
      const state = same ? 'is-drop-same' : place.artworkId ? 'is-drop-swap' : 'is-drop-free';
      const badge = same ? 'Hängt bereits hier' : place.artworkId ? 'Belegt – tauschen?' : 'Hier ablegen';
      for (const element of elements) {
        element.classList.add('is-drop-candidate', state);
        this.setBadge(element, badge);
        this.highlighted.push(element);
      }
    }
  }

  private clearHighlights(): void {
    for (const element of this.highlighted) {
      element.classList.remove(...CANDIDATE_CLASSES);
      this.removeBadge(element);
    }
    this.highlighted = [];
    this.hoverTarget = null;
  }

  private setBadge(element: HTMLElement, text: string): void {
    let badge = element.querySelector<HTMLElement>(':scope > .museum-hub__drop-badge');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'museum-hub__drop-badge';
      badge.setAttribute('aria-hidden', 'true');
      element.appendChild(badge);
    }
    badge.textContent = text;
  }

  private removeBadge(element: HTMLElement | null): void {
    element?.querySelector(':scope > .museum-hub__drop-badge')?.remove();
  }

  /** Re-applies highlights after the panels or scene were rebuilt. */
  refreshHighlights(): void {
    if (this.chosenArtworkId) this.highlightPlaces(this.chosenArtworkId);
    else if (!this.pointer?.started) this.clearHighlights();
  }

  // ── Picker and "Platzieren…" menu ─────────────────────────────────────────

  /** Small searchable artwork picker next to an empty place. */
  openPlacePicker(slotId: string, anchor: HTMLElement): void {
    const place = this.host.currentPlaces().find((candidate) => candidate.slotId === slotId);
    if (!place) return;
    this.reset();
    const popover = this.createPopover(anchor, `${place.label}: Bild hinzufügen`);
    const search = document.createElement('input');
    search.type = 'search';
    search.className = 'museum-hub__popover-search';
    search.placeholder = 'Bild suchen…';
    search.setAttribute('aria-label', 'Bild suchen');
    const list = document.createElement('ul');
    list.className = 'museum-hub__popover-list';
    const order = { unplaced: 0, other: 1, here: 2 } as const;
    const artworks = this.host
      .artworks()
      .filter((artwork) => artwork.slotId !== slotId)
      .sort((a, b) => order[a.location] - order[b.location] || a.title.localeCompare(b.title, 'de'));
    const render = (): void => {
      const query = search.value.trim().toLocaleLowerCase('de');
      list.replaceChildren();
      const matches = artworks.filter((artwork) => !query || artwork.title.toLocaleLowerCase('de').includes(query));
      if (!matches.length) {
        const empty = document.createElement('li');
        empty.className = 'museum-hub__library-empty';
        empty.textContent = 'Kein Bild gefunden.';
        list.appendChild(empty);
        return;
      }
      for (const artwork of matches) {
        const item = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'museum-hub__popover-item';
        button.dataset['artworkId'] = artwork.id;
        button.appendChild(thumbnailElement(artwork.thumbnail));
        const text = document.createElement('span');
        text.className = 'museum-hub__place-text';
        const title = document.createElement('strong');
        title.textContent = artwork.title;
        const where = document.createElement('span');
        where.textContent = artwork.placeText ? `Hängt in ${artwork.placeText} – wird getauscht` : 'Nicht platziert';
        text.append(title, where);
        button.appendChild(text);
        button.addEventListener('click', () => {
          this.closePopover(false);
          this.host.assign(slotId, artwork.id);
        });
        item.appendChild(button);
        list.appendChild(item);
      }
    };
    search.addEventListener('input', render);
    search.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        list.querySelector<HTMLButtonElement>('button')?.click();
      }
    });
    render();
    popover.append(search, list);
    search.focus({ preventScroll: true });
  }

  /** "Platzieren…" menu for one artwork. */
  openArtworkMenu(artworkId: string, anchor: HTMLElement): void {
    const artwork = this.host.artworks().find((candidate) => candidate.id === artworkId);
    if (!artwork) return;
    this.reset();
    const popover = this.createPopover(anchor, `„${artwork.title}“ platzieren`);
    const list = document.createElement('ul');
    list.className = 'museum-hub__popover-list';
    const add = (text: string, detail: string | null, action: () => void, className = ''): void => {
      const item = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `museum-hub__popover-item ${className}`.trim();
      const label = document.createElement('span');
      label.className = 'museum-hub__place-text';
      const strong = document.createElement('strong');
      strong.textContent = text;
      label.appendChild(strong);
      if (detail) {
        const small = document.createElement('span');
        small.textContent = detail;
        label.appendChild(small);
      }
      button.appendChild(label);
      button.addEventListener('click', () => {
        this.closePopover(false);
        action();
      });
      item.appendChild(button);
      list.appendChild(item);
    };
    for (const place of this.host.currentPlaces()) {
      if (place.slotId === artwork.slotId) continue;
      const occupant = place.artworkId ? this.titleOf(place.artworkId) : null;
      add(place.label, occupant ? `Belegt mit „${occupant}“ – tauschen` : 'Frei', () => this.host.assign(place.slotId, artworkId));
    }
    add('+ Neuer Raum', 'Raum anlegen und Bild dort aufhängen', () => this.host.placeInNewRoom(artworkId));
    if (artwork.location === 'other') add(`In ${artwork.placeText ?? 'seinem Raum'} anzeigen`, null, () => this.host.showArtwork(artworkId));
    if (artwork.slotId) add('Nicht platzieren', 'Bild vom Platz nehmen', () => this.host.unplace(artworkId), 'is-danger');
    popover.appendChild(list);
    list.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true });
  }

  private createPopover(anchor: HTMLElement, titleText: string): HTMLElement {
    this.closePopover(false);
    const popover = document.createElement('div');
    popover.className = 'museum-hub__popover';
    popover.setAttribute('role', 'dialog');
    popover.setAttribute('aria-label', titleText);
    const header = document.createElement('div');
    header.className = 'museum-hub__popover-header';
    const title = document.createElement('strong');
    title.textContent = titleText;
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'museum-hub__popover-close';
    close.textContent = '×';
    close.setAttribute('aria-label', 'Schließen');
    close.addEventListener('click', () => this.closePopover(true));
    header.append(title, close);
    popover.appendChild(header);
    document.body.appendChild(popover);
    const rect = anchor.getBoundingClientRect();
    const width = Math.min(320, window.innerWidth - 16);
    const left = Math.max(8, Math.min(window.innerWidth - width - 8, rect.left + rect.width / 2 - width / 2));
    const below = rect.bottom + 8;
    const top = below + 320 < window.innerHeight ? below : Math.max(8, rect.top - 8 - 320);
    popover.style.left = `${left}px`;
    popover.style.top = `${top}px`;
    popover.style.width = `${width}px`;
    this.popover = popover;
    this.popoverAnchor = anchor;
    window.addEventListener('pointerdown', this.handleOutsidePointer, true);
    return popover;
  }

  closePopover(restoreFocus: boolean): void {
    if (!this.popover) return;
    this.popover.remove();
    this.popover = null;
    window.removeEventListener('pointerdown', this.handleOutsidePointer, true);
    if (restoreFocus) this.popoverAnchor?.focus({ preventScroll: true });
    this.popoverAnchor = null;
  }

  private handleOutsidePointer = (event: PointerEvent): void => {
    if (this.popover && event.target instanceof Node && !this.popover.contains(event.target)) this.closePopover(false);
  };

  private handleKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape') return;
    if (this.popover) {
      event.preventDefault();
      event.stopPropagation();
      this.closePopover(true);
      return;
    }
    if (this.chosenArtworkId || this.armedSlotId || this.pointer?.started) {
      event.preventDefault();
      event.stopPropagation();
      this.cancel();
    }
  };

  private reset(): void {
    const changed = Boolean(this.chosenArtworkId || this.armedSlotId);
    this.chosenArtworkId = null;
    this.armedSlotId = null;
    this.clearHighlights();
    if (changed) this.emit();
  }

  private emit(): void {
    for (const listener of this.listeners) listener();
  }

  private titleOf(artworkId: string): string {
    return this.host.artworks().find((artwork) => artwork.id === artworkId)?.title ?? artworkId;
  }
}
