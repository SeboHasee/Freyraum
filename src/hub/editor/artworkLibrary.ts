/**
 * Artwork assignment UI for the placement editor (v1.35, v1.36): the four
 * places of the current room plus every artwork grouped into "In diesem Raum",
 * "In anderen Räumen", and "Nicht platziert". All clicks and drags go through
 * the shared PlacementController: pick an artwork, then pick a place (in the
 * list or directly in the museum view), or drag it there. Dropping on an
 * occupied place swaps; dropping back onto the list removes it from its place.
 */
import { countLabel } from './editorText';
import type { PlacementController } from './placementController';
import { thumbnailElement, thumbnailKey } from './thumbnails';

export interface LibraryPlace {
  slotId: string;
  label: string;
  artworkId: string | null;
  title: string | null;
  thumbnail: string | null;
  status: 'ok' | 'hint' | 'error';
}

export interface LibraryArtwork {
  id: string;
  title: string;
  thumbnail: string | null;
  /** Place that currently holds the artwork. */
  slotId: string | null;
  location: 'here' | 'other' | 'unplaced';
  /** "Raum 2 · Linke Wand" for placed artworks. */
  placeText: string | null;
}

export interface ArtworkLibraryCallbacks {
  onAutoFill(): void;
}

export class EditorArtworkLibrary {
  readonly places: HTMLElement;
  readonly library: HTMLElement;
  private readonly placeList: HTMLElement;
  private readonly placesTitle: HTMLElement;
  private readonly groups: Record<LibraryArtwork['location'], { section: HTMLElement; title: HTMLElement; list: HTMLElement }>;
  private readonly autoFill: HTMLButtonElement;
  private signature = '';
  private activeSlotId: string | null = null;
  private readonly libraryStatus: HTMLElement;
  /** Empty place cards have no artwork to drag; a plain click selects them. */
  private pendingPointerClick: HTMLElement | null = null;

  constructor(
    private readonly callbacks: ArtworkLibraryCallbacks,
    private readonly placement: PlacementController
  ) {
    const places = document.createElement('section');
    places.className = 'museum-hub__editor-section museum-hub__places';
    places.setAttribute('aria-labelledby', 'editor-places-title');
    const placesTitle = document.createElement('h3');
    placesTitle.id = 'editor-places-title';
    const placeList = document.createElement('div');
    placeList.className = 'museum-hub__place-list';
    placeList.setAttribute('role', 'group');
    placeList.setAttribute('aria-labelledby', 'editor-places-title');
    const hint = document.createElement('p');
    hint.className = 'museum-hub__editor-hint';
    hint.textContent =
      'Im Bild: ziehen verschiebt, die rote Ecke ändert die Größe; Pfeiltasten bewegen um 1 cm, mit Umschalt um 10 cm. Ein leerer Platz im Bild öffnet die Bildauswahl.';
    places.append(placesTitle, placeList, hint);

    const library = document.createElement('section');
    library.className = 'museum-hub__editor-section museum-hub__library';
    library.setAttribute('aria-labelledby', 'editor-library-title');
    const libraryTitle = document.createElement('h3');
    libraryTitle.id = 'editor-library-title';
    libraryTitle.textContent = 'Alle Bilder';
    const autoFill = document.createElement('button');
    autoFill.type = 'button';
    autoFill.className = 'museum-hub__calibration-action';
    autoFill.textContent = 'Leere Plätze automatisch füllen';
    autoFill.addEventListener('click', () => this.callbacks.onAutoFill());
    const libraryHint = document.createElement('p');
    libraryHint.className = 'museum-hub__editor-hint museum-hub__library-hint';
    libraryHint.textContent =
      'Ziehen oder anklicken: Bild anklicken, dann einen Platz im Bild oder oben wählen – oder das Bild direkt auf einen Platz ziehen. Zurück in die Liste ziehen nimmt es vom Platz.';
    this.libraryStatus = document.createElement('p');
    this.libraryStatus.className = 'museum-hub__library-status';
    this.libraryStatus.hidden = true;
    library.append(libraryTitle, libraryHint, this.libraryStatus, autoFill);
    // The whole list is a drop area for "nicht platzieren".
    library.dataset['dropUnplace'] = 'true';
    const makeGroup = (location: LibraryArtwork['location']) => {
      const section = document.createElement('div');
      section.className = `museum-hub__library-group museum-hub__library-group--${location}`;
      section.dataset['location'] = location;
      const title = document.createElement('h4');
      title.id = `editor-library-${location}`;
      const list = document.createElement('ul');
      list.className = 'museum-hub__library-list';
      list.setAttribute('aria-labelledby', title.id);
      section.append(title, list);
      library.appendChild(section);
      return { section, title, list };
    };
    this.groups = { here: makeGroup('here'), other: makeGroup('other'), unplaced: makeGroup('unplaced') };
    this.places = places;
    this.library = library;
    this.placeList = placeList;
    this.placesTitle = placesTitle;
    this.autoFill = autoFill;
  }

