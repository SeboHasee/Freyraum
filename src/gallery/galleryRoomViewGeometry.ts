import type { GalleryRoomView } from '../config/museumHub';
import {
  applyHomography,
  computeHomographyFromUnitSquare,
  homographyToCssMatrix3d,
  scaleHomographyForSourceRect,
  type Point2D,
  type Quad,
} from '../hub/projectiveGeometry';

export interface GalleryRoomArtworkTransform {
  width: number;
  height: number;
  transform: string;
}

function screenPoint(
  point: Point2D,
  view: GalleryRoomView,
  viewportWidth: number,
  viewportHeight: number
): Point2D {
  const scale = Math.max(viewportWidth / view.background.width, viewportHeight / view.background.height);
  const offsetX = (viewportWidth - view.background.width * scale) * 0.5;
  const offsetY = (viewportHeight - view.background.height * scale) * 0.5;
  return {
    x: offsetX + point.x * view.background.width * scale,
    y: offsetY + point.y * view.background.height * scale,
  };
}

export function projectGalleryRoomArtwork(
  view: GalleryRoomView,
  artworkAspect: number,
  artworkWidth: number,
  artworkHeight: number,
  viewportWidth: number,
  viewportHeight: number
): GalleryRoomArtworkTransform | null {
  if (
    !Number.isFinite(artworkAspect) || artworkAspect <= 0
    || !(artworkWidth > 0 && artworkHeight > 0)
    || !(viewportWidth > 0 && viewportHeight > 0)
  ) return null;

  const wallHomography = computeHomographyFromUnitSquare(view.wallQuad);
  if (!wallHomography) return null;

  let height = Math.min(view.placement.height, 0.88);
  let width = height * artworkAspect / view.wallAspect;
  if (width > 0.88) {
    const scale = 0.88 / width;
    width *= scale;
    height *= scale;
  }
  const centerU = Math.max(width * 0.5, Math.min(1 - width * 0.5, view.placement.u));
  const centerV = Math.max(height * 0.5, Math.min(1 - height * 0.5, view.placement.v));
  const localQuad: Quad = [
    { x: centerU - width * 0.5, y: centerV - height * 0.5 },
    { x: centerU + width * 0.5, y: centerV - height * 0.5 },
    { x: centerU + width * 0.5, y: centerV + height * 0.5 },
    { x: centerU - width * 0.5, y: centerV + height * 0.5 },
  ];
  const sourceQuad = localQuad.map((corner) => applyHomography(wallHomography, corner.x, corner.y));
  if (sourceQuad.some((corner) => corner === null)) return null;
  const projectedQuad = sourceQuad.map((corner) =>
    screenPoint(corner!, view, viewportWidth, viewportHeight)
  ) as unknown as Quad;
  const artworkHomography = computeHomographyFromUnitSquare(projectedQuad);
  if (!artworkHomography) return null;

  return {
    width: artworkWidth,
    height: artworkHeight,
    transform: homographyToCssMatrix3d(
      scaleHomographyForSourceRect(artworkHomography, artworkWidth, artworkHeight)
    ),
  };
}
