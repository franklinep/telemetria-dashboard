import { h, clear } from '../../lib/dom';
import { icon, type IconName } from '../../lib/icons';
import type { ConnectionState } from '../../services/telemetry-service';

interface ToolbarItem {
  id: string;
  label: string;
  sub?: string[];
  icon: IconName;
  kind: 'source' | 'action';
  defaultActive?: boolean;
}

const ITEMS: ToolbarItem[] = [
  { id: 'csv', label: 'Abrir CSV', sub: ['Reproducir log SD'], icon: 'project', kind: 'action' },
  { id: 'uart', label: 'UART', sub: ['XBee 900 MHz'], icon: 'uart', kind: 'source', defaultActive: true },
  { id: 'preferences', label: 'Preferencias', icon: 'preferences', kind: 'action' },
  { id: 'about', label: 'Acerca de', icon: 'about', kind: 'action' },
];

export interface ToolbarHandlers {
  onSelectSource(id: string): void;
  onAction(id: string): void;
  onToggleConnection(): void;
}

export function createToolbar(handlers: ToolbarHandlers) {
  let activeSource = ITEMS.find((i) => i.defaultActive)?.id ?? '';
  const sourceButtons = new Map<string, HTMLButtonElement>();

  function renderItem(item: ToolbarItem): HTMLButtonElement {
    const isActive = item.kind === 'source' && item.id === activeSource;
    const btn = h(
      'button',
      {
        class: `toolbar__btn${isActive ? ' toolbar__btn--active' : ''}`,
        attrs: { title: item.label, type: 'button' },
        on: {
          click: () => {
            if (item.kind === 'source') {
              setActiveSource(item.id);
              handlers.onSelectSource(item.id);
            } else {
              handlers.onAction(item.id);
            }
          },
        },
      },
      h('span', { class: 'toolbar__icon' }, icon(item.icon, { size: 18 })),
      h(
        'span',
        { class: 'toolbar__text' },
        h('span', { class: 'toolbar__label', text: item.label }),
        item.sub
          ? h('span', { class: 'toolbar__sub' }, ...item.sub.map((s) => h('span', { text: s })))
          : null,
      ),
    );
    if (item.kind === 'source') sourceButtons.set(item.id, btn);
    return btn;
  }

  function setActiveSource(id: string): void {
    activeSource = id;
    for (const [key, btn] of sourceButtons) {
      btn.classList.toggle('toolbar__btn--active', key === id);
    }
  }

  const connectLabel = h('span', { class: 'toolbar__label', text: 'Desconectar' });
  const connectIcon = h('span', { class: 'toolbar__icon' }, icon('disconnect', { size: 18 }));
  const connectBtn = h(
    'button',
    {
      class: 'toolbar__btn toolbar__btn--connect',
      dataset: { state: 'connected' },
      attrs: { title: 'Conectar / Desconectar telemetría', type: 'button' },
      on: { click: () => handlers.onToggleConnection() },
    },
    connectIcon,
    connectLabel,
  );

  const el = h(
    'div',
    { class: 'toolbar' },
    h('div', { class: 'toolbar__group' }, ...ITEMS.map(renderItem)),
    connectBtn,
  );

  return {
    el,
    setConnectionState(state: ConnectionState): void {
      const connected = state === 'connected';
      connectBtn.dataset.state = connected ? 'connected' : 'disconnected';
      connectLabel.textContent = connected ? 'Desconectar' : 'Conectar';
      clear(connectIcon);
      connectIcon.appendChild(icon(connected ? 'disconnect' : 'connect', { size: 18 }));
    },
  };
}