  update(state: {
    roomTitle: string;
    places: readonly LibraryPlace[];
    artworks: readonly LibraryArtwork[];
    activeSlotId: string | null;
  }): void {
    this.placesTitle.textContent = `Plätze in ${state.roomTitle}`;
    // Thumbnails can be multi-megabyte data: URLs in the file:// bundle, so
    // the change signature uses a short key instead of the full URL.
    const signature = JSON.stringify([state.places, state.artworks], (key, value: unknown) =>
      key === 'thumbnail' && typeof value === 'string' ? thumbnailKey(value) : value
    );
    if (signature !== this.signature) {
      this.signature = signature;
      this.renderPlaces(state.places);
      this.renderArtworks(state.artworks);
    }
    const hasEmptyPlace = state.places.some((place) => !place.artworkId);
    const hasUnplaced = state.artworks.some((artwork) => artwork.location === 'unplaced');
    this.autoFill.disabled = !hasEmptyPlace || !hasUnplaced;
    this.activeSlotId = state.activeSlotId;
    for (const card of this.placeList.querySelectorAll<HTMLButtonElement>('[data-slot-id]')) {
      const active = card.dataset['slotId'] === this.activeSlotId;
      card.classList.toggle('is-active', active);
      card.setAttribute('aria-pressed', String(active));
    }
    this.syncPlacementState();
  }

  /** Marks the chosen artwork / armed place and explains the next step. */
  syncPlacementState(): void {
    const chosen = this.placement.chosenArtwork;
    const armed = this.placement.armedPlace;
    for (const button of this.library.querySelectorAll<HTMLButtonElement>('.museum-hub__library-item')) {
      const isChosen = button.dataset['artworkId'] === chosen;
      button.classList.toggle('is-chosen', isChosen);
      button.setAttribute('aria-pressed', String(isChosen));
    }
    for (const card of this.placeList.querySelectorAll<HTMLButtonElement>('[data-slot-id]')) {
      card.classList.toggle('is-armed', card.dataset['slotId'] === armed);
    }
    this.library.classList.toggle('is-awaiting-artwork', Boolean(armed));
    if (chosen) {
      const title = this.library.querySelector<HTMLElement>(
        `.museum-hub__library-item[data-artwork-id="${CSS.escape(chosen)}"] strong`
      )?.textContent ?? chosen;
      this.libraryStatus.textContent = `„${title}“ ausgewählt – jetzt einen Platz anklicken (Esc bricht ab).`;
      this.libraryStatus.hidden = false;
    } else if (armed) {
      const label = this.placeList.querySelector<HTMLElement>(`[data-slot-id="${CSS.escape(armed)}"] strong`)?.textContent ?? '';
      this.libraryStatus.textContent = `${label} ist leer – jetzt ein Bild anklicken (Esc bricht ab).`;
      this.libraryStatus.hidden = false;
    } else {
      this.libraryStatus.hidden = true;
    }
  }

