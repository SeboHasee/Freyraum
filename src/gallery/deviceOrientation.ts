export type DeviceOrientationAccess = 'granted' | 'denied' | 'unavailable';

export interface DeviceOrientationPermissionOptions {
  secureContext: boolean;
  supported: boolean;
  requestPermission?: () => Promise<string>;
}

export interface DeviceArtworkTilt {
  tiltX: number;
  tiltY: number;
}

export async function requestDeviceOrientationAccess(
  options: DeviceOrientationPermissionOptions
): Promise<DeviceOrientationAccess> {
  if (!options.secureContext || !options.supported) return 'unavailable';
  if (!options.requestPermission) return 'granted';
  try {
    return await options.requestPermission() === 'granted' ? 'granted' : 'denied';
  } catch {
    return 'denied';
  }
}

export function normalizeDeviceArtworkTilt(
  beta: number,
  gamma: number,
  screenAngle: number,
  neutralBeta: number,
  neutralGamma: number,
  maximumAngle = 18,
  maximumTilt = 1.2,
  deadZone = 0
): DeviceArtworkTilt {
  const unit = normalizeDeviceTiltUnit(beta, gamma, screenAngle, neutralBeta, neutralGamma, maximumAngle, deadZone);
  return {
    tiltX: unit.y * maximumTilt,
    tiltY: unit.x * maximumTilt,
  };
}

/**
 * Screen-aligned device tilt in `[-1, 1]` per axis: `x` follows left/right
 * tilt (rotation about the screen's vertical axis), `y` forward/back tilt.
 * A small dead zone around the neutral pose keeps a resting hand from
 * producing constant micro-motion; the response is continuous past it.
 */
export function normalizeDeviceTiltUnit(
  beta: number,
  gamma: number,
  screenAngle: number,
  neutralBeta: number,
  neutralGamma: number,
  maximumAngle = 18,
  deadZone = 0
): { x: number; y: number } {
  const radians = ((Number.isFinite(screenAngle) ? screenAngle : 0) * Math.PI) / 180;
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  const deviceX = gamma - neutralGamma;
  const deviceY = wrapDegrees(beta - neutralBeta);
  const screenX = deviceX * cosine + deviceY * sine;
  const screenY = -deviceX * sine + deviceY * cosine;
  const span = Math.max(1e-6, maximumAngle - deadZone);
  const shape = (value: number): number => {
    const magnitude = Math.max(0, Math.abs(value) - deadZone);
    return Math.sign(value) * Math.min(1, magnitude / span);
  };
  return { x: shape(screenX) || 0, y: shape(screenY) || 0 };
}

function wrapDegrees(value: number): number {
  let wrapped = value;
  while (wrapped > 180) wrapped -= 360;
  while (wrapped < -180) wrapped += 360;
  return wrapped;
}

/**
 * Slowly re-centres the neutral pose toward the current pose so a phone held
 * at a new resting angle drifts back to an untilted artwork (~`1/lambda` s).
 */
export function driftDeviceNeutral(
  neutral: { beta: number; gamma: number },
  sample: { beta: number; gamma: number },
  deltaSeconds: number,
  lambda = 0.35
): { beta: number; gamma: number } {
  const amount = deltaSeconds <= 0 ? 0 : 1 - Math.exp(-lambda * Math.min(deltaSeconds, 0.5));
  return {
    beta: neutral.beta + wrapDegrees(sample.beta - neutral.beta) * amount,
    gamma: neutral.gamma + (sample.gamma - neutral.gamma) * amount,
  };
}

export function smoothDeviceArtworkTilt(
  current: DeviceArtworkTilt,
  target: DeviceArtworkTilt,
  deltaSeconds: number,
  lambda = 12
): DeviceArtworkTilt {
  const amount = deltaSeconds <= 0 ? 0 : 1 - Math.exp(-lambda * Math.min(deltaSeconds, 0.1));
  return {
    tiltX: current.tiltX + (target.tiltX - current.tiltX) * amount,
    tiltY: current.tiltY + (target.tiltY - current.tiltY) * amount,
  };
}
