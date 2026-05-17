/**
 * @experimental
 *
 * Runtime-only WebGPU probe module for the file:// customer preview build.
 * It is deliberately kept out of Vite's IIFE bundle graph so normal preview
 * sessions never parse or fetch it.
 */

/**
 * Probes WebGPU and returns a serializable result object. Never throws.
 */
export async function initWebGPUPrototype() {
  const unsupportedFeatures = [];

  try {
    const gpu = globalThis.navigator?.gpu;
    if (!gpu) {
      return { supported: false, unsupportedFeatures: ['navigator.gpu'], fallbackToWebGL: true };
    }

    const adapter = await gpu.requestAdapter();
    if (!adapter) {
      return { supported: false, unsupportedFeatures: ['gpu.requestAdapter'], fallbackToWebGL: true };
    }

    let adapterInfo;
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

    const limits = {};
    if (adapter.limits) {
      const interesting = [
        'maxTextureDimension1D',
        'maxTextureDimension2D',
        'maxTextureDimension3D',
        'maxBindGroups',
        'maxBufferSize',
      ];
      for (const key of interesting) {
        const value = adapter.limits[key];
        if (typeof value === 'number' && Number.isFinite(value)) {
          limits[key] = value;
        }
      }
    }

    try {
      await adapter.requestDevice();
    } catch {
      unsupportedFeatures.push('adapter.requestDevice');
    }

    console.info('[freyraum] WebGPU probe', { adapterInfo, limits, unsupportedFeatures });
    return { supported: true, adapterInfo, limits, unsupportedFeatures, fallbackToWebGL: true };
  } catch (err) {
    console.warn('[freyraum] WebGPU probe exception', err);
    return { supported: false, unsupportedFeatures: ['exception'], fallbackToWebGL: true };
  }
}
