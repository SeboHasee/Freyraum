import { createScopedDiagnostics } from '../utils/Diagnostics';

export interface DestinationTransitionConfig {
  durationMs?: number;
}

export interface Destination {
  id: string;
  preload?(): void | Promise<void>;
  enter(): void | Promise<void>;
  exit?(): void | Promise<void>;
  update?(time: number): boolean;
  transition?: DestinationTransitionConfig;
}

export interface NavigateOptions {
  transition?: boolean;
}

export interface DestinationTransition {
  cover(durationMs: number): Promise<void>;
  reveal(durationMs: number): Promise<void>;
  dispose(): void;
}

const DEFAULT_TRANSITION_MS = 650;

export class DestinationRegistry {
  private readonly destinations = new Map<string, Destination>();
  private readonly diagnostics = createScopedDiagnostics('destinations');
  private current: Destination | null = null;
  private navigating = false;

  constructor(private readonly transition: DestinationTransition) {}

  register(destination: Destination): void {
    if (this.destinations.has(destination.id)) {
      throw new Error(`Destination "${destination.id}" is already registered.`);
    }
    this.destinations.set(destination.id, destination);
  }

  async navigate(id: string, options: NavigateOptions = {}): Promise<boolean> {
    const target = this.destinations.get(id);
    if (!target) {
      this.diagnostics.warn('resolve-failed', 'Destination could not be resolved', { id });
      return false;
    }
    if (this.navigating || this.current?.id === id) return false;

    this.navigating = true;
    const useTransition = options.transition !== false && this.current !== null;
    const durationMs = target.transition?.durationMs ?? DEFAULT_TRANSITION_MS;

    try {
      await target.preload?.();
      if (useTransition) await this.transition.cover(durationMs);
      await this.current?.exit?.();
      await target.enter();
      this.current = target;
      if (useTransition) await this.transition.reveal(durationMs);
      this.diagnostics.info('navigation-complete', 'Destination navigation completed', { id });
      return true;
    } catch (error) {
      if (useTransition) await this.transition.reveal(durationMs);
      this.diagnostics.error('navigation-failed', 'Destination navigation failed', { id, error });
      return false;
    } finally {
      this.navigating = false;
    }
  }

  update(time: number): boolean {
    return this.current?.update?.(time) ?? false;
  }

  getCurrentId(): string | null {
    return this.current?.id ?? null;
  }

  dispose(): void {
    void this.current?.exit?.();
    this.current = null;
    this.destinations.clear();
    this.transition.dispose();
  }
}
