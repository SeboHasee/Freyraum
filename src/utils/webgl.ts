import * as THREE from 'three';

export type WebGLRendererMode = 'preferred' | 'compatibility' | 'battery';

export interface WebGLRendererCreation {
  renderer: THREE.WebGLRenderer;
  mode: WebGLRendererMode;
  attempts: readonly WebGLRendererMode[];
}

export class WebGLRendererCreationError extends Error {
  readonly attempts: readonly WebGLRendererMode[];
  readonly causeMessage: string;

  constructor(attempts: readonly WebGLRendererMode[], cause: unknown) {
    super('WebGL renderer initialization failed');
    this.name = 'WebGLRendererCreationError';
    this.attempts = attempts;
    this.causeMessage = cause instanceof Error ? cause.message : String(cause ?? 'unknown');
  }
}

export interface WebGLRendererDependencies {
  createCanvas(): HTMLCanvasElement;
  createRenderer(parameters: THREE.WebGLRendererParameters): THREE.WebGLRenderer;
}

const DEFAULT_DEPENDENCIES: WebGLRendererDependencies = {
  createCanvas: () => document.createElement('canvas'),
  createRenderer: (parameters) => new THREE.WebGLRenderer(parameters),
};

export function releaseWebGLContext(context: WebGL2RenderingContext | null): void {
  context?.getExtension('WEBGL_lose_context')?.loseContext();
}

/**
 * Creates the real renderer directly. This intentionally avoids a throwaway
 * capability probe, which would consume an additional browser WebGL context.
 */
export function createResilientWebGLRenderer(
  options: Pick<THREE.WebGLRendererParameters, 'alpha'> = {},
  dependencies: WebGLRendererDependencies = DEFAULT_DEPENDENCIES
): WebGLRendererCreation {
  const attempts: WebGLRendererMode[] = [];
  let lastError: unknown;
  const variants: readonly {
    mode: WebGLRendererMode;
    parameters: THREE.WebGLRendererParameters;
  }[] = [
    {
      mode: 'preferred',
      parameters: {
        ...options,
        antialias: true,
        powerPreference: 'high-performance',
      },
    },
    {
      mode: 'compatibility',
      parameters: {
        ...options,
        antialias: false,
        powerPreference: 'default',
        depth: true,
        stencil: false,
        failIfMajorPerformanceCaveat: false,
      },
    },
    {
      mode: 'battery',
      parameters: {
        ...options,
        antialias: false,
        powerPreference: 'low-power',
        depth: true,
        stencil: false,
        failIfMajorPerformanceCaveat: false,
      },
    },
  ];

  for (const variant of variants) {
    attempts.push(variant.mode);
    const canvas = dependencies.createCanvas();
    let context: WebGL2RenderingContext | null = null;
    try {
      context = canvas.getContext('webgl2', variant.parameters as WebGLContextAttributes);
      if (!context) throw new Error('WebGL 2 context creation returned null');
      return {
        renderer: dependencies.createRenderer({
          ...variant.parameters,
          canvas,
          context,
        }),
        mode: variant.mode,
        attempts: [...attempts],
      };
    } catch (error) {
      lastError = error;
      releaseWebGLContext(context);
    }
  }

  throw new WebGLRendererCreationError(attempts, lastError);
}

export function describeWebGLContext(renderer: THREE.WebGLRenderer): {
  version: 'webgl2';
  antialias: boolean;
  powerPreference: WebGLPowerPreference;
} {
  const attributes = renderer.getContext().getContextAttributes();
  return {
    version: 'webgl2',
    antialias: attributes?.antialias ?? false,
    powerPreference: attributes?.powerPreference ?? 'default',
  };
}
