import * as THREE from 'three';
import type { MuseumHubResolution, ResolvedHubSlot, ResolvedHubWall } from '../config/museumHub';
import { roomWallNormal, roomWallPoint } from './projectiveGeometry';

interface SlotMeshState {
  pageIndex: number;
  group: THREE.Group;
  artworkMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  shadowMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  textureKind: 'image' | 'placeholder' | null;
  textureKey: string | null;
}

const PLACEHOLDER_SIZE = 512;

function wallColorVariant(hex: string, multiplier: number): THREE.Color {
  return new THREE.Color(hex).multiplyScalar(multiplier);
}

function buildWallShape(wall: ResolvedHubWall): THREE.Shape | null {
  if (!wall.room) return null;
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(wall.room.width, 0);
  shape.lineTo(wall.room.width, wall.room.height);
  shape.lineTo(0, wall.room.height);
  shape.lineTo(0, 0);
  for (const exclusion of wall.room.doorwayExclusions) {
    const hole = new THREE.Path();
    hole.moveTo(exclusion[0]?.x ?? 0, exclusion[0]?.y ?? 0);
    for (let index = 1; index < exclusion.length; index += 1) {
      hole.lineTo(exclusion[index]!.x, exclusion[index]!.y);
    }
    hole.lineTo(exclusion[0]?.x ?? 0, exclusion[0]?.y ?? 0);
    shape.holes.push(hole);
  }
  return shape;
}

function floorShape(points: readonly THREE.Vector2[]): THREE.Shape {
  const shape = new THREE.Shape();
  const first = points[0]!;
  shape.moveTo(first.x, first.y);
  for (let index = 1; index < points.length; index += 1) {
    shape.lineTo(points[index]!.x, points[index]!.y);
  }
  shape.lineTo(first.x, first.y);
  return shape;
}

export class HubRoomRenderer {
  readonly canvas: HTMLCanvasElement;

  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera: THREE.PerspectiveCamera;
  private readonly resolution: MuseumHubResolution;
  private readonly pageGroups = new Map<number, THREE.Group>();
  private readonly slotMeshes = new Map<string, SlotMeshState>();
  private readonly placeholderTextures = new Map<string, THREE.CanvasTexture>();
  private readonly wallMaterial: THREE.MeshStandardMaterial;
  private readonly floorMaterial: THREE.MeshStandardMaterial;
  private readonly ceilingMaterial: THREE.MeshStandardMaterial;
  private readonly shadowMaterial: THREE.MeshBasicMaterial;
  private activePageIndex = 0;
  private disposed = false;

