export interface NativeArtworkDimensions {
  width: number;
  height: number;
}

export interface ArtworkRatioReport {
  native: number;
  physical: number;
  domSource: number;
  webglMesh: number | null;
  status: 'valid' | 'mismatch';
}

export function nativeArtworkAspect(dimensions: NativeArtworkDimensions): number {
  if (!Number.isFinite(dimensions.width) || !Number.isFinite(dimensions.height)
    || dimensions.width <= 0 || dimensions.height <= 0) {
    throw new Error('Artwork dimensions must be positive finite numbers.');
  }
  return dimensions.width / dimensions.height;
}

export function createNativeSourceRect(
  dimensions: NativeArtworkDimensions,
  displayHeight: number
): NativeArtworkDimensions {
  if (!Number.isFinite(displayHeight) || displayHeight <= 0) {
    throw new Error('Display height must be positive and finite.');
  }
  return {
    width: displayHeight * nativeArtworkAspect(dimensions),
    height: displayHeight,
  };
}

export function ratiosMatch(a: number, b: number, epsilon = 1e-6): boolean {
  return Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= epsilon;
}

export function buildArtworkRatioReport(
  dimensions: NativeArtworkDimensions,
  physical: NativeArtworkDimensions,
  domSource: NativeArtworkDimensions,
  webglMesh: NativeArtworkDimensions | null
): ArtworkRatioReport {
  const native = nativeArtworkAspect(dimensions);
  const physicalRatio = nativeArtworkAspect(physical);
  const domRatio = nativeArtworkAspect(domSource);
  const webglRatio = webglMesh ? nativeArtworkAspect(webglMesh) : null;
  return {
    native,
    physical: physicalRatio,
    domSource: domRatio,
    webglMesh: webglRatio,
    status: ratiosMatch(native, physicalRatio)
      && ratiosMatch(native, domRatio)
      && (webglRatio === null || ratiosMatch(native, webglRatio))
      ? 'valid'
      : 'mismatch',
  };
}
