import * as THREE from 'three';
import { createScopedDiagnostics } from '../utils/Diagnostics';

export interface HubArtworkTarget {
  id: string;
  title: string;
  destinationId?: string;
  position: readonly [number, number, number];
  palette: readonly [string, string, string];
}

export const HUB_ARTWORK_TARGETS: readonly HubArtworkTarget[] = [
  {
    id: 'gallery-entrance',
    title: 'Galerie betreten',
    destinationId: 'gallery',
    position: [0, 2.55, -5.88],
    palette: ['#1d2935', '#c8955d', '#e4d9c9'],
  },
  {
    id: 'future-west-wing',
    title: 'Künftiger Westflügel',
    position: [-4.45, 2.55, -5.88],
    palette: ['#4e5f60', '#c6b8a2', '#eee8df'],
  },
  {
    id: 'future-east-wing',
    title: 'Künftiger Ostflügel',
    position: [4.45, 2.55, -5.88],
    palette: ['#655955', '#b8a497', '#e9e1d9'],
  },
] as const;

type Navigate = (destinationId: string) => Promise<boolean>;

interface InteractiveTarget {
  definition: HubArtworkTarget;
  group: THREE.Group;
  hitMesh: THREE.Mesh;
  frameMaterial: THREE.MeshStandardMaterial;
}

const CAMERA_POSITION = new THREE.Vector3(0, 2.65, 9.5);
const CAMERA_TARGET = new THREE.Vector3(0, 2.35, -2.8);
const POINTER_MOVE_THRESHOLD_SQ = 64;

export class MainMuseumHub {
  private readonly diagnostics = createScopedDiagnostics('museum-hub');
  private readonly root = new THREE.Group();
  private readonly raycaster = new THREE.Raycaster();
  private readonly pointerNdc = new THREE.Vector2();
  private readonly targets: InteractiveTarget[] = [];
  private readonly disposables = new Set<THREE.BufferGeometry | THREE.Material | THREE.Texture>();
  private readonly previousCameraPosition = new THREE.Vector3();
  private readonly previousCameraQuaternion = new THREE.Quaternion();
  private pointerDownX = 0;
  private pointerDownY = 0;
  private hovered: InteractiveTarget | null = null;
  private active = false;
  private activating = false;
  private dirty = true;

  constructor(
    private readonly scene: THREE.Scene,
    private readonly camera: THREE.PerspectiveCamera,
    private readonly canvas: HTMLCanvasElement,
    private readonly navigate: Navigate
  ) {
    this.root.name = 'main-museum-hub';
    this.buildRoom();
    this.buildArtworkWall();
    this.buildLighting();
    this.root.visible = false;
    this.scene.add(this.root);
  }

  enter(): void {
    if (this.active) return;
    this.active = true;
    this.activating = false;
    this.root.visible = true;
    this.previousCameraPosition.copy(this.camera.position);
    this.previousCameraQuaternion.copy(this.camera.quaternion);
    this.camera.position.copy(CAMERA_POSITION);
    this.camera.lookAt(CAMERA_TARGET);
    this.camera.updateMatrixWorld();
    this.canvas.addEventListener('pointerdown', this.onPointerDown);
    this.canvas.addEventListener('pointermove', this.onPointerMove);
    this.canvas.addEventListener('pointerup', this.onPointerUp);
    this.canvas.addEventListener('pointerleave', this.onPointerLeave);
    this.canvas.addEventListener('keydown', this.onKeyDown);
    this.dirty = true;
    this.diagnostics.info('enter', 'Main museum hub entered', { targetCount: this.targets.length });
  }

  exit(): void {
    if (!this.active) return;
    this.active = false;
    this.root.visible = false;
    this.setHovered(null);
    this.canvas.removeEventListener('pointerdown', this.onPointerDown);
    this.canvas.removeEventListener('pointermove', this.onPointerMove);
    this.canvas.removeEventListener('pointerup', this.onPointerUp);
    this.canvas.removeEventListener('pointerleave', this.onPointerLeave);
    this.canvas.removeEventListener('keydown', this.onKeyDown);
    this.camera.position.copy(this.previousCameraPosition);
    this.camera.quaternion.copy(this.previousCameraQuaternion);
    this.camera.updateMatrixWorld();
    this.canvas.style.removeProperty('cursor');
    this.dirty = true;
  }

