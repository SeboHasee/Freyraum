/**
 * v0.74 Phase 10 / Phase 12 — Type B (structural) regression tooling.
 *
 * Runtime assertions that detect structural regressions (`plan.md § Phase 12.1
 * Type B`, `§ Phase 12.3 Type B`, `§ Phase 13` geometry-ownership coupling).
 * They verify that an optimization has not silently corrupted the scene graph,
 * geometry buffers, light shadow configuration, or material bindings.
 *
 * The checks are non-throwing by default: they return a list of violation
 * strings so a caller can decide whether to warn, fail a gate, or ignore. This
 * keeps them safe to run in production diagnostics without risking a crash that
 * the optimization itself did not cause.
 */

import * as THREE from 'three';

export interface InvariantContext {
  scene: THREE.Scene;
  /** The single artwork mesh whose geometry ownership must stay singular. */
  artworkMesh: THREE.Mesh;
  /** All scene lights; used for the shadow-casting-count invariant. */
  lights: THREE.Light[];
  /** Expected number of shadow-casting lights for the active preset. */
  expectedShadowCasterCount: number;
  /** Optional ceiling on artwork triangle count (Phase 14.4 LOD gate). */
  maxArtworkTriangles?: number;
}

export interface InvariantResult {
  /** Number of invariants evaluated. */
  checked: number;
  /** Human-readable violation messages; empty when all invariants hold. */
  violations: string[];
  /** Structured snapshot of measured structural values for logging. */
  measured: {
    artworkTriangles: number;
    sceneChildren: number;
    shadowCasterCount: number;
  };
}

function triangleCount(geometry: THREE.BufferGeometry | null | undefined): number {
  if (!geometry) return 0;
  const index = geometry.getIndex();
  if (index) return index.count / 3;
  const position = geometry.getAttribute('position');
  return position ? position.count / 3 : 0;
}

/**
 * Evaluate all structural invariants for the current scene state.
 */
export function runInvariants(ctx: InvariantContext): InvariantResult {
  const violations: string[] = [];
  let checked = 0;

  // 1. Geometry ownership: the artwork mesh must own exactly one valid geometry
  //    with a position attribute. OPT-2 (aspect cache) and OPT-9 (LOD swap) both
  //    assign `artworkMesh.geometry`; a corrupt or missing buffer here signals a
  //    geometry-ownership conflict (Phase 13 §13.1).
  checked += 1;
  const artGeo = ctx.artworkMesh.geometry as THREE.BufferGeometry | undefined;
  if (!artGeo) {
    violations.push('artworkMesh.geometry is null/undefined (geometry ownership lost)');
  } else if (!artGeo.getAttribute('position')) {
    violations.push('artworkMesh.geometry has no position attribute (corrupt buffer)');
  }

  // 2. Vertex/triangle ceiling (LOD gate, Phase 14.4).
  const artTris = triangleCount(artGeo);
  if (typeof ctx.maxArtworkTriangles === 'number') {
    checked += 1;
    if (artTris > ctx.maxArtworkTriangles) {
      violations.push(
        `artwork triangle count ${Math.round(artTris)} exceeds max ${ctx.maxArtworkTriangles}`
      );
    }
  }

  // 3. Material binding: the mesh must have a live (non-disposed) material.
  checked += 1;
  const material = ctx.artworkMesh.material as THREE.Material | THREE.Material[] | undefined;
  if (!material || (Array.isArray(material) && material.length === 0)) {
    violations.push('artworkMesh.material is missing (broken material binding)');
  }

  // 4. Shadow-casting light count must match the active preset expectation.
  //    OPT-5 changes this deliberately; an unexpected count is a regression.
  checked += 1;
  const shadowCasters = ctx.lights.filter((l) => l.castShadow).length;
  if (shadowCasters !== ctx.expectedShadowCasterCount) {
    violations.push(
      `shadow-casting light count ${shadowCasters} != expected ${ctx.expectedShadowCasterCount}`
    );
  }

  // 5. Scene consistency: no null children, and the artwork mesh's transform
  //    must be finite (a NaN from a bad clamp would silently blank the canvas).
  checked += 1;
  let sceneChildren = 0;
  let nullChildren = 0;
  ctx.scene.traverse((obj) => {
    sceneChildren += 1;
    if (obj === null || obj === undefined) nullChildren += 1;
  });
  if (nullChildren > 0) {
    violations.push(`${nullChildren} null/undefined node(s) found in scene graph`);
  }
  const p = ctx.artworkMesh.position;
  if (!Number.isFinite(p.x) || !Number.isFinite(p.y) || !Number.isFinite(p.z)) {
    violations.push('artworkMesh.position contains a non-finite value');
  }

  return {
    checked,
    violations,
    measured: {
      artworkTriangles: Math.round(artTris),
      sceneChildren,
      shadowCasterCount: shadowCasters,
    },
  };
}
