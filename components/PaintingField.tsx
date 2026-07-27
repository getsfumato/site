'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * The ground: three Leonardo paintings dissolved into one another.
 *
 * All three plates, the flow distortion, the grain and the vignette resolve in a
 * single fragment shader — one draw call, one full-screen quad. The plates are
 * screen-blended so each painting's own varnished near-black drops out and only
 * the lit passages surface: the figures emerge from the dark instead of sitting
 * in visible rectangles.
 *
 * Progressive enhancement: the CSS plates in globals.css paint on the server
 * render and stay put if WebGL is unavailable. This layer fades in over them
 * once it has textures and has drawn a frame.
 */

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform vec2  uRes;
  uniform float uTime;
  uniform float uMotion;      // 0 freezes the flow, for reduced-motion

  uniform sampler2D uVirgin;
  uniform sampler2D uSalvator;
  uniform sampler2D uBaptism;
  uniform vec3 uAspect;       // texture w/h for each plate, in the same order

  const vec3 GROUND_WARM = vec3(0.071, 0.063, 0.051);
  const vec3 GROUND_DEEP = vec3(0.031, 0.027, 0.024);

  /* A drift field built from layered sines. Not turbulence — it is periodic and
     cheap — but at this amplitude it reads as the paintings breathing, which is
     all it needs to do. */
  vec2 flow(vec2 p, float t) {
    return vec2(
      sin(p.y * 2.6 + t * 0.13) * cos(p.x * 1.8 - t * 0.09),
      cos(p.x * 2.2 - t * 0.11) * sin(p.y * 1.5 + t * 0.15)
    );
  }

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  /* Map plate-local coords in [-1,1] to a uv that covers the rect, cropping the
     overflowing axis — the equivalent of background-size: cover. */
  vec2 coverUV(vec2 p, float rectAspect, float texAspect) {
    vec2 q = p * 0.5 + 0.5;
    if (texAspect > rectAspect) q.x = (q.x - 0.5) * (rectAspect / texAspect) + 0.5;
    else                        q.y = (q.y - 0.5) * (texAspect / rectAspect) + 0.5;
    return q;
  }

  /* One painting, masked to an ellipse that dissolves at the edges. */
  vec3 plate(
    sampler2D tex, vec2 frag, vec2 centre, vec2 halfSize,
    float texAspect, float amount, float warp, float t
  ) {
    vec2 p = (frag - centre) / halfSize;              // plate-local, [-1,1]
    float rectAspect = halfSize.x / halfSize.y;

    vec2 warped = p + flow(p * 1.4, t) * warp;
    float d = length(warped);
    float mask = 1.0 - smoothstep(0.34, 1.02, d);
    if (mask <= 0.001) return vec3(0.0);

    vec2 uv = coverUV(warped, rectAspect, texAspect);
    uv = clamp(uv, vec2(0.001), vec2(0.999));
    return texture2D(tex, uv).rgb * mask * amount;
  }

  void main() {
    // work in a space where x is scaled by the viewport aspect, so the plates
    // keep their shape instead of stretching with the window
    float aspect = uRes.x / uRes.y;
    vec2 frag = vec2(vUv.x * aspect, 1.0 - vUv.y);
    float t = uTime * uMotion;

    // base ground
    float r = length((vec2(vUv.x, 1.0 - vUv.y) - vec2(0.5, 0.42)) * vec2(aspect, 1.0));
    vec3 col = mix(GROUND_WARM, GROUND_DEEP, smoothstep(0.0, 0.9, r));

    vec3 acc = vec3(0.0);
    // Virgin of the Rocks — the cave mouth, entering from the left
    acc += plate(uVirgin, frag, vec2(0.13 * aspect, 0.42), vec2(0.36, 0.54),
                 uAspect.x, 1.08, 0.030, t);
    // Salvator Mundi — the blessing hand and the slate robe, from the right
    acc += plate(uSalvator, frag, vec2(0.88 * aspect, 0.46), vec2(0.34, 0.48),
                 uAspect.y, 1.10, 0.026, t + 40.0);
    // The Baptism of Christ — the gold-richest of the three; a warm floor glow
    acc += plate(uBaptism, frag, vec2(0.52 * aspect, 0.98), vec2(0.64, 0.46),
                 uAspect.z, 0.92, 0.022, t + 80.0);

    // screen blend: the paintings' own blacks vanish, only the lit parts add
    col = 1.0 - (1.0 - col) * (1.0 - clamp(acc, 0.0, 1.0));

    // hold the centre column dark enough to read type over
    float centre = length((vec2(vUv.x, 1.0 - vUv.y) - vec2(0.5, 0.44)) * vec2(aspect, 1.0));
    col *= mix(0.5, 1.0, smoothstep(0.04, 0.72, centre));
    // and pull the frame edges back into the dark
    col *= 1.0 - smoothstep(0.58, 1.20, r) * 0.85;

    // film grain, stepped so it reads as grain rather than a shimmer
    float g = hash(gl_FragCoord.xy + floor(uTime * 12.0) * uMotion);
    col += (g - 0.5) * 0.030;

    gl_FragColor = vec4(max(col, vec3(0.0)), 1.0);
  }
