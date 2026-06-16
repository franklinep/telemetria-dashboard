type Child = Node | string | number | null | undefined | false;

export interface ElProps {
  class?: string;
  text?: string | number;
  html?: string;
  style?: Partial<CSSStyleDeclaration> | string;
  dataset?: Record<string, string>;
  attrs?: Record<string, string>;
  on?: Partial<Record<keyof HTMLElementEventMap, EventListener>>;
}

export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: ElProps = {},
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);

  if (props.class) el.className = props.class;
  if (props.text != null) el.textContent = String(props.text);
  if (props.html != null) el.innerHTML = props.html;

  if (props.style) {
    if (typeof props.style === 'string') el.style.cssText = props.style;
    else Object.assign(el.style, props.style);
  }
  if (props.dataset) for (const [k, v] of Object.entries(props.dataset)) el.dataset[k] = v;
  if (props.attrs) for (const [k, v] of Object.entries(props.attrs)) el.setAttribute(k, v);
  if (props.on) for (const [evt, fn] of Object.entries(props.on)) el.addEventListener(evt, fn as EventListener);

  for (const child of children) append(el, child);
  return el;
}

function append(parent: HTMLElement, child: Child): void {
  if (child == null || child === false) return;
  parent.appendChild(typeof child === 'string' || typeof child === 'number'
    ? document.createTextNode(String(child))
    : child);
}

export function clear(node: HTMLElement): void {
  node.replaceChildren();
}

export function mount(selector: string): HTMLElement {
  const el = document.querySelector<HTMLElement>(selector);
  if (!el) throw new Error(`Elemento no encontrado: ${selector}`);
  return el;
}
