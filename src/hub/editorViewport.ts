import * as THREE from 'three';
import { deriveWallFrame, type Point3D, type RoomWallModel, type WallFrame } from './projectiveGeometry';

export type EditorViewMode = 'perspective' | 'wall-edit';

export interface EditorCornerHandle {
  wallId: string;
  cornerIndex: number;
  world: Point3D;
  screen: { x: number; y: number };
  edgeAnchored: boolean;
}

export interface EditorViewportOptions {
  width: number;
  height: number;
  margin?: number;
}

export class EditorViewport {
  readonly perspectiveCamera: THREE.PerspectiveCamera;
  readonly wallEditCamera: THREE.OrthographicCamera;
  readonly target = new THREE.Vector3();
  private readonly margin: number;
  private width: number;
  private height: number;
  private mode: EditorViewMode = 'perspective';
  private activeFrame: WallFrame | null = null;

  constructor(options: EditorViewportOptions) {
    this.width = Math.max(1, options.width);
    this.height = Math.max(1, options.height);
    this.margin = Math.max(8, options.margin ?? 56);
    this.perspectiveCamera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.01, 100);
    this.wallEditCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.01, 100);
    this.resetView();
  }

  resize(width: number, height: number): void {
    this.width = Math.max(1, width);
    this.height = Math.max(1, height);
    this.perspectiveCamera.aspect = this.width / this.height;
    this.perspectiveCamera.updateProjectionMatrix();
    if (this.activeFrame && this.mode === 'wall-edit') this.frameWall(this.activeFrame);
  }

  resetView(): void {
    this.mode = 'perspective';
    this.activeFrame = null;
    this.perspectiveCamera.position.set(0, 3, 10);
    this.target.set(0, 2, 0);
    this.perspectiveCamera.lookAt(this.target);
  }

  frameWall(
    wall: RoomWallModel | WallFrame | readonly [Point3D, Point3D, Point3D, Point3D]
  ): WallFrame | null {
    const frame = 'normal' in wall ? wall : deriveWallFrame('corners' in wall ? wall.corners : wall);
    if (!frame) return null;
    this.mode = 'wall-edit';
    this.activeFrame = frame;
    this.target.set(frame.center.x, frame.center.y, frame.center.z);
    const distance = Math.max(frame.width, frame.height, 1);
    this.wallEditCamera.position.set(
      frame.center.x + frame.normal.x * distance,
      frame.center.y + frame.normal.y * distance,
      frame.center.z + frame.normal.z * distance
    );
    this.wallEditCamera.up.set(frame.axisV.x, frame.axisV.y, frame.axisV.z);
    this.wallEditCamera.lookAt(this.target);
    const aspect = this.width / this.height;
    const marginWorld = Math.max(frame.height, frame.width / aspect) * (this.margin / this.height) * 1.5;
    const halfHeight = Math.max(frame.height / 2, frame.width / (2 * aspect)) + marginWorld;
    const halfWidth = halfHeight * aspect;
    this.wallEditCamera.left = -halfWidth;
    this.wallEditCamera.right = halfWidth;
    this.wallEditCamera.top = halfHeight;
    this.wallEditCamera.bottom = -halfHeight;
    this.wallEditCamera.near = 0.01;
    this.wallEditCamera.far = distance * 4 + Math.max(frame.width, frame.height);
    this.wallEditCamera.updateProjectionMatrix();
    this.wallEditCamera.updateMatrixWorld(true);
    return frame;
  }

  frameCorner(wall: RoomWallModel | WallFrame, cornerIndex: number): WallFrame | null {
    const frame = this.frameWall(wall);
    if (!frame || cornerIndex < 0 || cornerIndex > 3) return null;
    return frame;
  }

  frameAllWalls(walls: readonly RoomWallModel[]): WallFrame[] {
    const frames = walls.map((wall) => deriveWallFrame(wall.corners)).filter((frame): frame is WallFrame => frame !== null);
    if (!frames.length) return [];
    this.mode = 'perspective';
    this.activeFrame = null;
    const points = frames.flatMap((frame) => frame.corners);
    const center = points.reduce(
      (sum, point) => ({ x: sum.x + point.x, y: sum.y + point.y, z: sum.z + point.z }),
      { x: 0, y: 0, z: 0 }
    );
    center.x /= points.length;
    center.y /= points.length;
    center.z /= points.length;
    const radius = Math.max(
      ...points.map((point) => Math.hypot(point.x - center.x, point.y - center.y, point.z - center.z)),
      1
    );
    this.target.set(center.x, center.y, center.z);
    const direction = new THREE.Vector3(0, 0.55, 2.6).normalize();
    const verticalHalfFov = THREE.MathUtils.degToRad(this.perspectiveCamera.fov) / 2;
    const horizontalHalfFov = Math.atan(Math.tan(verticalHalfFov) * this.perspectiveCamera.aspect);
    const limitingHalfFov = Math.max(THREE.MathUtils.degToRad(1), Math.min(verticalHalfFov, horizontalHalfFov));
    const cameraDistance = (radius / Math.tan(limitingHalfFov)) * 1.2;
    this.perspectiveCamera.position.set(
      center.x + direction.x * cameraDistance,
      center.y + direction.y * cameraDistance,
      center.z + direction.z * cameraDistance
    );
    this.perspectiveCamera.lookAt(this.target);
    this.perspectiveCamera.near = 0.01;
    this.perspectiveCamera.far = radius * 8;
    this.perspectiveCamera.updateProjectionMatrix();
    this.perspectiveCamera.updateMatrixWorld(true);
    return frames;
  }

  project(world: Point3D): { x: number; y: number } | null {
    const camera = this.mode === 'wall-edit' ? this.wallEditCamera : this.perspectiveCamera;
    camera.updateMatrixWorld(true);
    const projected = new THREE.Vector3(world.x, world.y, world.z).project(camera);
    if (!Number.isFinite(projected.x) || !Number.isFinite(projected.y)) return null;
    return {
      x: (projected.x + 1) * 0.5 * this.width,
      y: (1 - projected.y) * 0.5 * this.height,
    };
  }

  projectCorners(wallId: string, frame = this.activeFrame): EditorCornerHandle[] {
    if (!frame) return [];
    return frame.corners.flatMap((world, cornerIndex) => {
      const screen = this.project(world);
      return screen ? [{ wallId, cornerIndex, world, screen, edgeAnchored: false }] : [];
    });
  }

  projectWallCorners(wallId: string, frame: WallFrame, edgeMargin = 24): EditorCornerHandle[] {
    const sideWall = wallId === 'wall-left' || wallId === 'wall-right' || wallId.includes('left') || wallId.includes('right');
    const leftSideWall = wallId === 'wall-left' || wallId.includes('left');
    return frame.corners.flatMap((world, cornerIndex) => {
      const screen = this.project(world);
      if (!screen) return [];
      const edgeAnchored =
        (sideWall && (cornerIndex === 1 || cornerIndex === 2))
        ||
        screen.x < edgeMargin
        || screen.x > this.width - edgeMargin
        || screen.y < edgeMargin
        || screen.y > this.height - edgeMargin;
      return [{
        wallId,
        cornerIndex,
        world,
        screen: {
          // Keep the two rear corners of each side wall on its own screen edge.
          // Their projected positions can coincide with the front wall at the
          // extreme perspective angles used by the customer preview.
          x: sideWall && (cornerIndex === 1 || cornerIndex === 2)
            ? (leftSideWall ? edgeMargin : this.width - edgeMargin)
            : Math.min(this.width - edgeMargin, Math.max(edgeMargin, screen.x)),
          y: Math.min(this.height - edgeMargin, Math.max(edgeMargin, screen.y)),
        },
        edgeAnchored,
      }];
    });
  }

  cornerFromScreen(screenX: number, screenY: number): Point3D | null {
    if (!this.activeFrame || this.mode !== 'wall-edit') return null;
    const ndcX = (screenX / this.width) * 2 - 1;
    const ndcY = 1 - (screenY / this.height) * 2;
    const ray = new THREE.Raycaster();
    ray.setFromCamera(new THREE.Vector2(ndcX, ndcY), this.wallEditCamera);
    const normal = new THREE.Vector3(
      this.activeFrame.normal.x,
      this.activeFrame.normal.y,
      this.activeFrame.normal.z
    );
    const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(
      normal,
      new THREE.Vector3(this.activeFrame.origin.x, this.activeFrame.origin.y, this.activeFrame.origin.z)
    );
    const hit = ray.ray.intersectPlane(plane, new THREE.Vector3());
    return hit ? { x: hit.x, y: hit.y, z: hit.z } : null;
  }

  get viewMode(): EditorViewMode {
    return this.mode;
  }

  get currentFrame(): WallFrame | null {
    return this.activeFrame;
  }
}
