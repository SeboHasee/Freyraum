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

export interface ProjectedSourceMappingReport {
  expected: Array<{ x: number; y: number }>;
  actual: Array<{ x: number; y: number }>;
  maxError: number;
  valid: boolean;
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

export function validateProjectedSourceMapping(
  source: NativeArtworkDimensions,
  projected: readonly { x: number; y: number }[],
  map: (x: number, y: number) => { x: number; y: number } | null,
  epsilon = 1e-4
): ProjectedSourceMappingReport {
  const expected = projected.map(({ x, y }) => ({ x, y }));
  const corners = [
    { x: 0, y: 0 },
    { x: source.width, y: 0 },
    { x: source.width, y: source.height },
    { x: 0, y: source.height },
  ];
  const actual = corners.map((corner) => map(corner.x, corner.y) ?? { x: NaN, y: NaN });
  const maxError = actual.reduce((maximum, corner, index) => {
    const target = expected[index];
    return Math.max(maximum, Math.hypot(corner.x - target.x, corner.y - target.y));
  }, 0);
  return { expected, actual, maxError, valid: maxError <= epsilon };
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
