/**
 * v0.92 — shared, redacted source→decode→GPU→visible-pixels outcome contract.
 *
 * Both runtime routes (interactive gallery `TextureManager` and museum hub
 * `HubRoomRenderer`/`MainMuseumHub`) resolve an artwork image through the
 * same declared-image → embedded-fallback contract
 * (`resolveArtworkImageSources`), then must prove — not merely assume — that
 * the selected candidate reached decoded pixels, was uploaded to the GPU
 * within device capability, and (optionally, when a visible-pixel probe ran)
 * produced non-empty rendered output.
 *
 * This module defines that shared record shape plus a single diagnostics
 * entry point so a support engineer can find one terminal line per artwork
 * per route naming the first failed stage, or confirming full pixel proof.
 * The record intentionally carries only redacted URL types, ids, timings,
 * and dimensions — never raw URLs, data URIs, or image bytes.
 */

import type { ArtworkImageSourceMode, ArtworkImageUrlType } from './artworkImageSources';
import type { VisiblePixelProbeResult } from './sourceToPixelProbe';

export type SourceToPixelRoute = 'gallery' | 'hub';

export type SourceToPixelStage =
  | 'candidate-selected'
  | 'request'
  | 'decode'
  | 'compatibility-check'
  | 'gpu-upload'
  | 'visible-pixel-probe';

export type SourceToPixelResult = 'success' | 'failed';

export interface SourceToPixelOutcome {
  route: SourceToPixelRoute;
  artworkId: string;
  bundleId: string | null;
  runtimeProtocol: string | null;
  /** Source mode that ultimately produced the visible texture, or null if none did. */
  candidateMode: ArtworkImageSourceMode | null;
  resolvedUrlType: ArtworkImageUrlType | null;
  usedEmbeddedFallback: boolean;
  attemptedEmbeddedFallback: boolean;
  result: SourceToPixelResult;
  /** First stage that failed. Null when `result === 'success'`. */
  firstFailedStage: SourceToPixelStage | null;
  failureReason: string | null;
  elapsedMs: number;
  sourceWidth: number | null;
  sourceHeight: number | null;
  uploadWidth: number | null;
  uploadHeight: number | null;
  downscaleApplied: boolean;
  rendererMaxTextureSize: number | null;
  visibleProbe: VisiblePixelProbeResult | null;
}

export interface VisiblePixelProbePolicy {
  runtimeProtocol: string | null;
  resolvedUrlType: ArtworkImageUrlType | null;
  debugEnabled: boolean;
}

export function getRuntimeProtocol(): string | null {
  if (typeof window === 'undefined' || !window.location) return null;
  return window.location.protocol || null;
}

/**
 * Always allow developer-requested proof in verbose diagnostics, and require
 * proof automatically for file-preview `file://` artwork candidates because
 * that is the environment where a decoded image can still collapse into a
 * blank plane after upload.
 */
export function shouldRunVisiblePixelProbe(policy: VisiblePixelProbePolicy): boolean {
  if (policy.debugEnabled) return true;
  return policy.runtimeProtocol === 'file:' && policy.resolvedUrlType === 'file-url';
}

export function shouldRetryEmbeddedFallbackAfterPostUploadFailure(
  policy: VisiblePixelProbePolicy,
  hasEmbeddedFallback: boolean
): boolean {
  return hasEmbeddedFallback && shouldRunVisiblePixelProbe(policy);
}

/**
 * Records one terminal source-to-pixel outcome via the supplied scoped
 * diagnostics child. Successes log at `info`; failures (including a
 * generated-fallback terminal state) log at `warn` so they surface by
 * default outside verbose mode.
 */
export function recordSourceToPixelOutcome(
  diagnostics: { info(event: string, message: string, data?: unknown): void; warn(event: string, message: string, data?: unknown): void },
  outcome: SourceToPixelOutcome
): void {
  const log = outcome.result === 'success' ? diagnostics.info.bind(diagnostics) : diagnostics.warn.bind(diagnostics);
  const message =
    outcome.result === 'success'
      ? `${outcome.route === 'hub' ? 'Hub' : 'Gallery'} artwork proved source\u2192decode\u2192GPU\u2192pixels`
      : `${outcome.route === 'hub' ? 'Hub' : 'Gallery'} artwork failed source-to-pixel proof at ${outcome.firstFailedStage ?? 'unknown'} stage`;
  log('source-to-pixel-outcome', message, outcome);
}
