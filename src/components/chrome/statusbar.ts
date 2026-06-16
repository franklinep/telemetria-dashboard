import { h } from '../../lib/dom';
import { icon } from '../../lib/icons';
import { fmtUptime, pad3 } from '../../lib/format';
import type { ConnectionState } from '../../services/telemetry-service';
import type { SYSFrame } from '../../spec/telemetry';

export function createStatusbar(initialSubtitle?: string) {
  const dot = h('span', { class: 'statusbar__dot statusbar__dot--disconnected' });
  const meta = h('span', { class: 'statusbar__meta', text: '—' });
  const subtitle = h('span', { class: 'statusbar__subtitle', text: initialSubtitle ?? '' });

  const el = h(
    'div',
    { class: 'statusbar' },
    h(
      'div',
      { class: 'statusbar__left' },
      h('span', { class: 'statusbar__brand' }, icon('activity', { size: 15, stroke: 'var(--brand-yellow)' })),
      h('span', { class: 'statusbar__section', text: 'Tablero' }),
      subtitle,
    ),
    h('div', { class: 'statusbar__right' }, dot, meta),
  );

  return {
    el,
    setSubtitle(text?: string): void {
      subtitle.textContent = text ?? '';
    },
    setConnection(state: ConnectionState): void {
      dot.className = `statusbar__dot statusbar__dot--${state}`;
    },
    update(sys: SYSFrame): void {
      meta.textContent = `HB ${pad3(sys.heartbeat)} · ACTIVO ${fmtUptime(sys.uptime_ms)} · RSSI ${sys.rssi_dbm} dBm`;
    },
  };
}
