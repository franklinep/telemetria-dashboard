import {
  Chart, LineController, LineElement, PointElement,
  LinearScale, CategoryScale, Filler, Tooltip,
} from 'chart.js';
import { h } from '../../lib/dom';
import { createPanelShell } from './panel';
import type { Component } from '../../lib/component';
import type { TelemetrySnapshot } from '../../spec/telemetry';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip);

const HISTORY_LEN = 60;
const LABELS = Array.from({ length: HISTORY_LEN }, (_, i) => (i % 10 === 0 ? String(i) : ''));

function makeChart(canvas: HTMLCanvasElement, color: string, fillRgba: string, unit: string): Chart {
  return new Chart(canvas, {
    type: 'line',
    data: {
      labels: LABELS,
      datasets: [{ data: [], borderColor: color, backgroundColor: fillRgba, borderWidth: 1.5, pointRadius: 0, fill: true, tension: 0.3 }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      scales: {
        x: { display: false },
        y: {
          ticks: { font: { family: 'JetBrains Mono', size: 9 }, color: '#9CA0A8', maxTicksLimit: 5 },
          grid: { color: '#D9DBDF' },
          border: { display: false },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (c) => `${(c.parsed.y as number).toFixed(2)} ${unit}` } },
      },
    },
  });
}

export function createVoltChartPanel(): Component {
  const vCanvas = h('canvas');
  const iCanvas = h('canvas');

  const { root, body } = createPanelShell({ title: 'Voltaje y Corriente', subtitle: 'últimos 60 s' });
  body.classList.add('chart');
  body.append(
    h('div', { class: 'chart__row' }, h('span', { class: 'chart__ylabel', text: 'V' }), h('div', { class: 'chart__canvas-wrap' }, vCanvas)),
    h('div', { class: 'chart__row' }, h('span', { class: 'chart__ylabel', text: 'A' }), h('div', { class: 'chart__canvas-wrap' }, iCanvas)),
    h('span', { class: 'chart__xlabel', text: 'Muestras' }),
  );

  const vChart = makeChart(vCanvas, '#22C55E', 'rgba(34,197,94,0.08)', 'V');
  const iChart = makeChart(iCanvas, '#F97316', 'rgba(249,115,22,0.08)', 'A');

  return {
    el: root,
    update(snap: TelemetrySnapshot) {
      vChart.data.datasets[0].data = snap.vbat_history;
      iChart.data.datasets[0].data = snap.ibat_history;
      vChart.update('none');
      iChart.update('none');
    },
    destroy() {
      vChart.destroy();
      iChart.destroy();
    },
  };
}
