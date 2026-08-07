const ARTWORK_BODY_DEPTH = 0.04;
const ARTWORK_WALL_GAP = 0.028;
const ARTWORK_BODY_FRONT_CLEARANCE = 0.002;
const FRONT_WALL_Z = -(ARTWORK_BODY_DEPTH + ARTWORK_WALL_GAP + ARTWORK_BODY_FRONT_CLEARANCE);

export interface GalleryPresentationConfig {
  artworkBodyDepth: number;
  artworkWallGap: number;
  artworkBodyFrontClearance: number;
  artworkWallZ: number;
  roomHalfWidth: number;
  roomRearZ: number;
  floorY: number;
  ceilingY: number;
  skirtingHeight: number;
  skirtingDepth: number;
  revealDepth: number;
  revealDrop: number;
  lightStripDepth: number;
  lightStripLift: number;
}

/**
 * Compact architectural stage for the interactive gallery (v0.89).
 *
 * The room is intentionally deeper/wider than the normal inspection view so
 * wide desktop and backed-off overview states still terminate against real
 * wall/floor/ceiling geometry instead of the clear color.
 */
export const GALLERY_PRESENTATION_CONFIG: GalleryPresentationConfig = {
  artworkBodyDepth: ARTWORK_BODY_DEPTH,
  artworkWallGap: ARTWORK_WALL_GAP,
  artworkBodyFrontClearance: ARTWORK_BODY_FRONT_CLEARANCE,
  artworkWallZ: FRONT_WALL_Z,
  roomHalfWidth: 18,
  roomRearZ: 24,
  floorY: -6.6,
  ceilingY: 7.2,
  skirtingHeight: 0.08,
  skirtingDepth: 0.018,
  revealDepth: 0.14,
  revealDrop: 0.16,
  lightStripDepth: 0.22,
  lightStripLift: 0.006,
};
