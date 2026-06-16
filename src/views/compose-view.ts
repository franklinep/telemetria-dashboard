import { h } from '../lib/dom';
import type { Component, View } from '../lib/component';

export interface ViewMeta {
  id: string;
  tabLabel: string;
  title: string;
  subtitle?: string;
  dark?: boolean;
  gridClass: string;
}

export function composeView(meta: ViewMeta, panels: Component[]): View {
  const canvas = h(
    'div',
    { class: `view-canvas${meta.dark ? ' view-canvas--dark' : ''}` },
    h('div', { class: `grid ${meta.gridClass}` }, ...panels.map((p) => p.el)),
  );

  return {
    id: meta.id,
    tabLabel: meta.tabLabel,
    title: meta.title,
    subtitle: meta.subtitle,
    dark: meta.dark,
    el: canvas,
    update(snap) {
      for (const p of panels) p.update(snap);
    },
    destroy() {
      for (const p of panels) p.destroy?.();
    },
  };
}
