import { h } from '../../lib/dom';
import { mvToV } from '../../lib/format';
import { cellColor } from '../../lib/bms';
import { panelSubtitle } from '../../spec/messages';
import { createPanelShell } from './panel';
import type { Component } from '../../lib/component';
import type { BMSFrame } from '../../spec/telemetry';

const CELL_COUNT = 8;

export function createBMSCellsPanel(): Component {
  const cells = Array.from({ length: CELL_COUNT }, (_, i) => {
    const val = h('span', { class: 'cell__val', text: '—' });
    const fill = h('div', { class: 'cell__fill' });
    const el = h(
      'div',
      { class: 'cell' },
      val,
      h('div', { class: 'cell__track box' }, fill),
      h('span', { class: 'cell__label', text: `C${i + 1}` }),
    );
    return { el, val, fill };
  });

  const temp = (label: string) => {
    const val = h('span', { class: 'temp__val', text: '—' });
    const el = h('div', { class: 'temp box' }, h('span', { class: 'eyebrow', text: label }), val);
    return { el, val };
  };
  const t1 = temp('T1'), t2 = temp('T2'), tmos = temp('TMOS');

  const { root, body } = createPanelShell({ title: 'Celdas BMS', subtitle: panelSubtitle('BMS', '8 × Li-ion') });
  body.classList.add('cells');
  body.append(
    h('div', { class: 'cells__bars' }, ...cells.map((c) => c.el)),
    h('div', { class: 'cells__temps' }, t1.el, t2.el, tmos.el),
  );

  return {
    el: root,
    update({ bms }: { bms: BMSFrame }) {
      const ref = bms.cell_max_mv;
      bms.cells_mv.forEach((mv, i) => {
        const c = cells[i];
        c.val.textContent = mvToV(mv);
        c.fill.style.height = `${(mv / ref) * 80}%`;
        c.fill.style.background = cellColor(mv, bms);
      });
      t1.val.textContent = `${bms.t1_c}°C`;
      t2.val.textContent = `${bms.t2_c}°C`;
      tmos.val.textContent = `${bms.tmos_c}°C`;
    },
  };
}
