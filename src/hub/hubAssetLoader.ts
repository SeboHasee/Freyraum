import {
  getBackgroundFallbackCandidate,
  isHubAssetNotFoundStatus,
  isReferenceOnlyHubAssetPath,
} from './backgroundFallback';

type HubAssetRole = 'background' | 'reference';
type HubAssetAttemptRole = 'primary' | 'fallback';
type HubAssetFailureReason = 'http-error' | 'image-error' | 'timeout' | 'probe-timeout' | 'network-error';

interface HubAssetDiagnostics {
  warn(event: string, message: string, data?: unknown): void;
}

export interface HubAssetLoadOutcome {
  status: 'loaded' | 'fallback-loaded' | 'neutral-fallback';
  finalPath: string | null;
  finalUrl: string | null;
  httpStatus: number | null;
}

export interface HubAssetLoadOptions {
  image: HTMLImageElement;
  role: HubAssetRole;
  primaryPath: string;
  primaryUrl: string;
  fallbackPath?: string;
  fallbackUrl?: string;
  timeoutMs: number;
  diagnostics: HubAssetDiagnostics;
  context?: Record<string, unknown>;
  onNeutralFallback?: () => void;
}

interface HubAssetAttempt {
  role: HubAssetAttemptRole;
  path: string;
  url: string;
}

interface HubAssetProbeResult {
  ok: boolean | null;
  status: number | null;
  reason: 'ok' | 'unsupported' | 'probe-timeout' | 'network-error' | 'http-error';
}

interface HubAssetImageLoadResult {
  status: 'loaded' | 'error' | 'timeout';
}

export async function probeHubAssetAvailability(
  url: string,
  timeoutMs: number
): Promise<HubAssetProbeResult> {
  if (typeof window === 'undefined' || typeof window.fetch !== 'function') {
    return { ok: null, status: null, reason: 'unsupported' };
  }

  let protocol = '';
  try {
    protocol = new URL(url, window.location.href).protocol;
  } catch {
    return { ok: null, status: null, reason: 'unsupported' };
  }
  if (protocol !== 'http:' && protocol !== 'https:') {
    return { ok: null, status: null, reason: 'unsupported' };
  }

  const controller = typeof AbortController === 'function' ? new AbortController() : null;
  const timeout = window.setTimeout(() => controller?.abort(), Math.max(250, Math.min(timeoutMs, 4000)));
  try {
    const response = await window.fetch(url, {
      method: 'HEAD',
      cache: 'no-store',
      signal: controller?.signal,
    });
    if (response.status === 405 || response.status === 501) {
      return { ok: null, status: response.status, reason: 'unsupported' };
    }
    return {
      ok: response.ok,
      status: response.status,
      reason: response.ok ? 'ok' : 'http-error',
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return { ok: null, status: null, reason: 'probe-timeout' };
    }
    return { ok: null, status: null, reason: 'network-error' };
  } finally {
    window.clearTimeout(timeout);
  }
}

function waitForImageLoad(
  image: HTMLImageElement,
  url: string,
  timeoutMs: number
): Promise<HubAssetImageLoadResult> {
  return new Promise((resolve) => {
    let settled = false;
    const complete = (status: HubAssetImageLoadResult['status']): void => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      image.removeEventListener('load', handleLoad);
      image.removeEventListener('error', handleError);
      resolve({ status });
    };
    const handleLoad = (): void => complete('loaded');
    const handleError = (): void => complete('error');
    const timeout = window.setTimeout(() => complete('timeout'), timeoutMs);
    image.addEventListener('load', handleLoad);
    image.addEventListener('error', handleError);
    image.src = url;
  });
}

function describeHttpReason(status: number | null): string {
  if (status === null) return 'http-error';
  if (isHubAssetNotFoundStatus(status)) return 'http-404';
  return `http-${status}`;
}

function buildWarningPayload(
  options: HubAssetLoadOptions,
  attempt: HubAssetAttempt,
  reason: HubAssetFailureReason,
  httpStatus: number | null
): Record<string, unknown> {
  return {
    assetRole: options.role,
    attempt: attempt.role,
    path: attempt.path,
    url: attempt.url,
    primaryPath: options.primaryPath,
    primaryUrl: options.primaryUrl,
    fallbackPath: options.fallbackPath ?? null,
    fallbackUrl: options.fallbackUrl ?? null,
    httpStatus,
    reason,
    referenceOnly: isReferenceOnlyHubAssetPath(attempt.path),
    context: options.context ?? null,
  };
}