`;

const PLATES = ['/img/virgin.webp', '/img/salvator.webp', '/img/baptism.webp'] as const;

/** Texture.image is typed `unknown`; read the decoded dimensions defensively. */
function texAspect(tex: THREE.Texture): number {
  const img = tex.image as { width?: number; height?: number } | undefined;
  const w = img?.width ?? 1;
  const h = img?.height ?? 1;
  return h > 0 ? w / h : 1;
}

export default function PaintingField() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [dim, setDim] = useState(false);

  // The specimen act puts Salvator Mundi centre stage; leaving him in the
  // background at full strength at the same time reads as a duplicate, so the
  // ambient field steps back while that section is in view.
  useEffect(() => {
    const target = document.getElementById('measure');
    if (!target) return;
    // A ratio threshold cannot fire here: the section is taller than the
    // viewport, so 35% of it is never visible at once. Shrink the root to a
    // middle band instead and dim when the section crosses it.
    const io = new IntersectionObserver(
      ([entry]) => setDim(Boolean(entry?.isIntersecting)),
      { threshold: 0, rootMargin: '-35% 0px -35% 0px' },
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'low-power' });
    } catch {
      return; // no WebGL — the CSS plates stay
    }

    let disposed = false;
    let raf = 0;

    // The field is entirely soft gradients, so full device pixel ratio buys
    // nothing and costs a lot of fill.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    renderer.domElement.setAttribute('aria-hidden', 'true');
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

    const uniforms: Record<string, THREE.IUniform> = {
      uRes: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uMotion: { value: reduce.matches ? 0 : 1 },
      uVirgin: { value: null },
      uSalvator: { value: null },
      uBaptism: { value: null },
      uAspect: { value: new THREE.Vector3(1, 1, 1) },
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      uniforms,
      depthTest: false,
      depthWrite: false,
    });
    scene.add(new THREE.Mesh(geometry, material));

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      (uniforms.uRes.value as THREE.Vector2).set(w, h);
    };
    resize();

    // ---- textures -------------------------------------------------------

    const loader = new THREE.TextureLoader();
    const textures: THREE.Texture[] = [];

    const load = (url: string) =>
      new Promise<THREE.Texture>((resolve, reject) => {
        loader.load(
          url,
          (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.minFilter = THREE.LinearFilter;
            tex.magFilter = THREE.LinearFilter;
            tex.generateMipmaps = false;
            tex.wrapS = THREE.ClampToEdgeWrapping;
            tex.wrapT = THREE.ClampToEdgeWrapping;
            resolve(tex);
          },
          undefined,
          reject,
        );
      });

    void Promise.all(PLATES.map(load))
      .then(([virgin, salvator, baptism]) => {
        if (disposed) {
          [virgin, salvator, baptism].forEach((t) => t.dispose());
          return;
        }
        textures.push(virgin, salvator, baptism);
        uniforms.uVirgin.value = virgin;
        uniforms.uSalvator.value = salvator;
        uniforms.uBaptism.value = baptism;
        (uniforms.uAspect.value as THREE.Vector3).set(
          texAspect(virgin),
          texAspect(salvator),
          texAspect(baptism),
        );

        renderer.render(scene, camera);
        setReady(true);
        if (!reduce.matches) raf = requestAnimationFrame(frame);
      })
      .catch(() => {
        /* leave the CSS plates in place */
      });

    // ---- loop -----------------------------------------------------------

    let startedAt = 0;
    const frame = (now: number) => {
      if (!startedAt) startedAt = now;
      uniforms.uTime.value = (now - startedAt) / 1000;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const resume = () => {
      if (!raf && !reduce.matches && !document.hidden && textures.length) {
        raf = requestAnimationFrame(frame);
      }
    };

    const onResize = () => {
      resize();
      if (!raf) renderer.render(scene, camera);
    };
    const onVisibility = () => (document.hidden ? stop() : resume());
    const onMotion = () => {
      uniforms.uMotion.value = reduce.matches ? 0 : 1;
      if (reduce.matches) {
        stop();
        renderer.render(scene, camera);
      } else {
        resume();
      }
    };

    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);
    reduce.addEventListener('change', onMotion);

    return () => {
      disposed = true;
      stop();
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      reduce.removeEventListener('change', onMotion);
      textures.forEach((t) => t.dispose());
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div className="field" aria-hidden="true" data-dim={dim}>
      <div className="field__css" data-hidden={ready}>
        <div className="plate plate--virgin" />
        <div className="plate plate--baptism" />
        <div className="plate plate--salvator" />
      </div>
      <div className="field__gl" ref={hostRef} data-ready={ready} />
      {!ready && <div className="field__vignette" />}
    </div>
  );
}
