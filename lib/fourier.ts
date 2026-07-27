/**
 * The sfumato mark: an integral sign, decomposed into Fourier epicycles.
 *
 * Pure geometry — no DOM, no canvas. The renderer and the CLI preview script
 * both import this, so the letterform has exactly one definition.
 *
 *   1. LETTERFORM  A cubic-Bezier spine is offset to both sides by a broad-nib
 *      width model. Stroke weight is |sin(travel - nib)|, which is how a chisel
 *      pen actually behaves: hold the nib near-horizontal and the near-vertical
 *      stem comes out thick while the horizontal hooks thin to hairlines —
 *      exactly the stress an integral has in a serif maths face. Offsetting both
 *      sides and joining them yields a *closed* contour, which matters: an open
 *      stroke makes the DFT wrap discontinuously and the pen flies across the
 *      canvas once per period.
 *
 *   2. TRANSFORM   The contour is resampled to uniform arc length (unequal
 *      spacing skews the spectrum) and run through an O(N^2) DFT. Each bin
 *      becomes an epicycle: radius = magnitude, rate = signed frequency,
 *      start angle = phase. Sorted by magnitude, so the chain runs from the
 *      broad gesture down to the fine detail.
 */

export type Point = readonly [number, number];

/** [p0x, p0y, c1x, c1y, c2x, c2y, p1x, p1y] */
export type Cubic = readonly [number, number, number, number, number, number, number, number];

export interface Harmonic {
  /** signed — negative bins counter-rotate */
  freq: number;
  amp: number;
  phase: number;
}

