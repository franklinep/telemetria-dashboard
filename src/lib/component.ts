import type { TelemetrySnapshot } from '../spec/telemetry';

export interface Component {
  readonly el: HTMLElement;
  update(snap: TelemetrySnapshot): void;
  destroy?(): void;
}

export interface View extends Component {
  readonly id: string;
  readonly tabLabel: string;
  readonly title: string;
  readonly subtitle?: string;
  readonly dark?: boolean;
}
