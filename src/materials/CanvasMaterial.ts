import * as THREE from 'three';

export class CanvasMaterial {
  private normalTexture: THREE.Texture | null = null;

  async loadNormalTexture(): Promise<THREE.Texture> {
    if (this.normalTexture) return this.normalTexture;

    const loader = new THREE.TextureLoader();
    const texture = await new Promise<THREE.Texture>((resolve, reject) => {
      loader.load(
        'https://threejs.org/examples/textures/water/Water_1_M_Normal.jpg',
        (tex) => {
          tex.wrapS = THREE.RepeatWrapping;
          tex.wrapT = THREE.RepeatWrapping;
          tex.repeat.set(18, 18);
          this.normalTexture = tex;
          resolve(tex);
        },
        undefined,
        reject
      );
    });

    return texture;
  }

  createArtworkMaterial(
    normalTexture: THREE.Texture,
    map?: THREE.Texture
  ): THREE.MeshPhysicalMaterial {
    const mat = new THREE.MeshPhysicalMaterial({
      map: map ?? null,
      normalMap: normalTexture,
      normalScale: new THREE.Vector2(0.12, 0.12),
      roughness: 0.88,
      metalness: 0,
      clearcoat: 0.04,
    });
    return mat;
  }

  createFrameMaterial(): THREE.MeshPhysicalMaterial {
    return new THREE.MeshPhysicalMaterial({
      color: 0xe7e1d7,
      roughness: 0.52,
      metalness: 0.03,
      clearcoat: 0.18,
    });
  }

  dispose(): void {
    this.normalTexture?.dispose();
  }
}
