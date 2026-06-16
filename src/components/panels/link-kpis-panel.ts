import { h } from '../../lib/dom';
import { createPanelShell } from './panel';
import type { Component } from '../../lib/component';
import type { LinkFrame } from '../../spec/telemetry';

export function createLinkKPIsPanel(): Component {
  const kpi = (label: string, color: string, hint: string) => {
    const value = h('span', { class: 'metric-value', style: { color } });
    const hintEl = h('span', { class: 'kpi__hint', text: hint });
    const el = h('div', { class: 'kpi box--dark' }, h('span', { class: 'eyebrow eyebrow--dark', text: label }), value, hintEl);
    return { el, value, hintEl };
  };
  const ok = kpi('TRAMAS OK', 'var(--accent-green)', 'último minuto');
  const crc = kpi('ERRORES CRC', 'var(--accent-red)', '—');
  const tput = kpi('RENDIMIENTO', 'var(--accent-purple)', '0.6% del UART 115200');

  const { root, body } = createPanelShell({ title: 'Métricas de enlace', dark: true });
  body.classList.add('kpis');
  body.append(ok.el, crc.el, tput.el);

  return {
    el: root,
    update({ link }: { link: LinkFrame }) {
      const total = link.frames_ok + link.crc_errors;
      const pct = total > 0 ? ((link.crc_errors / total) * 100).toFixed(2) : '0.00';
      ok.value.textContent = link.frames_ok.toLocaleString();
      crc.value.textContent = String(link.crc_errors);
      crc.hintEl.textContent = `${pct}%`;
      tput.value.innerHTML = `${link.throughput_bps} <span class="unit">B/s</span>`;
    },
  };
}
