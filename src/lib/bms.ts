import type { BMSFrame } from '../spec/telemetry';

export function cellColor(mv: number, bms: BMSFrame): string {
  if (mv === bms.cell_min_mv) return 'var(--accent-orange)';
  if (mv === bms.cell_max_mv) return 'var(--accent-green)';
  return 'var(--accent-purple)';
}

export function socColor(soc: number): string {
  if (soc > 50) return 'var(--accent-green)';
  if (soc > 20) return 'var(--accent-orange)';
  return 'var(--accent-red)';
}
