# sfumato.sh

The landing page. Next.js (App Router), TypeScript, Three.js, motion.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run typecheck
npm run glyph      # print the mark as ASCII in the terminal
```

```text
app/
  layout.tsx        fonts + metadata
  page.tsx          composition (server component)
  globals.css       palette, layout, CSS painting fallback, entrance keyframes
components/
  EpicycleMark.tsx  the logo: Fourier epicycles on a 2D canvas
  PaintingField.tsx the ground: three.js shader compositing the paintings
  SpecimenPlate.tsx the specimen: three.js per-region mosaic + measured readouts
  InstallCommand.tsx copy-to-clipboard (motion)
  PointerParallax.tsx pointer-led drift on the mark (motion)
  Reveal.tsx        staggered entrance (CSS, deliberately not motion — see below)
lib/
  fourier.ts        letterform + DFT. Pure; no DOM.
  specimen.ts       the sampled regions, and the code that measures them
scripts/
  preview-glyph.ts  renders lib/fourier.ts as ASCII for iterating the letterform
public/
  install.sh        served at /install.sh
  img/              the three blurred plates + grain
```

## Type

Three faces from [Geist](https://vercel.com/font) via `next/font`, **one job each,
no overlap**:

| Face | Job | Where |
| --- | --- | --- |
| **Geist Pixel Square** | identity and enumeration | the wordmark, the beat numerals |
| **Geist Mono** | machine surfaces | commands, labels, tags, readouts, the mark's characters |
| **Geist Sans** | human language | headings and prose, nothing else |

The reason for that split: Pixel and Mono *rhyme*, because both are grid-derived.
Sans is the humanist outlier, so it is confined to language and kept quiet — low
contrast, generous leading — while Pixel and Mono carry all the chrome.

Two rules keep them in step:

- **Pixel is sized on multiples of the mono cell.** `--cell` is 11px. The beat
  numerals are 2 cells; the wordmark clamps between 4 and 8 cells. The two grids
  never drift.
- **Pixel recurs.** Used once it reads as a lone exotic, which is exactly how it
  looked before: a pixel wordmark floating above a page with no other pixel in it.
  It now appears four times down the page — wordmark plus `01` `02` `03`.

Every mono-voiced label also shares one size, one case and one tracking
(`0.16em`). That repetition is most of what makes the page feel like a single
system rather than a set of panels.

`geist/font/pixel` exports all five pixel variants (Square, Circle, Grid,
Triangle, Line) from one module, so importing it declares five `@font-face` rules.
Only Square is referenced, and unreferenced faces are never downloaded — the cost
is a few hundred bytes of CSS, not five font files.

## Palette

Not eyeballed from the paintings — sampled from them. k-means in CIELab over
downsampled scans, plus a targeted sweep for the accent hues that are too small
in area for k-means to surface. What that showed:

- The three paintings are overwhelmingly **warm earth**. Grounds sit at L\*7–11
  (`#1b1612`, `#201c13`), midtones are umber (`#393126`, `#533e26`).
- **Ochre-gold is the dominant accent** — 24% of the Baptism's pixels
  (`#cba053`, `#ba9c6b`). It became the hero accent.
- Leonardo's **lapis reads as desaturated slate** under five centuries of varnish
  (`#7d818e`, `#475761`) — not the vivid ultramarine you would reach for from
  memory. Slate is the honest secondary.
- Lit flesh and drapery give the **warm ivory** used for text (`#e9e1d1`).

Tokens live in `:root` in `globals.css`.

## Layout and narrative

**One grid, full width.** Everything sits on a single `.wrap` at `86rem`. Two
earlier versions were wrong in opposite directions: full-viewport "acts", where
each one centred its content against an arbitrary amount of empty viewport so
nothing lined up with anything; and then a `46rem` column, which on a 1400px
screen read as a phone layout that forgot to grow up.

The width is filled with **artefacts, not longer lines**. Every beat is the same
two parts — a claim in plain language, and something to look at beside it:

```text
[ 4.5rem ][ 24rem      ][ 1fr                    ]
  rail      copy          artefact
  01        the claim     the command
  02        the claim     the specimen
  03        the claim     the table
```

The rail is the spine: the Pixel numerals line up down the left edge and every
beat hangs off the same axis, with a hairline rule between them. The copy column
is deliberately narrow — **it is the measure**, so `.prose` carries no
`max-width` of its own; a second constraint inside the column is what left a third
of every beat empty in an earlier pass.