  update(): boolean {
    const changed = this.dirty;
    this.dirty = false;
    return changed;
  }

  dispose(): void {
    this.exit();
    this.scene.remove(this.root);
    for (const disposable of this.disposables) disposable.dispose();
    this.disposables.clear();
    this.targets.length = 0;
  }

  private buildRoom(): void {
    const wallMaterial = this.track(new THREE.MeshStandardMaterial({
      color: 0xd8d4cc,
      roughness: 0.92,
      metalness: 0,
    }));
    const floorMaterial = this.track(new THREE.MeshStandardMaterial({
      color: 0x6f6b64,
      roughness: 0.72,
      metalness: 0.04,
    }));
    const ceilingMaterial = this.track(new THREE.MeshStandardMaterial({
      color: 0xe7e4dd,
      roughness: 0.96,
      metalness: 0,
    }));
    const backGeometry = this.track(new THREE.PlaneGeometry(16, 6));
    const sideGeometry = this.track(new THREE.PlaneGeometry(16, 6));
    const floorGeometry = this.track(new THREE.PlaneGeometry(16, 16));

    const backWall = new THREE.Mesh(backGeometry, wallMaterial);
    backWall.position.set(0, 3, -6);
    backWall.receiveShadow = true;

    const leftWall = new THREE.Mesh(sideGeometry, wallMaterial);
    leftWall.position.set(-8, 3, 2);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;

    const rightWall = new THREE.Mesh(sideGeometry, wallMaterial);
    rightWall.position.set(8, 3, 2);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.receiveShadow = true;

    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.set(0, 0, 2);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;

    const ceiling = new THREE.Mesh(floorGeometry, ceilingMaterial);
    ceiling.position.set(0, 6, 2);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.receiveShadow = true;

    this.root.add(backWall, leftWall, rightWall, floor, ceiling);
  }

  private buildArtworkWall(): void {
    const frameGeometry = this.track(new THREE.BoxGeometry(3.05, 3.55, 0.18));
    const artGeometry = this.track(new THREE.PlaneGeometry(2.58, 3.08));
    const matGeometry = this.track(new THREE.PlaneGeometry(2.78, 3.28));
    const matMaterial = this.track(new THREE.MeshStandardMaterial({
      color: 0xeee9df,
      roughness: 0.88,
    }));

    for (const definition of HUB_ARTWORK_TARGETS) {
      const group = new THREE.Group();
      group.name = `hub-target-${definition.id}`;
      group.position.set(...definition.position);
      group.userData['hubTarget'] = definition;

      const frameMaterial = this.track(new THREE.MeshStandardMaterial({
        color: definition.destinationId ? 0x2a241d : 0x5b5650,
        roughness: 0.4,
        metalness: definition.destinationId ? 0.22 : 0.08,
        emissive: 0xc59a65,
        emissiveIntensity: 0,
      }));
      const frame = new THREE.Mesh(frameGeometry, frameMaterial);
      frame.castShadow = true;
      frame.receiveShadow = true;

      const mat = new THREE.Mesh(matGeometry, matMaterial);
      mat.position.z = 0.101;

      const artworkTexture = this.track(this.createArtworkTexture(definition));
      const artworkMaterial = this.track(new THREE.MeshStandardMaterial({
        map: artworkTexture,
        roughness: 0.65,
        metalness: 0,
      }));
      const art = new THREE.Mesh(artGeometry, artworkMaterial);
      art.position.z = 0.112;
      art.userData['hubTarget'] = definition;

      group.add(frame, mat, art);
      this.root.add(group);
      this.targets.push({ definition, group, hitMesh: art, frameMaterial });
    }
  }

