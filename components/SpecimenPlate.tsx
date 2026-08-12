'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { REGIONS, SPECIMEN_SRC, label, measure, type Measured } from '@/lib/specimen';

/**
 * The specimen: Salvator Mundi lifted off its ground, with the page sampling it.
 *
 * Three.js does the part that needs a GPU — each region of the painting is
 * quantised into blocks whose size breathes, which is a per-pixel operation over
 * a texture and would be miserable any other way. The reticles and readouts are
 * DOM on top, because 10px type has to stay crisp and selectable and a shader is
 * the wrong tool for typesetting.
 *
 * The readouts are measured from the actual pixels (see lib/specimen.ts) rather
 * than invented: ∇ is mean gradient magnitude, which is literally how gradually
 * tone moves — the quantity sfumato is named for. That is a detail for whoever
 * reads the source, not something the page explains.
 */

const N = 5; // must match REGIONS.length; the shader loop is unrolled at this size

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  precision highp float;

  #define N ${N}

  varying vec2 vUv;

  uniform sampler2D uMap;
  uniform vec4  uRect[N];    // xy = corner, zw = size, in uv space (y up)
  uniform vec2  uBlock[N];   // quantisation step, uv units (x and y, kept square in px)
  uniform float uAmt[N];     // 0 = untouched, 1 = fully quantised
  uniform float uTime;
  uniform float uReveal;     // 0..1 wipe from the foot of the plate upward
  uniform float uGain;       // the panel is five centuries dark and is now the subject

  const vec3 GOLD = vec3(0.796, 0.627, 0.325);

  void main() {
    vec2 uv = vUv;

    // The regions do not overlap, so a pixel belongs to at most one. Find its
    // quantised sample point and how strongly to apply it.
    vec2 q = uv;
    float amt = 0.0;
    float edge = 0.0;

    for (int i = 0; i < N; i++) {
      vec4 r = uRect[i];
      vec2 lo = r.xy;
      vec2 hi = r.xy + r.zw;
      vec2 s = step(lo, uv) * step(uv, hi);
      float inside = s.x * s.y;
      if (inside > 0.5) {
        vec2 b = uBlock[i];
        q = lo + (floor((uv - lo) / b) + 0.5) * b;
        // Ramp the effect in across the region border instead of switching it on.
        // A hard edge here made each sample read as a pasted-on box.
        vec2 din = min(uv - lo, hi - uv);
        amt = uAmt[i] * smoothstep(0.0, 0.018, min(din.x, din.y));
        // distance to the nearest block boundary, for a faint lattice
        vec2 f = abs(fract((uv - lo) / b) - 0.5) * 2.0;
        edge = max(f.x, f.y);
      }
    }

    // Sample both and cross-fade the colours. Mixing the coordinates instead
    // would smear the region toward its block centres rather than dissolve into
    // them.
    vec4 orig = texture2D(uMap, uv);
    vec4 mosaic = texture2D(uMap, q);
    vec4 c = mix(orig, mosaic, amt);

    /* Dissolve the frame edges.
       The matte alone cannot fix this: the subject runs off the crop on three
       sides — the chest is sliced flat at the foot, the arm and the hair at the
       flanks — so the alpha is fully opaque right up to the border and reads as a
       hard rectangle sitting in the page. Fading alpha toward the edges removes
       the boundary wherever it falls, whatever the matte did.
       The foot gets a long fade because that is where the crop cuts through solid
       chest; the crown barely touches its edge and needs almost none. */
    float fadeL = smoothstep(0.0, 0.10, uv.x);
    float fadeR = smoothstep(0.0, 0.10, 1.0 - uv.x);
    float fadeB = smoothstep(0.0, 0.20, uv.y);
    float fadeT = smoothstep(0.0, 0.04, 1.0 - uv.y);
    c.a *= fadeL * fadeR * fadeB * fadeT;

    // Lift it. Straight-alpha texture, so the gain applies to colour only.
    c.rgb = pow(c.rgb, vec3(0.88)) * uGain;

    // hairline lattice inside an active region, so the sampling grid is legible
    float lattice = smoothstep(0.86, 1.0, edge) * amt * 0.28;
    c.rgb += GOLD * lattice * c.a;

    // The plate resolves on entry, crown first. Three.js flips textures on
    // upload, so uv.y = 0 is the foot of the image and 1 - uv.y grows downward
    // from the crown; a pixel is revealed once uReveal has climbed past it.
    // uReveal finishes above 1.0 so the wipe ends fully open rather than closing
    // again as the value passes the top.
    float h = 1.0 - uv.y;
    float wipe = 1.0 - smoothstep(uReveal, uReveal + 0.16, h);
    c.a *= wipe;

    if (c.a < 0.004) discard;
    gl_FragColor = c;
  }
