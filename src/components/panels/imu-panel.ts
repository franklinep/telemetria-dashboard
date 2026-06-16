import { h } from '../../lib/dom';
import { fixed } from '../../lib/format';
import { panelSubtitle } from '../../spec/messages';
import { createPanelShell } from './panel';
import type { Component } from '../../lib/component';
import type { IMUFrame } from '../../spec/telemetry';

function drawHorizon(ctx: CanvasRenderingContext2D, w: number, h: number, roll: number, pitch: number): void {
  const cx = w / 2, cy = h / 2;
  const r = Math.min(w, h) / 2 - 4;
  ctx.clearRect(0, 0, w, h);
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((roll * Math.PI) / 180);
  const pitchOffset = (pitch / 90) * r;

  ctx.fillStyle = '#3B82F6';
  ctx.fillRect(-r * 2, -r * 2, r * 4, r * 2 + pitchOffset);
  ctx.fillStyle = '#92400E';
  ctx.fillRect(-r * 2, pitchOffset, r * 4, r * 2);

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-r * 2, pitchOffset);
  ctx.lineTo(r * 2, pitchOffset);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.lineWidth = 1;
  for (let i = -4; i <= 4; i++) {
    if (i === 0) continue;
    const y = pitchOffset - (i * r) / 5;
    const len = i % 2 === 0 ? r * 0.35 : r * 0.2;
    ctx.beginPath();
    ctx.moveTo(-len, y);
    ctx.lineTo(len, y);
    ctx.stroke();
  }
  ctx.restore();

  ctx.strokeStyle = '#EF4444';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.4, cy); ctx.lineTo(cx - r * 0.1, cy);
  ctx.moveTo(cx + r * 0.1, cy); ctx.lineTo(cx + r * 0.4, cy);
  ctx.moveTo(cx, cy - r * 0.08); ctx.lineTo(cx, cy + r * 0.08);
  ctx.stroke();

  ctx.strokeStyle = '#374151';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

export function createIMUPanel(): Component {
  const canvas = h('canvas', { class: 'imu__canvas', attrs: { width: '220', height: '220' } });
  const ctx = canvas.getContext('2d')!;

  const row = (lbl: string) => {
    const val = h('span', { class: 'imu__val', text: '—' });
    const el = h('div', { class: 'imu__row box' }, h('span', { class: 'imu__lbl', text: lbl }), val);
    return { el, val };
  };
  const roll = row('ROLL ↻');
  const pitch = row('PITCH ↕');
  const yaw = row('YAW ↺');

  const values = h(
    'div',
    { class: 'imu__values' },
    roll.el, pitch.el, yaw.el,
    h('div', { class: 'imu__meta box' }, h('span', { text: 'res 0.01°/LSB' }), h('span', { text: 'escala ×100 int16' })),
  );

  const { root, body } = createPanelShell({ title: 'Actitud IMU', subtitle: panelSubtitle('IMU', 'BNO086') });
  body.classList.add('imu');
  body.append(canvas, values);

  return {
    el: root,
    update({ imu }: { imu: IMUFrame }) {
      drawHorizon(ctx, canvas.width, canvas.height, imu.roll_deg, imu.pitch_deg);
      roll.val.textContent = `${fixed(imu.roll_deg)}°`;
      pitch.val.textContent = `${fixed(imu.pitch_deg)}°`;
      yaw.val.textContent = `${fixed(imu.yaw_deg)}°`;
    },
  };
}
