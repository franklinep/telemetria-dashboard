import { h } from '../../lib/dom';
import { MESSAGES } from '../../spec/messages';
import { createPanelShell } from './panel';
import type { Component } from '../../lib/component';
import type { BMSFrame } from '../../spec/telemetry';

const MAX_TEMP = 80;
const SCALE = [0, 20, 40, 60, 80];

export function createBMSTempsPanel(): Component {
  const rows = (['t1', 't2', 'tmos'] as const).map(() => {
    const fill = h('div', { class: 'htemps__fill' });
    const el = h(
      'div',
      { class: 'htemps__row' },
      h('div', { class: 'htemps__track box' }, fill),
      h('div', { class: 'htemps__scale' }, ...SCALE.map((s) => h('span', { text: String(s) }))),
    );
    return { el, fill };
  });

  const { root, body } = createPanelShell({ title: 'Temperaturas BMS (t1, t2, tmos)' });
  body.classList.add('htemps');
  body.append(
    ...rows.map((r) => r.el),
    h('p', { class: 'htemps__note box' }, h('span', {
      html: `Offset -50°C ya aplicado en firmware (§1.3)<br>Frecuencia: ${MESSAGES.BMS.hz} Hz · ${MESSAGES.BMS.periodMs / 1000} s entre frames`,
    })),
  );

  return {
    el: root,
    update({ bms }: { bms: BMSFrame }) {
      const temps = [bms.t1_c, bms.t2_c, bms.tmos_c];
      rows.forEach((r, i) => { r.fill.style.width = `${(temps[i] / MAX_TEMP) * 100}%`; });
    },
  };
}
