'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

const COMMAND = 'curl -fsSL https://sfumato.sh/install.sh | sh';

type State = 'idle' | 'copied' | 'failed';

/** execCommand path for non-secure contexts and older Safari. */
function legacyCopy(text: string): boolean {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  document.body.removeChild(ta);
  return ok;
}

export default function InstallCommand() {
  const [state, setState] = useState<State>('idle');
  const codeRef = useRef<HTMLElement>(null);
  const timer = useRef<number>(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(COMMAND);
      } else if (!legacyCopy(COMMAND)) {
        throw new Error('copy rejected');
      }
      setState('copied');
    } catch {
      setState('failed');
      // leave the command selected so the keyboard shortcut is one step away
      const node = codeRef.current;
      if (node) {
        const range = document.createRange();
        range.selectNodeContents(node);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState('idle'), 2000);
  };

  const label = state === 'copied' ? 'copied' : state === 'failed' ? 'select it' : 'copy';

  return (
    <section className="install" aria-labelledby="install-label">
      <h2 className="visually-hidden" id="install-label">
        Install sfumato
      </h2>
      <div className="install__row">
        <code className="install__cmd" ref={codeRef}>
          <span className="install__prompt">$</span> {COMMAND}
        </code>
        <motion.button
          className="copy"
          type="button"
          onClick={copy}
          data-state={state}
          whileTap={{ scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          {/* the label swaps rather than cross-fades in place, so the width
              change does not make the text jitter mid-transition */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16, ease: [0.22, 0.61, 0.36, 1] }}
              style={{ display: 'inline-block' }}
            >
              {label}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>
      {/* The honest status, not a footnote — the same reason it used to say this
          compiles from source. Prebuilt binaries exist now, so what a visitor needs
          to know is which platforms and that rendering wants a browser. An audience
          that reads install scripts before running them is owed the caveats up
          front rather than after piping to a shell. */}
      <p className="install__status">
        Prebuilt binary, checksum verified. macOS and Linux; Apple&nbsp;Silicon,
        x86_64, aarch64. Generating a resource also wants a Chromium-family browser,
        and <code>marp</code> or <code>ffmpeg</code> depending on what you make —{' '}
        <code>sfumato renderer doctor</code> says what is missing.
      </p>
      <p className="install__alt">
        <a href="https://github.com/getsfumato/sfumato#quick-start">Build it by hand instead</a>
      </p>
    </section>
  );
}