`;

export default function SpecimenPlate() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [measured, setMeasured] = useState<Measured[] | null>(null);
  const [blocks, setBlocks] = useState<number[]>(() => REGIONS.map((r) => r.block));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return; // no WebGL — the server-rendered image fallback stays
    }

    let disposed = false;
    let raf = 0;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearAlpha(0);
    renderer.domElement.setAttribute('aria-hidden', 'true');
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

    const uniforms: Record<string, THREE.IUniform> = {
      uMap: { value: null },
      uRect: { value: REGIONS.map((r) => new THREE.Vector4(r.x, 1 - r.y - r.h, r.w, r.h)) },
      uBlock: { value: REGIONS.map((r) => new THREE.Vector2(r.block, r.block)) },
      uAmt: { value: REGIONS.map(() => 0) },
      uTime: { value: 0 },
      // Open by default. The wipe is an enhancement played on first sight; if the
      // loop never runs — reduced motion, a throttled tab, a dead rAF — the plate
      // must still be visible rather than wiped shut.
      uReveal: { value: 2 },
      uGain: { value: 1.45 },
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      uniforms,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    scene.add(new THREE.Mesh(geometry, material));

    const resize = () => {
      const rect = host.getBoundingClientRect();
      if (rect.width && rect.height) renderer.setSize(rect.width, rect.height, false);
    };
    resize();

    // ---- texture + measurement -----------------------------------------

    let aspect = 1;
    const img = new Image();
    img.decoding = 'async';

    img.onload = () => {
      if (disposed) return;
      aspect = img.naturalWidth / img.naturalHeight;

      const tex = new THREE.Texture(img);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.needsUpdate = true;
      uniforms.uMap.value = tex;

      setMeasured(measure(img));
      setReady(true);
      resize();
      renderer.render(scene, camera); // one open frame; the wipe plays on first sight

      cleanupTex = () => tex.dispose();
    };
    img.src = SPECIMEN_SRC;

    let cleanupTex: (() => void) | null = null;

    // ---- loop -----------------------------------------------------------

    let startedAt = 0;
    // the wipe plays once, the first time the plate is actually looked at
    let played = false;
    // throttle the React state that feeds the DOM readouts; the shader can run at
    // 60fps but re-rendering five labels that often is pointless
    let lastPush = 0;

    const frame = (now: number) => {
      if (!startedAt) startedAt = now;
      const t = (now - startedAt) / 1000;
      uniforms.uTime.value = t;
      if (!played) {
        const rev = -0.16 + (t / 1.1) * 1.32;
        uniforms.uReveal.value = Math.min(1.16, rev);
        if (rev >= 1.16) played = true;
      }

      const amts = uniforms.uAmt.value as number[];
      const blks = uniforms.uBlock.value as THREE.Vector2[];
      const px: number[] = [];

      for (let i = 0; i < REGIONS.length; i++) {
        const r = REGIONS[i];
        // each region is sampled in its own slow cycle: mostly idle, then a pass
        const cycle = (Math.sin(t * 0.42 + r.phase) + 1) / 2;
        amts[i] = 0.25 + 0.75 * Math.pow(cycle, 1.6);
        const b = r.block + r.swing * Math.sin(t * 0.63 + r.phase * 1.7);
        blks[i].set(b, b * aspect);
        px.push(b);
      }

      renderer.render(scene, camera);

      if (now - lastPush > 110) {
        lastPush = now;
        setBlocks(px);
      }

      raf = requestAnimationFrame(frame);
    };

    // ---- reactions ------------------------------------------------------

    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const resume = () => {
      if (raf || reduce.matches || document.hidden || !uniforms.uMap.value) return;
      if (!played) {
        // first sight: close the wipe and let it resolve
        startedAt = 0;
        uniforms.uReveal.value = -0.16;
      }
      raf = requestAnimationFrame(frame);
    };

    const onResize = () => {
      resize();
      if (!raf) renderer.render(scene, camera);
    };
    const onVisibility = () => (document.hidden ? stop() : resume());
    const onMotion = () => {
      if (reduce.matches) {
        stop();
        played = true;
        uniforms.uReveal.value = 2;
        const amts = uniforms.uAmt.value as number[];
        for (let i = 0; i < amts.length; i++) amts[i] = 0.55;
        renderer.render(scene, camera);
      } else {
        startedAt = 0;
        resume();
      }
    };

    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);
    reduce.addEventListener('change', onMotion);

    // only run while on screen
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) resume();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(host);

    return () => {
      disposed = true;
      stop();
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      reduce.removeEventListener('change', onMotion);
      io.disconnect();
      cleanupTex?.();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <figure className="specimen">
      <div className="specimen__stage">
        {/* Paints before WebGL is up and stays if WebGL is unavailable. */}
        <img
          className="specimen__base"
          src={SPECIMEN_SRC}
          alt="Salvator Mundi by Leonardo da Vinci, lifted from its background."
          width={820}
          height={912}
          data-hidden={ready}
        />
        <div className="specimen__gl" ref={hostRef} data-ready={ready} />

        {/* reticles + readouts */}
        <div className="specimen__marks" aria-hidden="true">
          <svg className="specimen__wires" viewBox="0 0 100 100" preserveAspectRatio="none">
            {REGIONS.slice(0, -1).map((r, i) => {
              const next = REGIONS[i + 1];
              return (
                <line
                  key={i}
                  x1={(r.x + r.w / 2) * 100}
                  y1={(r.y + r.h / 2) * 100}
                  x2={(next.x + next.w / 2) * 100}
                  y2={(next.y + next.h / 2) * 100}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </svg>

          {REGIONS.map((r, i) => (
            <div
              key={i}
              className="specimen__box"
              style={{
                left: `${r.x * 100}%`,
                top: `${r.y * 100}%`,
                width: `${r.w * 100}%`,
                height: `${r.h * 100}%`,
              }}
            >
              <span
                className="specimen__label"
                /* anchor right-hand reticles to their right edge, or a nowrap
                   label on the far side hangs off the plate on narrow screens */
                data-side={r.x + r.w > 0.6 ? 'right' : 'left'}
              >
                {measured ? label(r, measured[i]) : '· · · ·'}
                <span className="specimen__block">
                  ▦ {(blocks[i] * 100).toFixed(1)}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* No legend. The readouts are a visual conceit — a machine peering at a
          painting — and spelling out what ∇ and μ mean turned a flourish into a
          lecture. The numbers are still genuinely measured; nobody has to know
          that to enjoy them. */}
    </figure>
  );
}
