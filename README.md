# Dashboard de Telemetría — Rover Rojo

Estación terrena para visualizar la telemetría del Rover Rojo (UNI FIEE · TerraBots) en tiempo real.
Tres vistas: telemetría principal, paquete BMS y diagnóstico de enlace.

## Desarrollo

```bash
npm install
npm run dev      # datos simulados
npm run test     # tests del contrato de datos
npm run build    # build de producción
```

Para consumir el endpoint real en lugar del mock:

```bash
VITE_USE_MOCK=false npm run dev   # GET /api/telemetry/latest
```

## Contrato de API

El endpoint `GET /api/telemetry/latest`:

```json
{
	"sys": {
		"heartbeat": 123,
		"uptime_ms": 456789,
		"imu_ok": true,
		"sht_ok": true,
		"lps_ok": true,
		"gps_ok": true,
		"twai_ok": true,
		"sd_ok": true,
		"rssi_dbm": -67
	},
	"imu": {
		"roll_deg": 1.23,
		"pitch_deg": -0.45,
		"yaw_deg": 182.7
	},
	"bat": {
		"vbat_v": 24.8,
		"ibat_a": 3.2,
		"soc_pct": 78
	},
	"gps": {
		"lat": -12.0464,
		"lon": -77.0428,
		"alt_m": 154.2,
		"fix": 3,
		"sats": 10
	},
	"env": {
		"temp_c": 26.4,
		"hum_pct": 41.2,
		"press_hpa": 1012.8
	},
	"bms": {
		"cells_mv": [4101, 4098, 4100, 4099, 4102, 4101, 4097, 4100],
		"cell_min_mv": 4097,
		"cell_max_mv": 4102,
		"cell_delta_mv": 5,
		"t1_c": 31.2,
		"t2_c": 32.0,
		"tmos_c": 33.1
	},
	"link": {
		"frames_ok": 120,
		"crc_errors": 2,
		"throughput_bps": 1840,
		"frame_counts": {
			"SYS": 10,
			"IMU": 10,
			"BAT": 5,
			"GPS": 5,
			"ENV": 3,
			"BMS": 2
		},
		"raw_log": [
			{
				"ts": "12:34:56.123",
				"msg_id": "SYS",
				"hex": "AA 01 06 00 7D FF 18 38 C2 4F",
				"crc_ok": true
			}
		]
	},
	"vbat_history": [24.7, 24.8, 24.9],
	"ibat_history": [3.4, 3.3, 3.2]
}
```

Reglas del contrato:

- Todos los campos deben venir siempre.
- Los tipos deben respetarse exactamente.
- `frame_counts` debe incluir siempre `SYS`, `IMU`, `BAT`, `GPS`, `ENV` y `BMS`.
- `raw_log` puede venir vacío, pero debe existir.
- `vbat_history` e `ibat_history` deben ser arreglos numéricos.

## Stack

TypeScript vanilla + Vite. Chart.js (gráficas), Leaflet (mapa), lucide (iconos).
