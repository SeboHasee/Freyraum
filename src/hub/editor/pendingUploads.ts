/**
 * v1.38 — Pending uploads (background + new artworks) and browser drafts for
 * the online placement editor.
 *
 * Uploads stay in the browser until "Veröffentlichen": they are previewed
 * through object URLs, written into the save package, and kept in an
 * IndexedDB draft so a crash or closed tab loses nothing.
 */
import {
  BACKGROUNDS_DIR,
  INBOX_DIR,
  MAX_IMAGE_BYTES,
  MAX_UPLOAD_LONG_SIDE,
  buildArtworkSidecar,
  sniffImageType,
  type PublishFile,
  type UploadImageExtension,
} from '../../online/publishRules';

export interface PreparedImage {
  blob: Blob;
  extension: UploadImageExtension;
  width: number;
  height: number;
  resized: boolean;
}

async function decodeImage(blob: Blob): Promise<{ source: CanvasImageSource; width: number; height: number; close(): void }> {
  if (typeof createImageBitmap === 'function') {
    const bitmap = await createImageBitmap(blob);
    return { source: bitmap, width: bitmap.width, height: bitmap.height, close: () => bitmap.close() };
  }
  const url = URL.createObjectURL(blob);
  const image = new Image();
  image.src = url;
  try {
    await image.decode();
  } finally {
    URL.revokeObjectURL(url);
  }
  return { source: image, width: image.naturalWidth, height: image.naturalHeight, close: () => undefined };
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/**
 * Downscales to at most 4096 px on the long side and keeps the file below the
 * service limit. Untouched PNG/JPEG/WebP files are uploaded byte-for-byte.
 */
export async function prepareImageUpload(file: Blob, maxLongSide = MAX_UPLOAD_LONG_SIDE): Promise<PreparedImage> {
  const head = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const type = sniffImageType(head);
  const decoded = await decodeImage(file);
  try {
    const { width, height } = decoded;
    if (!(width > 0 && height > 0)) throw new Error('invalid-image');
    const scale = Math.min(1, maxLongSide / Math.max(width, height));
    if (scale === 1 && type && file.size <= MAX_IMAGE_BYTES) {
      return { blob: file, extension: type === 'jpeg' ? 'jpg' : type, width, height, resized: false };
    }
    const targetWidth = Math.max(1, Math.round(width * scale));
    const targetHeight = Math.max(1, Math.round(height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('no-canvas');
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(decoded.source, 0, 0, targetWidth, targetHeight);
    if (type === 'png') {
      const png = await canvasToBlob(canvas, 'image/png');
      if (png && png.size <= MAX_IMAGE_BYTES) {
        return { blob: png, extension: 'png', width: targetWidth, height: targetHeight, resized: scale < 1 };
      }
    }
    for (const quality of [0.92, 0.85, 0.75, 0.6]) {
      const jpeg = await canvasToBlob(canvas, 'image/jpeg', quality);
      if (jpeg && jpeg.size <= MAX_IMAGE_BYTES) {
        return { blob: jpeg, extension: 'jpg', width: targetWidth, height: targetHeight, resized: scale < 1 };
      }
    }
    throw new Error('too-large');
  } finally {
    decoded.close();
  }
}

export interface PendingBackground {
  name: string;
  src: string;
  blob: Blob;
  width: number;
  height: number;
  objectUrl: string;
}

export interface PendingArtwork {
  id: string;
  fileName: string;
  blob: Blob;
  width: number;
  height: number;
  title: string;
  credit: string;
  objectUrl: string;
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? '');
      resolve(result.slice(result.indexOf(',') + 1));
    };
    reader.onerror = () => reject(reader.error ?? new Error('read-failed'));
    reader.readAsDataURL(blob);
  });
}

function textToBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (let index = 0; index < bytes.length; index += 1) binary += String.fromCharCode(bytes[index]!);
  return btoa(binary);
}

export class PendingUploads {
  background: PendingBackground | null = null;
  readonly artworks: PendingArtwork[] = [];
  /**
   * Saved/published uploads whose object URLs the open editor still shows
   * (artwork images, background) until the page reloads with the live files.
   */
  private readonly published: { background: PendingBackground | null; urls: string[] } = { background: null, urls: [] };

  setBackground(next: Omit<PendingBackground, 'objectUrl'> & { objectUrl?: string }): PendingBackground {
    if (this.background) URL.revokeObjectURL(this.background.objectUrl);
    this.background = { ...next, objectUrl: next.objectUrl ?? URL.createObjectURL(next.blob) };
    return this.background;
  }

  addArtwork(next: Omit<PendingArtwork, 'objectUrl'> & { objectUrl?: string }): PendingArtwork {
    const entry = { ...next, objectUrl: next.objectUrl ?? URL.createObjectURL(next.blob) };
    this.artworks.push(entry);
    return entry;
  }

