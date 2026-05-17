/**
 * @experimental — never eagerly imported by the production WebGL path.
 *
 * Loaded only via dynamic import when the user opts in via `?backend=webgpu`
 * or `localStorage.freyraum.backend = 'webgpu'`. Any failure inside this
 * module falls back silently to WebGL.
 */

export interface SerializedGPUAdapterInfo {
  vendor?: string;
  architecture?: string;
  device?: string;
  description?: string;
}

export interface WebGPUProbeResult {
  supported: boolean;
  adapterInfo?: SerializedGPUAdapterInfo;
  /** Plain-object limits snapshot so the result is loggable and stable across DOM lib versions. */
  limits?: Record<string, number>;
  unsupportedFeatures: string[];
  fallbackToWebGL: boolean;
}

/** Probes WebGPU. Resolves to a {@link WebGPUProbeResult}. Never throws. */
export async function initWebGPUPrototype(): Promise<WebGPUProbeResult> {
  const unsupportedFeatures: string[] = [];

  try {
    const gpu = (navigator as unknown as { gpu?: { requestAdapter: () => Promise<unknown> } }).gpu;
    if (!gpu) {
      return { supported: false, unsupportedFeatures: ['navigator.gpu'], fallbackToWebGL: true };
    }

    const adapter = (await gpu.requestAdapter()) as
      | (null | {
          info?: SerializedGPUAdapterInfo;
          requestAdapterInfo?: () => Promise<SerializedGPUAdapterInfo>;
          limits?: Record<string, number>;
          requestDevice: () => Promise<unknown>;
        });
    if (!adapter) {
      return { supported: false, unsupportedFeatures: ['gpu.requestAdapter'], fallbackToWebGL: true };
    }

    let adapterInfo: SerializedGPUAdapterInfo | undefined;
    if (typeof adapter.requestAdapterInfo === 'function') {
      try {
        const info = await adapter.requestAdapterInfo();
        adapterInfo = {
          vendor: info?.vendor,
          architecture: info?.architecture,
          device: info?.device,
          description: info?.description,
        };
      } catch {
        unsupportedFeatures.push('adapter.requestAdapterInfo');
      }
    } else if (adapter.info) {
      adapterInfo = {
        vendor: adapter.info.vendor,
        architecture: adapter.info.architecture,
        device: adapter.info.device,
        description: adapter.info.description,
      };
    }

    const limits: Record<string, number> = {};
    if (adapter.limits) {
      const interesting = [
        'maxTextureDimension1D',
        'maxTextureDimension2D',
        'maxTextureDimension3D',
        'maxBindGroups',
        'maxBufferSize',
      ];
      for (const k of interesting) {
        const v = adapter.limits[k];
        if (typeof v === 'number' && Number.isFinite(v)) limits[k] = v;
      }
    }

    try {
      await adapter.requestDevice();
    } catch {
      unsupportedFeatures.push('adapter.requestDevice');
    }

    if (typeof console !== 'undefined') {
      console.info('[freyraum] WebGPU probe', { adapterInfo, limits, unsupportedFeatures });
    }

    return { supported: true, adapterInfo, limits, unsupportedFeatures, fallbackToWebGL: true };
  } catch (err) {
    if (typeof console !== 'undefined') {
      console.warn('[freyraum] WebGPU probe exception', err);
    }
    return { supported: false, unsupportedFeatures: ['exception'], fallbackToWebGL: true };
  }
}
