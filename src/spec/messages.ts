export type MsgName = 'SYS' | 'IMU' | 'BAT' | 'GPS' | 'ENV' | 'BMS';

export interface MessageSpec {
  readonly id: number;
  readonly name: MsgName;
  readonly description: string;
  readonly hz: number;
  readonly periodMs: number;
  readonly frameBytes: number;
  readonly accentVar: string;
}

export const MESSAGES: Record<MsgName, MessageSpec> = {
  SYS: { id: 0x01, name: 'SYS', description: 'Heartbeat, flags sensores, uptime', hz: 2, periodMs: 500, frameBytes: 10, accentVar: 'var(--accent-blue)' },
  IMU: { id: 0x02, name: 'IMU', description: 'Roll, pitch, yaw (BNO086)', hz: 2, periodMs: 500, frameBytes: 10, accentVar: 'var(--accent-orange)' },
  BAT: { id: 0x03, name: 'BAT', description: 'Voltaje pack, corriente, SOC', hz: 1, periodMs: 1000, frameBytes: 9, accentVar: 'var(--accent-green)' },
  GPS: { id: 0x04, name: 'GPS', description: 'Lat, lon, alt, fix, satélites', hz: 1, periodMs: 1000, frameBytes: 16, accentVar: 'var(--accent-cyan)' },
  ENV: { id: 0x06, name: 'ENV', description: 'Temperatura, humedad, presión', hz: 0.5, periodMs: 2000, frameBytes: 10, accentVar: 'var(--accent-yellow)' },
  BMS: { id: 0x07, name: 'BMS', description: 'Celda mín/máx/delta, temperaturas', hz: 0.2, periodMs: 5000, frameBytes: 13, accentVar: 'var(--accent-purple)' },
};

export const MESSAGE_ORDER: readonly MsgName[] = ['SYS', 'IMU', 'BAT', 'GPS', 'ENV', 'BMS'];

export function toHexId(id: number): string {
  return '0x' + id.toString(16).toUpperCase().padStart(2, '0');
}

export function accentOf(name: string): string {
  return MESSAGES[name as MsgName]?.accentVar ?? 'var(--chrome-text)';
}

export function panelSubtitle(name: MsgName, source?: string): string {
  const m = MESSAGES[name];
  return [`MSG ${toHexId(m.id)}`, `${m.hz} Hz`, source].filter(Boolean).join(' · ');
}
