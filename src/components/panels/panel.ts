import { h } from '../../lib/dom';

export interface PanelOptions {
  title: string;
  subtitle?: string;
  dark?: boolean;
  bodyClass?: string;
}

// Chart.js y Leaflet recalculan su tamaño al recibir un resize.
function reflowLibs(): void {
  requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
}

export function createPanelShell(opts: PanelOptions): { root: HTMLElement; body: HTMLElement } {
  const body = h('div', { class: `panel__body${opts.bodyClass ? ' ' + opts.bodyClass : ''}` });
  const root = h('div', { class: `panel${opts.dark ? ' panel--dark' : ''}` });

  const ctrl = (symbol: string, title: string, onClick: () => void) =>
    h('button', {
      class: 'panel__ctrl',
      text: symbol,
      attrs: { title, type: 'button' },
      on: { click: onClick },
    });

  const controls = h(
    'span',
    { class: 'panel__controls' },
    ctrl('—', 'Minimizar', () => root.classList.toggle('panel--collapsed')),
    ctrl('□', 'Maximizar', () => {
      root.classList.remove('panel--collapsed');
      root.classList.toggle('panel--maximized');
      reflowLibs();
    }),
    ctrl('×', 'Cerrar (F5 restaura)', () => {
      root.classList.remove('panel--maximized');
      root.classList.add('panel--closed');
    }),
  );

  const header = h(
    'div',
    { class: 'panel__header' },
    h('span', { class: 'panel__dot' }),
    h('span', { class: 'panel__title', text: opts.title }),
    opts.subtitle ? h('span', { class: 'panel__subtitle', text: opts.subtitle }) : null,
    controls,
  );

  root.append(header, body);
  return { root, body };
}
