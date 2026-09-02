import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { MuseumHubResolution, ResolvedHubSlot, ResolvedHubWall } from '../config/museumHub';
import type { QualityPreset } from '../config/quality';
import type { ArtworkImageUrlType } from '../utils/artworkImageSources';
import { roomWallNormal, roomWallPoint } from './projectiveGeometry';
import {
  ArchitecturalSurfaceFactory,
  type ArchitecturalMaterials,
} from '../materials/ArchitecturalSurfaceFactory';
import { getOptimalPixelRatio } from '../utils/performance';
import { createScopedDiagnostics } from '../utils/Diagnostics';
import { createCompatibleTextureImage, type TextureUploadFit } from '../utils/textureUploadCompatibility';
import { probeTextureVisiblePixels, type VisiblePixelProbeResult } from '../utils/sourceToPixelProbe';
import { getRuntimeProtocol, shouldRunVisiblePixelProbe } from '../utils/sourceToPixelOutcome';

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
const ARTWORK_EDGE_DEPTH = 0.04;
/** How far the entry-zone shell extends past the camera (metres). */
const ENTRY_SHELL_MARGIN = 1.5;
/** Depth of the dim passage pocket behind each doorway opening (metres). */
const DOORWAY_POCKET_DEPTH = 1.15;
/** Skirting shadow-gap profile (metres). */
const SKIRTING_HEIGHT = 0.075;
const SKIRTING_DEPTH = 0.014;
/** Recessed ceiling light-cove dimensions (metres). */
export const HUB_COVE_WIDTH_M = 0.48;
const COVE_SIDE_INSET = 0.85;
const COVE_RECESS_DEPTH = 0.06;
/** Height of the diffuser strip above the ceiling plane (metres). Nearly
 *  flush so the glowing strip fills the opening even at grazing angles. */
const COVE_STRIP_LIFT = 0.006;

