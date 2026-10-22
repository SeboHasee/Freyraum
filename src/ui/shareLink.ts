/**
 * v1.46 — share the current artwork link (see `src/navigation/deepLink.ts`).
 * Uses the system share sheet where available (phones), otherwise copies the
 * link. Every failure is reported, never thrown.
 */
export type ShareLinkResult = 'shared' | 'copied' | 'cancelled' | 'failed';

export async function shareLink(url: string, title: string): Promise<ShareLinkResult> {
  const nav = typeof navigator === 'undefined' ? null : navigator;
  if (nav && typeof nav.share === 'function') {
    try {
      await nav.share({ title, url });
      return 'shared';
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return 'cancelled';
      // Fall through to copying (e.g. NotAllowedError without user activation).
    }
  }
  if (nav?.clipboard && typeof nav.clipboard.writeText === 'function') {
    try {
      await nav.clipboard.writeText(url);
      return 'copied';
    } catch {
      return 'failed';
    }
  }
  return 'failed';
}

export function shareLinkFeedback(result: ShareLinkResult): string | null {
  switch (result) {
    case 'copied':
      return 'Link kopiert';
    case 'failed':
      return 'Link konnte nicht geteilt werden';
    default:
      return null;
  }
}