  constructor(container: HTMLElement, resolution: MuseumHubResolution) {
    this.resolution = resolution;
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(resolution.stage.width, resolution.stage.height, false);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.NoToneMapping;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setClearColor(new THREE.Color(resolution.visualTokens.museumWall), 1);
    this.renderer.domElement.classList.add('museum-hub__canvas');
    container.appendChild(this.renderer.domElement);
    this.canvas = this.renderer.domElement;

    this.camera = new THREE.PerspectiveCamera(
      resolution.camera.verticalFovDeg,
      resolution.stage.width / resolution.stage.height,
      resolution.camera.near,
      resolution.camera.far ?? 40
    );
    this.camera.position.set(
      resolution.camera.position.x,
      resolution.camera.position.y,
      resolution.camera.position.z
    );
    this.camera.lookAt(
      resolution.camera.target.x,
      resolution.camera.target.y,
      resolution.camera.target.z
    );
    this.applyLensShift();

    this.wallMaterial = new THREE.MeshStandardMaterial({
      color: wallColorVariant(resolution.visualTokens.museumWall, 1.0),
      roughness: 0.96,
      metalness: 0.02,
      side: THREE.DoubleSide,
    });
    this.floorMaterial = new THREE.MeshStandardMaterial({
      color: wallColorVariant(resolution.visualTokens.museumWall, 0.92),
      roughness: 1,
      metalness: 0.02,
      side: THREE.DoubleSide,
    });
    this.ceilingMaterial = new THREE.MeshStandardMaterial({
      color: wallColorVariant(resolution.visualTokens.museumWall, 1.03),
      roughness: 0.98,
      metalness: 0.01,
      side: THREE.DoubleSide,
    });
    this.shadowMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
    });

    this.buildRoom();
    this.buildLights();
    this.setActivePage(0);
    this.render();
  }

  setActivePage(pageIndex: number): void {
    this.activePageIndex = pageIndex;
    for (const [candidatePageIndex, group] of this.pageGroups) {
      group.visible = candidatePageIndex === pageIndex;
    }
    this.render();
  }

  setSlotHidden(slotId: string): void {
    const state = this.slotMeshes.get(slotId);
    if (!state) return;
    state.group.visible = false;
    this.render();
  }

  upsertSlot(
    slot: ResolvedHubSlot,
    wall: ResolvedHubWall,
    image: HTMLImageElement | null,
    missingImage: boolean
  ): void {
    const state = this.ensureSlotState(slot);
    if (!state || !wall.room || !slot.selectable || !slot.artworkId) {
      if (state) state.group.visible = false;
      this.render();
      return;
    }
    const slotAnchor = slot.placement.anchor;
    const normal = roomWallNormal(wall.room);
    if (!slotAnchor || !normal) {
      state.group.visible = false;
      this.render();
      return;
    }

    const textureKey = !missingImage && image && image.complete && image.naturalWidth > 0
      ? image.currentSrc || image.src || `${slot.id}:image`
      : `${slot.id}:placeholder:${slot.displayLabel}`;
    if (state.textureKey !== textureKey) {
      const targetTexture =
        !missingImage && image && image.complete && image.naturalWidth > 0
          ? this.imageTexture(image)
          : this.placeholderTexture(slot.displayLabel);
      if (state.textureKind === 'image') {
        state.artworkMesh.material.map?.dispose();
      }
      state.artworkMesh.material.map = targetTexture;
      state.artworkMesh.material.needsUpdate = true;
      state.textureKey = textureKey;
      state.textureKind = missingImage ? 'placeholder' : 'image';
    }

    const width = slot.placement.mountedHeight * Math.max(0.25, slot.artworkAspect);
    const height = slot.placement.mountedHeight;
    const zOffset = slot.placement.zOffset ?? 0.02;
    const center = roomWallPoint(wall.room, slotAnchor);
    const basisU = new THREE.Vector3(wall.room.axisU.x, wall.room.axisU.y, wall.room.axisU.z).normalize();
    const basisV = new THREE.Vector3(wall.room.axisV.x, wall.room.axisV.y, wall.room.axisV.z).normalize();
    const basisN = new THREE.Vector3(normal.x, normal.y, normal.z).normalize();
    const matrix = new THREE.Matrix4().makeBasis(basisU, basisV, basisN);
    state.group.matrixAutoUpdate = false;
    matrix.setPosition(
      center.x + basisN.x * zOffset,
      center.y + basisN.y * zOffset,
      center.z + basisN.z * zOffset
    );
    state.group.matrix.copy(matrix);
    state.group.matrixWorldNeedsUpdate = true;
    state.group.visible = state.pageIndex === this.activePageIndex;
    state.artworkMesh.scale.set(width, height, 1);
    state.shadowMesh.scale.set(width * 1.04, height * 1.04, 1);
    state.shadowMesh.position.set(0, 0, -0.018);
    this.render();
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    for (const state of this.slotMeshes.values()) {
      if (state.textureKind === 'image') {
        state.artworkMesh.material.map?.dispose();
      }
      state.artworkMesh.material.dispose();
      state.shadowMesh.material.dispose();
    }
    for (const texture of this.placeholderTextures.values()) texture.dispose();
    this.wallMaterial.dispose();
    this.floorMaterial.dispose();
    this.ceilingMaterial.dispose();
    this.shadowMaterial.dispose();
    this.renderer.dispose();
    this.slotMeshes.clear();
    this.pageGroups.clear();
  }

  private applyLensShift(): void {
    const shiftX = this.resolution.camera.lensShift?.x ?? 0;
    const shiftY = this.resolution.camera.lensShift?.y ?? 0;
    this.camera.updateProjectionMatrix();
    if (shiftX === 0 && shiftY === 0) return;
    const matrix = this.camera.projectionMatrix.elements;
    matrix[8] += shiftX * 2;
    matrix[9] -= shiftY * 2;
    this.camera.projectionMatrixInverse.copy(this.camera.projectionMatrix).invert();
  }

  private buildLights(): void {
    const ambient = new THREE.AmbientLight(0xffffff, 0.72);
    const hemi = new THREE.HemisphereLight(0xffffff, 0xc9d3d8, 0.64);
    const key = new THREE.DirectionalLight(0xffffff, 0.8);
    key.position.set(-2.8, 4.8, 5.6);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 24;
    key.shadow.bias = -0.0005;
    this.scene.add(ambient, hemi, key);
  }

  private buildRoom(): void {
    for (const wall of this.resolution.walls) {
      if (!wall.room) continue;
      const shape = buildWallShape(wall);
      if (!shape) continue;
      const geometry = new THREE.ShapeGeometry(shape);
      const mesh = new THREE.Mesh(geometry, this.wallMaterial);
      mesh.receiveShadow = true;
      mesh.matrixAutoUpdate = false;
      const normal = roomWallNormal(wall.room);
      const basisU = new THREE.Vector3(wall.room.axisU.x, wall.room.axisU.y, wall.room.axisU.z).normalize();
      const basisV = new THREE.Vector3(wall.room.axisV.x, wall.room.axisV.y, wall.room.axisV.z).normalize();
      const basisN = new THREE.Vector3(normal?.x ?? 0, normal?.y ?? 0, normal?.z ?? 1).normalize();
      const matrix = new THREE.Matrix4().makeBasis(basisU, basisV, basisN);
      matrix.setPosition(wall.room.origin.x, wall.room.origin.y, wall.room.origin.z);
      mesh.matrix.copy(matrix);
      mesh.matrixWorldNeedsUpdate = true;
      this.scene.add(mesh);
    }

    const outline = this.resolution.room.floorOutline.map(
      (point) => new THREE.Vector2(point.x, point.z)
    );
    if (outline.length >= 3) {
      const floor = new THREE.Mesh(new THREE.ShapeGeometry(floorShape(outline)), this.floorMaterial);
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = this.resolution.room.floorY;
      floor.receiveShadow = true;
      this.scene.add(floor);

      const ceiling = new THREE.Mesh(new THREE.ShapeGeometry(floorShape(outline)), this.ceilingMaterial);
      ceiling.rotation.x = Math.PI / 2;
      ceiling.position.y = this.resolution.room.ceilingY;
      this.scene.add(ceiling);
    }
  }

  private ensureSlotState(slot: ResolvedHubSlot): SlotMeshState {
    const existing = this.slotMeshes.get(slot.id);
    if (existing) return existing;
    const artworkMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      toneMapped: false,
      side: THREE.DoubleSide,
    });
    const artworkMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), artworkMaterial);
    artworkMesh.castShadow = true;
    artworkMesh.receiveShadow = false;
    const shadowMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), this.shadowMaterial.clone());
    shadowMesh.renderOrder = 1;
    artworkMesh.renderOrder = 2;
    const group = new THREE.Group();
    group.add(shadowMesh, artworkMesh);
    const pageGroup = this.ensurePageGroup(slot.pageIndex);
    pageGroup.add(group);
    const state: SlotMeshState = {
      pageIndex: slot.pageIndex,
      group,
      artworkMesh,
      shadowMesh,
      textureKind: null,
      textureKey: null,
    };
    this.slotMeshes.set(slot.id, state);
    return state;
  }

  private ensurePageGroup(pageIndex: number): THREE.Group {
    const existing = this.pageGroups.get(pageIndex);
    if (existing) return existing;
    const group = new THREE.Group();
    group.visible = pageIndex === this.activePageIndex;
    this.pageGroups.set(pageIndex, group);
    this.scene.add(group);
    return group;
  }

  private imageTexture(image: HTMLImageElement): THREE.Texture {
    const texture = new THREE.Texture(image);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    texture.anisotropy = 4;
    return texture;
  }

  private placeholderTexture(label: string): THREE.CanvasTexture {
    const existing = this.placeholderTextures.get(label);
    if (existing) return existing;
    const canvas = document.createElement('canvas');
    canvas.width = PLACEHOLDER_SIZE;
    canvas.height = PLACEHOLDER_SIZE;
    const context = canvas.getContext('2d');
    if (!context) {
      const fallback = new THREE.CanvasTexture(canvas);
      this.placeholderTextures.set(label, fallback);
      return fallback;
    }
    context.fillStyle = this.resolution.visualTokens.museumWall;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = 'rgba(24, 32, 38, 0.22)';
    context.lineWidth = 12;
    context.strokeRect(28, 28, canvas.width - 56, canvas.height - 56);
    context.fillStyle = 'rgba(24, 32, 38, 0.72)';
    context.font = '600 42px Inter, system-ui, sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    const lines = label.split(/\s+/).reduce<string[]>((accumulator, part) => {
      const current = accumulator[accumulator.length - 1] ?? '';
      const candidate = current ? `${current} ${part}` : part;
      if (candidate.length > 14 && current) {
        accumulator.push(part);
      } else if (current) {
        accumulator[accumulator.length - 1] = candidate;
      } else {
        accumulator.push(part);
      }
      return accumulator;
    }, []);
    const renderedLines = lines.slice(0, 3);
    renderedLines.forEach((line, index) => {
      context.fillText(line, canvas.width / 2, canvas.height / 2 + (index - (renderedLines.length - 1) / 2) * 52);
    });
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    this.placeholderTextures.set(label, texture);
    return texture;
  }

  private render(): void {
    if (this.disposed) return;
    this.renderer.render(this.scene, this.camera);
  }
}