The hero follows the same logic: the mark sits *beside* the name rather than above
it, because stacked and centred it left the whole upper half of a wide screen
empty.

Three collapse stages, verified at 320 / 390 / 560 / 760 / 1100 / 1409:

| Below | What changes |
| --- | --- |
| `68rem` | the artefact drops beneath the copy, rail stays |
| `52rem` | the hero stacks and centres |
| `44rem` | the rail becomes a header row above the copy |

One spacing scale (`--s-1` … `--s-7`) is used for every vertical gap. No ad-hoc
margins.

### The three beats

They are the shape of a run, in the user's terms rather than the implementation's:

1. **grounded** — it works from the material you hand it, so you get your material
   explained rather than a generic summary of the topic.
2. **inspected** — nothing ships on the first draft; a correction is kept only when
   it makes the result better.
3. **filed** — every run is kept as its own version and published where you want it.

Earlier drafts of this copy named the parsers, the exact inspection viewports and
the patch semantics. All true, all in `sfumato-cli/docs`, and none of it something
a reader can act on — it read as a changelog. The claim survives; the internals
went back to the docs where they belong.

The specimen lives **inside beat 02** because that is what it illustrates. Standing
alone under a heading of its own it was a museum digression with no connection to
the product.

## The mark

`lib/fourier.ts` + `components/EpicycleMark.tsx`.

The letter is the **S of sfumato drawn the way an integral is drawn**.

A literal ∫ was tried first and does not work: it is essentially one long, almost
straight stem, and on a character grid this size it reads as a diagonal slash
rather than a letter. So the mark keeps what makes an S legible — two bowls with
a waist crossing between them, the upper opening right and the lower opening
left — and takes its proportions and terminals from the integral: taller and
narrower than a text S, steeply inclined, and finished at both ends with a hook
that curls away from the stroke instead of stopping flat.

1. **Letterform.** Both letters share 2-fold rotational symmetry, so only the top
   half is authored (`HALF_SPINE` — terminal hook, over the top, down the bowl,
   into the waist) and the bottom half is its reflection through the centre. The
   symmetry is exact and the inflection at the waist is smooth by construction,
   because the reflected tangent matches the incoming one.

   That spine is offset to both sides by a broad-nib width model: stroke weight
   is `|sin(travel − nib)|`, which is how a chisel pen behaves. Hold the nib
   near-horizontal (`nib: -18°`) and the near-vertical parts of the stroke come
   out thick while the horizontal passages thin to hairlines — the stress a real
   integral has. Offsetting both sides and joining them yields a **closed**
   contour, which matters: an open stroke makes the DFT wrap discontinuously and
   the pen flies across the canvas once per period.

   The terminals are the first thing to break at small sizes, which is why
   `hairline` is floored at 0.2 and `taper` kept short (0.11), and why the glyph
   frame does not shrink below 248px — below roughly that the grid gets too
   coarse to hold the hooks together.

2. **Transform.** The contour is resampled to uniform arc length (unequal
   spacing skews the spectrum), **centred on its mean**, then run through an
   O(N²) DFT. Centring first is not cosmetic: the k=0 bin is the centroid, a
   fixed translation rather than a rotation. Left in, it dominates the magnitude
   sort and gets drawn as an enormous circle that never turns.

3. **Render.** The letter is precomputed as a field of per-cell coverage from the
   *reconstructed* contour, so the grid shows the Fourier approximation and
   nothing else. Because that contour encloses the stroke, filling it yields a
   solid letter; tracing only the boundary leaves a hollow, ragged glyph at this
   size. Each cell also records the phase at which the pen first reaches it.

**The chain never stops.** The first revolution reveals the letter as the pen
arrives at each cell; after that the letter stands complete and the chain keeps
orbiting, with a travelling point of heat where the pen currently is. A one-shot
animation makes the epicycles invisible to anyone who arrives a few seconds late,
which defeats the point of showing them. The loop pauses when the mark scrolls
out of view or the tab is hidden. Click the mark to replay the reveal.

Tunables are constants at the top of each file: `CELL`, `RAMP`, `FIT`,
`PERIOD_MS`, `HEAT_*` in the component; `nib`, `nibWidth`, `hairline`, `slant`,
`taper`, `harmonics` in `fourier.ts`.

