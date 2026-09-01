import { clamp } from '../utils/math';

export interface InspectionPanLimitInput {
  artworkWidth: number;
  artworkHeight: number;
  visibleWidth: number;
  visibleHeight: number;
  overscrollX: number;
  overscrollY: number;
}

export interface HoverRotationClearanceInput {
  targetRotX: number;
  targetRotY: number;
  artworkWidth: number;
  artworkHeight: number;
  bodyBackDepth: number;
  wallZ: number;
  clearanceMargin?: number;
}

export interface HoverRotationClearanceResult {
  targetRotX: number;
  targetRotY: number;
  appliedScale: number;
  maxBackShift: number;
  availableClearance: number;
}

const CORNER_SIGNS = [-1, 1] as const;

export function getInspectionPanLimits(input: InspectionPanLimitInput): { x: number; y: number } {
  return {
    x: Math.max(0, (input.artworkWidth - input.visibleWidth) * 0.5 + input.overscrollX),
    y: Math.max(0, (input.artworkHeight - input.visibleHeight) * 0.5 + input.overscrollY),
  };
}

export function measureMountedArtworkBackShift(
  rotX: number,
  rotY: number,
  artworkWidth: number,
  artworkHeight: number,
  bodyBackDepth: number
): number {
  const halfWidth = Math.max(0, artworkWidth) * 0.5;
  const halfHeight = Math.max(0, artworkHeight) * 0.5;
  const backDepth = Math.max(0, bodyBackDepth);
  const sinX = Math.sin(rotX);
  const cosX = Math.cos(rotX);
  const sinY = Math.sin(rotY);
  const cosY = Math.cos(rotY);
  let maxBackShift = 0;

  const considerPoint = (x: number, y: number, z: number): void => {
    const rotatedZ = -x * sinY + (y * sinX + z * cosX) * cosY;
    maxBackShift = Math.max(maxBackShift, -rotatedZ);
  };

  for (const xSign of CORNER_SIGNS) {
    for (const ySign of CORNER_SIGNS) {
      const x = xSign * halfWidth;
      const y = ySign * halfHeight;
      considerPoint(x, y, 0);
      considerPoint(x, y, -backDepth);
    }
  }

  return maxBackShift;
}

export function clampHoverRotationToWallClearance(
  input: HoverRotationClearanceInput
): HoverRotationClearanceResult {
  const availableClearance = Math.max(0, Math.abs(input.wallZ) - Math.max(0, input.clearanceMargin ?? 0));
  const requestedRotX = Number.isFinite(input.targetRotX) ? input.targetRotX : 0;
  const requestedRotY = Number.isFinite(input.targetRotY) ? input.targetRotY : 0;

  if (availableClearance <= 0 || (requestedRotX === 0 && requestedRotY === 0)) {
    return {
      targetRotX: 0,
      targetRotY: 0,
      appliedScale: 0,
      maxBackShift: 0,
      availableClearance,
    };
  }

  const requestedBackShift = measureMountedArtworkBackShift(
    requestedRotX,
    requestedRotY,
    input.artworkWidth,
    input.artworkHeight,
    input.bodyBackDepth
  );
  if (requestedBackShift <= availableClearance) {
    return {
      targetRotX: requestedRotX,
      targetRotY: requestedRotY,
      appliedScale: 1,
      maxBackShift: requestedBackShift,
      availableClearance,
    };
  }

  let safeScale = 0;
  let unsafeScale = 1;
  for (let i = 0; i < 18; i += 1) {
    const mid = (safeScale + unsafeScale) * 0.5;
    const midBackShift = measureMountedArtworkBackShift(
      requestedRotX * mid,
      requestedRotY * mid,
      input.artworkWidth,
      input.artworkHeight,
      input.bodyBackDepth
    );
    if (midBackShift <= availableClearance) safeScale = mid;
    else unsafeScale = mid;
  }

  const appliedScale = clamp(safeScale, 0, 1);
  const targetRotX = requestedRotX * appliedScale;
  const targetRotY = requestedRotY * appliedScale;
  return {
    targetRotX,
    targetRotY,
    appliedScale,
    maxBackShift: measureMountedArtworkBackShift(
      targetRotX,
      targetRotY,
      input.artworkWidth,
      input.artworkHeight,
      input.bodyBackDepth
    ),
    availableClearance,
  };
}
