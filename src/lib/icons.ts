import {
  createElement,
  FolderOpen, Settings, Cable, Info,
  Plug, PlugZap, Pause, Play, Activity,
  type IconNode,
} from 'lucide';

const REGISTRY = {
  project: FolderOpen,
  preferences: Settings,
  uart: Cable,
  about: Info,
  disconnect: Plug,
  connect: PlugZap,
  pause: Pause,
  play: Play,
  activity: Activity,
} satisfies Record<string, IconNode>;

export type IconName = keyof typeof REGISTRY;

export interface IconOptions {
  size?: number;
  stroke?: string;
  strokeWidth?: number;
  class?: string;
}

export function icon(name: IconName, opts: IconOptions = {}): SVGElement {
  const svg = createElement(REGISTRY[name]);
  const { size = 18, stroke = 'currentColor', strokeWidth = 2, class: cls } = opts;
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.setAttribute('stroke', stroke);
  svg.setAttribute('stroke-width', String(strokeWidth));
  if (cls) svg.setAttribute('class', cls);
  return svg;
}
