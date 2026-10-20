export function timelineContentFits(
  contentWidth: number,
  visibleWidth: number,
  arrowSpace: number,
  arrowsVisible: boolean
): boolean {
  return contentWidth <= visibleWidth + (arrowsVisible ? Math.max(0, arrowSpace) : 0) + 1;
}
