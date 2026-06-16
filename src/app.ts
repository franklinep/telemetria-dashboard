import { h, mount } from './lib/dom';
import { TelemetryService, type ConnectionState } from './services/telemetry-service';
import { createTitlebar } from './components/chrome/titlebar';
import { createToolbar } from './components/chrome/toolbar';
import { createStatusbar } from './components/chrome/statusbar';
import { createTabbar } from './components/chrome/tabbar';
import { createVista01 } from './views/vista01';
import { createVista02 } from './views/vista02';
import { createVista03 } from './views/vista03';
import type { View } from './lib/component';
import type { TelemetrySnapshot } from './spec/telemetry';

const SOURCE_LABELS: Record<string, string> = { uart: 'UART /dev/ttyUSB0' };

export class App {
  readonly el: HTMLElement;

  private readonly service = new TelemetryService();
  private readonly titlebar = createTitlebar('');
  private readonly statusbar = createStatusbar();
  private readonly toolbar = createToolbar({
    onSelectSource: (id) => this.toast(`Fuente activa: ${SOURCE_LABELS[id] ?? id}`),
    onAction: (id) => this.toast(`${id} · acción de demo`),
    onToggleConnection: () => this.service.toggle(),
  });

  private readonly views: View[] = [createVista01(), createVista02(), createVista03()];
  private readonly viewById = new Map(this.views.map((v) => [v.id, v]));
  private readonly tabbar;

  private activeId = this.views[0].id;
  private lastSnapshot: TelemetrySnapshot | null = null;
  private toastTimer: number | null = null;
  private readonly toastEl = h('div', { class: 'toast', attrs: { hidden: '' } });

  constructor() {
    this.tabbar = createTabbar(
      this.views.map((v) => ({ id: v.id, label: v.tabLabel })),
      this.activeId,
      this.service.isMock,
      { onSelect: (id) => this.selectView(id), onTogglePause: () => this.service.toggle() },
    );

    const content = h('div', { class: 'app__content' }, ...this.views.map((v) => v.el), this.toastEl);
    this.el = h('div', { class: 'app' }, this.titlebar.el, this.toolbar.el, this.statusbar.el, content, this.tabbar.el);

    this.service.onSnapshot((snap) => this.onSnapshot(snap));
    this.service.onState((state, detail) => this.onState(state, detail));
    this.selectView(this.activeId);
  }

  mount(selector: string): void {
    mount(selector).appendChild(this.el);
    this.service.start();
  }

  private get activeView(): View {
    return this.viewById.get(this.activeId)!;
  }

  private onSnapshot(snap: TelemetrySnapshot): void {
    this.lastSnapshot = snap;
    this.statusbar.update(snap.sys);
    this.activeView.update(snap);
  }

  private onState(state: ConnectionState, detail?: string): void {
    this.statusbar.setConnection(state);
    this.toolbar.setConnectionState(state);
    this.tabbar.setPaused(state);
    if (state === 'error' && detail) this.toast(`Error de conexión: ${detail}`);
  }

  private selectView(id: string): void {
    if (!this.viewById.has(id)) return;
    this.activeId = id;
    const view = this.activeView;

    for (const v of this.views) v.el.toggleAttribute('hidden', v.id !== id);
    this.titlebar.setTitle(view.title);
    this.statusbar.setSubtitle(view.subtitle);
    this.tabbar.setActive(id);

    if (this.lastSnapshot) view.update(this.lastSnapshot);
  }

  private toast(msg: string): void {
    this.toastEl.textContent = msg;
    this.toastEl.removeAttribute('hidden');
    if (this.toastTimer !== null) window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => this.toastEl.setAttribute('hidden', ''), 2200);
  }
}
