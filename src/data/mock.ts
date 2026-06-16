import type { TelemetrySnapshot, RawEntry } from '../spec/telemetry';

const sin = Math.sin;
const cos = Math.cos;

// PRNG determinista por semilla (evita Math.random para que el mock sea reproducible).
function seededPrng(seed: number): number {
  const x = sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const LOG_ENTRIES: RawEntry[] = [];
const MSG_DEFS = [
  { id: 'SYS', hex: 'AA 01 06 {hb} AC 3F D1 E2 40 00 {crc}' },
  { id: 'IMU', hex: 'AA 02 06 00 7D FF 18 38 C2 {crc}' },
  { id: 'BAT', hex: 'AA 03 05 0A 00 02 E4 56 {crc}' },
  { id: 'GPS', hex: 'AA 04 0C FF 49 DE B0 FB 6B B9 80 06 09 03 {crc}' },
  { id: 'ENV', hex: 'AA 06 06 0B 22 18 38 27 88 {crc}' },
  { id: 'BMS', hex: 'AA 07 09 0C 88 0C A8 00 1E 1F 1E 1C {crc}' },
];

function padHex(n: number): string {
  return n.toString(16).toUpperCase().padStart(2, '0');
}

function fakeHex(template: string, tick: number): string {
  const hb = padHex(tick % 256);
  const crc = padHex((tick * 37 + 91) % 256);
  return template.replace('{hb}', hb).replace('{crc}', crc);
}

function nowTs(tick: number): string {
  const totalMs = tick * 500;
  const h = Math.floor(totalMs / 3600000) % 24;
  const m = Math.floor(totalMs / 60000) % 60;
  const s = Math.floor(totalMs / 1000) % 60;
  const ms = totalMs % 1000;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
}

const HISTORY_LEN = 60;
const vbat_hist: number[] = Array.from({ length: HISTORY_LEN }, (_, i) =>
  25.6 + sin(i * 0.1) * 0.3
);
const ibat_hist: number[] = Array.from({ length: HISTORY_LEN }, (_, i) =>
  7.4 + sin(i * 0.15 + 1.2) * 1.8
);

export function generateSnapshot(tick: number): TelemetrySnapshot {
  const t = tick * 0.08;

  const hb = tick % 256;
  const uptime_ms = tick * 500;

  const roll = sin(t * 0.7) * 12;
  const pitch = sin(t * 0.5 + 0.8) * 8;
  const yaw = ((t * 15) % 360 + 360) % 360;

  const vbat = 25.6 + sin(t * 0.3) * 0.4;
  const ibat = 7.4 + sin(t * 0.6 + 1.1) * 2.0;
  const soc = Math.round(86 - (tick * 0.01) % 20);

  vbat_hist.push(parseFloat(vbat.toFixed(2)));
  ibat_hist.push(parseFloat(ibat.toFixed(2)));
  if (vbat_hist.length > HISTORY_LEN) vbat_hist.shift();
  if (ibat_hist.length > HISTORY_LEN) ibat_hist.shift();

  const temp = 23.4 + sin(t * 0.1) * 1.5;
  const hum = 62 + sin(t * 0.08 + 0.5) * 4;
  const press = 1013 + sin(t * 0.05) * 3;

  // Coordenadas UNI FIEE (Lima) con una pequeña deriva.
  const lat = -12.018553 + sin(t * 0.02) * 0.00005;
  const lon = -77.049723 + cos(t * 0.02) * 0.00005;

  const base_mv = 3220;
  const cells_mv: [number,number,number,number,number,number,number,number] = [
    Math.round(base_mv + sin(t * 0.2) * 8 - 4),
    Math.round(base_mv + sin(t * 0.22 + 0.3) * 8 - 2),
    Math.round(base_mv + sin(t * 0.18 + 0.6) * 8 - 3),
    Math.round(base_mv + sin(t * 0.25 + 0.9) * 8 - 1),
    Math.round(base_mv - 10 + sin(t * 0.21 + 1.2) * 6),
    Math.round(base_mv + sin(t * 0.19 + 1.5) * 8),
    Math.round(base_mv + 12 + sin(t * 0.23 + 1.8) * 6),
    Math.round(base_mv + sin(t * 0.24 + 2.1) * 8 - 2),
  ];
  const cell_min = Math.min(...cells_mv);
  const cell_max = Math.max(...cells_mv);

  const rssi = Math.round(-67 + sin(t * 0.4) * 8);

  const msgDef = MSG_DEFS[tick % MSG_DEFS.length];
  const crc_ok = seededPrng(tick) > 0.04;
  LOG_ENTRIES.unshift({
    ts: nowTs(tick),
    msg_id: msgDef.id,
    hex: fakeHex(msgDef.hex, tick),
    crc_ok,
  });
  if (LOG_ENTRIES.length > 50) LOG_ENTRIES.pop();

  const frames_ok = 1248 + tick;
  const crc_errors = Math.floor(tick * 0.04);

  return {
    sys: {
      heartbeat: hb,
      uptime_ms,
      imu_ok: true,
      sht_ok: true,
      lps_ok: true,
      gps_ok: true,
      twai_ok: true,
      sd_ok: seededPrng(tick + 500) > 0.05,
      rssi_dbm: rssi,
    },
    imu: {
      roll_deg: parseFloat(roll.toFixed(2)),
      pitch_deg: parseFloat(pitch.toFixed(2)),
      yaw_deg: parseFloat(yaw.toFixed(2)),
    },
    bat: {
      vbat_v: parseFloat(vbat.toFixed(2)),
      ibat_a: parseFloat(ibat.toFixed(2)),
      soc_pct: Math.max(0, Math.min(100, soc)),
    },
    gps: {
      lat: parseFloat(lat.toFixed(6)),
      lon: parseFloat(lon.toFixed(6)),
      alt_m: 154.3,
      fix: 3,
      sats: 12,
    },
    env: {
      temp_c: parseFloat(temp.toFixed(1)),
      hum_pct: parseFloat(hum.toFixed(0)),
      press_hpa: parseFloat(press.toFixed(1)),
    },
    bms: {
      cells_mv,
      cell_min_mv: cell_min,
      cell_max_mv: cell_max,
      cell_delta_mv: cell_max - cell_min,
      t1_c: Math.round(31 + sin(t * 0.07) * 2),
      t2_c: Math.round(30 + sin(t * 0.06 + 0.4) * 2),
      tmos_c: Math.round(28 + sin(t * 0.05 + 0.8) * 1.5),
    },
    link: {
      frames_ok,
      crc_errors,
      throughput_bps: 73,
      frame_counts: {
        SYS: Math.min(120, tick * 2),
        IMU: Math.min(120, tick * 2),
        BAT: Math.min(60, tick),
        GPS: Math.min(60, tick),
        ENV: Math.min(30, Math.floor(tick / 2)),
        BMS: Math.min(12, Math.floor(tick / 5)),
      },
      raw_log: [...LOG_ENTRIES],
    },
    vbat_history: [...vbat_hist],
    ibat_history: [...ibat_hist],
  };
}
