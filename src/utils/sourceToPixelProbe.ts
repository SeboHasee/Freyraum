/**
 * v0.92 — bounded developer/CI probe proving that a texture bound to a
 * material map actually produces non-empty GPU output, not just that the
 * loader/decoder resolved without error.
 *
 * The probe renders the supplied texture into a tiny (4×4) off-screen render
 * target using a dedicated, lazily-created and reused scene/camera/mesh per
 * renderer, then reads back the pixels. It reports only a pass/fail verdict
 * plus a compact average colour and the probe's own (tiny, fixed) dimensions
 * — never the source image bytes, a data URI, or any customer-identifying
 * content. This keeps the probe cheap enough to run on demand without
 * imposing GPU-stall cost on every visitor by default (callers should gate
 * invocation behind verbose diagnostics or an explicit CI/dev trigger).
 */

import * as THREE from 'three';

export interface VisiblePixelProbeResult {
  pass: boolean;
  probeWidth: number;
  probeHeight: number;
  averageColor: { r: number; g: number; b: number; a: number };
  reason?: string;
}

interface ProbeRig {
  renderTarget: THREE.WebGLRenderTarget;
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  material: THREE.MeshBasicMaterial;
  buffer: Uint8Array;
}

const PROBE_SIZE = 4;
const rigsByRenderer = new WeakMap<THREE.WebGLRenderer, ProbeRig>();

function ensureRig(renderer: THREE.WebGLRenderer): ProbeRig {
  const existing = rigsByRenderer.get(renderer);
  if (existing) return existing;

  const renderTarget = new THREE.WebGLRenderTarget(PROBE_SIZE, PROBE_SIZE, {
    depthBuffer: false,
    stencilBuffer: false,
  });
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 2);
  camera.position.z = 1;
  const material = new THREE.MeshBasicMaterial({ toneMapped: false, transparent: true });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  scene.add(mesh);

  const rig: ProbeRig = {
    renderTarget,
    scene,
    camera,
    material,
    buffer: new Uint8Array(PROBE_SIZE * PROBE_SIZE * 4),
  };
  rigsByRenderer.set(renderer, rig);
  return rig;
}

/**
 * Renders `texture` into the shared bounded probe rig for this renderer and
 * reads back its pixels. Returns `pass: true` only when the readback
 * contains non-zero alpha, i.e. the GPU actually produced visible output for
 * this exact texture binding.
 */
export function probeTextureVisiblePixels(
  renderer: THREE.WebGLRenderer,
  texture: THREE.Texture
): VisiblePixelProbeResult {
  try {
    const rig = ensureRig(renderer);
    rig.material.map = texture;
    rig.material.needsUpdate = true;

    const previousTarget = renderer.getRenderTarget();
    renderer.setRenderTarget(rig.renderTarget);
    renderer.render(rig.scene, rig.camera);
    renderer.readRenderTargetPixels(rig.renderTarget, 0, 0, PROBE_SIZE, PROBE_SIZE, rig.buffer);
    renderer.setRenderTarget(previousTarget);
    rig.material.map = null;

    const sampleCount = PROBE_SIZE * PROBE_SIZE;
    let r = 0;
    let g = 0;
    let b = 0;
    let a = 0;
    for (let i = 0; i < rig.buffer.length; i += 4) {
      r += rig.buffer[i] ?? 0;
      g += rig.buffer[i + 1] ?? 0;
      b += rig.buffer[i + 2] ?? 0;
      a += rig.buffer[i + 3] ?? 0;
    }
    const averageColor = {
      r: Math.round(r / sampleCount),
      g: Math.round(g / sampleCount),
      b: Math.round(b / sampleCount),
      a: Math.round(a / sampleCount),
    };
    const pass = averageColor.a > 0;
    return {
      pass,
      probeWidth: PROBE_SIZE,
      probeHeight: PROBE_SIZE,
      averageColor,
      reason: pass ? undefined : 'zero-alpha-readback',
    };
  } catch (err) {
    return {
      pass: false,
      probeWidth: PROBE_SIZE,
      probeHeight: PROBE_SIZE,
      averageColor: { r: 0, g: 0, b: 0, a: 0 },
      reason: err instanceof Error ? err.message : 'probe-error',
    };
  }
}
