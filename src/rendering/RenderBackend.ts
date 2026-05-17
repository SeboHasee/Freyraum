/**
 * Render backend selection for v0.02.
 *
 * The customer-facing renderer is always WebGL. WebGPU is an opt-in
 * informational probe activated only by an explicit query flag or
 * `localStorage` value AND only when `navigator.gpu` is present.
 *
 * The probe is loaded via dynamic import (see {@link maybeProbeWebGPU}) so
 * the WebGPU module is never parsed in unsupported browsers and never blocks
 * the normal preview path.
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
 * The WebGPU prototype module is loaded via dynamic import so it is never
 * parsed in unsupported browsers and never bundled into the main chunk.
 */
export async function maybeProbeWebGPU(): Promise<unknown | null> {
  const backendId = await detectBackend();
  if (backendId !== 'webgpu-experimental') return null;

  try {
    const mod = await import('./WebGPUPrototype');
    return await mod.initWebGPUPrototype();
  } catch (err) {
    // Probe is informational only — never break the preview if it fails.
    if (typeof console !== 'undefined') {
      console.warn('[freyraum] WebGPU probe failed; staying on WebGL', err);
    }
    return null;
  }
}
