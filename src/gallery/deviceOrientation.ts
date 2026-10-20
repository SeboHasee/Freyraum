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
  maximumTilt = 1.2
): DeviceArtworkTilt {
  const radians = ((Number.isFinite(screenAngle) ? screenAngle : 0) * Math.PI) / 180;
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  const deviceX = gamma - neutralGamma;
  const deviceY = beta - neutralBeta;
  const screenX = deviceX * cosine + deviceY * sine;
  const screenY = -deviceX * sine + deviceY * cosine;
  const clampUnit = (value: number): number => Math.max(-1, Math.min(1, value / maximumAngle));
  return {
    tiltX: clampUnit(screenY) * maximumTilt,
    tiltY: clampUnit(screenX) * maximumTilt,
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
