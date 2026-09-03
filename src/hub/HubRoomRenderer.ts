import * as THREE from 'three';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import type { MuseumHubResolution, ResolvedHubSlot, ResolvedHubWall } from '../config/museumHub';
import type { QualityPreset } from '../config/quality';
import type { ArtworkImageUrlType } from '../utils/artworkImageSources';
import {
  createArtworkMountingFrame,
  HUB_ARTWORK_DEPTH_M,
  roomWallNormal,
  roomWallPoint,
} from './projectiveGeometry';
import {
  ArchitecturalSurfaceFactory,
  type ArchitecturalMaterials,
} from '../materials/ArchitecturalSurfaceFactory';
import { getOptimalPixelRatio } from '../utils/performance';
import { createScopedDiagnostics } from '../utils/Diagnostics';
import { createCompatibleTextureImage, type TextureUploadFit } from '../utils/textureUploadCompatibility';
import { probeTextureVisiblePixels, type VisiblePixelProbeResult } from '../utils/sourceToPixelProbe';
import { getRuntimeProtocol, shouldRunVisiblePixelProbe } from '../utils/sourceToPixelOutcome';
import {
  createResilientWebGLRenderer,
  describeWebGLContext,
  type WebGLRendererMode,
} from '../utils/webgl';

interface SlotMeshState {
  pageIndex: number;
  group: THREE.Group;
  artworkMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  edgeMesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>;
  shadowMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  textureKind: 'image' | 'placeholder' | null;
  textureKey: string | null;
}

/**
 * v0.92: result of {@link HubRoomRenderer.upsertSlot}, letting
 * `MainMuseumHub` fold the GPU-upload/visible-pixel proof into its
 * shared source-to-pixel outcome record for the hub route.
 */
export interface SlotUpsertResult {
  /** False only when the slot geometry/room was invalid and nothing was drawn. */
  applied: boolean;
  /** True when a real (non-placeholder) image texture is bound. */
  usedImage: boolean;
  /** Populated only when a new image texture was created during this call. */
  fit?: TextureUploadFit;
  visibleProbe?: VisiblePixelProbeResult;
  failureStage?: 'gpu-upload' | 'visible-pixel-probe';
  failureReason?: string;
}

const PLACEHOLDER_SIZE = 512;
/** Perceived stretched-canvas depth of a mounted artwork (metres). */
/** How far the entry-zone shell extends past the camera (metres). */
const ENTRY_SHELL_MARGIN = 1.5;
/** Depth of the dim passage pocket behind each doorway opening (metres). */
const DOORWAY_POCKET_DEPTH = 1.15;
/** Skirting shadow-gap profile (metres). */
const SKIRTING_HEIGHT = 0.026;
const SKIRTING_DEPTH = 0.012;
/** Long perimeter light-channel and central clerestory dimensions (metres). */
export const HUB_COVE_WIDTH_M = 0.34;
const COVE_WALL_INSET = 0.55;
const COVE_END_INSET = 0.72;
const COVE_RECESS_DEPTH = 0.06;
const CLERESTORY_WIDTH = 2.7;
const CLERESTORY_END_INSET = 1.55;
const CLERESTORY_RISE = 0.82;
const SKYLIGHT_ROOF_RISE = 0.72;
/** Height of the diffuser strip above the ceiling plane (metres). Nearly
 *  flush so the glowing strip fills the opening even at grazing angles. */
const COVE_STRIP_LIFT = 0.006;

/** Static daylight rig: broad cool-neutral wash, perimeter panels, one shadow key. */
export const HUB_LIGHTING_PROFILE = Object.freeze({
  hemisphere: Object.freeze({
    sky: 0xeaf2f6,
    ground: 0xc7c3b9,
    intensity: 0.14,
  }),
  key: Object.freeze({
    color: 0xf4f7f6,
    intensity: 0.55,
    position: Object.freeze([-3.4, 9.8, 5.9] as const),
    target: Object.freeze([0.2, 1.1, -1.8] as const),
  }),
  fill: Object.freeze({
    color: 0xe8edef,
    intensity: 0.16,
    position: Object.freeze([3.8, 5.8, 5.2] as const),
    target: Object.freeze([-0.6, 1.6, -1.6] as const),
  }),
  ceilingPanel: Object.freeze({
    color: 0xf4f8fa,
    intensity: 5,
    edgeInset: 0.05,
    ceilingOffset: 0.045,
  }),
  skylightPanel: Object.freeze({
    color: 0xe8f0f2,
    intensity: 3.2,
    edgeInset: 0.12,
    ceilingOffset: 0.12,
  }),
});

/** RectAreaLight emits along local -Z; this target keeps every panel room-facing. */
export const HUB_AREA_LIGHT_DIRECTION = Object.freeze([0, -1, 0] as const);

export const HUB_SKYLIGHT_PROFILE = Object.freeze({
  turbidity: 5.6,
  rayleigh: 1.25,
  mieCoefficient: 0.004,
  mieDirectionalG: 0.78,
  sunDirection: Object.freeze([-0.3, 0.87, 0.39] as const),
  roofRise: SKYLIGHT_ROOF_RISE,
  ribCount: 9,
  glassRoughness: 0.19,
  glassTransmission: 0.72,
});

export const HUB_RENDER_PROFILE = Object.freeze({
  toneMappingExposure: 0.92,
  environmentIntensity: 0.18,
  planarReflectionHigh: 0.16,
  planarReflectionBalanced: 0,
});

/**
 * WebGL renderer for the museum hub room (v0.87).
 *
 * Renders the complete architectural shell — gallery room, entry-zone
 * extension enclosing the calibrated camera, doorway passage pockets,
 * skirting shadow gaps and recessed ceiling light coves — plus the mounted
 * artwork planes. The scene is static and renders strictly on demand
 * (`render()` after every mutation); there is no per-frame loop, so idle GPU
 * cost stays zero.
 *
 * Quality tiers (`QualityPreset`) gate the pixel-ratio cap, procedural
 * surface tile size, skylight shadow mapping, and the floor reflection
 * strategy (`planar` render-to-texture / `ibl` environment gloss / `off`).
 */
export class HubRoomRenderer {
  readonly canvas: HTMLCanvasElement;

  private readonly diagnostics = createScopedDiagnostics('hub-room');
  private readonly renderer: THREE.WebGLRenderer;
  private readonly rendererMode: WebGLRendererMode;
  private readonly scene = new THREE.Scene();
  private readonly camera: THREE.PerspectiveCamera;
  private readonly cameraTarget = new THREE.Vector3();
  private readonly resolution: MuseumHubResolution;
  private readonly pageGroups = new Map<number, THREE.Group>();
  private readonly slotMeshes = new Map<string, SlotMeshState>();
  private readonly placeholderTextures = new Map<string, THREE.CanvasTexture>();
  private readonly surfaceFactory: ArchitecturalSurfaceFactory;
  private readonly materials: ArchitecturalMaterials;
  private readonly shadowMaterial: THREE.MeshBasicMaterial;
  private readonly edgeGeometry = new THREE.BoxGeometry(1, 1, 1);
  private readonly artworkPlaneGeometry = new THREE.PlaneGeometry(1, 1);
  private contactShadowTexture: THREE.CanvasTexture | null = null;
  private readonly floorMeshes: THREE.Mesh[] = [];
  private keyLight: THREE.DirectionalLight | null = null;
  private fillLight: THREE.DirectionalLight | null = null;
  private readonly ceilingPanelLights: THREE.RectAreaLight[] = [];
  private sky: Sky | null = null;
  private batterySky: THREE.Mesh<THREE.SphereGeometry, THREE.ShaderMaterial> | null = null;
  private skylightGlassMaterial: THREE.MeshPhysicalMaterial | null = null;
  private skylightGlassFallback: THREE.MeshBasicMaterial | null = null;
  private readonly skylightGlassMeshes: THREE.Mesh[] = [];
  private environmentTarget: THREE.WebGLRenderTarget | null = null;
  private reflectionTarget: THREE.WebGLRenderTarget | null = null;
  private readonly reflectionCamera = new THREE.PerspectiveCamera();
  private readonly reflectionMatrix = new THREE.Matrix4();
  private readonly reflectionUniforms = {
    uReflectionMap: { value: null as THREE.Texture | null },
    uReflectionMatrix: { value: new THREE.Matrix4() },
    uReflectionStrength: { value: 0 },
  };
  private preset: QualityPreset;
  private activePageIndex = 0;
  private disposed = false;

