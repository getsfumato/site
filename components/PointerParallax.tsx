'use client';

import { useEffect } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';

/**
 * A few pixels of pointer-led drift. Purely decorative — it moves something that
 * is already visible, so there is no risk of it hiding content the way a
 * JS-driven entrance would.
 *
 * Springs rather than a raw follow, so the mark lags the cursor slightly and
 * settles instead of snapping.
 */
export default function PointerParallax({
  children,
  amount = 10,
}: {
  children: React.ReactNode;
  /** peak offset in px at the edges of the viewport */
  amount?: number;
}) {
  const reduce = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 60, damping: 18, mass: 0.6 });
  const y = useSpring(rawY, { stiffness: 60, damping: 18, mass: 0.6 });

  useEffect(() => {
    if (reduce) return;
    // a coarse pointer has no hover position to track
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      rawX.set(nx * amount);
      rawY.set(ny * amount);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduce, amount, rawX, rawY]);

  if (reduce) return <>{children}</>;

  return <motion.div style={{ x, y, display: 'flex', justifyContent: 'center' }}>{children}</motion.div>;
}
