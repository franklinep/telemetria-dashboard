import { h, clear } from '../../lib/dom';
import { icon } from '../../lib/icons';
import type { ConnectionState } from '../../services/telemetry-service';

export interface TabDescriptor {
  id: string;
  label: string;
}

export interface TabbarHandlers {
  onSelect(id: string): void;
  onTogglePause(): void;
}

export function createTabbar(
  tabs: TabDescriptor[],
  activeId: string,
  isMock: boolean,
  handlers: TabbarHandlers,
) {
  const tabButtons = new Map<string, HTMLButtonElement>();

  function renderTab(tab: TabDescriptor): HTMLButtonElement {
    const btn = h('button', {
      class: `tabbar__tab${tab.id === activeId ? ' tabbar__tab--active' : ''}`,
      text: tab.label,
      attrs: { type: 'button' },
      on: { click: () => handlers.onSelect(tab.id) },
    });
    tabButtons.set(tab.id, btn);
    return btn;
  }

  const pauseIcon = h('span', {}, icon('pause', { size: 14 }));
  const pauseBtn = h(
    'button',
    { class: 'tabbar__pause', attrs: { title: 'Pausar / Reanudar', type: 'button' }, on: { click: () => handlers.onTogglePause() } },
    pauseIcon,
  );

  const el = h(
    'div',
    { class: 'tabbar' },
    h('div', { class: 'tabbar__group' }, pauseBtn, ...tabs.map(renderTab)),
    h(
      'div',
      { class: 'tabbar__group' },
      isMock ? h('span', { class: 'tabbar__badge', text: 'SIMULADO' }) : null,
    ),
  );

  return {
    el,
    setActive(id: string): void {
      for (const [key, btn] of tabButtons) {
        btn.classList.toggle('tabbar__tab--active', key === id);
      }
    },
    setPaused(state: ConnectionState): void {
      clear(pauseIcon);
      pauseIcon.appendChild(icon(state === 'connected' ? 'pause' : 'play', { size: 14 }));
    },
  };
}