  removeArtwork(id: string): PendingArtwork | null {
    const index = this.artworks.findIndex((entry) => entry.id === id);
    if (index < 0) return null;
    const [removed] = this.artworks.splice(index, 1);
    return removed ?? null;
  }

  removeBackground(): PendingBackground | null {
    const removed = this.background;
    this.background = null;
    return removed;
  }

  get isEmpty(): boolean {
    return !this.background && this.artworks.length === 0;
  }

  /** Bytes that will be uploaded for the given config (unused background excluded). */
  totalBytes(backgroundSrc: string): number {
    const background = this.background && this.background.src === backgroundSrc ? this.background.blob.size : 0;
    return background + this.artworks.reduce((sum, entry) => sum + entry.blob.size, 0);
  }

  /** Package files; a pending background is only sent while it is selected. */
  async toFiles(backgroundSrc: string): Promise<PublishFile[]> {
    const files: PublishFile[] = [];
    if (this.background && this.background.src === backgroundSrc) {
      files.push({ path: `${BACKGROUNDS_DIR}${this.background.name}`, contentBase64: await blobToBase64(this.background.blob) });
    }
    for (const artwork of this.artworks) {
      files.push({ path: `${INBOX_DIR}${artwork.fileName}`, contentBase64: await blobToBase64(artwork.blob) });
      files.push({
        path: `${INBOX_DIR}${artwork.id}.txt`,
        contentBase64: textToBase64(buildArtworkSidecar({ title: artwork.title, credit: artwork.credit })),
      });
    }
    return files;
  }

  /** After a successful save: nothing is pending any more, previews stay alive. */
  markPublished(): void {
    if (this.background) {
      if (this.published.background) this.published.urls.push(this.published.background.objectUrl);
      this.published.background = this.background;
    }
    this.published.urls.push(...this.artworks.map((artwork) => artwork.objectUrl));
    this.background = null;
    this.artworks.length = 0;
  }

  /** Preview URL of a saved background that is not live yet. */
  publishedBackground(src: string): PendingBackground | null {
    return this.published.background?.src === src ? this.published.background : null;
  }

  clear(): void {
    if (this.published.background) URL.revokeObjectURL(this.published.background.objectUrl);
    for (const url of this.published.urls) URL.revokeObjectURL(url);
    this.published.background = null;
    this.published.urls.length = 0;
    if (this.background) URL.revokeObjectURL(this.background.objectUrl);
    this.background = null;
    for (const artwork of this.artworks) URL.revokeObjectURL(artwork.objectUrl);
    this.artworks.length = 0;
  }
}

// ── Browser drafts (IndexedDB) ──────────────────────────────────────────────

export interface EditorDraft {
  baseCommit: string | null;
  savedAt: string;
  config: string;
  background: Omit<PendingBackground, 'objectUrl'> | null;
  artworks: Omit<PendingArtwork, 'objectUrl'>[];
}

const DB_NAME = 'freyraum-editor';
const STORE = 'drafts';
const KEY = 'current';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('no-indexeddb'));
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('indexeddb-open-failed'));
  });
}

async function withStore<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb();
  try {
    return await new Promise<T>((resolve, reject) => {
      const transaction = db.transaction(STORE, mode);
      const request = action(transaction.objectStore(STORE));
      transaction.oncomplete = () => resolve(request.result);
      transaction.onerror = () => reject(transaction.error ?? new Error('indexeddb-failed'));
      transaction.onabort = () => reject(transaction.error ?? new Error('indexeddb-aborted'));
    });
  } finally {
    db.close();
  }
}

export async function saveDraft(draft: EditorDraft): Promise<boolean> {
  try {
    await withStore('readwrite', (store) => store.put(draft, KEY));
    return true;
  } catch {
    return false;
  }
}

export async function loadDraft(): Promise<EditorDraft | null> {
  try {
    const draft = (await withStore('readonly', (store) => store.get(KEY))) as EditorDraft | undefined;
    return draft && typeof draft.config === 'string' ? draft : null;
  } catch {
    return null;
  }
}

export async function clearDraft(): Promise<void> {
  try {
    await withStore('readwrite', (store) => store.delete(KEY));
  } catch {
    // Nothing to clear when IndexedDB is unavailable.
  }
}

export function draftFromPending(pending: PendingUploads, baseCommit: string | null, config: string): EditorDraft {
  return {
    baseCommit,
    savedAt: new Date().toISOString(),
    config,
    background: pending.background
      ? {
        name: pending.background.name,
        src: pending.background.src,
        blob: pending.background.blob,
        width: pending.background.width,
        height: pending.background.height,
      }
      : null,
    artworks: pending.artworks.map((entry) => ({
      id: entry.id,
      fileName: entry.fileName,
      blob: entry.blob,
      width: entry.width,
      height: entry.height,
      title: entry.title,
      credit: entry.credit,
    })),
  };
}
