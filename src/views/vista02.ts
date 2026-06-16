import { composeView } from './compose-view';
import { createPerCellPanel } from '../components/panels/per-cell-panel';
import { createPackSummaryPanel } from '../components/panels/pack-summary-panel';
import { createVoltChartPanel } from '../components/panels/volt-chart-panel';
import { createBMSTempsPanel } from '../components/panels/bms-temps-panel';
import type { View } from '../lib/component';

export function createVista02(): View {
  return composeView(
    {
      id: 'v02',
      tabLabel: 'Celdas BMS',
      title: 'Rover Rojo · Paquete BMS',
      subtitle: 'BMS JK · CAN @ 250 kbps · IDs 0x02F4...0x05F4',
      gridClass: 'grid--v02',
    },
    [
      createPerCellPanel(),
      createPackSummaryPanel(),
      createVoltChartPanel(),
      createBMSTempsPanel(),
    ],
  );
}