function buildFallbackAttempt(options: HubAssetLoadOptions, fallbackAttempted: boolean): HubAssetAttempt | null {
  const candidateUrl = getBackgroundFallbackCandidate(
    options.primaryUrl,
    options.fallbackUrl ?? '',
    fallbackAttempted
  );
  if (!candidateUrl || !options.fallbackPath) return null;
  return {
    role: 'fallback',
    path: options.fallbackPath,
    url: candidateUrl,
  };
}

function logPrimaryFailure(
  options: HubAssetLoadOptions,
  attempt: HubAssetAttempt,
  reason: HubAssetFailureReason,
  httpStatus: number | null
): void {
  const descriptor =
    reason === 'timeout' || reason === 'probe-timeout'
      ? 'timed out'
      : reason === 'network-error'
        ? 'could not be reached'
        : isHubAssetNotFoundStatus(httpStatus)
          ? 'returned 404'
          : `returned ${describeHttpReason(httpStatus)}`;
  options.diagnostics.warn(
    'hub-asset-missing',
    `Hub ${options.role} asset ${descriptor}; retrying shipped fallback without aborting`,
    buildWarningPayload(options, attempt, reason, httpStatus)
  );
}

function logTerminalFailure(
  options: HubAssetLoadOptions,
  attempt: HubAssetAttempt,
  reason: HubAssetFailureReason,
  httpStatus: number | null
): void {
  const descriptor =
    reason === 'timeout' || reason === 'probe-timeout'
      ? 'timed out'
      : reason === 'network-error'
        ? 'could not be reached'
        : isHubAssetNotFoundStatus(httpStatus)
          ? 'returned 404'
          : `returned ${describeHttpReason(httpStatus)}`;
  options.diagnostics.warn(
    'hub-asset-fallback-failed',
    attempt.role === 'fallback'
      ? `Hub ${options.role} asset and fallback ${descriptor}; continuing with neutral museum-grey surface`
      : `Hub ${options.role} asset ${descriptor}; continuing with neutral museum-grey surface`,
    buildWarningPayload(options, attempt, reason, httpStatus)
  );
}

async function tryLoadHubAssetAttempt(
  options: HubAssetLoadOptions,
  attempt: HubAssetAttempt
): Promise<{ status: 'loaded'; httpStatus: number | null } | { status: 'failed'; reason: HubAssetFailureReason; httpStatus: number | null }> {
  const probe = await probeHubAssetAvailability(attempt.url, options.timeoutMs);
  if (probe.ok === false) {
    return { status: 'failed', reason: 'http-error', httpStatus: probe.status };
  }

  const imageResult = await waitForImageLoad(options.image, attempt.url, options.timeoutMs);
  if (imageResult.status === 'loaded') {
    return { status: 'loaded', httpStatus: probe.status };
  }
  if (imageResult.status === 'timeout') {
    return { status: 'failed', reason: probe.reason === 'probe-timeout' ? 'probe-timeout' : 'timeout', httpStatus: probe.status };
  }
  if (probe.reason === 'network-error') {
    return { status: 'failed', reason: 'network-error', httpStatus: probe.status };
  }
  return { status: 'failed', reason: 'image-error', httpStatus: probe.status };
}

export async function loadHubImageAsset(options: HubAssetLoadOptions): Promise<HubAssetLoadOutcome> {
  let attempt: HubAssetAttempt | null = {
    role: 'primary',
    path: options.primaryPath,
    url: options.primaryUrl,
  };
  let fallbackAttempted = false;
  let lastHttpStatus: number | null = null;

  while (attempt) {
    const result = await tryLoadHubAssetAttempt(options, attempt);
    if (result.status === 'loaded') {
      return {
        status: attempt.role === 'primary' ? 'loaded' : 'fallback-loaded',
        finalPath: attempt.path,
        finalUrl: attempt.url,
        httpStatus: result.httpStatus,
      };
    }

    lastHttpStatus = result.httpStatus;
    const fallbackAttempt = buildFallbackAttempt(options, fallbackAttempted);
    if (attempt.role === 'primary' && fallbackAttempt) {
      fallbackAttempted = true;
      logPrimaryFailure(options, attempt, result.reason, result.httpStatus);
      attempt = fallbackAttempt;
      continue;
    }

    logTerminalFailure(options, attempt, result.reason, result.httpStatus);
    options.onNeutralFallback?.();
    return {
      status: 'neutral-fallback',
      finalPath: null,
      finalUrl: null,
      httpStatus: lastHttpStatus,
    };
  }

  options.onNeutralFallback?.();
  return {
    status: 'neutral-fallback',
    finalPath: null,
    finalUrl: null,
    httpStatus: lastHttpStatus,
  };
}
