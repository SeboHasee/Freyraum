import type { GalleryRoomView } from '../../config/museumHub';
import type { Artwork } from '../../config/artworks';
import { projectGalleryRoomArtwork } from '../../gallery/galleryRoomViewGeometry';
import { quadIsConvex } from '../projectiveGeometry';

interface GalleryRoomViewsOptions {
  views: readonly GalleryRoomView[];
  artwork: Artwork | null;
  resolveBackground: (src: string) => string;
  onHistory: () => void;
  onChange: (views: GalleryRoomView[]) => void;
}

export class EditorGalleryRoomViews {
  readonly element: HTMLElement;
  private readonly select: HTMLSelectElement;
  private readonly preview: HTMLDivElement;
  private readonly background: HTMLImageElement;
  private readonly artworkImage: HTMLImageElement;
  private readonly fields = new Map<string, HTMLInputElement>();
  private readonly status: HTMLParagraphElement;
  private readonly options: GalleryRoomViewsOptions;
  private views: GalleryRoomView[];
  private activeId = '';
  private editStarted = false;

  constructor(options: GalleryRoomViewsOptions) {
    this.options = options;
    this.views = options.views.map((view) => structuredClone(view));
    const section = document.createElement('section');
    section.className = 'museum-hub__gallery-room-editor';
    const heading = document.createElement('h3');
    heading.textContent = 'Foto-Raum gestalten';
    const hint = document.createElement('p');
    hint.className = 'museum-hub__editor-hint';
    hint.textContent = 'Wandgrenze und Bildposition werden wie in der Besucheransicht projiziert.';
    const selectLabel = document.createElement('label');
    selectLabel.className = 'museum-hub__calibration-label';
    selectLabel.textContent = 'Foto-Raum';
    this.select = document.createElement('select');
    this.select.className = 'museum-hub__calibration-select';
    this.select.setAttribute('aria-label', 'Foto-Raum zum Bearbeiten auswählen');
    this.select.addEventListener('change', () => this.setActive(this.select.value));
    selectLabel.appendChild(this.select);

    this.preview = document.createElement('div');
    this.preview.className = 'museum-hub__gallery-room-preview';
    this.preview.setAttribute('role', 'img');
    this.preview.setAttribute('aria-label', 'Vorschau des projizierten Foto-Raums');
    this.background = document.createElement('img');
    this.background.alt = '';
    this.background.setAttribute('aria-hidden', 'true');
    this.artworkImage = document.createElement('img');
    this.artworkImage.alt = '';
    this.artworkImage.setAttribute('aria-hidden', 'true');
    this.preview.append(this.background, this.artworkImage);

    const boundary = document.createElement('fieldset');
    const boundaryLegend = document.createElement('legend');
    boundaryLegend.textContent = 'Wandgrenze (0–100 %)';
    const boundaryGrid = document.createElement('div');
    boundaryGrid.className = 'museum-hub__gallery-room-quad';
    for (let index = 0; index < 4; index += 1) {
      for (const axis of ['x', 'y'] as const) {
        const key = `corner-${index}-${axis}`;
        boundaryGrid.appendChild(this.createNumberField(
          key,
          `Ecke ${index + 1} ${axis.toUpperCase()}`,
          0,
          1,
          0.001
        ));
      }
    }
    boundary.append(boundaryLegend, boundaryGrid);

    const placement = document.createElement('fieldset');
    const placementLegend = document.createElement('legend');
    placementLegend.textContent = 'Kunstwerk auf der Wand';
    const placementGrid = document.createElement('div');
    placementGrid.className = 'museum-hub__gallery-room-placement';
    placementGrid.append(
      this.createNumberField('placement-u', 'Horizontalposition', 0, 1, 0.01),
      this.createNumberField('placement-v', 'Vertikalposition', 0, 1, 0.01),
      this.createNumberField('placement-height', 'Bildhöhe', 0.05, 0.88, 0.01)
    );
    placement.append(placementLegend, placementGrid);

    this.status = document.createElement('p');
    this.status.className = 'museum-hub__editor-hint museum-hub__gallery-room-status';
    this.status.setAttribute('role', 'status');
    this.status.setAttribute('aria-live', 'polite');
    section.append(heading, hint, selectLabel, this.preview, boundary, placement, this.status);
    this.element = section;
    this.refresh(options.views);
  }

  refresh(views: readonly GalleryRoomView[]): void {
    this.views = views.map((view) => structuredClone(view));
    this.select.replaceChildren();
    for (const view of this.views) {
      const option = document.createElement('option');
      option.value = view.id;
      option.textContent = view.name;
      this.select.appendChild(option);
    }
    const nextActive = this.views.some((view) => view.id === this.activeId)
      ? this.activeId
      : this.views[0]?.id ?? '';
    this.setActive(nextActive);
    this.element.hidden = this.views.length === 0;
  }