  private buildLighting(): void {
    const base = new THREE.HemisphereLight(0xf5f1e8, 0x4d4a45, 1.35);
    this.root.add(base);

    const fill = new THREE.DirectionalLight(0xfff4e4, 1.15);
    fill.position.set(-3, 5.5, 7);
    this.root.add(fill);

    for (const target of this.targets) {
      const spot = new THREE.SpotLight(0xffe1b8, target.definition.destinationId ? 15 : 10, 13, 0.34, 0.58, 1.6);
      spot.position.set(target.group.position.x, 5.35, -1.6);
      spot.target = target.group;
      spot.castShadow = false;
      this.root.add(spot);
    }
  }

  private createArtworkTexture(definition: HubArtworkTarget): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 384;
    canvas.height = 480;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not create hub artwork texture.');
    const [dark, mid, light] = definition.palette;
    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, light);
    gradient.addColorStop(0.5, mid);
    gradient.addColorStop(1, dark);
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.globalAlpha = 0.72;
    context.fillStyle = dark;
    context.beginPath();
    context.ellipse(130, 170, 115, 180, -0.42, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = light;
    context.beginPath();
    context.ellipse(285, 310, 95, 145, 0.38, 0, Math.PI * 2);
    context.fill();
    context.globalAlpha = 0.38;
    context.fillStyle = mid;
    context.fillRect(0, 220, canvas.width, 44);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }

  private onPointerDown = (event: PointerEvent): void => {
    if (!this.active || event.button !== 0) return;
    this.pointerDownX = event.clientX;
    this.pointerDownY = event.clientY;
  };

  private onPointerMove = (event: PointerEvent): void => {
    if (!this.active || this.activating) return;
    this.setHovered(this.pickTarget(event.clientX, event.clientY));
  };

  private onPointerUp = (event: PointerEvent): void => {
    if (!this.active || this.activating || event.button !== 0) return;
    const dx = event.clientX - this.pointerDownX;
    const dy = event.clientY - this.pointerDownY;
    if (dx * dx + dy * dy > POINTER_MOVE_THRESHOLD_SQ) return;
    const target = this.pickTarget(event.clientX, event.clientY);
    if (target?.definition.destinationId) this.activate(target);
  };

  private onPointerLeave = (): void => this.setHovered(null);

  private onKeyDown = (event: KeyboardEvent): void => {
    if (!this.active || this.activating || (event.key !== 'Enter' && event.key !== ' ')) return;
    const primaryTarget = this.targets.find((target) => target.definition.destinationId);
    if (!primaryTarget) return;
    event.preventDefault();
    this.activate(primaryTarget);
  };

  private pickTarget(clientX: number, clientY: number): InteractiveTarget | null {
    const rect = this.canvas.getBoundingClientRect();
    this.pointerNdc.set(
      ((clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1,
      -((clientY - rect.top) / Math.max(1, rect.height)) * 2 + 1
    );
    this.raycaster.setFromCamera(this.pointerNdc, this.camera);
    const clickable = this.targets.filter((target) => !!target.definition.destinationId);
    const intersections = this.raycaster.intersectObjects(clickable.map((target) => target.hitMesh), false);
    if (intersections.length === 0) return null;
    return clickable.find((target) => target.hitMesh === intersections[0].object) ?? null;
  }

  private setHovered(target: InteractiveTarget | null): void {
    if (this.hovered === target) return;
    if (this.hovered) this.hovered.frameMaterial.emissiveIntensity = 0;
    this.hovered = target;
    if (this.hovered) this.hovered.frameMaterial.emissiveIntensity = 0.36;
    this.canvas.style.cursor = this.hovered ? 'pointer' : 'default';
    this.dirty = true;
  }

  private activate(target: InteractiveTarget): void {
    const destinationId = target.definition.destinationId;
    if (!destinationId || this.activating) return;
    this.activating = true;
    void this.navigate(destinationId).finally(() => {
      if (this.active) this.activating = false;
    });
  }

  private track<T extends THREE.BufferGeometry | THREE.Material | THREE.Texture>(disposable: T): T {
    this.disposables.add(disposable);
    return disposable;
  }
}
