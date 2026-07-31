export type ExperienceState = 'loading' | 'hub' | 'transitioning' | 'destination';

export interface DestinationDefinition {
  id: string;
  label: string;
  prepare?(): Promise<void> | void;
  enter(): Promise<void> | void;
  exit?(): Promise<void> | void;
  dispose?(): void;
}

interface DestinationRouterOptions {
  onStateChange?(state: ExperienceState, destinationId: string | null): void;
  onTransitionError?(destination: DestinationDefinition, error: unknown): void;
}

export class DestinationRouter {
  private readonly destinations = new Map<string, DestinationDefinition>();
  private readonly options: DestinationRouterOptions;
  private active: DestinationDefinition | null = null;
  private transition: Promise<boolean> | null = null;
  private generation = 0;
  private disposed = false;
  private state: ExperienceState = 'loading';

  constructor(options: DestinationRouterOptions = {}) {
    this.options = options;
  }

  register(destination: DestinationDefinition): void {
    if (this.disposed) throw new Error('Cannot register a destination after disposal.');
    if (this.destinations.has(destination.id)) {
      throw new Error(`Destination "${destination.id}" is already registered.`);
    }
    this.destinations.set(destination.id, destination);
  }

  async startAt(id: string): Promise<void> {
    if (this.active || this.transition) throw new Error('Destination router has already started.');
    const destination = this.requireDestination(id);
    await destination.prepare?.();
    if (this.disposed) return;
    await destination.enter();
    if (this.disposed) return;
    this.active = destination;
    this.setState(id === 'hub' ? 'hub' : 'destination');
  }

  navigate(id: string): Promise<boolean> {
    if (this.disposed || this.active?.id === id) return Promise.resolve(false);
    if (this.transition) return this.transition;

    const destination = this.requireDestination(id);
    const transitionGeneration = ++this.generation;
    this.setState('transitioning');
    this.transition = this.runTransition(destination, transitionGeneration).finally(() => {
      if (this.generation === transitionGeneration) this.transition = null;
    });
    return this.transition;
  }

  private async runTransition(
    destination: DestinationDefinition,
    transitionGeneration: number
  ): Promise<boolean> {
    const previous = this.active;
    try {
      await destination.prepare?.();
      if (!this.isCurrent(transitionGeneration)) return false;
      await previous?.exit?.();
      if (!this.isCurrent(transitionGeneration)) return false;
      await destination.enter();
      if (!this.isCurrent(transitionGeneration)) return false;
      this.active = destination;
      this.setState(destination.id === 'hub' ? 'hub' : 'destination');
      return true;
    } catch (error) {
      if (!this.isCurrent(transitionGeneration)) return false;
      if (previous) {
        await previous.enter();
        if (!this.isCurrent(transitionGeneration)) return false;
        this.active = previous;
        this.setState(previous.id === 'hub' ? 'hub' : 'destination');
      }
      this.options.onTransitionError?.(destination, error);
      return false;
    }
  }

  private requireDestination(id: string): DestinationDefinition {
    const destination = this.destinations.get(id);
    if (!destination) throw new Error(`Unknown destination "${id}".`);
    return destination;
  }

  private isCurrent(generation: number): boolean {
    return !this.disposed && this.generation === generation;
  }

  private setState(state: ExperienceState): void {
    this.state = state;
    this.options.onStateChange?.(state, this.active?.id ?? null);
  }

  get currentState(): ExperienceState {
    return this.state;
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.generation += 1;
    this.destinations.forEach((destination) => destination.dispose?.());
    this.destinations.clear();
    this.active = null;
    this.transition = null;
  }
}
