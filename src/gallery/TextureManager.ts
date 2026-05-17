import * as THREE from 'three';

export class TextureManager {
  private readonly cache = new Map<string, THREE.Texture>();
  private readonly loader = new THREE.TextureLoader();
  private maxAnisotropy = 1;

  constructor() {
    this.loader.setCrossOrigin('anonymous');
  }

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

    return new Promise((resolve) => {
      this.loader.load(
        url,
        (texture) => {
          this.prepareTexture(texture);
          this.cache.set(url, texture);
          resolve(texture);
        },
        undefined,
        () => {
          const fallback = this.createFallbackTexture(url);
          this.cache.set(url, fallback);
          resolve(fallback);
        }
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

  private prepareTexture(texture: THREE.Texture): void {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = this.maxAnisotropy;
    texture.needsUpdate = true;
  }

  private createFallbackTexture(seed: string): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 1100;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const hue = this.hash(seed) % 32;
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, `hsl(${205 + hue}, 18%, 92%)`);
      gradient.addColorStop(0.55, `hsl(${35 + hue}, 22%, 78%)`);
      gradient.addColorStop(1, `hsl(${205 + hue}, 12%, 62%)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(255,255,255,0.34)';
      ctx.lineWidth = 28;
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.08, canvas.height * 0.28);
      ctx.bezierCurveTo(
        canvas.width * 0.35,
        canvas.height * 0.08,
        canvas.width * 0.58,
        canvas.height * 0.32,
        canvas.width * 0.9,
        canvas.height * 0.22
      );
      ctx.stroke();

      ctx.fillStyle = 'rgba(17,24,29,0.16)';
      ctx.font = '700 58px Inter, Arial, sans-serif';
      ctx.fillText('FREYRAUM', 96, canvas.height - 96);
    }

    const texture = new THREE.CanvasTexture(canvas);
    this.prepareTexture(texture);
    return texture;
  }

  private hash(value: string): number {
    let result = 0;
    for (let i = 0; i < value.length; i += 1) {
      result = (result * 31 + value.charCodeAt(i)) >>> 0;
    }
    return result;
  }
}