/** Static, low-energy hub rig: broad warm-neutral wash plus two directions. */
export const HUB_LIGHTING_PROFILE = Object.freeze({
  hemisphere: Object.freeze({
    sky: 0xfffaf1,
    ground: 0xbab4aa,
    intensity: 0.5,
  }),
  key: Object.freeze({
    color: 0xfff4e2,
    intensity: 0.38,
    position: Object.freeze([-1.4, 7.2, 4.8] as const),
    target: Object.freeze([0.25, 0.8, -0.6] as const),
  }),
  fill: Object.freeze({
    color: 0xf0f3f1,
    intensity: 0.18,
    position: Object.freeze([3.0, 4.8, 3.8] as const),
    target: Object.freeze([-0.6, 1.5, -0.4] as const),
  }),
  ceilingPanel: Object.freeze({
    color: 0xfff2dc,
    intensity: 3.2,
    edgeInset: 0.12,
    ceilingOffset: 0.025,
  }),
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
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(getOptimalPixelRatio(preset.pixelRatioCap));
    this.renderer.setSize(resolution.stage.width, resolution.stage.height, false);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    // No tone mapping: artwork planes must reproduce customer imagery exactly.
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
    this.attachFloorReflectionShader(this.materials.floor);

    this.shadowMaterial = new THREE.MeshBasicMaterial({
      map: this.contactShadowMap(),
      color: 0x000000,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
      toneMapped: false,
    });

    this.buildRoom();
    this.buildLights();
    this.applyEnvironment();
    this.applyReflectionMode();
    this.setActivePage(0);
    this.render();
  }

  /**
   * Applies a quality preset at runtime: pixel-ratio cap, surface tile size,
   * skylight shadows, and floor-reflection strategy. Re-renders once.
   */
  applyPreset(preset: QualityPreset): void {
    if (this.disposed) return;
    this.preset = preset;
    this.renderer.setPixelRatio(getOptimalPixelRatio(preset.pixelRatioCap));
    this.renderer.setSize(this.resolution.stage.width, this.resolution.stage.height, false);
    this.surfaceFactory.setTileSize(preset.hubSurfaceTileSize);
    this.applyLightingPreset();
    this.applyShadowPreset();
    this.applyEnvironment();
    this.applyReflectionMode();
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
    const normal = roomWallNormal(wall.room);
    if (!slotAnchor || !normal) {
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
    // Stretched-canvas body: front face sits just behind the artwork plane.
    state.edgeMesh.scale.set(width, height, ARTWORK_EDGE_DEPTH);
    state.edgeMesh.position.set(0, 0, -ARTWORK_EDGE_DEPTH / 2 - 0.001);
    // Soft radial contact shadow hugging the wall behind the mounted work.
    state.shadowMesh.scale.set(width * 1.1, height * 1.1, 1);
    state.shadowMesh.position.set(0, -0.01, -zOffset + 0.004);
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
      panel.rotation.x = -Math.PI / 2;
      this.ceilingPanelLights.push(panel);
      this.scene.add(panel);
    }
    this.applyLightingPreset();
    this.applyShadowPreset();
  }

  /** Area fixtures are reserved for high/balanced; battery uses one cheap fill. */
  private applyLightingPreset(): void {
    const areaLightingEnabled = this.preset.id !== 'battery';
    for (const panel of this.ceilingPanelLights) panel.visible = areaLightingEnabled;
    if (this.fillLight) this.fillLight.visible = !areaLightingEnabled;
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
    // Ortho frustum fitted to the room envelope (including entry extension).
    const shell = this.shellBounds();
    const radius = Math.max(shell.max.x - shell.min.x, shell.max.z - shell.min.z);
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

  /** PMREM room environment for subtle material response; skipped on battery. */
  private applyEnvironment(): void {
    const wantsEnvironment = this.preset.hubReflection !== 'off';
    if (wantsEnvironment && !this.environmentTarget) {
      const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
      pmremGenerator.compileEquirectangularShader();
      const roomEnv = new RoomEnvironment(this.renderer);
      this.environmentTarget = pmremGenerator.fromScene(roomEnv);
      pmremGenerator.dispose();
      roomEnv.dispose();
      this.scene.environment = this.environmentTarget.texture;
      this.scene.environmentIntensity = 0.32;
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
    material.onBeforeCompile = (shader) => {
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
    material.customProgramCacheKey = () => 'hub-floor-reflection';
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
        this.reflectionTarget.texture.colorSpace = this.renderer.outputColorSpace;
      }
      this.reflectionUniforms.uReflectionMap.value = this.reflectionTarget.texture;
      this.reflectionUniforms.uReflectionStrength.value = this.preset.id === 'high' ? 0.28 : 0.24;
      this.materials.floor.roughness = 0.64;
    } else {
      this.reflectionUniforms.uReflectionMap.value = null;
      this.reflectionUniforms.uReflectionStrength.value = 0;
      this.reflectionTarget?.dispose();
      this.reflectionTarget = null;
      // ibl: environment gloss only; off: fully diffuse mineral floor.
      this.materials.floor.roughness = mode === 'ibl' ? 0.55 : 0.78;
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
    this.renderer.setRenderTarget(target);
    this.renderer.render(this.scene, cam);
    this.renderer.setRenderTarget(null);
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

    // Ceiling with recessed light coves inside the original room area.
    const coves = this.coveRects();
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
    const ceiling = new THREE.Mesh(new THREE.ShapeGeometry(ceilingShape), this.materials.ceiling);
    // Shape (x, z) rotated +90° about X maps to world (x, ceilingY, z) facing down.
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = shell.max.y;
    this.scene.add(ceiling);

    for (const cove of coves) {
      this.buildCove(cove, shell.max.y);
    }
  }

  private coveRects(): { minX: number; maxX: number; minZ: number; maxZ: number }[] {
    const bounds = this.resolution.room.bounds;
    const width = bounds.max.x - bounds.min.x;
    const depth = bounds.max.z - bounds.min.z;
    if (width < 3 || depth < 3) return [];
    const minX = bounds.min.x + COVE_SIDE_INSET;
    const maxX = bounds.max.x - COVE_SIDE_INSET;
    const rows = [bounds.min.z + depth * 0.24, bounds.min.z + depth * 0.62];
    return rows.map((z) => ({
      minX,
      maxX,
      minZ: z - HUB_COVE_WIDTH_M / 2,
      maxZ: z + HUB_COVE_WIDTH_M / 2,
    }));
  }

  private buildCove(
    cove: { minX: number; maxX: number; minZ: number; maxZ: number },
    ceilingY: number
  ): void {
    const length = cove.maxX - cove.minX;
    // Dark reveal returns along the two long edges of the recess.
    this.addQuad(
      this.materials.trim,
      new THREE.Vector3(cove.minX, ceilingY, cove.minZ),
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 1, 0),
      length,
      COVE_RECESS_DEPTH
    );
    this.addQuad(
      this.materials.trim,
      new THREE.Vector3(cove.maxX, ceilingY, cove.maxZ),
      new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(0, 1, 0),
      length,
      COVE_RECESS_DEPTH
    );
    // Warm-white diffuser strip just above the ceiling plane, oversized so it
    // fills the opening from every viewing angle (no void visible past it).
    this.addQuad(
      this.materials.lightStrip,
      new THREE.Vector3(cove.minX - 0.06, ceilingY + COVE_STRIP_LIFT, cove.minZ - 0.06),
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 0, 1),
      length + 0.12,
      cove.maxZ - cove.minZ + 0.12
    );
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
        this.addQuad(this.materials.pocket, cornerLow(u0, v0, 0), back.clone(), v.clone(), DOORWAY_POCKET_DEPTH, height);
        // Jamb at u1 (faces back toward the first jamb).
        this.addQuad(this.materials.pocket, cornerLow(u1, v0, DOORWAY_POCKET_DEPTH), back.clone().negate(), v.clone(), DOORWAY_POCKET_DEPTH, height);
        // Header underside (faces down).
        this.addQuad(this.materials.pocket, cornerLow(u0, v1, 0), back.clone(), u.clone(), DOORWAY_POCKET_DEPTH, width);
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
        .addScaledVector(inward, SKIRTING_DEPTH / 2)
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

  /** Shared soft radial-gradient texture for artwork contact shadows. */
  private contactShadowMap(): THREE.CanvasTexture {
    if (this.contactShadowTexture) return this.contactShadowTexture;
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    if (context) {
      const gradient = context.createRadialGradient(
        size / 2,
        size / 2,
        size * 0.18,
        size / 2,
        size / 2,
        size * 0.5
      );
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.55, 'rgba(255,255,255,0.45)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, size, size);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
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
