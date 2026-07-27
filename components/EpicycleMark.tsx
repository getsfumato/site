'use client';

import { useEffect, useRef } from 'react';
import { integralGlyph, penAt, type Point } from '@/lib/fourier';

/**
 * The mark: an S drawn in the manner of an integral sign by a chain of Fourier
 * epicycles, rendered as ASCII characters.
 *
 * The chain never stops. On the first revolution the letter is revealed as the
 * pen reaches each cell; after that the letter stands complete and the chain
 * keeps orbiting, with a travelling point of heat where the pen currently is.
 * A one-shot animation would mean the epicycles are invisible to anyone who
 * arrives a few seconds late — which defeats the point of showing them.
 */

const CELL = 8; // ASCII grid pitch, CSS px
const RAMP = ['.', ':', '-', '=', '+', '*', '#', '@'] as const;
const FIT = 0.62; // share of the frame the letter occupies

const PERIOD_MS = 6000; // one revolution of the chain
const HEAT_DECAY = 0.935; // per-frame falloff of the pen's glow
const HEAT_RADIUS = 2.2; // cells

const GOLD = [203, 160, 83] as const;
const IVORY = [233, 225, 209] as const;
const SLATE = [125, 129, 142] as const;

type RGB = readonly [number, number, number];

function mix(a: RGB, b: RGB, t: number): [number, number, number] {
  const k = t < 0 ? 0 : t > 1 ? 1 : t;
  return [
    Math.round(a[0] + (b[0] - a[0]) * k),
    Math.round(a[1] + (b[1] - a[1]) * k),
    Math.round(a[2] + (b[2] - a[2]) * k),
  ];
}

function distToSeg(px: number, py: number, a: Point, b: Point): number {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const l2 = dx * dx + dy * dy;
  let t = l2 ? ((px - a[0]) * dx + (py - a[1]) * dy) / l2 : 0;
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  return Math.hypot(a[0] + dx * t - px, a[1] + dy * t - py);
}

