/**
 * Artwork assignment UI for the placement editor (v1.35): the four places of
 * the current room plus every artwork grouped into "In diesem Raum",
 * "In anderen Räumen", and "Nicht platziert". Artworks can be clicked into a
 * selected place or dragged onto a place (dropping on an occupied place swaps;
 * dropping on "Nicht platziert" removes the artwork from its place).
 */
import { countLabel } from './editorText';

const DRAG_TYPE = 'application/x-freyraum-artwork';

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
  location: 'here' | 'other' | 'unplaced';
  /** "Raum 2 · Linke Wand" for placed artworks. */
  placeText: string | null;
}

export interface ArtworkLibraryCallbacks {
  onSelectPlace(slotId: string): void;
  onArtworkClick(artworkId: string): void;
  onAssign(slotId: string, artworkId: string): void;
  onUnplace(artworkId: string): void;
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

  constructor(private readonly callbacks: ArtworkLibraryCallbacks) {
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
      'Platz wählen, dann ein Bild aus der Liste anklicken oder hierher ziehen. Im Bild: ziehen verschiebt, die rote Ecke ändert die Größe; Pfeiltasten bewegen um 1 cm, mit Umschalt um 10 cm.';
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
    library.append(libraryTitle, autoFill);
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
    const unplaced = this.groups.unplaced.section;
    unplaced.addEventListener('dragover', (event) => {
      if (!event.dataTransfer?.types.includes(DRAG_TYPE)) return;
      event.preventDefault();
      unplaced.classList.add('is-drop-target');
    });
    unplaced.addEventListener('dragleave', () => unplaced.classList.remove('is-drop-target'));
    unplaced.addEventListener('drop', (event) => {
      unplaced.classList.remove('is-drop-target');
      const artworkId = event.dataTransfer?.getData(DRAG_TYPE);
      if (!artworkId) return;
      event.preventDefault();
      this.callbacks.onUnplace(artworkId);
    });

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
    const signature = JSON.stringify([state.places, state.artworks]);
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
  }

  private renderPlaces(places: readonly LibraryPlace[]): void {
    this.placeList.replaceChildren();
    for (const place of places) {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = `museum-hub__place-card is-${place.status}${place.artworkId ? '' : ' is-empty'}`;
      card.dataset['slotId'] = place.slotId;
      card.setAttribute('aria-pressed', 'false');
      card.setAttribute(
        'aria-label',
        `${place.label}: ${place.title ? `„${place.title}“` : 'leer'}${place.status === 'error' ? ', Fehler' : place.status === 'hint' ? ', Hinweis' : ''}`
      );
      card.appendChild(this.thumbnail(place.thumbnail));
      const text = document.createElement('span');
      text.className = 'museum-hub__place-text';
      const label = document.createElement('strong');
      label.textContent = place.label;
      const title = document.createElement('span');
      title.textContent = place.title ?? 'Leer – Bild wählen';
      text.append(label, title);
      card.appendChild(text);
      card.addEventListener('click', () => this.callbacks.onSelectPlace(place.slotId));
      if (place.artworkId) {
        card.draggable = true;
        card.addEventListener('dragstart', (event) => this.startDrag(event, place.artworkId!));
      }
      card.addEventListener('dragover', (event) => {
        if (!event.dataTransfer?.types.includes(DRAG_TYPE)) return;
        event.preventDefault();
        card.classList.add('is-drop-target');
      });
      card.addEventListener('dragleave', () => card.classList.remove('is-drop-target'));
      card.addEventListener('drop', (event) => {
        card.classList.remove('is-drop-target');
        const artworkId = event.dataTransfer?.getData(DRAG_TYPE);
        if (!artworkId) return;
        event.preventDefault();
        this.callbacks.onAssign(place.slotId, artworkId);
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
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'museum-hub__library-item';
        button.dataset['artworkId'] = artwork.id;
        button.draggable = true;
        button.appendChild(this.thumbnail(artwork.thumbnail));
        const text = document.createElement('span');
        text.className = 'museum-hub__place-text';
        const title = document.createElement('strong');
        title.textContent = artwork.title;
        const place = document.createElement('span');
        place.textContent = artwork.placeText ?? 'Nicht platziert – in der Galerie unsichtbar';
        text.append(title, place);
        button.appendChild(text);
        button.setAttribute(
          'aria-label',
          artwork.location === 'unplaced'
            ? `„${artwork.title}“ in den gewählten Platz hängen`
            : `„${artwork.title}“ auswählen (${artwork.placeText ?? ''})`
        );
        button.addEventListener('click', () => this.callbacks.onArtworkClick(artwork.id));
        button.addEventListener('dragstart', (event) => this.startDrag(event, artwork.id));
        item.appendChild(button);
        group.list.appendChild(item);
      }
    }
  }

  private startDrag(event: DragEvent, artworkId: string): void {
    if (!event.dataTransfer) return;
    event.dataTransfer.setData(DRAG_TYPE, artworkId);
    event.dataTransfer.setData('text/plain', artworkId);
    event.dataTransfer.effectAllowed = 'move';
  }

  private thumbnail(src: string | null): HTMLElement {
    const frame = document.createElement('span');
    frame.className = 'museum-hub__thumb';
    frame.setAttribute('aria-hidden', 'true');
    if (src) {
      const image = document.createElement('img');
      image.alt = '';
      image.loading = 'lazy';
      image.decoding = 'async';
      image.draggable = false;
      image.src = src;
      frame.appendChild(image);
    }
    return frame;
  }

  /** Summary used by the bottom status and screen-reader announcements. */
  static unplacedSummary(count: number): string {
    return count === 0 ? 'Alle Bilder sind platziert.' : `${countLabel(count, 'Bild ist', 'Bilder sind')} nicht platziert.`;
  }
}
