import { h } from '../../lib/dom';
import { MESSAGES, MESSAGE_ORDER, toHexId } from '../../spec/messages';
import { createPanelShell } from './panel';
import type { Component } from '../../lib/component';
import type { LinkFrame } from '../../spec/telemetry';

export function createFrameCountsPanel(): Component {
  const rows = MESSAGE_ORDER.map((name) => {
    const spec = MESSAGES[name];
    const max = Math.round(spec.hz * 60); // hz × 60 s
    const fill = h('div', { class: 'counts__fill', style: { background: spec.accentVar } });
    const num = h('span', { class: 'counts__num', text: '0' });
    const el = h(
      'div',
      { class: 'counts__row' },
      h('span', { class: 'counts__id', text: `${name} ${toHexId(spec.id)}`, style: { color: spec.accentVar } }),
      h('div', { class: 'counts__track box--dark' }, fill),
      num,
    );
    return { el, fill, num, name, max };
  });

  const { root, body } = createPanelShell({ title: 'Tramas/MSG_ID · últimos 60 s', dark: true });
  body.classList.add('counts');
  body.append(...rows.map((r) => r.el));

  return {
    el: root,
    update({ link }: { link: LinkFrame }) {
      for (const r of rows) {
        const count = link.frame_counts[r.name] ?? 0;
        r.num.textContent = String(count);
        r.fill.style.width = `${Math.min(100, (count / r.max) * 100)}%`;
      }
    },
  };
}
