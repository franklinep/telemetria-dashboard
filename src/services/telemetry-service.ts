import type { TelemetrySnapshot } from '../spec/telemetry';

const POLL_MS = 500;
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

interface DataSource {
  fetch(tick: number): Promise<TelemetrySnapshot>;
}

class MockSource implements DataSource {
  async fetch(tick: number): Promise<TelemetrySnapshot> {
    const { generateSnapshot } = await import('../data/mock');
    return generateSnapshot(tick);
  }
}

class HttpSource implements DataSource {
  async fetch(): Promise<TelemetrySnapshot> {
    const res = await fetch('/api/telemetry/latest');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json() as Promise<TelemetrySnapshot>;
  }
}

export type ConnectionState = 'connected' | 'disconnected' | 'error';

type SnapshotListener = (snap: TelemetrySnapshot) => void;
type StateListener = (state: ConnectionState, detail?: string) => void;

export class TelemetryService {
  readonly isMock = USE_MOCK;

  private source: DataSource = USE_MOCK ? new MockSource() : new HttpSource();
  private timer: number | null = null;
  private tick = 0;
  private snapshotListeners = new Set<SnapshotListener>();
  private stateListeners = new Set<StateListener>();
  private _state: ConnectionState = 'disconnected';

  get state(): ConnectionState {
    return this._state;
  }

  onSnapshot(fn: SnapshotListener): () => void {
    this.snapshotListeners.add(fn);
    return () => this.snapshotListeners.delete(fn);
  }

  onState(fn: StateListener): () => void {
    this.stateListeners.add(fn);
    return () => this.stateListeners.delete(fn);
  }

  start(): void {
    if (this.timer !== null) return;
    void this.poll();
    this.timer = window.setInterval(() => void this.poll(), POLL_MS);
  }

  stop(): void {
    if (this.timer !== null) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
    this.setState('disconnected');
  }

  toggle(): void {
    this.timer === null ? this.start() : this.stop();
  }

  private async poll(): Promise<void> {
    try {
      const snap = await this.source.fetch(this.tick++);
      this.setState('connected');
      this.snapshotListeners.forEach((fn) => fn(snap));
    } catch (e) {
      this.setState('error', String(e));
    }
  }

  private setState(state: ConnectionState, detail?: string): void {
    if (state === this._state && state !== 'error') return;
    this._state = state;
    this.stateListeners.forEach((fn) => fn(state, detail));
  }
}