  constructor(container: HTMLElement, resolution: MuseumHubResolution, preset: QualityPreset) {
    this.resolution = resolution;
    this.preset = preset;
    const creation = createResilientWebGLRenderer({ alpha: false });
    this.renderer = creation.renderer;
    this.rendererMode = creation.mode;
    this.renderer.setPixelRatio(
      creation.mode === 'preferred' ? getOptimalPixelRatio(preset.pixelRatioCap) : 1
    );
    this.renderer.setSize(resolution.stage.width, resolution.stage.height, false);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    // Architectural highlights use a restrained photographic shoulder. Artwork
    // planes explicitly opt out so customer imagery remains source-faithful.
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = HUB_RENDER_PROFILE.toneMappingExposure;
    this.renderer.shadowMap.enabled = creation.mode === 'preferred';
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setClearColor(new THREE.Color(resolution.visualTokens.museumWall), 1);
    this.renderer.domElement.classList.add('museum-hub__canvas');
    container.appendChild(this.renderer.domElement);
    this.canvas = this.renderer.domElement;
    this.diagnostics.info('created', 'Hub WebGL renderer initialized', {
      mode: creation.mode,
      attempts: creation.attempts,
      context: describeWebGLContext(this.renderer),
      protocol: window.location.protocol,
    });

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
    this.cameraTarget.set(
      resolution.camera.target.x,
      resolution.camera.target.y,
      resolution.camera.target.z
    );
    this.camera.lookAt(this.cameraTarget);
    this.applyLensShift();

    this.surfaceFactory = new ArchitecturalSurfaceFactory(preset.hubSurfaceTileSize, 'hub');
    this.surfaceFactory.setAnisotropy(this.effectiveAnisotropy());
    this.materials = this.surfaceFactory.getMaterials({
      wall: resolution.visualTokens.museumWall,
    });
    this.materials.ceiling.shadowSide = THREE.DoubleSide;
    this.materials.trim.shadowSide = THREE.DoubleSide;
    this.attachFloorReflectionShader(this.materials.floor);

    this.shadowMaterial = new THREE.MeshBasicMaterial({
      map: this.contactShadowMap(),
      color: 0x000000,
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
      toneMapped: false,
    });

    this.buildRoom();
    this.buildLights();
    this.applyEnvironment();
    this.applyReflectionMode();
    this.setActivePage(0);
    this.render();
    this.logRenderingDiagnostics();
  }

