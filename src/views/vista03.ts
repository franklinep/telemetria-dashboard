import { composeView } from './compose-view';
import { createRSSIGaugePanel } from '../components/panels/rssi-gauge-panel';
import { createFrameStreamPanel } from '../components/panels/frame-stream-panel';
import { createLinkKPIsPanel } from '../components/panels/link-kpis-panel';
import { createFrameCountsPanel } from '../components/panels/frame-counts-panel';
import type { View } from '../lib/component';

export function createVista03(): View {
  return composeView(
    {
      id: 'v03',
      tabLabel: 'Diagnóstico de enlace',
      title: 'Rover Rojo · Diagnóstico de enlace',
      subtitle: 'PAN 0xAB12 · 900 MHz FHSS · MODO AT · /dev/ttyUSB0',
      dark: true,
      gridClass: 'grid--v03',
    },
    [
      createRSSIGaugePanel(),
      createFrameStreamPanel(),
      createLinkKPIsPanel(),
      createFrameCountsPanel(),
    ],
  );
}
