export interface SYSFrame {
  heartbeat: number;    // 0–255, cicla
  uptime_ms: number;    // milisegundos desde boot
  imu_ok: boolean;
  sht_ok: boolean;
  lps_ok: boolean;
  gps_ok: boolean;
  twai_ok: boolean;
  sd_ok: boolean;
  rssi_dbm: number;     // -30 a -120 dBm, calculado local
}

export interface IMUFrame {
  roll_deg: number;     // ±180°, resolución 0.01°
  pitch_deg: number;    // ±90°
  yaw_deg: number;      // 0–360°
}

export interface BATFrame {
  vbat_v: number;       // Voltios pack total
  ibat_a: number;       // Amperios (positivo = descarga)
  soc_pct: number;      // 0–100 %
}

export interface GPSFrame {
  lat: number;          // grados decimales
  lon: number;
  alt_m: number;
  fix: 0 | 1 | 2 | 3;  // 0=sin fix, 3=3D
  sats: number;
}

export interface ENVFrame {
  temp_c: number;       // SHT40, °C
  hum_pct: number;      // SHT40, %
  press_hpa: number;    // LPS22HB, hPa
}

export interface BMSFrame {
  cells_mv: [number, number, number, number, number, number, number, number];
  cell_min_mv: number;
  cell_max_mv: number;
  cell_delta_mv: number;
  t1_c: number;
  t2_c: number;
  tmos_c: number;
}

export interface RawEntry {
  ts: string;       // "HH:MM:SS.mmm"
  msg_id: string;   // "SYS"|"IMU"|"BAT"|"GPS"|"ENV"|"BMS"
  hex: string;      // "AA 02 06 00 7D FF 18 38 C2 4F"
  crc_ok: boolean;
}

export interface LinkFrame {
  frames_ok: number;
  crc_errors: number;
  throughput_bps: number;
  frame_counts: Record<'SYS' | 'IMU' | 'BAT' | 'GPS' | 'ENV' | 'BMS', number>;
  raw_log: RawEntry[];
}

export interface TelemetrySnapshot {
  sys: SYSFrame;
  imu: IMUFrame;
  bat: BATFrame;
  gps: GPSFrame;
  env: ENVFrame;
  bms: BMSFrame;
  link: LinkFrame;
  vbat_history: number[];   // últimos 60 samples (1 Hz)
  ibat_history: number[];
}