  /**
   * Applies a quality preset at runtime: pixel-ratio cap, surface tile size,
   * skylight shadows, and floor-reflection strategy. Re-renders once.
   */
  applyPreset(preset: QualityPreset): void {
    if (this.disposed) return;
    this.preset = preset;
    this.renderer.setPixelRatio(
      this.rendererMode === 'preferred' ? getOptimalPixelRatio(preset.pixelRatioCap) : 1
    );
    this.renderer.setSize(this.resolution.stage.width, this.resolution.stage.height, false);
    this.surfaceFactory.setTileSize(preset.hubSurfaceTileSize);
    this.applyLightingPreset();
    this.applySkyPreset();
    this.applyShadowPreset();
    this.applyEnvironment();
    this.applyReflectionMode();
    this.render();
    this.logRenderingDiagnostics();
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

  /** v0.92: live renderer GPU capability used by the shared source-to-pixel outcome contract. */
  getMaxTextureSize(): number {
    return this.renderer.capabilities.maxTextureSize;
  }

  upsertSlot(
    slot: ResolvedHubSlot,
    wall: ResolvedHubWall,
    image: HTMLImageElement | null,
    missingImage: boolean,
    sourceUrlType: ArtworkImageUrlType | null
  ): SlotUpsertResult {
    const state = this.ensureSlotState(slot);
    if (!state || !wall.room || !slot.selectable || !slot.artworkId) {
      if (state) state.group.visible = false;
      this.render();
      return { applied: false, usedImage: false };
    }
    const slotAnchor = slot.placement.anchor;
    if (!slotAnchor) {
      state.group.visible = false;
      this.render();
      return { applied: false, usedImage: false };
    }

    const textureKey = !missingImage && image && image.complete && image.naturalWidth > 0
      ? image.currentSrc || image.src || `${slot.id}:image`
      : `${slot.id}:placeholder:${slot.displayLabel}`;
    let fit: TextureUploadFit | undefined;
    let visibleProbe: VisiblePixelProbeResult | undefined;
    if (state.textureKey !== textureKey) {
      let targetTexture: THREE.Texture;
      if (!missingImage && image && image.complete && image.naturalWidth > 0) {
        const built = this.imageTexture(image);
        targetTexture = built.texture;
        fit = built.fit;
        try {
          this.renderer.initTexture(targetTexture);
        } catch (error) {
          if (targetTexture !== state.artworkMesh.material.map) targetTexture.dispose();
          const failureReason = error instanceof Error ? error.message : String(error);
          this.diagnostics.warn('hub-slot-texture-upload-failed', 'Hub artwork texture failed during GPU upload', {
            slotId: slot.id,
            artworkId: slot.artworkId,
            sourceUrlType,
            fit,
            failureReason,
          });
          return {
            applied: true,
            usedImage: false,
            fit,
            failureStage: 'gpu-upload',
            failureReason,
          };
        }
        const shouldProbe = shouldRunVisiblePixelProbe({
          runtimeProtocol: getRuntimeProtocol(),
          resolvedUrlType: sourceUrlType,
          debugEnabled: this.diagnostics.isDebugEnabled(),
        });
        if (shouldProbe) {
          visibleProbe = probeTextureVisiblePixels(this.renderer, targetTexture);
          if (!visibleProbe.pass) {
            if (targetTexture !== state.artworkMesh.material.map) targetTexture.dispose();
            this.diagnostics.warn('hub-slot-visible-probe-failed', 'Hub artwork texture bound but produced no visible pixels', {
              slotId: slot.id,
              artworkId: slot.artworkId,
              sourceUrlType,
              probe: visibleProbe,
            });
            return {
              applied: true,
              usedImage: false,
              fit,
              visibleProbe,
              failureStage: 'visible-pixel-probe',
              failureReason: visibleProbe.reason ?? 'probe-failed',
            };
          }
        }
      } else {
        targetTexture = this.placeholderTexture(slot.displayLabel);
        this.renderer.initTexture(targetTexture);
      }
      if (state.textureKind === 'image') {
        state.artworkMesh.material.map?.dispose();
      }
      state.artworkMesh.material.map = targetTexture;
      state.artworkMesh.material.needsUpdate = true;
      state.textureKey = textureKey;
      state.textureKind = missingImage ? 'placeholder' : 'image';
    }

    const mountingFrame = createArtworkMountingFrame(
      wall.room,
      slotAnchor,
      slot.placement.physicalHeight ?? slot.placement.mountedHeight,
      Math.max(0.25, slot.artworkAspect),
      slot.placement.mountingGap
    );
    if (!mountingFrame) {
      state.group.visible = false;
      this.render();
      return { applied: false, usedImage: false };
    }
    const { width, height } = mountingFrame;
    const basisU = new THREE.Vector3(
      mountingFrame.basisU.x,
      mountingFrame.basisU.y,
      mountingFrame.basisU.z
    );
    const basisV = new THREE.Vector3(
      mountingFrame.basisV.x,
      mountingFrame.basisV.y,
      mountingFrame.basisV.z
    );
    const basisN = new THREE.Vector3(
      mountingFrame.basisN.x,
      mountingFrame.basisN.y,
      mountingFrame.basisN.z
    );
    const matrix = new THREE.Matrix4().makeBasis(basisU, basisV, basisN);
    state.group.matrixAutoUpdate = false;
    matrix.setPosition(
      mountingFrame.frontCenter.x,
      mountingFrame.frontCenter.y,
      mountingFrame.frontCenter.z
    );
    state.group.matrix.copy(matrix);
    state.group.matrixWorldNeedsUpdate = true;
    state.group.visible = state.pageIndex === this.activePageIndex;
    state.artworkMesh.scale.set(width, height, 1);
    // Stretched-canvas body: front face sits just behind the artwork plane.
    // Keep the box's front face 1 mm behind the image plane while its back
    // remains exactly at the mounting-frame back plane.
    state.edgeMesh.scale.set(width, height, HUB_ARTWORK_DEPTH_M - 0.001);
    state.edgeMesh.position.set(0, 0, -(HUB_ARTWORK_DEPTH_M + 0.001) / 2);
    // Tight directional contact card; the body supplies the broader real shadow.
    state.shadowMesh.scale.set(width * 1.035, height * 1.04, 1);
    state.shadowMesh.position.set(
      0.012,
      -0.018,
      -mountingFrame.depth - mountingFrame.mountingGap + 0.001
    );
    this.render();
    return { applied: true, usedImage: !missingImage, fit, visibleProbe };
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    for (const state of this.slotMeshes.values()) {
      if (state.textureKind === 'image') {
        state.artworkMesh.material.map?.dispose();
      }
      state.artworkMesh.material.dispose();
    }
    for (const texture of this.placeholderTextures.values()) texture.dispose();
    this.shadowMaterial.dispose();
    this.contactShadowTexture?.dispose();
    this.edgeGeometry.dispose();
    this.artworkPlaneGeometry.dispose();
    this.scene.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (mesh.isMesh && mesh.geometry !== this.edgeGeometry && mesh.geometry !== this.artworkPlaneGeometry) {
        mesh.geometry.dispose();
      }
    });
    this.keyLight?.shadow.map?.dispose();
    this.reflectionTarget?.dispose();
    this.environmentTarget?.dispose();
    this.sky?.material.dispose();
    this.batterySky?.material.dispose();
    this.skylightGlassMaterial?.dispose();
    this.skylightGlassFallback?.dispose();
    this.surfaceFactory.dispose();
    this.renderer.dispose();
    this.slotMeshes.clear();
    this.pageGroups.clear();
  }

  // ── Camera ─────────────────────────────────────────────────────────────────

  private applyLensShift(): void {
    const shiftX = this.resolution.camera.lensShift?.x ?? 0;
    const shiftY = this.resolution.camera.lensShift?.y ?? 0;
    this.camera.updateProjectionMatrix();
    if (shiftX !== 0 || shiftY !== 0) {
      const matrix = this.camera.projectionMatrix.elements;
      matrix[8] += shiftX * 2;
      matrix[9] -= shiftY * 2;
      this.camera.projectionMatrixInverse.copy(this.camera.projectionMatrix).invert();
    }
    // The reflection camera shares the exact projection (including shift).
    this.reflectionCamera.projectionMatrix.copy(this.camera.projectionMatrix);
    this.reflectionCamera.projectionMatrixInverse.copy(this.camera.projectionMatrixInverse);
  }

  // ── Lighting ───────────────────────────────────────────────────────────────

  private buildLights(): void {
    const profile = HUB_LIGHTING_PROFILE;
    // Broad indirect-looking wash supports the local ceiling panels without
    // flattening the room into one uniform exposure.
    const hemisphere = new THREE.HemisphereLight(
      profile.hemisphere.sky,
      profile.hemisphere.ground,
      profile.hemisphere.intensity
    );
    // The restrained high key is the only shadow caster.
    const key = new THREE.DirectionalLight(profile.key.color, profile.key.intensity);
    key.position.set(...profile.key.position);
    key.target.position.set(...profile.key.target);
    const fill = new THREE.DirectionalLight(profile.fill.color, profile.fill.intensity);
    fill.position.set(...profile.fill.position);
    fill.target.position.set(...profile.fill.target);
    this.keyLight = key;
    this.fillLight = fill;
    this.scene.add(hemisphere, key, key.target, fill, fill.target);
    for (const cove of this.coveRects()) {
      const width = Math.max(0.1, cove.maxX - cove.minX - profile.ceilingPanel.edgeInset * 2);
      const height = Math.max(0.1, cove.maxZ - cove.minZ - profile.ceilingPanel.edgeInset);
      const panel = new THREE.RectAreaLight(
        profile.ceilingPanel.color,
        profile.ceilingPanel.intensity,
        width,
        height
      );
      panel.position.set(
        (cove.minX + cove.maxX) / 2,
        this.resolution.room.ceilingY - profile.ceilingPanel.ceilingOffset,
        (cove.minZ + cove.maxZ) / 2
      );
      this.orientAreaLightIntoRoom(panel);
      this.ceilingPanelLights.push(panel);
      this.scene.add(panel);
    }
    const clerestory = this.clerestoryRect();
    const skylightPanel = new THREE.RectAreaLight(
      profile.skylightPanel.color,
      profile.skylightPanel.intensity,
      Math.max(0.1, clerestory.maxX - clerestory.minX - profile.skylightPanel.edgeInset * 2),
      Math.max(0.1, clerestory.maxZ - clerestory.minZ - profile.skylightPanel.edgeInset * 2)
    );
    skylightPanel.position.set(
      0,
      this.resolution.room.ceilingY + CLERESTORY_RISE - profile.skylightPanel.ceilingOffset,
      (clerestory.minZ + clerestory.maxZ) / 2
    );
    this.orientAreaLightIntoRoom(skylightPanel);
    this.ceilingPanelLights.push(skylightPanel);
    this.scene.add(skylightPanel);
    this.applyLightingPreset();
    this.applyShadowPreset();
  }

  private orientAreaLightIntoRoom(light: THREE.RectAreaLight): void {
    light.lookAt(
      light.position.x + HUB_AREA_LIGHT_DIRECTION[0],
      light.position.y + HUB_AREA_LIGHT_DIRECTION[1],
      light.position.z + HUB_AREA_LIGHT_DIRECTION[2]
    );
  }

  /** Area fixtures are reserved for high/balanced; battery uses one cheap fill. */
  private applyLightingPreset(): void {
    const areaLightingEnabled = this.preset.id !== 'battery';
    for (const panel of this.ceilingPanelLights) panel.visible = areaLightingEnabled;
    if (this.fillLight) this.fillLight.visible = !areaLightingEnabled;
  }

  private applySkyPreset(): void {
    const battery = this.preset.id === 'battery';
    if (this.sky) this.sky.visible = !battery;
    if (this.batterySky) this.batterySky.visible = battery;
    const material = battery ? this.skylightGlassFallback : this.skylightGlassMaterial;
    if (material) {
      for (const glass of this.skylightGlassMeshes) glass.material = material;
    }
  }

  private applyShadowPreset(): void {
    const key = this.keyLight;
    if (!key) return;
    const enabled = this.preset.hubShadows;
    if (key.castShadow !== enabled) {
      key.castShadow = enabled;
    }
    const mapSize = this.preset.id === 'high' ? 2048 : 1024;
    if (key.shadow.mapSize.x !== mapSize) {
      key.shadow.mapSize.set(mapSize, mapSize);
      key.shadow.map?.dispose();
      key.shadow.map = null;
    }
    // Fit the single map to the visible room rather than the entry extension.
    const bounds = this.resolution.room.bounds;
    const radius = Math.max(bounds.max.x - bounds.min.x, bounds.max.z - bounds.min.z) * 0.72;
    key.shadow.camera.left = -radius;
    key.shadow.camera.right = radius;
    key.shadow.camera.top = radius;
    key.shadow.camera.bottom = -radius;
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 24;
    key.shadow.bias = -0.0006;
    key.shadow.normalBias = 0.02;
    key.shadow.camera.updateProjectionMatrix();
  }

  private logRenderingDiagnostics(): void {
    const direction = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const areaLights = this.ceilingPanelLights.map((light) => {
      light.getWorldQuaternion(quaternion);
      direction.set(0, 0, -1).applyQuaternion(quaternion).normalize();
      return {
        intensity: light.intensity,
        size: `${light.width.toFixed(2)}x${light.height.toFixed(2)}`,
        direction: direction.toArray().map((value) => Number(value.toFixed(3))),
        visible: light.visible,
      };
    });
    const info = this.renderer.info;
    this.diagnostics.info('rendering-profile', 'Hub architectural rendering profile', {
      preset: this.preset.id,
      toneMapping: this.renderer.toneMapping,
      exposure: this.renderer.toneMappingExposure,
      environmentIntensity: this.scene.environment ? this.scene.environmentIntensity : 0,
      hemisphereIntensity: HUB_LIGHTING_PROFILE.hemisphere.intensity,
      directionalIntensity: this.keyLight?.intensity ?? 0,
      areaLights,
      shadowMapSize: this.keyLight?.castShadow ? this.keyLight.shadow.mapSize.x : 0,
      reflectionTarget: this.reflectionTarget
        ? `${this.reflectionTarget.width}x${this.reflectionTarget.height}`
        : 'off',
      drawCalls: info.render.calls,
      triangles: info.render.triangles,
      textures: info.memory.textures,
      programs: info.programs?.length ?? 0,
    });
  }

  /** Cached PMREM generated from the same procedural sky visible through the roof. */
  private applyEnvironment(): void {
    const wantsEnvironment = this.preset.hubReflection !== 'off';
    if (wantsEnvironment && !this.environmentTarget) {
      const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
      pmremGenerator.compileCubemapShader();
      const environmentScene = new THREE.Scene();
      environmentScene.add(this.createAtmosphericSky());
      this.environmentTarget = pmremGenerator.fromScene(environmentScene, 0.08);
      pmremGenerator.dispose();
      environmentScene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.isMesh) {
          mesh.geometry.dispose();
          const material = mesh.material as THREE.Material;
          material.dispose();
        }
      });
      this.scene.environment = this.environmentTarget.texture;
      this.scene.environmentIntensity = HUB_RENDER_PROFILE.environmentIntensity;
    } else if (!wantsEnvironment && this.environmentTarget) {
      this.scene.environment = null;
      this.environmentTarget.dispose();
      this.environmentTarget = null;
    }
  }

  // ── Floor reflection ───────────────────────────────────────────────────────

  /**
   * Injects a projective planar-reflection sample into the shared floor
   * material. The reflection is rendered on demand into a downscaled target
   * (see `renderReflection`), weighted by Fresnel and the floor roughness map
   * so it reads as controlled sheen, never a mirror. When the active preset
   * uses `ibl`/`off`, the strength uniform is 0 and the branch is skipped.
   */
  private attachFloorReflectionShader(material: THREE.MeshStandardMaterial): void {
    const uniforms = this.reflectionUniforms;
    const applySurfaceResponse = material.onBeforeCompile;
    material.onBeforeCompile = (shader) => {
      applySurfaceResponse(shader, this.renderer);
      shader.uniforms.uReflectionMap = uniforms.uReflectionMap;
      shader.uniforms.uReflectionMatrix = uniforms.uReflectionMatrix;
      shader.uniforms.uReflectionStrength = uniforms.uReflectionStrength;
      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <common>',
          '#include <common>\nuniform mat4 uReflectionMatrix;\nvarying vec4 vHubReflectionCoord;'
        )
        .replace(
          '#include <worldpos_vertex>',
          '#include <worldpos_vertex>\n' +
            'vec4 hubWorldPosition = modelMatrix * vec4( transformed, 1.0 );\n' +
            'vHubReflectionCoord = uReflectionMatrix * hubWorldPosition;'
        );
      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          '#include <common>\nuniform sampler2D uReflectionMap;\nuniform float uReflectionStrength;\nvarying vec4 vHubReflectionCoord;'
        )
        .replace(
          '#include <opaque_fragment>',
          'if ( uReflectionStrength > 0.001 && vHubReflectionCoord.w > 0.0 ) {\n' +
            '  vec2 hubReflUv = vHubReflectionCoord.xy / vHubReflectionCoord.w;\n' +
            '  if ( all( greaterThan( hubReflUv, vec2( 0.0 ) ) ) && all( lessThan( hubReflUv, vec2( 1.0 ) ) ) ) {\n' +
            '    float hubFresnel = pow( 1.0 - saturate( dot( normalize( vViewPosition ), normal ) ), 3.0 );\n' +
            '    float hubWeight = uReflectionStrength * ( 0.35 + 0.65 * hubFresnel ) * ( 1.0 - roughnessFactor );\n' +
            '    vec3 hubReflection = texture2D( uReflectionMap, hubReflUv ).rgb;\n' +
            '    outgoingLight = mix( outgoingLight, hubReflection, clamp( hubWeight, 0.0, 1.0 ) );\n' +
            '  }\n' +
            '}\n' +
            '#include <opaque_fragment>'
        );
    };
    const surfaceCacheKey = material.customProgramCacheKey;
    material.customProgramCacheKey = () => `hub-floor-reflection-${surfaceCacheKey()}`;
  }

  private applyReflectionMode(): void {
    const mode = this.preset.hubReflection;
    if (mode === 'planar') {
      const divisor = Math.max(1, this.preset.hubReflectionDivisor);
      const width = Math.max(64, Math.floor(this.resolution.stage.width / divisor));
      const height = Math.max(64, Math.floor(this.resolution.stage.height / divisor));
      if (!this.reflectionTarget || this.reflectionTarget.width !== width || this.reflectionTarget.height !== height) {
        this.reflectionTarget?.dispose();
        this.reflectionTarget = new THREE.WebGLRenderTarget(width, height, {
          minFilter: THREE.LinearFilter,
          magFilter: THREE.LinearFilter,
        });
        this.reflectionTarget.texture.colorSpace = THREE.LinearSRGBColorSpace;
      }
      this.reflectionUniforms.uReflectionMap.value = this.reflectionTarget.texture;
      this.reflectionUniforms.uReflectionStrength.value = this.preset.id === 'high'
        ? HUB_RENDER_PROFILE.planarReflectionHigh
        : HUB_RENDER_PROFILE.planarReflectionBalanced;
      this.materials.floor.roughness = 0.6;
    } else {
      this.reflectionUniforms.uReflectionMap.value = null;
      this.reflectionUniforms.uReflectionStrength.value = 0;
      this.reflectionTarget?.dispose();
      this.reflectionTarget = null;
      // ibl: environment gloss only; off: fully diffuse mineral floor.
      this.materials.floor.roughness = mode === 'ibl' ? 0.62 : 0.76;
    }
  }

  /** Mirrors the calibrated camera across the floor plane and re-renders the
   *  reflection target. Called from `render()` — on-demand only. */
  private renderReflection(): void {
    const target = this.reflectionTarget;
    if (!target || this.reflectionUniforms.uReflectionStrength.value <= 0) return;
    const floorY = this.resolution.room.floorY;
    const cam = this.reflectionCamera;
    cam.position.copy(this.camera.position);
    cam.position.y = 2 * floorY - cam.position.y;
    cam.up.set(0, -1, 0);
    cam.lookAt(this.cameraTarget.x, 2 * floorY - this.cameraTarget.y, this.cameraTarget.z);
    cam.updateMatrixWorld(true);
    cam.projectionMatrix.copy(this.camera.projectionMatrix);
    // Bias matrix maps clip space to [0..1] UV for projective sampling.
    this.reflectionMatrix.set(
      0.5, 0.0, 0.0, 0.5,
      0.0, 0.5, 0.0, 0.5,
      0.0, 0.0, 0.5, 0.5,
      0.0, 0.0, 0.0, 1.0
    );
    this.reflectionMatrix.multiply(cam.projectionMatrix);
    this.reflectionMatrix.multiply(cam.matrixWorldInverse);
    this.reflectionUniforms.uReflectionMatrix.value.copy(this.reflectionMatrix);

    for (const floor of this.floorMeshes) floor.visible = false;
    const toneMapping = this.renderer.toneMapping;
    this.renderer.toneMapping = THREE.NoToneMapping;
    this.renderer.setRenderTarget(target);
    this.renderer.render(this.scene, cam);
    this.renderer.setRenderTarget(null);
    this.renderer.toneMapping = toneMapping;
    for (const floor of this.floorMeshes) floor.visible = true;
  }

  // ── Room shell construction ────────────────────────────────────────────────

  /** Architectural envelope: room bounds extended past the camera so the
   *  entry side reads as continuous space instead of an open box edge. */
  private shellBounds(): { min: THREE.Vector3; max: THREE.Vector3 } {
    const bounds = this.resolution.room.bounds;
    const min = new THREE.Vector3(bounds.min.x, this.resolution.room.floorY, bounds.min.z);
    const max = new THREE.Vector3(bounds.max.x, this.resolution.room.ceilingY, bounds.max.z);
    const cameraZ = this.resolution.camera.position.z;
    if (cameraZ + ENTRY_SHELL_MARGIN > max.z) {
      max.z = cameraZ + ENTRY_SHELL_MARGIN;
    }
    return { min, max };
  }

  /**
   * Axis-oriented quad with UVs in metres so the shared tiling detail maps
   * keep real-world texel density on every shell face. `origin` is the
   * bottom-left corner; the face normal is `basisU × basisV`.
   */
  private addQuad(
    material: THREE.Material,
    origin: THREE.Vector3,
    basisU: THREE.Vector3,
    basisV: THREE.Vector3,
    width: number,
    height: number,
    parent: THREE.Object3D = this.scene
  ): THREE.Mesh {
    const geometry = new THREE.PlaneGeometry(width, height);
    const uv = geometry.attributes.uv as THREE.BufferAttribute;
    for (let index = 0; index < uv.count; index += 1) {
      uv.setXY(index, uv.getX(index) * width, uv.getY(index) * height);
    }
    const mesh = new THREE.Mesh(geometry, material);
    const normal = new THREE.Vector3().crossVectors(basisU, basisV).normalize();
    const matrix = new THREE.Matrix4().makeBasis(basisU, basisV, normal);
    matrix.setPosition(
      origin.x + basisU.x * (width / 2) + basisV.x * (height / 2),
      origin.y + basisU.y * (width / 2) + basisV.y * (height / 2),
      origin.z + basisU.z * (width / 2) + basisV.z * (height / 2)
    );
    mesh.matrixAutoUpdate = false;
    mesh.matrix.copy(matrix);
    mesh.matrixWorldNeedsUpdate = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  private buildRoom(): void {
    this.buildCalibratedWalls();
    this.buildFloorAndCeiling();
    this.buildEntryShell();
    this.buildDoorwayPockets();
    this.buildSkirting();
    this.buildCeilingReveal();
  }

  /** Rendered walls from the calibrated room model (doorway holes intact). */
  private buildCalibratedWalls(): void {
    for (const wall of this.resolution.walls) {
      if (!wall.room) continue;
      const shape = buildWallShape(wall);
      if (!shape) continue;
      const geometry = new THREE.ShapeGeometry(shape);
      const mesh = new THREE.Mesh(geometry, this.materials.wall);
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
  }

  /**
   * Floor and ceiling spanning the full shell (room + entry extension). The
   * ceiling carries two recessed light coves that justify the gallery
   * illumination; the emissive strips sit above the ceiling holes so the
   * fixture itself is never a bare glowing rectangle.
   */
  private buildFloorAndCeiling(): void {
    const shell = this.shellBounds();

    // Floor: one metric quad facing up across the whole shell footprint.
    const floor = this.addQuad(
      this.materials.floor,
      new THREE.Vector3(shell.min.x, shell.min.y, shell.max.z),
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 0, -1),
      shell.max.x - shell.min.x,
      shell.max.z - shell.min.z
    );
    this.floorMeshes.push(floor);

    // Ceiling with longitudinal perimeter channels and a raised central light well.
    const coves = this.coveRects();
    const clerestory = this.clerestoryRect();
    const ceilingShape = new THREE.Shape();
    ceilingShape.moveTo(shell.min.x, shell.min.z);
    ceilingShape.lineTo(shell.max.x, shell.min.z);
    ceilingShape.lineTo(shell.max.x, shell.max.z);
    ceilingShape.lineTo(shell.min.x, shell.max.z);
    ceilingShape.closePath();
    for (const cove of coves) {
      const hole = new THREE.Path();
      hole.moveTo(cove.minX, cove.minZ);
      hole.lineTo(cove.maxX, cove.minZ);
      hole.lineTo(cove.maxX, cove.maxZ);
      hole.lineTo(cove.minX, cove.maxZ);
      hole.closePath();
      ceilingShape.holes.push(hole);
    }
    const clerestoryHole = new THREE.Path();
    clerestoryHole.moveTo(clerestory.minX, clerestory.minZ);
    clerestoryHole.lineTo(clerestory.maxX, clerestory.minZ);
    clerestoryHole.lineTo(clerestory.maxX, clerestory.maxZ);
    clerestoryHole.lineTo(clerestory.minX, clerestory.maxZ);
    clerestoryHole.closePath();
    ceilingShape.holes.push(clerestoryHole);
    const ceiling = new THREE.Mesh(new THREE.ShapeGeometry(ceilingShape), this.materials.ceiling);
    // Shape (x, z) rotated +90° about X maps to world (x, ceilingY, z) facing down.
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = shell.max.y;
    ceiling.castShadow = true;
    ceiling.receiveShadow = true;
    this.scene.add(ceiling);

    for (const cove of coves) {
      this.buildCove(cove, shell.max.y);
    }
    this.buildClerestory(clerestory, shell.max.y);
  }

  private coveRects(): { minX: number; maxX: number; minZ: number; maxZ: number }[] {
    const bounds = this.resolution.room.bounds;
    const depth = bounds.max.z - bounds.min.z;
    if (bounds.max.x - bounds.min.x < 4 || depth < 5) return [];
    const minZ = bounds.min.z + COVE_END_INSET;
    const maxZ = bounds.max.z - COVE_END_INSET;
    return [
      {
        minX: bounds.min.x + COVE_WALL_INSET,
        maxX: bounds.min.x + COVE_WALL_INSET + HUB_COVE_WIDTH_M,
        minZ,
        maxZ,
      },
      {
        minX: bounds.max.x - COVE_WALL_INSET - HUB_COVE_WIDTH_M,
        maxX: bounds.max.x - COVE_WALL_INSET,
        minZ,
        maxZ,
      },
    ];
  }

  private clerestoryRect(): { minX: number; maxX: number; minZ: number; maxZ: number } {
    const bounds = this.resolution.room.bounds;
    return {
      minX: -CLERESTORY_WIDTH / 2,
      maxX: CLERESTORY_WIDTH / 2,
      minZ: bounds.min.z + CLERESTORY_END_INSET,
      maxZ: bounds.max.z - CLERESTORY_END_INSET,
    };
  }

  private buildCove(
    cove: { minX: number; maxX: number; minZ: number; maxZ: number },
    ceilingY: number
  ): void {
    const length = cove.maxZ - cove.minZ;
    // Dark reveal returns along the long edges of each perimeter channel.
    this.addQuad(
      this.materials.trim,
      new THREE.Vector3(cove.minX, ceilingY, cove.maxZ),
      new THREE.Vector3(0, 0, -1),
      new THREE.Vector3(0, 1, 0),
      length,
      COVE_RECESS_DEPTH
    ).castShadow = true;
    this.addQuad(
      this.materials.trim,
      new THREE.Vector3(cove.maxX, ceilingY, cove.minZ),
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, 1, 0),
      length,
      COVE_RECESS_DEPTH
    ).castShadow = true;
    // Warm-white diffuser strip just above the ceiling plane, oversized so it
    // fills the opening from every viewing angle (no void visible past it).
    this.addQuad(
      this.materials.lightStrip,
      new THREE.Vector3(cove.minX - 0.04, ceilingY + COVE_STRIP_LIFT, cove.minZ - 0.04),
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 0, 1),
      cove.maxX - cove.minX + 0.08,
      length + 0.08
    );
  }

  private buildClerestory(
    opening: { minX: number; maxX: number; minZ: number; maxZ: number },
    ceilingY: number
  ): void {
    const width = opening.maxX - opening.minX;
    const depth = opening.maxZ - opening.minZ;
    const topY = ceilingY + CLERESTORY_RISE;
    this.addQuad(
      this.materials.ceiling,
      new THREE.Vector3(opening.minX, ceilingY, opening.maxZ),
      new THREE.Vector3(0, 0, -1),
      new THREE.Vector3(0, 1, 0),
      depth,
      CLERESTORY_RISE
    ).castShadow = true;
    this.addQuad(
      this.materials.ceiling,
      new THREE.Vector3(opening.maxX, ceilingY, opening.minZ),
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, 1, 0),
      depth,
      CLERESTORY_RISE
    ).castShadow = true;
    this.addQuad(
      this.materials.ceiling,
      new THREE.Vector3(opening.minX, ceilingY, opening.minZ),
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 1, 0),
      width,
      CLERESTORY_RISE
    ).castShadow = true;
    this.addQuad(
      this.materials.ceiling,
      new THREE.Vector3(opening.maxX, ceilingY, opening.maxZ),
      new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(0, 1, 0),
      width,
      CLERESTORY_RISE
    ).castShadow = true;
    this.buildSkylightRoof(opening, topY);
    if (!this.sky) {
      this.sky = this.createAtmosphericSky();
      this.batterySky = this.createBatterySky();
      this.scene.add(this.sky, this.batterySky);
    }
    this.applySkyPreset();
  }

  private buildSkylightRoof(
    opening: { minX: number; maxX: number; minZ: number; maxZ: number },
    eaveY: number
  ): void {
    const halfWidth = (opening.maxX - opening.minX) / 2;
    const depth = opening.maxZ - opening.minZ;
    const slopeLength = Math.hypot(halfWidth, SKYLIGHT_ROOF_RISE);
    const roofAngle = Math.atan2(SKYLIGHT_ROOF_RISE, halfWidth);
    this.skylightGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#dbe8e9'),
      roughness: HUB_SKYLIGHT_PROFILE.glassRoughness,
      metalness: 0,
      transmission: HUB_SKYLIGHT_PROFILE.glassTransmission,
      thickness: 0.018,
      ior: 1.48,
      transparent: true,
      opacity: 0.62,
      side: THREE.DoubleSide,
      depthWrite: false,
      envMapIntensity: 0.72,
    });
    this.skylightGlassFallback = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#d8e5e7'),
      transparent: true,
      opacity: 0.42,
      side: THREE.DoubleSide,
      depthWrite: false,
      toneMapped: true,
    });
    const leftGlass = this.addQuad(
      this.skylightGlassMaterial,
      new THREE.Vector3(opening.minX, eaveY, opening.minZ),
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(halfWidth / slopeLength, SKYLIGHT_ROOF_RISE / slopeLength, 0),
      depth,
      slopeLength
    );
    const rightGlass = this.addQuad(
      this.skylightGlassMaterial,
      new THREE.Vector3(opening.maxX, eaveY, opening.maxZ),
      new THREE.Vector3(0, 0, -1),
      new THREE.Vector3(-halfWidth / slopeLength, SKYLIGHT_ROOF_RISE / slopeLength, 0),
      depth,
      slopeLength
    );
    leftGlass.renderOrder = -1;
    rightGlass.renderOrder = -1;
    this.skylightGlassMeshes.push(leftGlass, rightGlass);

    const frameThickness = 0.045;
    const ridge = new THREE.Mesh(
      new THREE.BoxGeometry(frameThickness, frameThickness, depth + 0.08),
      this.materials.trim
    );
    ridge.position.set(0, eaveY + SKYLIGHT_ROOF_RISE, (opening.minZ + opening.maxZ) / 2);
    ridge.castShadow = true;
    this.scene.add(ridge);

    const rafterGeometry = new THREE.BoxGeometry(slopeLength + 0.06, frameThickness, frameThickness);
    const rafters = new THREE.InstancedMesh(
      rafterGeometry,
      this.materials.trim,
      HUB_SKYLIGHT_PROFILE.ribCount * 2
    );
    const transform = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3(1, 1, 1);
    for (let index = 0; index < HUB_SKYLIGHT_PROFILE.ribCount; index += 1) {
      const z = opening.minZ + (depth * index) / (HUB_SKYLIGHT_PROFILE.ribCount - 1);
      position.set(-halfWidth / 2, eaveY + SKYLIGHT_ROOF_RISE / 2, z);
      quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), roofAngle);
      transform.compose(position, quaternion, scale);
      rafters.setMatrixAt(index * 2, transform);
      position.set(halfWidth / 2, eaveY + SKYLIGHT_ROOF_RISE / 2, z);
      quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), -roofAngle);
      transform.compose(position, quaternion, scale);
      rafters.setMatrixAt(index * 2 + 1, transform);
    }
    rafters.instanceMatrix.needsUpdate = true;
    rafters.castShadow = true;
    this.scene.add(rafters);
  }

  private createAtmosphericSky(): Sky {
    const sky = new Sky();
    sky.scale.setScalar(80);
    const uniforms = sky.material.uniforms;
    uniforms.turbidity!.value = HUB_SKYLIGHT_PROFILE.turbidity;
    uniforms.rayleigh!.value = HUB_SKYLIGHT_PROFILE.rayleigh;
    uniforms.mieCoefficient!.value = HUB_SKYLIGHT_PROFILE.mieCoefficient;
    uniforms.mieDirectionalG!.value = HUB_SKYLIGHT_PROFILE.mieDirectionalG;
    uniforms.sunPosition!.value.set(...HUB_SKYLIGHT_PROFILE.sunDirection);
    sky.material.depthWrite = false;
    sky.renderOrder = -10;
    return sky;
  }

  private createBatterySky(): THREE.Mesh<THREE.SphereGeometry, THREE.ShaderMaterial> {
    const material = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      toneMapped: true,
      vertexShader: [
        'varying vec3 vWorldDirection;',
        'void main() {',
        '  vec4 worldPosition = modelMatrix * vec4(position, 1.0);',
        '  vWorldDirection = normalize(worldPosition.xyz - cameraPosition);',
        '  gl_Position = projectionMatrix * viewMatrix * worldPosition;',
        '}',
      ].join('\n'),
      fragmentShader: [
        'varying vec3 vWorldDirection;',
        'void main() {',
        '  float horizon = smoothstep(-0.12, 0.72, vWorldDirection.y);',
        '  vec3 low = vec3(0.78, 0.82, 0.82);',
        '  vec3 high = vec3(0.60, 0.72, 0.80);',
        '  gl_FragColor = vec4(mix(low, high, horizon), 1.0);',
        '}',
      ].join('\n'),
    });
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(60, 16, 8), material);
    mesh.renderOrder = -10;
    return mesh;
  }

  /**
   * Entry-zone extension: continues the side walls past the camera and closes
   * the shell with a rear wall behind the viewer, so no open shell edge can
   * appear inside the frustum at any supported aspect ratio.
   */
  private buildEntryShell(): void {
    const shell = this.shellBounds();
    const roomMaxZ = this.resolution.room.bounds.max.z;
    if (shell.max.z <= roomMaxZ + 0.01) return;
    const extensionDepth = shell.max.z - roomMaxZ;
    const height = shell.max.y - shell.min.y;

    // Left extension wall (x = min, faces +x).
    this.addQuad(
      this.materials.wall,
      new THREE.Vector3(shell.min.x, shell.min.y, shell.max.z),
      new THREE.Vector3(0, 0, -1),
      new THREE.Vector3(0, 1, 0),
      extensionDepth,
      height
    );
    // Right extension wall (x = max, faces -x).
    this.addQuad(
      this.materials.wall,
      new THREE.Vector3(shell.max.x, shell.min.y, roomMaxZ),
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, 1, 0),
      extensionDepth,
      height
    );
    // Rear closing wall behind the camera (faces -z, toward the room).
    this.addQuad(
      this.materials.wall,
      new THREE.Vector3(shell.max.x, shell.min.y, shell.max.z),
      new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(0, 1, 0),
      shell.max.x - shell.min.x,
      height
    );
  }

  /**
   * Dim passage pockets behind the side-wall doorway openings: jambs, header,
   * threshold and back panel in a subdued plaster so each opening reads as a
   * passage into an adjacent dimmer space instead of a hole in the shell.
   */
  private buildDoorwayPockets(): void {
    for (const wall of this.resolution.walls) {
      const room = wall.room;
      if (!room || room.doorwayExclusions.length === 0) continue;
      const normal = roomWallNormal(room);
      if (!normal) continue;
      const u = new THREE.Vector3(room.axisU.x, room.axisU.y, room.axisU.z).normalize();
      const v = new THREE.Vector3(room.axisV.x, room.axisV.y, room.axisV.z).normalize();
      const back = new THREE.Vector3(-normal.x, -normal.y, -normal.z);
      for (const exclusion of room.doorwayExclusions) {
        const us = exclusion.map((p) => p.x);
        const vs = exclusion.map((p) => p.y);
        const u0 = Math.min(...us);
        const u1 = Math.max(...us);
        const v0 = Math.min(...vs);
        const v1 = Math.max(...vs);
        const cornerLow = (du: number, dv: number, depth: number): THREE.Vector3 => {
          const p = roomWallPoint(room, { x: du, y: dv });
          return new THREE.Vector3(p.x, p.y, p.z).addScaledVector(back, depth);
        };
        const width = u1 - u0;
        const height = v1 - v0;
        // Jamb at u0 (faces across the opening toward the other jamb).
        this.addQuad(
          this.materials.pocket,
          cornerLow(u0, v0, 0),
          back.clone(),
          v.clone(),
          DOORWAY_POCKET_DEPTH,
          height
        ).castShadow = true;
        // Jamb at u1 (faces back toward the first jamb).
        this.addQuad(
          this.materials.pocket,
          cornerLow(u1, v0, DOORWAY_POCKET_DEPTH),
          back.clone().negate(),
          v.clone(),
          DOORWAY_POCKET_DEPTH,
          height
        ).castShadow = true;
        // Header underside (faces down).
        this.addQuad(
          this.materials.pocket,
          cornerLow(u0, v1, 0),
          back.clone(),
          u.clone(),
          DOORWAY_POCKET_DEPTH,
          width
        ).castShadow = true;
        // Threshold floor (faces up). Registered with the floor meshes so the
        // planar-reflection pass hides every surface that samples its target.
        this.floorMeshes.push(
          this.addQuad(this.materials.floor, cornerLow(u0, v0, 0), u.clone(), back.clone(), width, DOORWAY_POCKET_DEPTH)
        );
        // Back panel closing the passage (faces the opening).
        this.addQuad(this.materials.pocket, cornerLow(u0, v0, DOORWAY_POCKET_DEPTH), u.clone(), v.clone(), width, height);
      }
    }
  }

  /**
   * Dark skirting shadow gap along every wall base. Segments skip doorway
   * openings so the profile never crosses a passage.
   */
  private buildSkirting(): void {
    const shell = this.shellBounds();
    const roomMaxZ = this.resolution.room.bounds.max.z;
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const addSegment = (
      start: THREE.Vector3,
      direction: THREE.Vector3,
      length: number,
      inward: THREE.Vector3
    ): void => {
      if (length <= 0.02) return;
      const mesh = new THREE.Mesh(geometry, this.materials.trim);
      mesh.scale.set(length, SKIRTING_HEIGHT, SKIRTING_DEPTH);
      const center = start
        .clone()
        .addScaledVector(direction, length / 2)
        .addScaledVector(inward, -SKIRTING_DEPTH * 0.25)
        .setY(shell.min.y + SKIRTING_HEIGHT / 2);
      mesh.position.copy(center);
      if (Math.abs(direction.z) > Math.abs(direction.x)) mesh.rotation.y = Math.PI / 2;
      this.scene.add(mesh);
    };

    for (const wall of this.resolution.walls) {
      const room = wall.room;
      if (!room) continue;
      const normal = roomWallNormal(room);
      if (!normal) continue;
      const u = new THREE.Vector3(room.axisU.x, room.axisU.y, room.axisU.z).normalize();
      const inward = new THREE.Vector3(normal.x, normal.y, normal.z);
      // Openings along the wall base (doorways starting at the floor).
      const openings = room.doorwayExclusions
        .filter((polygon) => Math.min(...polygon.map((p) => p.y)) <= 0.01)
        .map((polygon) => ({
          from: Math.min(...polygon.map((p) => p.x)),
          to: Math.max(...polygon.map((p) => p.x)),
        }))
        .sort((a, b) => a.from - b.from);
      let cursor = 0;
      for (const opening of openings) {
        const origin = roomWallPoint(room, { x: cursor, y: 0 });
        addSegment(new THREE.Vector3(origin.x, origin.y, origin.z), u, opening.from - cursor, inward);
        cursor = opening.to;
      }
      const tail = roomWallPoint(room, { x: cursor, y: 0 });
      addSegment(new THREE.Vector3(tail.x, tail.y, tail.z), u, room.width - cursor, inward);
    }

    // Entry extension + rear wall skirting for continuity.
    if (shell.max.z > roomMaxZ + 0.01) {
      const extensionDepth = shell.max.z - roomMaxZ;
      addSegment(
        new THREE.Vector3(shell.min.x, 0, roomMaxZ),
        new THREE.Vector3(0, 0, 1),
        extensionDepth,
        new THREE.Vector3(1, 0, 0)
      );
      addSegment(
        new THREE.Vector3(shell.max.x, 0, roomMaxZ),
        new THREE.Vector3(0, 0, 1),
        extensionDepth,
        new THREE.Vector3(-1, 0, 0)
      );
      addSegment(
        new THREE.Vector3(shell.min.x, 0, shell.max.z),
        new THREE.Vector3(1, 0, 0),
        shell.max.x - shell.min.x,
        new THREE.Vector3(0, 0, -1)
      );
    }
  }

  /** Narrow ceiling shadow lines ground the tall wall planes without an AO pass. */
  private buildCeilingReveal(): void {
    const shell = this.shellBounds();
    const roomMinZ = this.resolution.room.bounds.min.z;
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const add = (
      position: THREE.Vector3,
      scale: THREE.Vector3
    ): void => {
      const reveal = new THREE.Mesh(geometry, this.materials.trim);
      reveal.position.copy(position);
      reveal.scale.copy(scale);
      this.scene.add(reveal);
    };
    add(
      new THREE.Vector3(0, shell.max.y - 0.018, roomMinZ + 0.012),
      new THREE.Vector3(shell.max.x - shell.min.x, 0.025, 0.024)
    );
    add(
      new THREE.Vector3(shell.min.x + 0.012, shell.max.y - 0.018, (shell.min.z + shell.max.z) / 2),
      new THREE.Vector3(0.024, 0.025, shell.max.z - shell.min.z)
    );
    add(
      new THREE.Vector3(shell.max.x - 0.012, shell.max.y - 0.018, (shell.min.z + shell.max.z) / 2),
      new THREE.Vector3(0.024, 0.025, shell.max.z - shell.min.z)
    );
  }

  // ── Artwork slots ──────────────────────────────────────────────────────────

  private ensureSlotState(slot: ResolvedHubSlot): SlotMeshState {
    const existing = this.slotMeshes.get(slot.id);
    if (existing) return existing;
    const artworkMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      toneMapped: false,
    });
    const artworkMesh = new THREE.Mesh(this.artworkPlaneGeometry, artworkMaterial);
    artworkMesh.castShadow = false;
    artworkMesh.receiveShadow = false;
    // Stretched-canvas body gives the mounted work physical depth and casts
    // the skylight shadow instead of the transparent image plane.
    const edgeMesh = new THREE.Mesh(this.edgeGeometry, this.materials.artworkEdge);
    edgeMesh.castShadow = true;
    edgeMesh.receiveShadow = false;
    const shadowMesh = new THREE.Mesh(this.artworkPlaneGeometry, this.shadowMaterial);
    shadowMesh.renderOrder = 1;
    edgeMesh.renderOrder = 2;
    artworkMesh.renderOrder = 3;
    const group = new THREE.Group();
    group.add(shadowMesh, edgeMesh, artworkMesh);
    const pageGroup = this.ensurePageGroup(slot.pageIndex);
    pageGroup.add(group);
    const state: SlotMeshState = {
      pageIndex: slot.pageIndex,
      group,
      artworkMesh,
      edgeMesh,
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

  private effectiveAnisotropy(): number {
    try {
      return Math.min(4, this.renderer.capabilities.getMaxAnisotropy());
    } catch {
      return 1;
    }
  }

  /**
   * v0.92: builds the hub artwork albedo texture, applying the same shared
   * capability-aware downscale used by the interactive gallery before the
   * source is bound as a GPU texture. Never upscales.
   */
  private imageTexture(image: HTMLImageElement): { texture: THREE.Texture; fit: TextureUploadFit } {
    const maxTextureSize = this.renderer.capabilities.maxTextureSize;
    const sourceWidth = image.naturalWidth || image.width;
    const sourceHeight = image.naturalHeight || image.height;
    const compatible = createCompatibleTextureImage(image, sourceWidth, sourceHeight, maxTextureSize);
    if (compatible.downscaleApplied) {
      this.diagnostics.warn('hub-slot-texture-downscaled', 'Downscaled oversized hub artwork texture to fit device capability', {
        sourceWidth,
        sourceHeight,
        uploadWidth: compatible.fit.targetWidth,
        uploadHeight: compatible.fit.targetHeight,
        maxTextureSize,
      });
    } else if (compatible.fit.needsDownscale) {
      this.diagnostics.warn('hub-slot-texture-oversized', 'Hub artwork texture exceeds device MAX_TEXTURE_SIZE and could not be downscaled', {
        sourceWidth,
        sourceHeight,
        maxTextureSize,
      });
    }
    const texture = new THREE.Texture(compatible.image as TexImageSource);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    texture.anisotropy = this.effectiveAnisotropy();
    return { texture, fit: compatible.fit };
  }

  /** Shared soft rounded contact card for physically mounted artworks. */
  private contactShadowMap(): THREE.CanvasTexture {
    if (this.contactShadowTexture) return this.contactShadowTexture;
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    if (context) {
      const inset = 10;
      const radius = 7;
      context.filter = 'blur(6px)';
      context.fillStyle = 'rgba(255,255,255,0.9)';
      context.beginPath();
      context.moveTo(inset + radius, inset);
      context.lineTo(size - inset - radius, inset);
      context.quadraticCurveTo(size - inset, inset, size - inset, inset + radius);
      context.lineTo(size - inset, size - inset - radius);
      context.quadraticCurveTo(size - inset, size - inset, size - inset - radius, size - inset);
      context.lineTo(inset + radius, size - inset);
      context.quadraticCurveTo(inset, size - inset, inset, size - inset - radius);
      context.lineTo(inset, inset + radius);
      context.quadraticCurveTo(inset, inset, inset + radius, inset);
      context.closePath();
      context.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.NoColorSpace;
    this.contactShadowTexture = texture;
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
    this.renderReflection();
    this.renderer.render(this.scene, this.camera);
  }
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