export default function EpicycleMark() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { harmonics, box } = integralGlyph();

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

    // ---- geometry, recomputed on resize ---------------------------------
    let W = 0;
    let H = 0;
    let scale = 1;
    let ox = 0;
    let oy = 0;
    let cols = 0;
    let rows = 0;
    let cover = new Float32Array(0);
    let arrival = new Float32Array(0);
    let heat = new Float32Array(0);
    // resolved once per layout: reading it per frame forces a style recalc
    let fontSpec = `500 ${CELL + 3}px monospace`;

    /** Pen position in canvas px at chain phase t. */
    const pen = (t: number, circles?: Array<[number, number, number]>): Point => {
      const raw: Array<[number, number, number]> | undefined = circles ? [] : undefined;
      const [x, y] = penAt(harmonics, t, raw);
      if (circles && raw) {
        for (const [cx, cy, r] of raw) {
          const rr = r * scale;
          // the tail of the chain is sub-pixel; drawing it is just noise
          if (rr > 1.1) circles.push([cx * scale + ox, cy * scale + oy, rr]);
        }
      }
      return [x * scale + ox, y * scale + oy];
    };

    /**
     * Build the letter as per-cell coverage, plus the phase at which the pen
     * first arrives at each cell.
     *
     * The polygon is the *reconstruction* — the path the chain actually walks —
     * so the grid shows the Fourier approximation and nothing else. Because that
     * path is a closed contour around the stroke, filling it yields a solid
     * letter with the integral's thick stem and hairline hooks intact; tracing
     * only the boundary leaves a hollow, ragged glyph at this size.
     */
    const buildField = () => {
      const N = 512;
      const poly: Point[] = [];
      for (let i = 0; i < N; i++) poly.push(pen((i / N) * Math.PI * 2));

      cover = new Float32Array(cols * rows);
      arrival = new Float32Array(cols * rows);
      heat = new Float32Array(cols * rows);

      const reach = CELL * 0.9;

      for (let cy = 0; cy < rows; cy++) {
        for (let cx = 0; cx < cols; cx++) {
          const px = cx * CELL + CELL / 2;
          const py = cy * CELL + CELL / 2;

          let best = Infinity;
          let bestI = 0;
          let inside = false;
          for (let i = 0; i < poly.length; i++) {
            const a = poly[i];
            const b = poly[(i + 1) % poly.length];
            const d = distToSeg(px, py, a, b);
            if (d < best) {
              best = d;
              bestI = i;
            }
            // even-odd crossing test, folded into the same pass
            if (a[1] > py !== b[1] > py) {
              const x = a[0] + ((py - a[1]) / (b[1] - a[1])) * (b[0] - a[0]);
              if (px < x) inside = !inside;
            }
          }

          const signed = inside ? -best : best;
          if (signed > reach) continue;

          const v = Math.min(1, Math.max(0, (CELL * 0.75 - signed) / (CELL * 1.5)));
          if (v <= 0.02) continue;

          const idx = cy * cols + cx;
          cover[idx] = v;
          arrival[idx] = bestI / poly.length;
        }
      }
    };

    const layout = (): boolean => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return false;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width;
      H = rect.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const mono = getComputedStyle(canvas).getPropertyValue('--font-mono').trim();
      fontSpec = `500 ${CELL + 3}px ${mono || 'ui-monospace, monospace'}`;
      ctx.font = fontSpec;

      scale = Math.min(W / (box.x1 - box.x0), H / (box.y1 - box.y0)) * FIT;
      ox = W / 2 - ((box.x0 + box.x1) / 2) * scale;
      oy = H / 2 - ((box.y0 + box.y1) / 2) * scale;

      cols = Math.ceil(W / CELL) + 1;
      rows = Math.ceil(H / CELL) + 1;
      buildField();
      return true;
    };

    // ---- painting -------------------------------------------------------

    const drawField = (revealed: number) => {
      ctx.font = fontSpec;
      for (let cy = 0; cy < rows; cy++) {
        for (let cx = 0; cx < cols; cx++) {
          const idx = cy * cols + cx;
          const v = cover[idx];
          if (v <= 0.02) continue;
          if (arrival[idx] > revealed) continue;

          const ch = RAMP[Math.min(RAMP.length - 1, Math.floor(v * RAMP.length))];
          const h = heat[idx];

          // heavier coverage reads lighter; the pen's heat pushes it to ivory
          let col = mix(GOLD, IVORY, Math.max(0, (v - 0.4) / 0.6));
          if (h > 0.01) col = mix(col, IVORY, Math.min(1, h));

          const alpha = Math.min(1, (0.32 + v * 0.68) * (1 + h * 0.5));
          ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${alpha})`;
          ctx.fillText(ch, cx * CELL + CELL / 2, cy * CELL + CELL / 2);
        }
      }
    };

    const drawChain = (circles: Array<[number, number, number]>, tip: Point, alpha: number) => {
      if (alpha <= 0.01 || !circles.length) return;

      // radii, chained centre to centre
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${GOLD.join(',')},${0.32 * alpha})`;
      ctx.beginPath();
      ctx.moveTo(circles[0][0], circles[0][1]);
      for (let i = 1; i < circles.length; i++) ctx.lineTo(circles[i][0], circles[i][1]);
      ctx.lineTo(tip[0], tip[1]);
      ctx.stroke();

      // the circles themselves
      ctx.strokeStyle = `rgba(${SLATE.join(',')},${0.3 * alpha})`;
      ctx.beginPath();
      for (const [cx, cy, r] of circles) {
        ctx.moveTo(cx + r, cy);
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
      }
      ctx.stroke();

      // the pen
      ctx.beginPath();
      ctx.arc(tip[0], tip[1], 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${IVORY.join(',')},${0.95 * alpha})`;
      ctx.shadowColor = `rgba(${GOLD.join(',')},${0.9 * alpha})`;
      ctx.shadowBlur = 16;
      ctx.fill();
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    /** Bump the heat field around the pen so its travel is visible on the letter. */
    const stokeHeat = (tip: Point) => {
      const cx = tip[0] / CELL;
      const cy = tip[1] / CELL;
      const r = Math.ceil(HEAT_RADIUS);
      for (let y = Math.floor(cy) - r; y <= Math.floor(cy) + r; y++) {
        for (let x = Math.floor(cx) - r; x <= Math.floor(cx) + r; x++) {
          if (x < 0 || y < 0 || x >= cols || y >= rows) continue;
          const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
          if (d > HEAT_RADIUS) continue;
          const idx = y * cols + x;
          const add = (1 - d / HEAT_RADIUS) * 0.5;
          if (add > heat[idx]) heat[idx] = add;
        }
      }
    };

    // ---- loop -----------------------------------------------------------

    let raf = 0;
    let start = 0;
    let running = true;

    const still = () => {
      ctx.clearRect(0, 0, W, H);
      heat.fill(0);
      drawField(1);
      const circles: Array<[number, number, number]> = [];
      const tip = pen(0, circles);
      drawChain(circles, tip, 0.5);
    };

    const frame = (now: number) => {
      if (!start) start = now;
      const elapsed = now - start;
      const turns = elapsed / PERIOD_MS;

      // reveal saturates after the first revolution; the chain keeps going
      const revealed = Math.min(1, turns);
      const phase = turns * Math.PI * 2;

      for (let i = 0; i < heat.length; i++) heat[i] *= HEAT_DECAY;

      const circles: Array<[number, number, number]> = [];
      const tip = pen(phase, circles);
      stokeHeat(tip);

      ctx.clearRect(0, 0, W, H);
      drawField(revealed);
      // Full strength while it draws — that is the show — then well back, so the
      // letter is what you read and the mechanism is what you notice second.
      drawChain(circles, tip, revealed < 1 ? 1 : 0.5);

      if (running) raf = requestAnimationFrame(frame);
    };

    const play = () => {
      cancelAnimationFrame(raf);
      running = true;
      start = 0;
      raf = requestAnimationFrame(frame);
    };

    const boot = () => {
      if (!layout()) return;
      if (reduce.matches) {
        running = false;
        still();
      } else {
        play();
      }
    };

    // Wait for the mono face before measuring: drawing early would bake in
    // fallback metrics for the whole grid.
    let cancelled = false;
    const mono = getComputedStyle(document.documentElement).getPropertyValue('--font-mono').trim();
    const ready = document.fonts?.load
      ? document.fonts.load(`500 ${CELL + 3}px ${mono || 'monospace'}`).catch(() => {})
      : Promise.resolve();
    void ready.then(() => {
      if (!cancelled) boot();
    });

    // ---- reactions ------------------------------------------------------

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (!layout()) return;
        // reallocating the backing store clears it; if the loop is stopped,
        // put the settled mark back
        if (!running) still();
      }, 160);
    };
    window.addEventListener('resize', onResize);

    const onMotionChange = () => {
      if (reduce.matches) {
        running = false;
        cancelAnimationFrame(raf);
        still();
      } else {
        play();
      }
    };
    reduce.addEventListener('change', onMotionChange);

    // Pause when off-screen or on a hidden tab — no reason to burn frames.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting && !reduce.matches) {
          if (!running) {
            running = true;
            raf = requestAnimationFrame(frame);
          }
        } else {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!reduce.matches) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    const onClick = () => {
      if (!reduce.matches) play();
    };
    canvas.addEventListener('click', onClick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      reduce.removeEventListener('change', onMotionChange);
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('click', onClick);
      io.disconnect();
    };
  }, []);

  return (
    <div className="glyph">
      <canvas
        ref={canvasRef}
        width={290}
        height={387}
        role="img"
        title="Draw it again"
        aria-label="The letter S, drawn in the manner of an integral sign by a rotating chain of Fourier epicycles, rendered in ASCII characters."
      />
    </div>
  );
}
