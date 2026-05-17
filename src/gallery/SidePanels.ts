import * as THREE from 'three';

export class SidePanels {
  readonly leftPanel: THREE.Mesh;
  readonly rightPanel: THREE.Mesh;
  private readonly leftMaterial: THREE.MeshBasicMaterial;
  private readonly rightMaterial: THREE.MeshBasicMaterial;

  constructor(scene: THREE.Scene) {
    const geo = new THREE.PlaneGeometry(2.1, 2.9);

    this.leftMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.95,
    });
    this.leftPanel = new THREE.Mesh(geo, this.leftMaterial);
    this.leftPanel.position.set(-4.9, 0, -1.1);
    this.leftPanel.rotation.y = 0.28;
    this.leftPanel.userData['side'] = 'left';
    scene.add(this.leftPanel);

    this.rightMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.95,
    });
    this.rightPanel = new THREE.Mesh(geo, this.rightMaterial);
    this.rightPanel.position.set(4.9, 0, -1.1);
    this.rightPanel.rotation.y = -0.28;
    this.rightPanel.userData['side'] = 'right';
    scene.add(this.rightPanel);
  }

  updateTextures(prevTexture: THREE.Texture | null, nextTexture: THREE.Texture | null): void {
    if (prevTexture) {
      this.leftMaterial.map = prevTexture;
      this.leftMaterial.needsUpdate = true;
    }
    if (nextTexture) {
      this.rightMaterial.map = nextTexture;
      this.rightMaterial.needsUpdate = true;
    }
  }

  getMeshes(): THREE.Mesh[] {
    return [this.leftPanel, this.rightPanel];
  }

  dispose(): void {
    this.leftPanel.geometry.dispose();
    this.rightPanel.geometry.dispose();
    this.leftMaterial.dispose();
    this.rightMaterial.dispose();
  }
}
