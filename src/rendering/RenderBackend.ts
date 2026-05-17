/**
 * Render backend selection for v0.02.
 *
 * The customer-facing renderer is always WebGL. WebGPU is an opt-in
 * informational probe activated only by an explicit query flag or
 * `localStorage` value AND only when `navigator.gpu` is present.
 *
 * The customer preview is emitted as a single IIFE bundle for `file://` use,
 * so Rollup-based code splitting is intentionally unavailable. To keep the
 * experimental WebGPU code out of the main preview bundle, the probe lives as
 * a copied public module (`/public/webgpu-probe.js`) that is imported only at
 * runtime when the user explicitly opts in.
 */

export type BackendId = 'webgl' | 'webgpu-experimental';

export interface RenderBackendInfo {
  backendId: BackendId;
  adapterLabel?: string;
  unsupportedReason?: string;
}

const STORAGE_KEY = 'freyraum.backend';

function readQueryFlag(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.get('backend') === 'webgpu';
  } catch {
    return false;
  }
}

function readStorageFlag(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'webgpu';
  } catch {
    return false;
  }
}

function hasNavigatorGPU(): boolean {
  return typeof navigator !== 'undefined' && 'gpu' in navigator && (navigator as { gpu?: unknown }).gpu !== undefined;
}

/**
 * Returns the active backend.
 *
 * The production preview always returns `'webgl'`. `'webgpu-experimental'`
 * is only returned when BOTH the user opted in AND the browser exposes
 * `navigator.gpu`.
 */
export async function detectBackend(): Promise<BackendId> {
  const optedIn = readQueryFlag() || readStorageFlag();
  if (optedIn && hasNavigatorGPU()) return 'webgpu-experimental';
  return 'webgl';
}

export async function getBackendInfo(): Promise<RenderBackendInfo> {
  const backendId = await detectBackend();
  if (backendId === 'webgl') {
    return { backendId };
  }
  return {
    backendId,
    unsupportedReason: hasNavigatorGPU() ? undefined : 'navigator.gpu is not available',
  };
}

/**
 * Optionally probes WebGPU when the user has opted in. Returns `null` for
 * the normal WebGL path so callers can safely ignore the result.
 *
 * The WebGPU prototype module is loaded from the copied public file
 * `customer-preview/webgpu-probe.js`, so it is never parsed or bundled into
 * the main IIFE preview bundle.
 */
export async function maybeProbeWebGPU(): Promise<unknown | null> {
  const backendId = await detectBackend();
  if (backendId !== 'webgpu-experimental') return null;

  try {
    const probeUrl = new URL('./webgpu-probe.js', window.location.href).toString();
    const mod = (await import(/* @vite-ignore */ probeUrl)) as {
      initWebGPUPrototype?: () => Promise<unknown>;
    };
    if (typeof mod.initWebGPUPrototype !== 'function') {
      throw new Error('webgpu-probe.js does not export initWebGPUPrototype()');
    }
    return await mod.initWebGPUPrototype();
  } catch (err) {
    // Probe is informational only — never break the preview if it fails.
    if (typeof console !== 'undefined') {
      console.warn('[freyraum] WebGPU probe failed; staying on WebGL', err);
    }
    return null;
  }
}