### Iterating on the letterform

`npm run glyph -- [width] [height] [fit] [cell]` prints the mark as ASCII from
the real geometry. Reading the coverage field as text is far more precise than
squinting at a canvas — reshape `HALF_SPINE` and re-run. `?debug` on the page
also exposes the live coverage field on `window.__glyph`.

## The ground

`components/PaintingField.tsx`. All three plates, the flow distortion, the grain
and the vignette resolve in a **single fragment shader** — one draw call, one
full-screen quad.

The plates are screen-blended (`1 - (1-a)(1-b)`), so each painting's own
varnished near-black drops out and only the lit passages surface: the figures
emerge from the dark instead of sitting in visible rectangles. The flow field is
layered sines, not turbulence — periodic and cheap, but at this amplitude it
reads as the paintings breathing, which is all it needs to do.

Rendered at a capped pixel ratio (1.25): the field is entirely soft gradients, so
full DPR buys nothing and costs a lot of fill.

**Progressive enhancement.** The CSS plates in `globals.css` paint on the server
render and stay put if WebGL is unavailable; the GL layer fades in over them once
it has textures and has drawn a frame. Reduced-motion freezes the flow and grain
to a single static composition.

The plates are pre-blurred at build time rather than blurred at runtime — a
heavily blurred image compresses to ~20KB. All three plus the grain come to under
100KB. They were produced from Wikimedia Commons scans: cropped to remove
photographed frames, downscaled to 1100px, Gaussian blur r14, brightness +12%,
saturation +18% (the scans are very dark under the page's own darkness), WebP q76.

All three paintings are public domain: *Virgin of the Rocks* (Louvre),
*Salvator Mundi*, and *The Baptism of Christ* (Verrocchio & Leonardo, Uffizi).

## The specimen

`components/SpecimenPlate.tsx` + `lib/specimen.ts`. The second act: Salvator Mundi
lifted off his ground, with the page sampling him — reticles, leader lines and
numeric readouts over a figure whose regions quantise into blocks.

**It is a flourish, and it carries no legend.** A machine peering at a Leonardo is
the whole idea; captioning it with "∇ mean gradient magnitude / μ mean luminance"
turned a visual conceit into a lecture, so that legend is gone.

**The numbers are still real** — that is for whoever reads the source, not
something the page explains. Each region reports the mean luminance (μ) of its
pixels and the mean gradient magnitude (∇), and ∇ is the quantity sfumato is named
for: how gradually brightness changes. The values land around 0.025, an order of
magnitude below what a hard-edged image gives. Inventing plausible confidence
scores would have been easier and would have meant nothing. Measured once on mount
from a 320px scratch canvas; the statistics are means, so they are stable under
downsampling. Alpha-weighted, or the cutout's transparent surround would drag them
toward zero.

**Division of labour.** Three.js does the per-region mosaic, because quantising a
texture per pixel is what a fragment shader is for: the regions arrive as a `vec4`
rect array, the loop is unrolled at `#define N 5`, and each region cross-fades
between the original sample and the block-centre sample. Cross-fading the
*colours* and not the *coordinates* matters — mixing coordinates smears a region
toward its block centres instead of dissolving into them. The reticles and labels
are DOM, because 10px type has to stay crisp and a shader is the wrong tool for
typesetting.

The plate wipes in from the foot on entry. `uReveal` finishes above 1.0 on
purpose: a wipe whose window ends at exactly 1.0 closes again as the value passes
it, which is precisely the bug that made the figure vanish during development.

The ambient field dims to 34% while this act is on screen — Salvator is the
subject here, and leaving him in the background at full strength at the same time
reads as a duplicate. Driven by an IntersectionObserver with a
`-35% 0px -35% 0px` root margin: a ratio threshold cannot work, because the
section is taller than the viewport and 35% of it is never visible at once.

### Why the plate has no edges

The cutout's alpha removes the background, but it cannot remove the *crop*. The
subject runs off the frame on three sides — the chest is sliced flat at the foot,
the arm and the hair at the flanks — so alpha stays fully opaque right up to the
border and the plate reads as a rectangle sitting in the page.

So the shader fades alpha toward each edge, which removes the boundary wherever it
falls regardless of what the matte did. The fades are per-edge and not equal: the
foot gets a long one (20% of the height) because that is where the crop cuts
through solid chest, the flanks get 10%, and the crown almost none since it barely
touches its edge.

Two consequences worth knowing before touching either file:

- **`REGIONS` must stay clear of the fade.** The hand and the collar originally sat
  against the crop boundary, and the fade that removed the rectangle also erased
  the material under those two reticles — leaving them hovering over nothing. Both
  moved inward. Moving a region changes its readout, because the readout is
  measured from whatever is actually underneath it.
- **The mosaic ramps in across each region border** rather than switching on at a
  hard rectangle, for the same reason: an abrupt edge made every sample read as a
  pasted-on box.

### The cutout

`public/img/salvator-bust.webp` — 120KB, WebP with alpha.

Produced with u2netp, a 4.5MB saliency model, run through onnxruntime. Two things
worth knowing if it is ever regenerated:

- **A chiaroscuro key does not work.** Luminance plus warmth (r-b) looked like the
  thematically apt approach and produced a soft veil that never reached alpha 0 —
  these voids are warm dark brown, not neutral, so the warmth term contributes
  everywhere. On a near-black page it passes; on anything else it is a faint
  rectangle.
- **The Virgin of the Rocks cannot be matted this way at all.** Her cave and
  foliage are tonally continuous with the figures — which is the whole point of
  sfumato — so neither a key nor saliency separates them. Salvator Mundi works
  because he is one figure against a genuine void.
- u2netp is a *saliency* model: it keeps the face, hair, blessing hand and collar
  and discards the lapis robe as background. Rather than fight that, the frame is
  cropped to the bust, which is where the matte is clean and which is the stronger
  composition anyway. The edge is feathered ~1.5px; a razor-sharp cutout of a
  sfumato painting reads as a sticker.

## Where motion is and is not used

`motion` drives the copy-button label swap (`AnimatePresence`), its press
spring, and the pointer parallax on the mark — things that move content which is
**already visible**.

The entrance reveal is deliberately **CSS keyframes**, not motion. An entrance
that starts at `opacity: 0` decides whether content is visible at all, so it must
not depend on JavaScript: `motion.div` with `initial={{ opacity: 0 }}`
server-renders the hidden state inline, and anything that stops the animation
from running — no JS, a hydration error, a throttled background tab — leaves the
page blank. This was a real regression during development, caught on a
backgrounded tab. A keyframe animation degrades to "visible" on its own.

## install.sh

POSIX `sh`, safe under `curl … | sh`: no prompts, no interactive assumptions.
Detects OS and architecture (including musl hosts), resolves the latest release
tag, downloads the matching tarball, verifies its SHA-256 when a `.sha256` is
published, installs to `~/.local/bin` via a temp-name-then-rename so a running
binary is never truncated, clears the macOS quarantine flag, and prints a
shell-specific PATH hint when the directory is not on `PATH`.

Overrides: `SFUMATO_VERSION`, `SFUMATO_BIN_DIR`, `SFUMATO_NO_MODIFY_PATH`.

Expected release assets:

```text
sfumato-v<version>-<target>.tar.gz
sfumato-v<version>-<target>.tar.gz.sha256   (optional)
```

with `<target>` a Rust triple: `aarch64-apple-darwin`, `x86_64-apple-darwin`,
`x86_64-unknown-linux-gnu`, `aarch64-unknown-linux-gnu`, and the `-musl`
variants.

> **Not functional yet.** `getsfumato/cli` has no published releases, so the
> installer falls through to building from source with `cargo install --git`
> (the repo is public, so that path works today). Publish a tagged release with
> assets named as above and the fast path starts working with no change to the
> script. `sfumato` is also not on crates.io — once it is, simplify
> `cargo_fallback()` to `cargo install sfumato --locked`.

## Deploy

Vercel, zero config. `next.config.mjs` sets `install.sh` to `text/plain` so it
renders in a browser instead of downloading — people do read install scripts
before piping them to a shell — marks `img/` immutable, and sets
`nosniff` / `DENY` / `strict-origin-when-cross-origin`.

`npm audit` reports three high-severity advisories in `postcss` and `sharp`.
Both are Next's own pinned dependencies; `npm audit fix --force` "resolves" them
by downgrading Next to 9.3.3. They are build-time/image-processing paths, not
reachable by a visitor to a static page. Left alone pending a Next patch.
