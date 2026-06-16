import { composeView } from './compose-view';
import { createIMUPanel } from '../components/panels/imu-panel';
import { createBatteryPanel } from '../components/panels/battery-panel';
import { createENVPanel } from '../components/panels/env-panel';
import { createGPSPanel } from '../components/panels/gps-panel';
import { createBMSCellsPanel } from '../components/panels/bms-cells-panel';
import { createVoltChartPanel } from '../components/panels/volt-chart-panel';
import type { View } from '../lib/component';

export function createVista01(): View {
  return composeView(
    {
      id: 'v01',
      tabLabel: 'Actitud IMU',
      title: 'Rover Rojo · Telemetría — UART /dev/ttyUSB0 @ 115200 8N1',
      gridClass: 'grid--v01',
    },
    [
      createIMUPanel(),
      createBatteryPanel(),
      createENVPanel(),
      createGPSPanel(),
      createBMSCellsPanel(),
      createVoltChartPanel(),
    ],
  );
}