export interface Box {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

export interface Glyph {
  /** the closed outline, uniformly sampled */
  contour: Point[];
  /** strongest first */
  harmonics: Harmonic[];
  box: Box;
}

/* ------------------------------------------------------------------ *
 * The letterform
 * ------------------------------------------------------------------ */

/**
 * An S drawn the way an integral is drawn.
 *
 * A literal integral sign does not work here: it is essentially one long, almost
 * straight stem, and on a character grid this size it reads as a diagonal slash
 * rather than a letter. So the S keeps what makes an S legible — two bowls with a
 * waist crossing between them, the upper bowl opening right and the lower opening
 * left — while the proportions and the terminals come from the integral: taller
 * and narrower than a text S, steeply inclined, and finished at both ends with a
 * hook that curls away from the stroke instead of stopping flat.
 *
 * Both letters happen to share 2-fold rotational symmetry, so only the top half
 * is authored — terminal hook, over the top, down the bowl, into the waist — and
 * the bottom half is its reflection through the centre. The symmetry is exact and
 * the inflection at the waist is smooth by construction, because the reflected
 * tangent matches the incoming one.
 *
 * Authored in a 100 x 170 box, y running down. Centre is (50, 85).
 */
const HALF_SPINE: Cubic[] = [
  [66, 26, 77, 22, 86, 15, 83, 7],   // hook: out of the tip, curling to the apex
  [83, 7, 74, 0, 54, 3, 41, 11],     // over the top, leftward
  [41, 11, 27, 19, 15, 33, 17, 49],  // down the left flank of the upper bowl
  [17, 49, 19, 65, 34, 78, 50, 85],  // bowl closing into the waist at the centre
];

const CENTRE: Point = [50, 85];

/** Reflect a cubic through the centre and reverse its direction. */
function reflectCubic(c: Cubic): Cubic {
  const [cx, cy] = CENTRE;
  const r = (x: number, y: number): [number, number] => [2 * cx - x, 2 * cy - y];
  const [p0x, p0y, c1x, c1y, c2x, c2y, p1x, p1y] = c;
  // reflect every control point, then walk the segment backwards so the halves
  // join head-to-tail at the centre
  const p1 = r(p1x, p1y);
  const c2 = r(c2x, c2y);
  const c1 = r(c1x, c1y);
  const p0 = r(p0x, p0y);
  return [...p1, ...c2, ...c1, ...p0] as unknown as Cubic;
}

/** The full spine: authored top half, then its point reflection. */
export const INTEGRAL_SPINE: Cubic[] = [
  ...HALF_SPINE,
  ...[...HALF_SPINE].reverse().map(reflectCubic),
];

export interface LetterOptions {
  /** chisel angle, radians. Near-horizontal keeps the stem thick. */
  nib?: number;
  /** maximum stroke weight, spine units */
  nibWidth?: number;
  /** thinnest stroke as a fraction of nibWidth */
  hairline?: number;
  /** italic shear, applied about the box baseline */
  slant?: number;
  /** fraction of the arc length tapered to a point at each terminal */
  taper?: number;
  /** samples per cubic when flattening the spine */
  perSegment?: number;
  /** uniform samples around the finished contour */
  contourSamples?: number;
  /** epicycles to retain */
  harmonics?: number;
}

const DEFAULTS = {
  nib: (-18 * Math.PI) / 180,
  nibWidth: 24,
  hairline: 0.2,
  slant: 0.13,
  taper: 0.11,
  perSegment: 200,
  contourSamples: 512,
  harmonics: 96,
} satisfies Required<LetterOptions>;

/** Box height, used as the shear baseline so the slant pivots at the foot. */
const BOX_H = 170;

function cubicAt(s: Cubic, t: number): Point {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return [
    a * s[0] + b * s[2] + c * s[4] + d * s[6],
    a * s[1] + b * s[3] + c * s[5] + d * s[7],
  ];
}

/** Flatten the spine to a dense polyline, applying the italic shear as we go. */
function flattenSpine(spine: Cubic[], perSegment: number, slant: number): Point[] {
  const pts: Point[] = [];
  for (const seg of spine) {
    for (let i = 0; i < perSegment; i++) {
      const [x, y] = cubicAt(seg, i / perSegment);
      pts.push([x + (BOX_H - y) * slant, y]);
    }
  }
  const [lx, ly] = cubicAt(spine[spine.length - 1], 1);
  pts.push([lx + (BOX_H - ly) * slant, ly]);
  return pts;
}

/**
 * Offset the spine to both sides by the broad-nib width and join the two sides
 * into a single closed contour.
 */
function buildOutline(spine: Cubic[], o: Required<LetterOptions>): Point[] {
  const pts = flattenSpine(spine, o.perSegment, o.slant);
  const n = pts.length;

  // cumulative arc length, for the terminal tapers
  const len = new Float64Array(n);
  for (let i = 1; i < n; i++) {
    len[i] = len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  }
  const total = len[n - 1] || 1;

  const left: Point[] = [];
  const right: Point[] = [];

  for (let i = 0; i < n; i++) {
    const p = pts[i];
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(n - 1, i + 1)];
    const tx = b[0] - a[0];
    const ty = b[1] - a[1];
    const m = Math.hypot(tx, ty) || 1;

    // chisel-pen weight, floored so hairlines survive
    let w = Math.max(o.hairline, Math.abs(Math.sin(Math.atan2(ty, tx) - o.nib))) * o.nibWidth;

    // ease the weight down at both terminals so the hooks come to a point
    const s = len[i] / total;
    const edge = Math.min(s, 1 - s) / o.taper;
    if (edge < 1) {
      const smooth = edge * edge * (3 - 2 * edge);
      w *= o.hairline + (1 - o.hairline) * smooth;
    }

    const nx = -ty / m;
    const ny = tx / m;
    left.push([p[0] + (nx * w) / 2, p[1] + (ny * w) / 2]);
    right.push([p[0] - (nx * w) / 2, p[1] - (ny * w) / 2]);
  }

  right.reverse();
  return left.concat(right);
}

/** Resample a closed polyline to N points spaced evenly by arc length. */
function resampleClosed(pts: Point[], N: number): Point[] {
  const n = pts.length;
  const seg = new Float64Array(n);
  let total = 0;
  for (let i = 0; i < n; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % n];
    seg[i] = Math.hypot(b[0] - a[0], b[1] - a[1]);
    total += seg[i];
  }

  const out: Point[] = [];
  const step = total / N;
  let i = 0;
  let carried = 0;
  for (let k = 0; k < N; k++) {
    const want = k * step;
    while (i < n - 1 && carried + seg[i] < want) {
      carried += seg[i];
      i++;
    }
    const a = pts[i];
    const b = pts[(i + 1) % n];
    const t = seg[i] > 0 ? (want - carried) / seg[i] : 0;
    out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
  }
  return out;
}