  private renderPlaces(places: readonly LibraryPlace[]): void {
    this.placeList.replaceChildren();
    for (const place of places) {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = `museum-hub__place-card is-${place.status}${place.artworkId ? '' : ' is-empty'}`;
      card.dataset['slotId'] = place.slotId;
      card.dataset['dropSlot'] = place.slotId;
      card.setAttribute('aria-pressed', 'false');
      card.setAttribute(
        'aria-label',
        `${place.label}: ${place.title ? `„${place.title}“` : 'leer'}${place.status === 'error' ? ', Fehler' : place.status === 'hint' ? ', Hinweis' : ''}`
      );
      card.appendChild(thumbnailElement(place.thumbnail));
      const text = document.createElement('span');
      text.className = 'museum-hub__place-text';
      const label = document.createElement('strong');
      label.textContent = place.label;
      const title = document.createElement('span');
      title.textContent = place.title ?? 'Leerer Platz – Bild anklicken oder hierher ziehen';
      text.append(label, title);
      card.appendChild(text);
      const choose = (): void => this.placement.choosePlace(place.slotId);
      // Mouse/touch go through the controller (click or drag); keyboard
      // activation arrives as a click without pointer events (detail 0).
      card.addEventListener('pointerdown', (event) => {
        if (place.artworkId) this.placement.beginPointer(event, place.artworkId, place.slotId, choose);
        else if (event.isPrimary && (event.pointerType !== 'mouse' || event.button === 0)) this.pendingPointerClick = card;
      });
      card.addEventListener('click', (event) => {
        if (event.detail === 0 || this.pendingPointerClick === card) choose();
        this.pendingPointerClick = null;
      });
      this.placeList.appendChild(card);
    }
  }

  private renderArtworks(artworks: readonly LibraryArtwork[]): void {
    const titles: Record<LibraryArtwork['location'], string> = {
      here: 'In diesem Raum',
      other: 'In anderen Räumen',
      unplaced: 'Nicht platzierte Kunstwerke',
    };
    for (const location of ['here', 'other', 'unplaced'] as const) {
      const group = this.groups[location];
      const entries = artworks.filter((artwork) => artwork.location === location);
      group.title.textContent = `${titles[location]} (${entries.length})`;
      group.list.replaceChildren();
      if (entries.length === 0) {
        const empty = document.createElement('li');
        empty.className = 'museum-hub__library-empty';
        empty.textContent = location === 'unplaced' ? 'Alle Bilder hängen in einem Raum.' : 'Keine Bilder.';
        group.list.appendChild(empty);
        continue;
      }
      for (const artwork of entries) {
        const item = document.createElement('li');
        item.className = 'museum-hub__library-row';
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'museum-hub__library-item';
        button.dataset['artworkId'] = artwork.id;
        button.setAttribute('aria-pressed', 'false');
        const grip = document.createElement('span');
        grip.className = 'museum-hub__drag-grip';
        grip.setAttribute('aria-hidden', 'true');
        grip.textContent = '⠿';
        button.append(grip, thumbnailElement(artwork.thumbnail));
        const text = document.createElement('span');
        text.className = 'museum-hub__place-text';
        const title = document.createElement('strong');
        title.textContent = artwork.title;
        const place = document.createElement('span');
        place.textContent = artwork.placeText ?? 'Nicht platziert – in der Galerie unsichtbar';
        text.append(title, place);
        button.appendChild(text);
        const chosenBadge = document.createElement('span');
        chosenBadge.className = 'museum-hub__chosen-badge';
        chosenBadge.textContent = 'Ausgewählt';
        chosenBadge.setAttribute('aria-hidden', 'true');
        button.appendChild(chosenBadge);
        button.setAttribute(
          'aria-label',
          `„${artwork.title}“ (${artwork.placeText ?? 'nicht platziert'}). Auswählen und danach einen Platz wählen.`
        );
        const choose = (): void => this.placement.chooseArtwork(artwork.id);
        button.addEventListener('pointerdown', (event) =>
          this.placement.beginPointer(event, artwork.id, artwork.slotId, choose)
        );
        button.addEventListener('click', (event) => {
          if (event.detail === 0) choose();
        });
        const more = document.createElement('button');
        more.type = 'button';
        more.className = 'museum-hub__library-more';
        more.textContent = 'Platzieren…';
        more.setAttribute('aria-label', `„${artwork.title}“ platzieren: Platz, neuen Raum oder Entfernen wählen`);
        more.setAttribute('aria-haspopup', 'dialog');
        more.addEventListener('click', () => this.placement.openArtworkMenu(artwork.id, more));
        item.append(button, more);
        group.list.appendChild(item);
      }
    }
  }

  /** Summary used by the bottom status and screen-reader announcements. */
  static unplacedSummary(count: number): string {
    return count === 0 ? 'Alle Bilder sind platziert.' : `${countLabel(count, 'Bild ist', 'Bilder sind')} nicht platziert.`;
  }
}