  private createNumberField(
    key: string,
    labelText: string,
    min: number,
    max: number,
    step: number
  ): HTMLLabelElement {
    const label = document.createElement('label');
    label.className = 'museum-hub__gallery-room-field';
    label.textContent = labelText;
    const input = document.createElement('input');
    input.type = 'number';
    input.min = String(min);
    input.max = String(max);
    input.step = String(step);
    input.setAttribute('aria-label', labelText);
    input.addEventListener('focus', () => {
      if (this.editStarted) return;
      this.options.onHistory();
      this.editStarted = true;
    });
    input.addEventListener('input', () => this.applyField(key, input));
    input.addEventListener('change', () => {
      this.editStarted = false;
      this.applyField(key, input);
    });
    this.fields.set(key, input);
    label.appendChild(input);
    return label;
  }

  private setActive(id: string): void {
    this.activeId = id;
    this.select.value = id;
    const view = this.views.find((candidate) => candidate.id === id);
    if (!view) return;
    this.background.src = this.options.resolveBackground(view.background.src);
    if (this.options.artwork) this.artworkImage.src = this.options.artwork.image;
    this.status.textContent = '';
    this.syncFields(view);
    this.updatePreview(view);
  }

  private syncFields(view: GalleryRoomView): void {
    view.wallQuad.forEach((corner, index) => {
      this.fields.get(`corner-${index}-x`)!.value = corner.x.toFixed(3);
      this.fields.get(`corner-${index}-y`)!.value = corner.y.toFixed(3);
    });
    this.fields.get('placement-u')!.value = view.placement.u.toFixed(3);
    this.fields.get('placement-v')!.value = view.placement.v.toFixed(3);
    this.fields.get('placement-height')!.value = view.placement.height.toFixed(3);
  }

  private applyField(key: string, input: HTMLInputElement): void {
    const view = this.views.find((candidate) => candidate.id === this.activeId);
    const value = Number(input.value);
    if (!view || !Number.isFinite(value) || value < Number(input.min) || value > Number(input.max)) return;
    const next = structuredClone(view);
    const cornerMatch = /^corner-(\d)-([xy])$/.exec(key);
    if (cornerMatch) {
      const corner = next.wallQuad[Number(cornerMatch[1])];
      corner[cornerMatch[2] as 'x' | 'y'] = value;
    } else {
      const property = key.slice('placement-'.length) as keyof GalleryRoomView['placement'];
      next.placement[property] = value;
    }
    const artworkAspect = this.options.artwork
      ? this.options.artwork.dimensions.width / this.options.artwork.dimensions.height
      : 1;
    const artworkHeight = 1000 / artworkAspect;
    const projected = projectGalleryRoomArtwork(
      next,
      artworkAspect,
      1000,
      artworkHeight,
      this.preview.clientWidth,
      this.preview.clientHeight
    );
    const width = next.placement.height * artworkAspect / next.wallAspect;
    const valid = next.wallQuad.every((corner) =>
      Number.isFinite(corner.x) && Number.isFinite(corner.y)
        && corner.x >= 0 && corner.x <= 1 && corner.y >= 0 && corner.y <= 1
    ) && quadIsConvex(next.wallQuad)
      && next.placement.u >= 0 && next.placement.u <= 1
      && next.placement.v >= 0 && next.placement.v <= 1
      && next.placement.height >= 0.05 && next.placement.height <= 0.88
      && width <= 0.88 && Boolean(projected);
    if (!valid) {
      this.status.textContent = 'Ungültige Wandgrenze oder Bildposition. Bitte Werte innerhalb der Wand wählen.';
      this.status.classList.add('is-error');
      return;
    }
    const index = this.views.findIndex((candidate) => candidate.id === this.activeId);
    this.views[index] = next;
    this.options.onChange(this.views.map((candidate) => structuredClone(candidate)));
    this.status.textContent = 'Änderung übernommen.';
    this.status.classList.remove('is-error');
    this.updatePreview(next);
  }

  private updatePreview(view: GalleryRoomView): void {
    const artworkAspect = this.options.artwork
      ? this.options.artwork.dimensions.width / this.options.artwork.dimensions.height
      : 1;
    const width = 1000;
    const height = width / artworkAspect;
    const rect = this.preview.getBoundingClientRect();
    const projected = projectGalleryRoomArtwork(
      view,
      artworkAspect,
      width,
      height,
      rect.width || 640,
      rect.height || 360
    );
    if (!projected) {
      this.status.textContent = 'Die Vorschau kann mit dieser Wandgrenze nicht berechnet werden.';
      this.status.classList.add('is-error');
      return;
    }
    this.artworkImage.style.width = `${projected.width}px`;
    this.artworkImage.style.height = `${projected.height}px`;
    this.artworkImage.style.transform = projected.transform;
    this.status.classList.remove('is-error');
  }
}
