import { h } from '../../lib/dom';
import { fixed } from '../../lib/format';
import { socColor } from '../../lib/bms';
import { createPanelShell } from './panel';
import type { Component } from '../../lib/component';
import type { BATFrame, BMSFrame } from '../../spec/telemetry';

export function createPackSummaryPanel(): Component {
  const item = (label: string, color: string, hint: string) => {
    const value = h('span', { class: 'metric-value', style: { color } });
    const hintEl = h('span', { class: 'summary__hint', text: hint });
    const el = h('div', { class: 'summary__item box' }, h('span', { class: 'eyebrow', text: label }), value, hintEl);
    return { el, value, hintEl };
  };
  const voltage = item('VOLTAJE', 'var(--accent-green)', 'vbat ×100');
  const soc = item('ESTADO DE CARGA', 'var(--accent-green)', 'uint8 raw');
  const delta = item('Δ CELDA', 'var(--accent-orange)', '—');

  const { root, body } = createPanelShell({ title: 'Resumen del paquete' });
  body.classList.add('summary');
  body.append(voltage.el, soc.el, delta.el);

  return {
    el: root,
    update({ bat, bms }: { bat: BATFrame; bms: BMSFrame }) {
      voltage.value.innerHTML = `${fixed(bat.vbat_v)} <span class="unit">V</span>`;
      soc.value.innerHTML = `${bat.soc_pct} <span class="unit">%</span>`;
      soc.value.style.color = socColor(bat.soc_pct);
      delta.value.innerHTML = `${bms.cell_delta_mv} <span class="unit">mV</span>`;
      delta.hintEl.textContent = `mín ${bms.cell_min_mv} mV · máx ${bms.cell_max_mv} mV`;
    },
  };
}
