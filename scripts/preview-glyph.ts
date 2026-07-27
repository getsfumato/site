/**
 * Prints the mark as ASCII, straight from lib/fourier.ts, so the letterform can
 * be iterated without a browser. Reading the coverage field as text is far more
 * precise than squinting at a canvas.
 *
 *   npm run glyph -- [width] [height] [fit] [cell]
 */

import { integralGlyph, penAt, type Point } from '../lib/fourier';

const W = Number(process.argv[2] ?? 240);
const H = Number(process.argv[3] ?? 320);
const FIT = Number(process.argv[4] ?? 0.82);
const CELL = Number(process.argv[5] ?? 8);
const RAMP = ['.', ':', '-', '=', '+', '*', '#', '@'];

const { harmonics, box } = integralGlyph();

const scale = Math.min(W / (box.x1 - box.x0), H / (box.y1 - box.y0)) * FIT;
const ox = W / 2 - ((box.x0 + box.x1) / 2) * scale;
const oy = H / 2 - ((box.y0 + box.y1) / 2) * scale;

const N = 512;
const poly: Point[] = [];
for (let i = 0; i < N; i++) {
  const [x, y] = penAt(harmonics, (i / N) * Math.PI * 2);
  poly.push([x * scale + ox, y * scale + oy]);
}

function distToSeg(px: number, py: number, a: Point, b: Point): number {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const l2 = dx * dx + dy * dy;
  let t = l2 ? ((px - a[0]) * dx + (py - a[1]) * dy) / l2 : 0;
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  return Math.hypot(a[0] + dx * t - px, a[1] + dy * t - py);
}

const cols = Math.ceil(W / CELL) + 1;
const rows = Math.ceil(H / CELL) + 1;
const cover = new Float32Array(cols * rows);
const reach = CELL * 0.9;

for (let cy = 0; cy < rows; cy++) {
  for (let cx = 0; cx < cols; cx++) {
    const px = cx * CELL + CELL / 2;
    const py = cy * CELL + CELL / 2;
    let best = Infinity;
    let inside = false;
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i];
      const b = poly[(i + 1) % poly.length];
      const d = distToSeg(px, py, a, b);
      if (d < best) best = d;
      if (a[1] > py !== b[1] > py) {
        const x = a[0] + ((py - a[1]) / (b[1] - a[1])) * (b[0] - a[0]);
        if (px < x) inside = !inside;
      }
    }
    const signed = inside ? -best : best;
    if (signed > reach) continue;
    cover[cy * cols + cx] = Math.min(1, Math.max(0, (CELL * 0.75 - signed) / (CELL * 1.5)));
  }
}

let minx = cols;
let maxx = 0;
let miny = rows;
let maxy = 0;
for (let y = 0; y < rows; y++) {
  for (let x = 0; x < cols; x++) {
    if (cover[y * cols + x] > 0.02) {
      if (x < minx) minx = x;
      if (x > maxx) maxx = x;
      if (y < miny) miny = y;
      if (y > maxy) maxy = y;
    }
  }
}

const w = maxx - minx + 1;
const h = maxy - miny + 1;
const strongest = harmonics[0];
console.log(
  `canvas ${W}x${H} fit ${FIT} cell ${CELL} | letter ${w}w x ${h}h cells | ratio ${(w / h).toFixed(2)}`,
);
console.log(
  `harmonics ${harmonics.length} | largest epicycle r=${(strongest.amp * scale).toFixed(1)}px`,
);
console.log('+' + '-'.repeat(w) + '+');
for (let y = miny; y <= maxy; y++) {
  let line = '';
  for (let x = minx; x <= maxx; x++) {
    const v = cover[y * cols + x];
    line += v <= 0.02 ? ' ' : RAMP[Math.min(RAMP.length - 1, Math.floor(v * RAMP.length))];
  }
  console.log('|' + line + '|');
}
console.log('+' + '-'.repeat(w) + '+');
