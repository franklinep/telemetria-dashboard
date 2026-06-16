import { h } from '../../lib/dom';

const MAC_DOTS = ['#FF5F57', '#FEBC2E', '#28C840'];

export function createTitlebar(initialTitle: string) {
  const titleEl = h('span', { class: 'titlebar__title', text: initialTitle });

  const dots = h(
    'span',
    { class: 'titlebar__dots' },
    ...MAC_DOTS.map((c) => h('span', { class: 'titlebar__dot', style: { background: c } })),
  );

  const el = h('div', { class: 'titlebar' }, dots, titleEl);

  return {
    el,
    setTitle(title: string): void {
      titleEl.textContent = title;
    },
  };
}
