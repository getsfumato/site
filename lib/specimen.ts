/**
 * The regions the page "measures" on the Salvator Mundi bust, and the code that
 * measures them.
 *
 * The readouts are real. Each region reports the mean luminance of its pixels and
 * the mean gradient magnitude — and the second one is the whole point: gradient
 * magnitude is a direct measure of how gradually tone changes, which is exactly
 * what sfumato is. Leonardo's transitions are so soft that these numbers come out
 * an order of magnitude below what a hard-edged image would give. Inventing
 * plausible-looking confidence scores would have been easier and would have meant
 * nothing.
 */

export interface Region {
  /** rect in image space, 0..1, y down */
  x: number;
  y: number;
  w: number;
  h: number;
  /** which measurement to surface in the label */
  readout: 'grad' | 'lum';
  /** block size in image-width units at rest, and how far it breathes */
  block: number;
  swing: number;
  /** phase offset so the regions do not pulse in unison */
  phase: number;
}

export const SPECIMEN_SRC = '/img/salvator-bust.webp';

/**
 * Placed on the features a viewer already looks at: eyes, mouth, hand, hair, collar.
 *
 * All five are kept clear of the plate's edge dissolve (see the shader). The hand
 * and the collar originally sat right against the crop boundary, where the fade
 * that removes the rectangle also erased the sample sitting on it — a reticle
 * hovering over nothing.
 */
export const REGIONS: Region[] = [
  { x: 0.345, y: 0.235, w: 0.30, h: 0.115, readout: 'grad', block: 0.020, swing: 0.010, phase: 0.0 },
  { x: 0.415, y: 0.445, w: 0.185, h: 0.10, readout: 'grad', block: 0.014, swing: 0.007, phase: 1.7 },
  { x: 0.055, y: 0.545, w: 0.150, h: 0.205, readout: 'lum', block: 0.024, swing: 0.012, phase: 3.1 },
  { x: 0.720, y: 0.585, w: 0.190, h: 0.205, readout: 'grad', block: 0.018, swing: 0.009, phase: 4.4 },
  { x: 0.330, y: 0.775, w: 0.340, h: 0.105, readout: 'lum', block: 0.016, swing: 0.008, phase: 5.6 },
];

export interface Measured {
  /** mean gradient magnitude — the sfumato number */
  grad: number;
  /** mean luminance */
  lum: number;
}

/**
 * Measure every region from the decoded image.
 *
 * Runs once on a scratch canvas at reduced resolution: the statistics are means,
 * so they are stable under downsampling, and the full 820px image is more pixels
 * than the numbers need. Gradient is a forward difference on luminance, scaled to
 * per-pixel units so the value does not depend on the sampling resolution.
 */
export function measure(img: HTMLImageElement, regions: Region[] = REGIONS): Measured[] {
  const W = 320;
  const H = Math.max(1, Math.round((img.naturalHeight / img.naturalWidth) * W));

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return regions.map(() => ({ grad: 0, lum: 0 }));

  ctx.drawImage(img, 0, 0, W, H);
  const { data } = ctx.getImageData(0, 0, W, H);

  // luminance plane, alpha-weighted: the cutout's transparent surround must not
  // drag the means toward zero
  const lum = new Float32Array(W * H);
  const alpha = new Float32Array(W * H);
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    lum[p] = (data[i] * 0.2126 + data[i + 1] * 0.7152 + data[i + 2] * 0.0722) / 255;
    alpha[p] = data[i + 3] / 255;
  }

  return regions.map((r) => {
    const x0 = Math.max(0, Math.floor(r.x * W));
    const y0 = Math.max(0, Math.floor(r.y * H));
    const x1 = Math.min(W - 1, Math.ceil((r.x + r.w) * W));
    const y1 = Math.min(H - 1, Math.ceil((r.y + r.h) * H));

    let sumL = 0;
    let sumG = 0;
    let weight = 0;

    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        const p = y * W + x;
        const a = alpha[p];
        if (a < 0.5) continue;
        const gx = lum[y * W + Math.min(W - 1, x + 1)] - lum[p];
        const gy = lum[Math.min(H - 1, y + 1) * W + x] - lum[p];
        sumL += lum[p] * a;
        sumG += Math.hypot(gx, gy) * a;
        weight += a;
      }
    }

    if (weight === 0) return { grad: 0, lum: 0 };
    return { grad: sumG / weight, lum: sumL / weight };
  });
}

/** Label for a region, e.g. "∇ 0.0138". Fixed width so it does not jitter. */
export function label(region: Region, m: Measured): string {
  return region.readout === 'grad'
    ? `∇ ${m.grad.toFixed(4)}`
    : `μ ${m.lum.toFixed(4)}`;
}
