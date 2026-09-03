import type { Artwork } from '../config/artworks';
import { getDiagnostics } from '../utils/Diagnostics';

export type FallbackCategory =
  | 'webgl-unavailable'
  | 'renderer-initialization'
  | 'startup'
  | 'preview-assets';

export interface FallbackScreenOptions {
  category: FallbackCategory;
  reason: string;
  surfaceColor?: string | null;
  artworks?: readonly Artwork[];
  onRetry?: () => void;
}

const COPY: Record<FallbackCategory, { title: string; body: string }> = {
  'webgl-unavailable': {
    title: 'Museum im 2D-Modus',
    body: 'Auf diesem Gerät steht WebGL nicht zur Verfügung. Sie können die Kunstwerke weiterhin ansehen und lesen.',
  },
  'renderer-initialization': {
    title: 'Museum im 2D-Modus',
    body: 'Die immersive 3D-Ansicht konnte nicht gestartet werden. Die Kunstwerke bleiben hier vollständig zugänglich.',
  },
  startup: {
    title: 'Vorschau konnte nicht vollständig starten',
    body: 'Beim Laden ist ein unerwarteter Fehler aufgetreten. Dies ist nicht automatisch ein WebGL-Problem.',
  },
  'preview-assets': {
    title: 'Vorschau ist unvollständig',
    body: 'Erforderliche lokale Vorschaudateien fehlen. Bitte erstellen Sie die Kundenvorschau erneut.',
  },
};

function artworkSource(artwork: Artwork): string {
  return artwork.image || artwork.webglImage || '';
}

export function showFallbackScreen(
  container: HTMLElement,
  options: FallbackScreenOptions
): void {
  const diagnostics = getDiagnostics();
  container.dataset['experience'] = 'fallback';
  container.querySelector('.fallback-screen')?.remove();
  container.querySelector<HTMLElement>('.loading-overlay')?.remove();

  const fallback = document.createElement('section');
  fallback.className = 'fallback-screen';
  fallback.setAttribute('aria-labelledby', 'fallback-screen-title');
  if (options.surfaceColor?.trim()) fallback.style.backgroundColor = options.surfaceColor.trim();

  const card = document.createElement('div');
  card.className = 'fallback-screen__card';
  const eyebrow = document.createElement('p');
  eyebrow.className = 'fallback-screen__eyebrow';
  eyebrow.textContent = 'FREYRAUM';
  const title = document.createElement('h1');
  title.id = 'fallback-screen-title';
  title.className = 'fallback-screen__title';
  title.textContent = COPY[options.category].title;
  const body = document.createElement('p');
  body.className = 'fallback-screen__body';
  body.textContent = COPY[options.category].body;
  card.append(eyebrow, title, body);

  const actions = document.createElement('div');
  actions.className = 'fallback-screen__actions';
  if (options.artworks?.length) {
    const continueLink = document.createElement('a');
    continueLink.className = 'fallback-screen__action';
    continueLink.href = '#fallback-artworks';
    continueLink.textContent = 'In 2D fortfahren';
    actions.appendChild(continueLink);
  }
  if (options.onRetry) {
    const retry = document.createElement('button');
    retry.className = 'fallback-screen__action';
    retry.type = 'button';
    retry.textContent = '3D erneut versuchen';
    retry.addEventListener('click', () => {
      retry.disabled = true;
      retry.textContent = '3D wird erneut gestartet …';
      options.onRetry?.();
    }, { once: true });
    actions.appendChild(retry);
  }
  if (actions.childElementCount) card.appendChild(actions);

  if (diagnostics.getMode() !== 'default') {
    const detail = document.createElement('details');
    detail.className = 'fallback-screen__detail';
    const summary = document.createElement('summary');
    summary.textContent = 'Technische Details';
    const reason = document.createElement('p');
    reason.textContent = options.reason;
    detail.append(summary, reason);
    card.appendChild(detail);
  }
  fallback.appendChild(card);

  if (options.artworks?.length) {
    const museum = document.createElement('section');
    museum.id = 'fallback-artworks';
    museum.className = 'fallback-screen__museum';
    museum.setAttribute('aria-label', 'Kunstwerke');
    for (const artwork of options.artworks) {
      const article = document.createElement('article');
      article.className = 'fallback-screen__artwork';
      const image = document.createElement('img');
      image.loading = 'lazy';
      image.decoding = 'async';
      image.alt = artwork.alt;
      const primarySource = artworkSource(artwork);
      image.src = primarySource;
      if (artwork.webglImage && artwork.webglImage !== primarySource) {
        image.addEventListener('error', () => {
          image.src = artwork.webglImage ?? '';
        }, { once: true });
      }
      const text = document.createElement('div');
      const artworkTitle = document.createElement('h2');
      artworkTitle.textContent = artwork.title;
      const metadata = document.createElement('p');
      metadata.className = 'fallback-screen__metadata';
      metadata.textContent = `${artwork.year} · ${artwork.medium}`;
      const description = document.createElement('p');
      description.textContent = artwork.description;
      const credit = document.createElement('p');
      credit.className = 'fallback-screen__metadata';
      credit.textContent = artwork.credit;
      text.append(artworkTitle, metadata, description, credit);
      article.append(image, text);
      museum.appendChild(article);
    }
    fallback.appendChild(museum);
  }

  container.appendChild(fallback);
  diagnostics.info('fallback', 'shown', 'Fallback experience shown', {
    category: options.category,
    artworkCount: options.artworks?.length ?? 0,
    protocol: window.location.protocol,
  });
}
