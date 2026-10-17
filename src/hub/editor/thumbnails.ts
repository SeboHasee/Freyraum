/**
 * Small, reusable artwork thumbnails for the placement editor (v1.36).
 *
 * Each source image is decoded once in the background and drawn into a small
 * master canvas; every list entry, place card, picker row, and drag preview
 * then copies that canvas. Rebuilding the panels therefore never re-decodes or
 * re-scales a full-resolution artwork. Canvases only display pixels (they are
 * never read back), so file:// sources work even though they taint the canvas.
 */

const MASTER_SIZE = 160;
const masters = new Map<string, HTMLCanvasElement | null>();
const pending = new Map<string, Promise<HTMLCanvasElement | null>>();

function loadMaster(src: string): Promise<HTMLCanvasElement | null> {
  const existing = pending.get(src);
  if (existing) return existing;
  const promise = new Promise<HTMLCanvasElement | null>((resolve) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => {
      const decoded = typeof image.decode === 'function' ? image.decode().catch(() => undefined) : Promise.resolve();
      void decoded.then(() => {
        const width = image.naturalWidth;
        const height = image.naturalHeight;
        if (!width || !height) {
          resolve(null);
          return;
        }
        const scale = Math.min(1, MASTER_SIZE / Math.max(width, height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(width * scale));
        canvas.height = Math.max(1, Math.round(height * scale));
        const context = canvas.getContext('2d');
        if (!context) {
          resolve(null);
          return;
        }
        context.imageSmoothingQuality = 'high';
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas);
      });
    };
    image.onerror = () => resolve(null);
    image.src = src;
  }).then((canvas) => {
    masters.set(src, canvas);
    return canvas;
  });
  pending.set(src, promise);
  return promise;
}

function copyInto(frame: HTMLElement, master: HTMLCanvasElement): void {
  const canvas = document.createElement('canvas');
  canvas.width = master.width;
  canvas.height = master.height;
  canvas.getContext('2d')?.drawImage(master, 0, 0);
  frame.replaceChildren(canvas);
}

/** Short, stable identity for a (possibly huge data:) thumbnail URL. */
export function thumbnailKey(src: string): string {
  return src.length > 256 ? `${src.length}:${src.slice(0, 64)}:${src.slice(-64)}` : src;
}

/** Thumbnail frame; the picture appears as soon as its small copy is ready. */
export function thumbnailElement(src: string | null): HTMLElement {
  const frame = document.createElement('span');
  frame.className = 'museum-hub__thumb';
  frame.setAttribute('aria-hidden', 'true');
  if (!src) return frame;
  const ready = masters.get(src);
  if (ready) {
    copyInto(frame, ready);
  } else if (ready === undefined) {
    void loadMaster(src).then((master) => {
      if (master) copyInto(frame, master);
    });
  }
  return frame;
}
