import { h } from '../../lib/dom';
import { createPanelShell } from './panel';
import type { Component } from '../../lib/component';
import type { SYSFrame } from '../../spec/telemetry';

const RSSI_MIN = -120, RSSI_MAX = -30;
const START = Math.PI * 0.75, END = Math.PI * 2.25;
const ARC = END - START;
const TICKS = [-120, -90, -60, -30];

function qualityColor(rssi: number): string {
  if (rssi > -70) return '#22C55E';
  if (rssi > -90) return '#FACC15';
  return '#E74C3C';
}

function drawGauge(ctx: CanvasRenderingContext2D, w: number, h: number, rssi: number): void {
  const cx = w / 2, cy = h * 0.62, r = Math.min(w, h) * 0.4;
  const norm = Math.max(0, Math.min(1, (rssi - RSSI_MIN) / (RSSI_MAX - RSSI_MIN)));
  const needle = START + norm * ARC;
  ctx.clearRect(0, 0, w, h);

  ctx.beginPath();
  ctx.arc(cx, cy, r, START, END);
  ctx.strokeStyle = '#2A2C32';
  ctx.lineWidth = 12;
  ctx.lineCap = 'round';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, r, START, needle);
  ctx.strokeStyle = qualityColor(rssi);
  ctx.lineWidth = 12;
  ctx.stroke();

  ctx.font = '10px JetBrains Mono, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const val of TICKS) {
    const a = START + ((val - RSSI_MIN) / (RSSI_MAX - RSSI_MIN)) * ARC;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * (r - 18), cy + Math.sin(a) * (r - 18));
    ctx.lineTo(cx + Math.cos(a) * (r + 8), cy + Math.sin(a) * (r + 8));
    ctx.strokeStyle = '#454850';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#6B6E76';
    ctx.fillText(String(val), cx + Math.cos(a) * (r - 32), cy + Math.sin(a) * (r - 32));
  }

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(needle);
  ctx.beginPath();
  ctx.moveTo(-6, 0);
  ctx.lineTo(r - 20, 0);
  ctx.strokeStyle = '#F97316';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  ctx.beginPath();
  ctx.arc(cx, cy, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#9CA0A8';
  ctx.fill();
}

export function createRSSIGaugePanel(): Component {
  const canvas = h('canvas', { class: 'gauge__canvas', attrs: { width: '280', height: '200' } });
  const ctx = canvas.getContext('2d')!;
  const value = h('div', { class: 'gauge__value', text: '—' });

  const { root, body } = createPanelShell({ title: 'RSSI — XBee S3B Pro', dark: true });
  body.classList.add('gauge');
  body.append(canvas, value);

  return {
    el: root,
    update({ sys }: { sys: SYSFrame }) {
      drawGauge(ctx, canvas.width, canvas.height, sys.rssi_dbm);
      value.textContent = `${sys.rssi_dbm} dBm`;
    },
  };
}