/* ------------------------------------------------------------------ *
 * The transform
 * ------------------------------------------------------------------ */

/**
 * Centre a point set on its own mean.
 *
 * This is done before the transform on purpose. The k=0 bin of a DFT is the
 * centroid — a fixed translation, not a rotation. Left in place it dominates the
 * magnitude sort and would be drawn as an enormous circle that never turns,
 * which is simply not an epicycle. Removing it first means every harmonic that
 * survives is a genuine rotating one, and the mark is positioned from its
 * bounding box instead.
 */
function centre(points: Point[]): Point[] {
  let sx = 0;
  let sy = 0;
  for (const [x, y] of points) {
    sx += x;
    sy += y;
  }
  const n = points.length || 1;
  const cx = sx / n;
  const cy = sy / n;
  return points.map(([x, y]) => [x - cx, y - cy] as Point);
}

export function dft(points: Point[], keep: number): Harmonic[] {
  const N = points.length;
  const bins: Harmonic[] = [];
  for (let k = 0; k < N; k++) {
    let re = 0;
    let im = 0;
    for (let n = 0; n < N; n++) {
      const phi = (2 * Math.PI * k * n) / N;
      const c = Math.cos(phi);
      const s = Math.sin(phi);
      re += points[n][0] * c + points[n][1] * s;
      im += points[n][1] * c - points[n][0] * s;
    }
    re /= N;
    im /= N;
    bins.push({
      freq: k <= N / 2 ? k : k - N,
      amp: Math.hypot(re, im),
      phase: Math.atan2(im, re),
    });
  }
  bins.sort((a, b) => b.amp - a.amp);
  return bins.slice(0, keep);
}

/* ------------------------------------------------------------------ *
 * Assembly
 * ------------------------------------------------------------------ */

function boundsOf(pts: Point[]): Box {
  let x0 = Infinity;
  let x1 = -Infinity;
  let y0 = Infinity;
  let y1 = -Infinity;
  for (const [x, y] of pts) {
    if (x < x0) x0 = x;
    if (x > x1) x1 = x;
    if (y < y0) y0 = y;
    if (y > y1) y1 = y;
  }
  return { x0, x1, y0, y1 };
}

/**
 * Sum the epicycle chain at phase t. Returns the pen position in spine units.
 * If `circles` is supplied, each epicycle's centre and radius is pushed onto it
 * in chain order.
 */
export function penAt(
  harmonics: Harmonic[],
  t: number,
  circles?: Array<[number, number, number]>,
): Point {
  let x = 0;
  let y = 0;
  for (const h of harmonics) {
    const px = x;
    const py = y;
    const a = h.freq * t + h.phase;
    x += h.amp * Math.cos(a);
    y += h.amp * Math.sin(a);
    if (circles) circles.push([px, py, h.amp]);
  }
  return [x, y];
}

let cached: Glyph | null = null;

/** The mark. Memoised: the DFT is ~260k complex ops and never changes. */
export function integralGlyph(options: LetterOptions = {}): Glyph {
  const useCache = Object.keys(options).length === 0;
  if (useCache && cached) return cached;

  const o = { ...DEFAULTS, ...options };
  const contour = centre(resampleClosed(buildOutline(INTEGRAL_SPINE, o), o.contourSamples));
  const harmonics = dft(contour, o.harmonics);

  // Bound the *reconstruction*, not the source outline: with a finite harmonic
  // count the drawn path overshoots the original slightly, and fitting to the
  // original would clip those overshoots at the canvas edge.
  const recon: Point[] = [];
  for (let i = 0; i < o.contourSamples; i++) {
    recon.push(penAt(harmonics, (i / o.contourSamples) * Math.PI * 2));
  }

  const glyph: Glyph = { contour: recon, harmonics, box: boundsOf(recon) };
  if (useCache) cached = glyph;
  return glyph;
}
