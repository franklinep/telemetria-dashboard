import { h } from '../../lib/dom';
import { fixed } from '../../lib/format';
import { socColor } from '../../lib/bms';
import { panelSubtitle } from '../../spec/messages';
import { createPanelShell } from './panel';
import type { Component } from '../../lib/component';
import type { BATFrame } from '../../spec/telemetry';

const SCALE = ['20.00', '21.34', '22.69', '24.03', '25.37', '26.71', '28.06', '29.40'];
const V_MIN = 20, V_MAX = 29.4;

export function createBatteryPanel(): Component {
  const fill = h('div', { class: 'bat__fill' });
  const voltage = h('div', { class: 'bat__voltage', text: '—' });

  const metric = (label: string, color: string) => {
    const value = h('span', { class: 'metric-value', style: { color } });
    const el = h('div', { class: 'bat__metric box' }, h('span', { class: 'eyebrow', text: label }), value);
    return { el, value };
  };
  const soc = metric('SOC', 'var(--accent-green)');
  const drain = metric('CONSUMO', 'var(--accent-orange)');
  const power = metric('POTENCIA', 'var(--accent-primary)');

  const { root, body } = createPanelShell({ title: 'Batería', subtitle: panelSubtitle('BAT', 'JK BMS CAN') });
  body.classList.add('bat');
  body.append(
    h('div', { class: 'bat__indicators' }, ...Array.from({ length: 5 }, () => h('div', { class: 'bat__indicator box' }))),
    h(
      'div',
      { class: 'bat__bar' },
      h('div', { class: 'bat__track box' }, fill),
      h('div', { class: 'bat__scale' }, ...SCALE.map((v) => h('span', { text: v }))),
      voltage,
    ),
    h('div', { class: 'bat__metrics' }, soc.el, drain.el, power.el),
  );

  return {
    el: root,
    update({ bat }: { bat: BATFrame }) {
      const pct = Math.min(100, Math.max(0, ((bat.vbat_v - V_MIN) / (V_MAX - V_MIN)) * 100));
      fill.style.width = `${pct}%`;
      voltage.textContent = `${fixed(bat.vbat_v)} V`;
      soc.value.textContent = `${bat.soc_pct} %`;
      soc.value.style.color = socColor(bat.soc_pct);
      drain.value.textContent = `${fixed(bat.ibat_a, 1)} A`;
      power.value.textContent = `${(bat.vbat_v * bat.ibat_a).toFixed(0)} W`;
    },
  };
}
