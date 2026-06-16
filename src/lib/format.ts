export function fmtUptime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const hh = Math.floor(s / 3600).toString().padStart(2, '0');
  const mm = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
  const ss = (s % 60).toString().padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

export function pad3(n: number): string {
  return Math.trunc(n).toString().padStart(3, '0');
}

export function fixed(n: number, d = 2): string {
  return n.toFixed(d);
}

export function mvToV(mv: number): string {
  return (mv / 1000).toFixed(3);
}
