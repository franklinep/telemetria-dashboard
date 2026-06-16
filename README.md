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

## Stack

TypeScript vanilla + Vite. Chart.js (gráficas), Leaflet (mapa), lucide (iconos).
