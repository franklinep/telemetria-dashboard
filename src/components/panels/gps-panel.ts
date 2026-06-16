import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { h } from '../../lib/dom';
import { fixed } from '../../lib/format';
import { panelSubtitle } from '../../spec/messages';
import { createPanelShell } from './panel';
import type { Component } from '../../lib/component';
import type { GPSFrame } from '../../spec/telemetry';

const CDN = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images';
const FIX_LABELS = ['SIN FIX', 'DR', '2D', '3D'];

// Corrige las rutas de iconos por defecto rotas con bundlers.
L.Icon.Default.mergeOptions({
  iconRetinaUrl: `${CDN}/marker-icon-2x.png`,
  iconUrl: `${CDN}/marker-icon.png`,
  shadowUrl: `${CDN}/marker-shadow.png`,
});

export function createGPSPanel(): Component {
  const mapEl = h('div', { class: 'gps__map' });

  const coord = (label: string) => {
    const value = h('span', { class: 'gps__value', text: '—' });
    const el = h('div', { class: 'gps__item' }, h('span', { class: 'gps__label', text: label }), value);
    return { el, value };
  };
  const lat = coord('LAT'), lon = coord('LON'), alt = coord('ALT'), fix = coord('FIX'), sats = coord('SATS');

  const { root, body } = createPanelShell({ title: 'Posición GPS', subtitle: panelSubtitle('GPS', 'NEO-M9N') });
  body.classList.add('gps');
  body.append(mapEl, h('div', { class: 'gps__coords' }, lat.el, lon.el, alt.el, fix.el, sats.el));

  let map: L.Map | null = null;
  let marker: L.Marker | null = null;
  let visible = false;

  function ensureMap(g: GPSFrame): void {
    if (map || mapEl.clientWidth === 0) return;
    map = L.map(mapEl, { zoomControl: false, attributionControl: false }).setView([g.lat, g.lon], 17);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    marker = L.marker([g.lat, g.lon]).addTo(map);
  }

  return {
    el: root,
    update({ gps }: { gps: GPSFrame }) {
      ensureMap(gps);
      if (map && marker) {
        // Reajusta el tamaño al volver a una vista oculta
        const nowVisible = mapEl.offsetParent !== null;
        if (nowVisible && !visible) map.invalidateSize();
        visible = nowVisible;
        marker.setLatLng([gps.lat, gps.lon]);
        map.panTo([gps.lat, gps.lon], { animate: false });
      }
      lat.value.textContent = `${fixed(gps.lat, 6)}°`;
      lon.value.textContent = `${fixed(gps.lon, 6)}°`;
      alt.value.textContent = `${fixed(gps.alt_m, 1)} m`;
      fix.value.textContent = FIX_LABELS[gps.fix] ?? '—';
      fix.value.style.color = gps.fix === 3 ? 'var(--accent-green)' : 'var(--accent-red)';
      sats.value.textContent = `${gps.sats}/12`;
    },
    destroy() {
      map?.remove();
      map = null;
    },
  };
}
