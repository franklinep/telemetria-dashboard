import { h } from '../../lib/dom';
import { mvToV } from '../../lib/format';
import { cellColor } from '../../lib/bms';
import { createPanelShell } from './panel';
import type { Component } from '../../lib/component';
import type { BMSFrame } from '../../spec/telemetry';

const CELL_COUNT = 8;

export function createPerCellPanel(): Component {
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

  const { root, body } = createPanelShell({ title: 'Voltaje por celda', subtitle: '8 × Li-ion' });
  body.classList.add('cells');
  body.append(h('div', { class: 'cells__bars' }, ...cells.map((c) => c.el)));

  return {
    el: root,
    update({ bms }: { bms: BMSFrame }) {
      const ref = bms.cell_max_mv;
      bms.cells_mv.forEach((mv, i) => {
        const c = cells[i];
        c.val.textContent = mvToV(mv);
        c.fill.style.height = `${(mv / ref) * 75}%`;
        c.fill.style.background = cellColor(mv, bms);
      });
    },
  };
}
