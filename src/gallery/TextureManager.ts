import * as THREE from 'three';

export class TextureManager {
  private readonly cache = new Map<string, THREE.Texture>();
  private readonly loader = new THREE.TextureLoader();
  private maxAnisotropy = 1;

  init(renderer: THREE.WebGLRenderer): void {
    this.maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
  }

  async preload(urls: string[]): Promise<void> {
    await Promise.all(urls.map((url) => this.load(url)));
  }

  load(url: string): Promise<THREE.Texture> {
    if (this.cache.has(url)) {
      return Promise.resolve(this.cache.get(url)!);
    }

    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.anisotropy = this.maxAnisotropy;
          this.cache.set(url, texture);
          resolve(texture);
        },
        undefined,
        reject
      );
    });
  }

  get(url: string): THREE.Texture | undefined {
    return this.cache.get(url);
  }

  dispose(): void {
    this.cache.forEach((tex) => tex.dispose());
    this.cache.clear();
  }
}
