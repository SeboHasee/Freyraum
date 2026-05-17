import * as THREE from 'three';

export interface TextureSize {
  width: number;
  height: number;
  aspect: number;
}

export function getTextureSize(texture: THREE.Texture): TextureSize {
  const image = texture.image as HTMLImageElement | ImageBitmap | { width?: number; height?: number };

  let width = 1;
  let height = 1;

  if ('naturalWidth' in image) {
    width = image.naturalWidth || image.width || 1;
    height = image.naturalHeight || image.height || 1;
  } else {
    width = image.width || 1;
    height = image.height || 1;
  }

  return {
    width,
    height,
    aspect: width / height,
  };
}

export function fitWithinBox(
  aspect: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  const safeAspect = Number.isFinite(aspect) && aspect > 0 ? aspect : 1;
  const boxAspect = maxWidth / maxHeight;

  if (safeAspect >= boxAspect) {
    return {
      width: maxWidth,
      height: maxWidth / safeAspect,
    };
  }

  return {
    width: maxHeight * safeAspect,
    height: maxHeight,
  };
}
