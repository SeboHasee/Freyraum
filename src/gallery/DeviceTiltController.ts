import {
  driftDeviceNeutral,
  normalizeDeviceTiltUnit,
  requestDeviceOrientationAccess,
  type DeviceOrientationAccess,
} from './deviceOrientation';

/** Degrees of device tilt that map to the full artwork tilt. */
const TILT_RANGE_DEG = 16;
/** Resting-hand dead zone in degrees. */
const TILT_DEAD_ZONE_DEG = 1.4;

type OrientationConstructor = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<'granted' | 'denied'>;
};

function orientationConstructor(): OrientationConstructor | undefined {
  return typeof window === 'undefined'
    ? undefined
    : (window.DeviceOrientationEvent as OrientationConstructor | undefined);
}

/**
 * Device-orientation tilt source for the interactive gallery. Emits a
 * screen-aligned unit tilt (`[-1, 1]` per axis) that callers map onto their
 * own bounded rotation. Handles the iOS permission prompt, screen rotation,
 * slow neutral re-centring, a resting-hand dead zone, and page-hide
 * suspension. Listeners are only attached while both enabled and active.
 */
export class DeviceTiltController {
  private enabled = false;
  private active = false;
  private attached = false;
  private neutral: { beta: number; gamma: number } | null = null;
  private lastSampleAt = 0;
  private disposed = false;

  constructor(private readonly onTilt: (x: number, y: number) => void) {
    document.addEventListener('visibilitychange', this.onVisibilityChange);
  }

  static isSupported(): boolean {
    return typeof orientationConstructor() === 'function' && window.isSecureContext;
  }

  /** iOS Safari requires an explicit permission request from a user gesture. */
  static needsPermission(): boolean {
    return typeof orientationConstructor()?.requestPermission === 'function';
  }

  get isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Requests access (must run inside a user gesture on iOS) and starts
   * listening when granted.
   */
  async enable(): Promise<DeviceOrientationAccess> {
    if (this.disposed) return 'unavailable';
    const constructor = orientationConstructor();
    const access = await requestDeviceOrientationAccess({
      secureContext: typeof window !== 'undefined' && window.isSecureContext,
      supported: typeof constructor === 'function',
      requestPermission: constructor?.requestPermission
        ? () => constructor.requestPermission!()
        : undefined,
    });
    if (access !== 'granted' || this.disposed) return access;
    this.enabled = true;
    this.sync();
    return access;
  }

  disable(): void {
    this.enabled = false;
    this.sync();
  }

  /** Pauses listening while the owning view is hidden (hub, photo room). */
  setActive(active: boolean): void {
    this.active = active;
    this.sync();
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.enabled = false;
    this.sync();
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
  }

  private sync(): void {
    const shouldAttach = this.enabled && this.active && !document.hidden && !this.disposed;
    if (shouldAttach === this.attached) return;
    this.attached = shouldAttach;
    this.neutral = null;
    if (shouldAttach) {
      window.addEventListener('deviceorientation', this.onOrientation);
      window.addEventListener('orientationchange', this.onScreenRotation);
      window.screen.orientation?.addEventListener('change', this.onScreenRotation);
    } else {
      window.removeEventListener('deviceorientation', this.onOrientation);
      window.removeEventListener('orientationchange', this.onScreenRotation);
      window.screen.orientation?.removeEventListener('change', this.onScreenRotation);
      this.onTilt(0, 0);
    }
  }

  private onOrientation = (event: DeviceOrientationEvent): void => {
    if (!Number.isFinite(event.beta) || !Number.isFinite(event.gamma)) return;
    const sample = { beta: event.beta!, gamma: event.gamma! };
    const now = performance.now();
    if (!this.neutral) {
      this.neutral = sample;
      this.lastSampleAt = now;
      return;
    }
    this.neutral = driftDeviceNeutral(this.neutral, sample, (now - this.lastSampleAt) / 1000);
    this.lastSampleAt = now;
    const unit = normalizeDeviceTiltUnit(
      sample.beta,
      sample.gamma,
      window.screen.orientation?.angle ?? 0,
      this.neutral.beta,
      this.neutral.gamma,
      TILT_RANGE_DEG,
      TILT_DEAD_ZONE_DEG
    );
    this.onTilt(unit.x, unit.y);
  };

  private onScreenRotation = (): void => {
    this.neutral = null;
    this.onTilt(0, 0);
  };

  private onVisibilityChange = (): void => {
    this.sync();
  };
}
