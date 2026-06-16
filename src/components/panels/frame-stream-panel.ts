import { h, clear } from '../../lib/dom';
import { accentOf } from '../../spec/messages';
import { createPanelShell } from './panel';
import type { Component } from '../../lib/component';
import type { LinkFrame } from '../../spec/telemetry';

const MAX_ROWS = 18;

export function createFrameStreamPanel(): Component {
  const stream = h('div', { class: 'stream' });

  const { root, body } = createPanelShell({ title: 'Flujo de tramas crudas', subtitle: 'prefijo 0xAA · big-endian', dark: true });
  body.append(stream);

  return {
    el: root,
    update({ link }: { link: LinkFrame }) {
      clear(stream);
      for (const entry of link.raw_log.slice(0, MAX_ROWS)) {
        stream.appendChild(h(
          'div',
          { class: 'stream__entry' },
          h('span', { class: 'stream__ts', text: entry.ts }),
          h('span', { class: 'stream__id', text: entry.msg_id, style: { color: accentOf(entry.msg_id) } }),
          h('span', { class: 'stream__hex', text: entry.hex }),
          h('span', { class: `stream__status stream__status--${entry.crc_ok ? 'ok' : 'err'}`, text: entry.crc_ok ? 'OK' : 'CRC' }),
        ));
      }
    },
  };
}
