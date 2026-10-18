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

export interface ArtworkDepthPoseInput {
  targetRotX: number;
  targetRotY: number;
  artworkWidth: number;
  artworkHeight: number;
  bodyBackDepth: number;
  groupScale?: number;
  desiredPositionZ: number;
  wallZ: number;
  cameraZ: number;
  cameraNear: number;
  clearanceMargin?: number;
}

export interface ArtworkDepthPoseResult extends HoverRotationClearanceResult {
  positionZ: number;
  frontShift: number;
}

const CORNER_SIGNS = [-1, 1] as const;
export const DEFAULT_INSPECTION_OVERSCROLL_X = 0.45;
export const DEFAULT_INSPECTION_OVERSCROLL_Y = 0.24;

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

export function measureMountedArtworkFrontShift(
  rotX: number,
  rotY: number,
  artworkWidth: number,
  artworkHeight: number,
  bodyBackDepth = 0
): number {
  const halfWidth = Math.max(0, artworkWidth) * 0.5;
  const halfHeight = Math.max(0, artworkHeight) * 0.5;
  const sinX = Math.sin(rotX);
  const cosX = Math.cos(rotX);
  const sinY = Math.sin(rotY);
  const cosY = Math.cos(rotY);
  let maxFrontShift = 0;

  for (const xSign of CORNER_SIGNS) {
    for (const ySign of CORNER_SIGNS) {
      const x = xSign * halfWidth;
      const y = ySign * halfHeight;
      for (const z of [0, -Math.max(0, bodyBackDepth)]) {
        const rotatedZ = -x * sinY + (y * sinX + z * cosX) * cosY;
        maxFrontShift = Math.max(maxFrontShift, rotatedZ);
      }
    }
  }

  return maxFrontShift;
}

export function resolveArtworkDepthPose(input: ArtworkDepthPoseInput): ArtworkDepthPoseResult {
  const scale = Number.isFinite(input.groupScale) ? Math.max(0, input.groupScale ?? 1) : 1;
  const artworkWidth = Math.max(0, input.artworkWidth) * scale;
  const artworkHeight = Math.max(0, input.artworkHeight) * scale;
  const bodyBackDepth = Math.max(0, input.bodyBackDepth) * scale;
  const clearanceMargin = Math.max(0, input.clearanceMargin ?? 0.004);
  const wallZ = Number.isFinite(input.wallZ) ? input.wallZ : 0;
  const cameraZ = Number.isFinite(input.cameraZ) ? input.cameraZ : 0;
  const cameraNear = Math.max(0, Number.isFinite(input.cameraNear) ? input.cameraNear : 0);
  const requestedRotX = Number.isFinite(input.targetRotX) ? input.targetRotX : 0;
  const requestedRotY = Number.isFinite(input.targetRotY) ? input.targetRotY : 0;

  const measure = (rotationScale: number) => {
    const targetRotX = requestedRotX * rotationScale;
    const targetRotY = requestedRotY * rotationScale;
    const backShift = measureMountedArtworkBackShift(
      targetRotX,
      targetRotY,
      artworkWidth,
      artworkHeight,
      bodyBackDepth
    );
    const frontShift = measureMountedArtworkFrontShift(
      targetRotX,
      targetRotY,
      artworkWidth,
      artworkHeight,
      bodyBackDepth
    );
    const minPositionZ = wallZ + clearanceMargin + backShift;
    const maxPositionZ = cameraZ - cameraNear - clearanceMargin - frontShift;
    return { targetRotX, targetRotY, backShift, frontShift, minPositionZ, maxPositionZ };
  };

  let rotationScale = 1;
  let pose = measure(rotationScale);
  if (pose.minPositionZ > pose.maxPositionZ) {
    let safeScale = 0;
    let unsafeScale = 1;
    for (let i = 0; i < 24; i += 1) {
      const candidate = (safeScale + unsafeScale) * 0.5;
      const measured = measure(candidate);
      if (measured.minPositionZ <= measured.maxPositionZ) safeScale = candidate;
      else unsafeScale = candidate;
    }
    rotationScale = safeScale;
    pose = measure(rotationScale);
  }

  const positionZ = Math.min(pose.maxPositionZ, Math.max(pose.minPositionZ, input.desiredPositionZ));
  return {
    targetRotX: pose.targetRotX,
    targetRotY: pose.targetRotY,
    appliedScale: rotationScale,
    maxBackShift: pose.backShift,
    frontShift: pose.frontShift,
    availableClearance: Math.max(0, Math.min(Math.abs(wallZ), cameraZ - cameraNear)),
    positionZ,
  };
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
