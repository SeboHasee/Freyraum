/**
 * Lightweight WebGL feature detection.
 *
 * Returns true if a WebGL 1 or 2 context can be created. We probe a
 * throwaway canvas so the real renderer never sees a failed context.
 */

export function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    return Boolean(gl);
  } catch {
    return false;
  }
}
