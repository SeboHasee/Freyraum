/**
 * v0.11 — hint copy driven by capability-based pointer detection.
 *
 * Reads `<html data-pointer-primary>` (written by `applyDeviceCaps()`
 * in `src/utils/device.ts`) and swaps the localised hint copy between
 * fine-pointer (mouse wheel / drag) and coarse-pointer (swipe / pinch)
 * audiences. SCSS hides the hint outright on `phone-portrait` and
 * `phone-small` because vertical space is too scarce.
 *
 * The element remains `aria-hidden="true"` because it is decorative
 * (controls are also available via real buttons and keyboard).
 */
export class HintText {
  private readonly el: HTMLElement;

  constructor(container: HTMLElement) {
    this.el = document.createElement('p');
    this.el.className = 'hint-text';
    this.el.setAttribute('aria-hidden', 'true');
    this.updateHint();
    container.appendChild(this.el);
  }

  /**
   * Re-read `<html data-pointer-primary>` and update the copy.
   * Called from the constructor and from `main.ts` after a debounced
   * resize, so swapping pointer types (e.g. plugging a mouse into a
   * touch laptop) updates the hint at the next resize event.
   */
  updateHint(): void {
    const pointer = document.documentElement.dataset['pointerPrimary'] ?? 'fine';
    this.el.textContent =
      pointer === 'coarse'
        ? 'Wischen zum Navigieren · Zwei Finger zum Zoomen.'
        : 'Scrollen zum Zoomen · Ziehen zum freien Bewegen.';
  }

  dispose(): void {
    this.el.remove();
  }
}
