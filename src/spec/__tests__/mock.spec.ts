import { describe, it, expect } from 'vitest';
import { generateSnapshot } from '../../data/mock';

describe('generateSnapshot conforma al contrato TelemetrySnapshot', () => {
  const snap = generateSnapshot(42);

  it('SYS — heartbeat en rango [0,255]', () => {
    expect(snap.sys.heartbeat).toBeGreaterThanOrEqual(0);
    expect(snap.sys.heartbeat).toBeLessThanOrEqual(255);
  });

  it('SYS — uptime_ms es positivo', () => {
    expect(snap.sys.uptime_ms).toBeGreaterThan(0);
  });

  it('SYS — flags son booleanos', () => {
    expect(typeof snap.sys.imu_ok).toBe('boolean');
    expect(typeof snap.sys.gps_ok).toBe('boolean');
    expect(typeof snap.sys.sd_ok).toBe('boolean');
  });

  it('SYS — rssi_dbm en rango válido [-120, -30]', () => {
    expect(snap.sys.rssi_dbm).toBeGreaterThanOrEqual(-120);
    expect(snap.sys.rssi_dbm).toBeLessThanOrEqual(-30);
  });

  it('IMU — roll en ±180°', () => {
    expect(snap.imu.roll_deg).toBeGreaterThanOrEqual(-180);
    expect(snap.imu.roll_deg).toBeLessThanOrEqual(180);
  });

  it('IMU — pitch en ±90°', () => {
    expect(snap.imu.pitch_deg).toBeGreaterThanOrEqual(-90);
    expect(snap.imu.pitch_deg).toBeLessThanOrEqual(90);
  });

  it('IMU — yaw en [0, 360)', () => {
    expect(snap.imu.yaw_deg).toBeGreaterThanOrEqual(0);
    expect(snap.imu.yaw_deg).toBeLessThan(360);
  });

  it('BAT — vbat_v positivo', () => {
    expect(snap.bat.vbat_v).toBeGreaterThan(0);
  });

  it('BAT — soc_pct en [0, 100]', () => {
    expect(snap.bat.soc_pct).toBeGreaterThanOrEqual(0);
    expect(snap.bat.soc_pct).toBeLessThanOrEqual(100);
  });

  it('GPS — coordenadas UNI FIEE (Lima)', () => {
    expect(snap.gps.lat).toBeCloseTo(-12.018553, 2);
    expect(snap.gps.lon).toBeCloseTo(-77.049723, 2);
  });

  it('GPS — fix en {0,1,2,3}', () => {
    expect([0, 1, 2, 3]).toContain(snap.gps.fix);
  });

  it('BMS — 8 celdas exactas', () => {
    expect(snap.bms.cells_mv).toHaveLength(8);
  });

  it('BMS — cell_delta = max - min', () => {
    expect(snap.bms.cell_delta_mv).toBe(snap.bms.cell_max_mv - snap.bms.cell_min_mv);
  });

  it('BMS — cell_min <= cell_max', () => {
    expect(snap.bms.cell_min_mv).toBeLessThanOrEqual(snap.bms.cell_max_mv);
  });

  it('Link — historial vbat tiene 60 muestras', () => {
    expect(snap.vbat_history).toHaveLength(60);
  });

  it('Link — frame_counts tiene los 6 MSG IDs', () => {
    const keys = Object.keys(snap.link.frame_counts);
    expect(keys).toEqual(expect.arrayContaining(['SYS', 'IMU', 'BAT', 'GPS', 'ENV', 'BMS']));
  });

  it('Link — raw_log tiene entradas con ts, msg_id, hex, crc_ok', () => {
    expect(snap.link.raw_log.length).toBeGreaterThan(0);
    const entry = snap.link.raw_log[0];
    expect(entry).toHaveProperty('ts');
    expect(entry).toHaveProperty('msg_id');
    expect(entry).toHaveProperty('hex');
    expect(typeof entry.crc_ok).toBe('boolean');
  });

  it('tick 0 vs tick 10 — heartbeat avanza', () => {
    const s0 = generateSnapshot(0);
    const s10 = generateSnapshot(10);
    expect(s10.sys.heartbeat).toBe(10);
    expect(s0.sys.heartbeat).toBe(0);
  });
});
