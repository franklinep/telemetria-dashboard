import { h } from '../../lib/dom';
import { fixed } from '../../lib/format';
import { toHexId, MESSAGES } from '../../spec/messages';
import { createPanelShell } from './panel';
import type { Component } from '../../lib/component';
import type { ENVFrame, SYSFrame } from '../../spec/telemetry';

const FLAGS: { key: keyof SYSFrame; label: string }[] = [
  { key: 'imu_ok', label: 'IMU' },
  { key: 'sht_ok', label: 'SHT' },
  { key: 'lps_ok', label: 'LPS' },
  { key: 'gps_ok', label: 'GPS' },
  { key: 'twai_ok', label: 'TWAI' },
  { key: 'sd_ok', label: 'SD' },
];

export function createENVPanel(): Component {
  const card = (label: string, color: string) => {
    const value = h('span', { class: 'metric-value', style: { color } });
    const el = h('div', { class: 'env__card box' }, h('span', { class: 'eyebrow', text: label }), value);
    return { el, value };
  };
  const temp = card('TEMP', 'var(--accent-cyan)');
  const hum = card('HUM', 'var(--accent-blue)');
  const pres = card('PRES', 'var(--accent-blue)');

  const flagDots = new Map<string, HTMLElement>();
  const flagGrid = h(
    'div',
    { class: 'env__flags-grid' },
    ...FLAGS.map(({ key, label }) => {
      const dot = h('span', { class: 'flag__dot' });
      flagDots.set(key, dot);
      return h('span', { class: 'flag' }, dot, h('span', { class: 'flag__label', text: label }));
    }),
  );

  const subtitle = `MSG ${toHexId(MESSAGES.ENV.id)} + ${toHexId(MESSAGES.SYS.id)}`;
  const { root, body } = createPanelShell({ title: 'Ambiente + Estados', subtitle });
  body.classList.add('env');
  body.append(
    h('div', { class: 'env__readings' }, temp.el, hum.el, pres.el),
    h(
      'div',
      { class: 'env__flags box' },
      h('span', { class: 'eyebrow', text: 'BANDERAS SYS · byte status_flags' }),
      flagGrid,
    ),
  );

  return {
    el: root,
    update({ env, sys }: { env: ENVFrame; sys: SYSFrame }) {
      temp.value.innerHTML = `${fixed(env.temp_c, 1)}<span class="unit">°C</span>`;
      hum.value.innerHTML = `${env.hum_pct}<span class="unit">%</span>`;
      pres.value.innerHTML = `${env.press_hpa.toFixed(0)}<span class="unit">hPa</span>`;
      for (const { key } of FLAGS) {
        const ok = sys[key] as boolean;
        flagDots.get(key)!.style.background = ok ? 'var(--accent-green)' : 'var(--accent-red)';
      }
    },
  };
}
