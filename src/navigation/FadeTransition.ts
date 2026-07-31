import type { DestinationTransition } from './DestinationRegistry';

const waitForOpacity = (element: HTMLElement, durationMs: number): Promise<void> =>
  new Promise((resolve) => {
    let settled = false;
    const finish = (): void => {
      if (settled) return;
      settled = true;
      element.removeEventListener('transitionend', onTransitionEnd);
      window.clearTimeout(timeoutId);
      resolve();
    };
    const onTransitionEnd = (event: TransitionEvent): void => {
      if (event.target === element && event.propertyName === 'opacity') finish();
    };
    const timeoutId = window.setTimeout(finish, durationMs + 100);
    element.addEventListener('transitionend', onTransitionEnd);
  });

export class FadeTransition implements DestinationTransition {
  private readonly element: HTMLDivElement;

  constructor(container: HTMLElement) {
    this.element = document.createElement('div');
    this.element.className = 'destination-transition';
    this.element.setAttribute('aria-hidden', 'true');
    container.appendChild(this.element);
  }

  async cover(durationMs: number): Promise<void> {
    this.element.style.setProperty('--destination-transition-ms', `${durationMs}ms`);
    this.element.classList.add('is-active');
    await waitForOpacity(this.element, durationMs);
  }

  async reveal(durationMs: number): Promise<void> {
    this.element.style.setProperty('--destination-transition-ms', `${durationMs}ms`);
    this.element.classList.remove('is-active');
    await waitForOpacity(this.element, durationMs);
  }

  dispose(): void {
    this.element.remove();
  }
}
