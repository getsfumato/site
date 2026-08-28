---
name: sfumato
description: One screen — a Leonardo surfacing out of warm varnished dark, a pixel wordmark, one command, three icons.
colors:
  ink-000: "#080706"
  ink-050: "#0b0908"
  ink-100: "#12100d"
  gold: "#cba053"
  gold-dim: "#a28757"
  gold-deep: "#946712"
  ivory: "#e9e1d1"
  ivory-dim: "#b9b2a0"
  ivory-mute: "#8c8578"
typography:
  display:
    fontFamily: "Geist Pixel Square, ui-monospace, monospace"
    fontSize: "clamp(2.75rem, 9vw, 8.25rem)"
    fontWeight: 400
    lineHeight: 0.86
    letterSpacing: "0.02em"
  lede:
    fontFamily: "Geist Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(0.9375rem, 2.6vw, 1.0625rem)"
    fontWeight: 300
    lineHeight: 1.6
  label:
    fontFamily: "Geist Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0.16em"
  code:
    fontFamily: "Geist Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.7
  code-fluid:
    fontFamily: "Geist Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "clamp(0.625rem, 2.5vw, 0.75rem)"
    fontWeight: 400
    lineHeight: 1.6
  code-micro:
    fontFamily: "Geist Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "0.5625rem"
    fontWeight: 400
    lineHeight: 1.6
  readout:
    fontFamily: "Geist Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "0.5625rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0.04em"
    fontFeature: "tabular-nums"
rounded:
  none: "0"
  panel: "10px"
spacing:
  cell: "0.6875rem"
  s-1: "0.5rem"
  s-2: "0.75rem"
  s-3: "1.25rem"
  s-4: "2rem"
components:
  stage:
    backgroundColor: "transparent"
    textColor: "{colors.ivory}"
    rounded: "{rounded.none}"
    padding: "2rem clamp(1.25rem, 5vw, 2rem)"
  specimen:
    backgroundColor: "radial-gradient(58% 46% at 50% 46%, rgba(148, 103, 18, 0.16), transparent 72%)"
    rounded: "{rounded.none}"
    width: "min(clamp(200px, 28vw, 300px), 36vh)"
  reticle:
    backgroundColor: "transparent"
    textColor: "{colors.ivory-dim}"
    typography: "{typography.readout}"
    rounded: "{rounded.none}"
  install-row:
    textColor: "{colors.ivory}"
    typography: "{typography.code-fluid}"
    rounded: "{rounded.panel}"
    width: "100%"
  copy-button:
    backgroundColor: "transparent"
    textColor: "{colors.gold-dim}"
    typography: "{typography.code}"
    rounded: "{rounded.none}"
    padding: "0 1.1rem"
  copy-button-hover:
    backgroundColor: "rgba(203, 160, 83, 0.08)"
    textColor: "{colors.gold}"
  platform-line:
    textColor: "{colors.ivory-mute}"
    typography: "{typography.label}"
  icon-link:
    backgroundColor: "transparent"
    textColor: "{colors.ivory-mute}"
    rounded: "{rounded.panel}"
    width: "44px"
    height: "44px"
  icon-link-hover:
    backgroundColor: "rgba(203, 160, 83, 0.08)"
    textColor: "{colors.gold}"
---

# Design System: sfumato

## Overview

**Creative North Star: "One Screen, One Action"**

A five-century-old painting surfaces out of the dark, the name sits into its base,
and under it there is exactly one thing to do. The page is a single centred column
that fits in a viewport: the measured plate, the wordmark, one line of language, the
install command, three icons. Nothing scrolls and nothing enumerates features — a visitor
who has read the line either runs the command or follows a link, and everything
that was neither of those has been removed.

The register is warm, varnished and tonally continuous: things emerge from
near-black rather than sitting on it. Salvator Mundi carries the identity, and he
carries it *as a specimen* — the page samples five regions of the painting and
reports what it measures there, in mono, at 9px. That is the tension the whole
system runs on: the painting is tonally continuous, the instrument reading it is
gridded and unhurried, and the product's name is what happens between them. The
plate is the only place the page still speaks in that machine voice at any volume;
the command and the platform line are the quiet end of it.

Nothing here is decided by taste where it could be decided by measurement. The
palette is sampled from the three source paintings by k-means in CIELab, not
eyeballed from them — which is why ochre-gold rather than any brand hue is the
accent. The specimen's readouts are computed from the actual pixels underneath
them: μ is mean luminance and ∇ is mean gradient magnitude, which is literally how
gradually tone moves — the quantity sfumato is named for. The vitruvian glyph in
the link row was drawn against the original at 20, 28, 64 and 140px and reduced to
the parts that survive at icon size. That provenance is load-bearing: a contributor
who substitutes a plausible-looking value for a measured one has broken the system
even if it looks identical.

**Key Characteristics:**

- One screen, one action; no sections, no scroll, no feature list.
- Warm near-black ground (`#0b0908`), never neutral grey and never cool.
- One accent hue, ochre-gold, sampled from the Baptism's halos.
- Three type faces, one job each, and only one sentence of language.
- Depth by emergence — atmosphere, masks and light pools, not shadows.
- Imagery has no edge: every plate and the specimen dissolve to zero alpha.
- Every number on screen is measured, or it is not on screen.

**Removed, and not to be reintroduced.** Two things were cut rather than refined:

- **The epicycle mark.** The wordmark's S used to be reconstructed from its own
  Fourier series and rendered as an orbiting ASCII field. It was the most
  interesting object on the page and it was also the reason the name arrived second.
  The pixel wordmark carries the identity alone now.
- **The three beats.** A rail of Pixel numerals, prose columns and code snippets
  arguing the product in three acts. All of it was true and none of it was necessary
  to install a CLI.

**Kept, and moved.** The specimen plate went out with the beats in that pass and
came straight back: it is the animation that makes the page feel like it is *doing*
something, and its shader is also the only thing that removes the crop from the
bust. It now opens the page instead of sitting in act two.

If a future pass wants a feature list or a second act, it belongs in the docs site,
not here. The plate is the exception that already exists — do not add a second one.

## Colors

Warm earth read through varnish: three near-blacks, one gold family, three ivories
for language and chrome. Nine values, all of them in use — the palette holds no
token that nothing references.

### Primary

- **Halo Gold** (`#cba053`): the hero accent, sampled from the Baptism's halos where
  it accounts for 24% of pixels. Reserved for the things the eye must find — the `$`
  prompt, a hovered icon, focus rings, the wordmark's glow. Never a fill, never a
  background.
- **Patina Gold** (`#a28757`): the quiet gold for something interactive but at rest —
  the copy button's idle label.
- **Deep Ochre** (`#946712`): gold pushed into shadow. The selection background.
  Too dark for text on the ground; treat it as a *material*, not a text colour.

### Neutral

- **Cave Black** (`#080706`): the deepest ground — the radial field's far falloff and
  the vignette's outer edge.
- **Ground Black** (`#0b0908`): the page ground and the browser theme colour. Warm,
  not neutral — its red channel is deliberately above its blue.
- **Umber Black** (`#12100d`): the lifted centre of the field's radial gradient.
- **Lit Ivory** (`#e9e1d1`): the wordmark and the command. The brightest thing on the
  page must be one of those two.
- **Veiled Ivory** (`#b9b2a0`): the single line of language under the name.
- **Muted Ivory** (`#8c8578`): mono chrome at rest — the platform line and the icons.

The specimen adds two non-token values that belong to the plate rather than to the
palette: `rgba(233,225,209,0.16–0.46)` for the reticle borders as they breathe, and
`rgba(233,225,209,0.18)` for the leader lines between regions. They are ivory at low
alpha by the same logic as the hairline — never a solid grey.

### Named Rules

**The Rationed Light Rule.** Gold is light, not paint. It appears as thin strokes,
small marks and single glyphs — never as a filled button, badge, panel or block. If
a gold region is large enough to read as a shape, it is wrong.

**The Warm Ground Rule.** Every dark value has more red than blue. There is no
neutral grey and no cool black anywhere in the palette. A `#0a0a0a` or a
`slate-950` is an immediate identity break, however subtle it looks alone.

**The Three-Tier Text Rule.** Language descends through exactly three ivories — Lit
for the name and the command, Veiled for the sentence, Muted for chrome. Reaching
for an opacity on ivory instead of the next tier down fragments the ramp. There is
no fourth tier: the page no longer has anything quiet enough to need one.

## Typography

**Display Font:** Geist Pixel Square (with `ui-monospace`, monospace)
**Body Font:** Geist Sans (with `ui-sans-serif`, `system-ui`, sans-serif)
**Label/Mono Font:** Geist Mono (with `ui-monospace`, `SF Mono`, Menlo, monospace)

**Character:** Pixel and Mono *rhyme* — both are grid-derived, so they read as one
mechanical voice at two volumes: the name and the numbers being taken off the
painting. Sans is the humanist outlier, which is why it is confined to the one human
sentence on the page and kept quiet: weight 300, leading 1.6, low contrast.

### Hierarchy

- **Display** (Pixel, 400, `clamp(2.75rem, 9vw, 8.25rem)`, line-height 0.86): the
  wordmark, once. **Solid Lit Ivory**, with a wide soft gold drop-shadow
  (`0 0 26px rgba(203,160,83,0.22)`) so the pixel squares read as *lit* rather than
  printed. It previously carried a clipped ivory → gold gradient; that used gold as
  paint rather than as light, against this system's own Rationed Light Rule, and
  gradient display type is the most recognisable generated-page tell there is.
- **Lede** (Sans, 300, `clamp(0.9375rem, 2.6vw, 1.0625rem)`, 1.6, max `34ch`,
  `text-wrap: balance`): the only sentence. Two lines at desktop width, which is the
  budget — a third line means the sentence is doing a feature list's job.
- **Label** (Mono, `0.6875rem` = one cell, `0.16em`, uppercase): the platform line
  under the command, and the only label voice left. One size, one case, one tracking.
- **Code** (Mono, `0.75rem`): the copy button, at `0.08em` tracking.
- **Code (fluid)** (Mono, `clamp(0.625rem, 2.5vw, 0.75rem)`): the install command.
- **Code (micro)** (Mono, `0.5625rem` = 9px): the install command below `22rem`, and
  the only step on the ramp that exists for a single breakpoint. It is a deliberate
  floor, not a stray value: a half-shown install command reads as broken, so on the
  narrowest phones type size is what gets traded.
- **Readout** (Mono, `0.5625rem` = 9px, `0.04em`, `tabular-nums`): the specimen's
  measured labels, with a `0 1px 4px rgba(8,7,6,0.9)` text-shadow so 9px survives
  over the figure. Tabular because the digits change every frame and must not
  shuffle sideways.

9px exists in exactly those two places, and in both the string is a machine's output
rather than prose to read: a command to copy, and a measurement. Nothing else may
use it.

### Named Rules

**The One Job Rule.** Pixel is identity. Mono is machine surfaces. Sans is the one
human sentence. No face ever takes another's job — Sans never becomes chrome, Mono
never sets prose, Pixel never appears outside the wordmark.

**The Cell Rule.** Every Pixel size is an exact multiple of the 11px mono cell. The
pixel grid and the mono grid never drift out of step, which is why they read as one
system rather than two fonts.

**The Pixel Echo Rule.** Pixel-grid forms appear three times and always as identity:
the wordmark, the favicon's S, and the same S as the docs icon in the link row.
Used once, a pixel form reads as a lone exotic; those three are what make it
structural. Do not add a fourth occurrence for decoration, and do not let the three
drift apart — they are the same letter drawn on the same grid.

**The Single Label Voice Rule.** Any mono *label* shares one size, one case and
`0.16em` tracking. A label at a different size is a new voice, and there is no
budget for one. The readout is not an exception to this: it is not a label, it is a
number the machine took off the painting, and its tracking, size and tabular figures
all follow from that.

## Layout

**One centred column, one viewport.** `.stage` is a flex column — `align-items` and
`justify-content: center`, `min-height: 100svh`, `gap: --s-3`, padding
`--s-4 clamp(1.25rem, 5vw, 2rem)`, `text-align: center`. There is no container, no
grid, no header and no footer.

**`min-height`, never `height`.** At around 380px tall in landscape the column is
taller than the viewport; a fixed height clips the command off the bottom with no
way to reach it.

**The plate is sized against the viewport's height, not just its width:**
`min(clamp(200px, 28vw, 300px), 36vh)`. Its aspect is `820 / 912`, which makes it the
tallest object in the column by a wide margin, and a width-only clamp put the icon
row below the fold on a 757px-tall window — the exact failure the One Screen Rule
exists to prevent. The `vh` term binds on a laptop; the `vw` clamp binds on a tall
narrow phone. Any future change to the plate's size is a change to both terms.

**The group and the acts.** Plate, wordmark and sentence read as one unit at the
base gap; the command and the icon row each take an extra `--s-2` (`.stage__act`)
so the action separates from the identity without a rule between them.

**The name sits into the plate.** The portrait frame carries `margin-bottom:
-1.25rem` so the wordmark overlaps the dissolved base of the bust rather than
starting after a gap. Figure and type occupy one optical block. The bottom 12% of the
plate is empty ground below the lowest reticle, which is what makes the overlap safe.

**Collapse ladder** — the column needs no breakpoints of its own; only two
components and the plates respond:

| Below | What changes |
| --- | --- |
| `30rem` | the install row stacks (button border moves left → top); plates re-size on `vw` |
| `22rem` | the install command trades type size for showing the whole command |

### Named Rules

**The One Screen Rule.** Everything on this page fits one viewport at 1280×720 and
at 390×844. Anything that would introduce a scroll belongs on `docs.sfumato.sh`.

**The No Panels Rule.** Nothing is separated by a surface. There is no card, no
section background and no divider rule on this page — the centring and the gaps do
all of it.

## Elevation & Depth

**Depth is emergence, not lift.** Nothing casts a shadow to sit above the page;
things *surface out of* the dark. Four mechanisms carry all of it:

1. **The radial ground** — `radial-gradient(120% 90% at 50% 30%, ink-100, ink-000 78%)`
   lifts the centre of the viewport a few L\* above its edges.
2. **Screen-blended plates** — the three paintings composite with `mix-blend-mode:
   screen` (`1 - (1-a)(1-b)`) so each one's own varnished near-black drops out and
   only the lit passages appear. No plate ever has a visible rectangle.
3. **Radial masks** — every plate is masked with `radial-gradient(closest-side
   ellipse …, #000 4–8%, transparent 66–72%)`, so it has no edge anywhere.
4. **Per-pixel edge dissolve** — the specimen's shader multiplies alpha by a
   `smoothstep` from each border (`0.20` at the foot, `0.10` at the flanks, `0.04` at
   the crown) so the crop has no boundary wherever it falls.
5. **Pools of light** — a warm `rgba(148,103,18,0.16)` radial under the specimen, and
   the wordmark's `26px` gold drop-shadow. Light, not shade.

### Shadow Vocabulary

- **Panel lift** (`0 1px 0 rgba(233,225,209,0.05) inset, 0 18px 44px -22px
  rgba(0,0,0,0.9)`): the install row only. **Recorded as an outlier, not doctrine** —
  a UI reflex that sits slightly outside this world. Do not propagate it to a second
  element on the grounds that it exists here.
- **Readout legibility** (`text-shadow: 0 1px 4px rgba(8,7,6,0.9)`): applied to the
  9px mono readouts over the figure. Functional, not decorative.

### Named Rules

**The Emergence Rule.** Depth comes from masks, screen blending, gradients and light
pools — never from `box-shadow`. If a new element needs to feel raised, give it light
or give it space.

**The No Edges Rule.** Imagery in this system has no boundary, and **alpha alone
cannot remove a crop**. The bust is a cutout, but the subject runs off the frame on
three sides — the chest is sliced flat at the foot, the arm and the hair at the
flanks — so its alpha is fully opaque right up to the border and it reads as a
rectangle sitting in the page. Removing that is a per-pixel job, and it belongs to
the shader (mechanism 4 above), not to a mask on a wrapper.

This has now been got wrong twice, in both available directions:

- A one-sided `linear-gradient` fade down the image. It cannot touch the flanks, and
  the version that stopped at `94%` left the last 6% of the crop visible as a straight
  edge across the robe.
- A mask on the `.portrait` wrapper. The reticle labels are DOM children of that box,
  so a fade across the bottom of the frame takes the lowest readout with it.

The server-rendered fallback carries `radial-gradient(84% 66% at 50% 40%, #000 52%,
transparent 100%)` on the `<img>` **itself** — not the wrapper — as the honest static
approximation until the GL layer is up. A rectangular image edge anywhere, for any
number of frames, is a defect.

## Shapes

**Square by default**, with one radius: the `10px` panel, shared by the install row
and the icon-link hit areas so the two objects under the name read as one pair.
Everything else — the copy button, the command, focus rings — is `0`.

Structure, where it exists at all, is drawn with **lines, not boxes**: the copy
button is marked off by a single `rgba(203,160,83,0.18)` border on one side. Four
borders make a card, and there are no cards here.

The specimen's reticles are the sharpest expression of this: **corner ticks, not
frames**. Each region is a 1px `rgba(233,225,209,0.34)` box whose `::before` /
`::after` draw 5×5px gold L-brackets at opposing corners, breathing between `0.16` and
`0.46` alpha on a 5.5s alternating cycle with staggered negative delays. It reads as a
measurement being taken, not as a box around something.

### Named Rules

**The One Edge Rule.** When something needs marking off, mark one side — a border, a
top rule, or two opposing corner ticks.

## Components

### Install Row (signature)

The page's primary call to action and the only lifted object in the system.

- **Corner style:** `10px`. **Width:** 100%, `max-width: 30rem`, centred.
- **Background:** `linear-gradient(180deg, rgba(37,31,24,0.72), rgba(11,9,8,0.82))`
  with `backdrop-filter: blur(14px) saturate(120%)`.
- **Border:** `1px solid rgba(203,160,83,0.2)`, warming to `0.34` on hover over `0.3s`.
- **Shadow strategy:** see Elevation — the panel-lift shadow lives here and nowhere else.
- **Internal padding:** `0.85rem 0.5rem 0.85rem 1rem` on the command; the button
  carries its own.
- **Behaviour:** the command is real, selectable `<code>` with a gold `$` prompt
  (`user-select: none`) and horizontal overflow with scrollbars hidden in both
  engines. Below `30rem` the row stacks and the button's border moves from left to
  top. Below `22rem` type size is traded down — a half-shown install command reads
  as broken.

### Buttons

There is exactly one button in the system, and it is a text button.

- **Shape:** square (`0` radius), separated from its field by a single
  `rgba(203,160,83,0.18)` left border rather than a background.
- **Copy (primary action label):** Patina Gold mono at `0.75rem`, `0.08em` tracking,
  transparent background, `0 1.1rem` padding, full-height.
- **Hover:** label to Halo Gold, background to `rgba(203,160,83,0.08)` over `0.2s
  var(--ease)`. The wash is a breath of light, not a fill.
- **Focus:** `2px solid var(--gold)` at `-2px` offset so the ring sits inside the
  row's own border rather than doubling it.
- **Press:** `scale(0.94)` on a stiff spring (stiffness 500, damping 30).
- **State label:** the text itself is the feedback — `copy` → `copied` → back after
  2000ms, or `select it` when the clipboard is unavailable (the command is then left
  selected, so the keyboard shortcut is one step away). The label *swaps*
  (`AnimatePresence mode="wait"`, y ±6px, 160ms) rather than cross-fading in place,
  so the width change doesn't jitter. No icon, no toast, no checkmark.

### The Platform Line

One mono label under the command: `MACOS & LINUX`. It replaced a four-line status
paragraph covering checksums, architectures and renderer prerequisites — on a page
whose whole argument is one command, that footnote was the largest block of text on
screen. Everything it said now lives in `sfumato renderer doctor` and the docs.

### The Specimen (signature)

`SpecimenPlate` — Salvator Mundi lifted off his ground and measured. The first thing
on the page and the only thing on it that moves on its own.

- **Source:** `/img/salvator-bust.webp`, an 820×912 cutout with real alpha.
- **Frame:** `min(clamp(200px, 28vw, 300px), 36vh)` at aspect `820 / 912`, over a warm
  `rgba(148,103,18,0.16)` radial light pool, `margin-bottom: -1.25rem`.
- **Layering:** a plain `<img>` paints on the server render and a Three.js canvas
  cross-fades over it at `700ms` once ready. Five regions quantise into blocks via an
  unrolled shader loop, cross-fading *colours* rather than coordinates — mixing
  coordinates smears a region toward its block centres instead of dissolving into them.
- **Instrumentation:** DOM, not shader, because 9px type must stay crisp.
  Corner-tick reticles, `rgba(233,225,209,0.18)` leader lines between region centres,
  and tabular readouts carrying real measured μ (mean luminance) and ∇ (mean gradient
  magnitude) values. Right-hand reticles anchor their label to the right edge, or a
  `nowrap` label on the far side hangs off the plate on narrow screens.
- **Sampling motion:** each region runs its own slow cycle — mostly idle, then a pass
  (`amt = 0.25 + 0.75·cycle^1.6`, `sin(t·0.42 + phase)`), with the block size breathing
  on a second, slower period. The five phases are offset so they never pulse in unison.
  The React state feeding the labels is throttled to ~110ms; the shader runs at frame
  rate, but re-rendering five labels that often is pointless.
- **Reveal:** wipes in from the foot on first sight. `uReveal` starts at `-0.16` and
  deliberately finishes above `1.0` (at `1.16`), because a window ending at exactly
  `1.0` closes again as the value passes it. It defaults to `2` — fully open — so a
  loop that never runs leaves the plate visible rather than wiped shut.
- **Costs nothing when unseen:** an IntersectionObserver stops the loop off-screen,
  `visibilitychange` stops it on a hidden tab, and `prefers-reduced-motion` freezes it
  to a single static composition at `amt = 0.55` with the reticles' CSS breathing off.
- **Gain:** `1.45` on colour only (straight-alpha texture). The panel is five centuries
  dark and is now the subject; the wordmark still has to be brighter.
- **No legend.** A machine peering at a Leonardo is the whole idea; captioning it turns
  the conceit into a lecture. The numbers are for whoever reads the source.

### The Link Row

Three destinations, no words: source (`github.com/getsfumato/sfumato`), docs
(`docs.sfumato.sh`), vitruvio (`vitruvio.sh`).

- **Hit area:** 44px square, `10px` radius, glyph 22px inside it. The row stays quiet
  without becoming a target you have to aim at.
- **Colour:** Muted Ivory at rest; Halo Gold with a `rgba(203,160,83,0.08)` wash on
  hover. Focus: `2px solid var(--gold)` at `2px` offset.
- **Accessible name:** `aria-label` + `title` on the anchor. No visible text — the
  glyphs are the whole row.
- **Optical weight:** GitHub is solid because its mark only reads as itself filled;
  the other two are `1.4`-unit strokes on the same 24-unit box, which lands at a
  comparable ink density at 22px.
- **The vitruvian glyph** is a circle, a figure, arms to the rim and legs apart. The
  square of the original sheet and the second raised pair of arms were both drawn and
  both cut: the square's top edge lands within a pixel of the circle at icon size and
  the pair of arm-pairs turns the figure to mud. What is left is the part that still
  reads.
- **The docs glyph** is the favicon's pixel S, unchanged, on the same box — see the
  Pixel Echo Rule.

### The Ground (signature)

`PaintingField` — all three plates, flow distortion, grain and vignette resolved in a
single fragment shader: one draw call, one full-screen quad, pixel ratio capped at
1.25 because the field is entirely soft gradients.

- **Progressive enhancement is a requirement, not an optimisation.** CSS plates paint
  on the server render and stay if WebGL is unavailable; the GL layer fades in over
  them (`900ms`) only once it has textures and has drawn a frame. The two layers'
  strengths are kept in sync by hand — a change to one is a change to both.
- **Salvator is held down** (plate amount `0.46`, CSS opacity `0.30`, against `1.08`
  for the Virgin): the same painting is the specimen in the centre of the page, and
  two legible faces read as a duplicate rather than as a motif.
- **The Baptism is held down too** (`0.58`, CSS `0.34`) and pushed lower: at full
  strength its warm floor glow reached the icon row and made the bottom of the page
  brighter than the wordmark.
- **Flow** is layered sines rather than turbulence — periodic and cheap, but at this
  amplitude it reads as the paintings breathing, which is all it needs to do.
- **Reduced motion** freezes flow and grain to a single static composition.
- **`prefers-contrast: more`** drops plate opacity to 0.16 and the GL layer to 0.3,
  and promotes the lede to Lit Ivory.

### Reveal

- Entrance is **CSS keyframes, never JavaScript**: `opacity 0 → 1`,
  `translateY(14px) → 0`, `blur(7px) → 0` over `1.1s var(--ease)` with `both` fill and
  a per-element `--reveal-delay` (0.05 / 0.20 / 0.32 / 0.44 / 0.58s down the column).
- This is an invariant with a cause. An entrance that starts at `opacity: 0` decides
  whether content is visible at all, so it must not depend on JS — a `motion.div` with
  `initial={{ opacity: 0 }}` server-renders the hidden state inline, and anything that
  stops the animation (no JS, a hydration error, a throttled background tab) leaves the
  page blank. That was a real regression, caught on a backgrounded tab. A keyframe
  animation degrades to *visible* on its own.

### Named Rules

**The Visible-By-Default Rule.** Any animation whose start state hides content must be
authored in CSS. JavaScript may only move, colour, or spring things that are already
visible.

## Do's and Don'ts

### Do:

- **Do** keep the page to one screen and one action. New material goes to the docs.
- **Do** keep every dark value warmer than neutral — more red than blue, in the
  `#080706` / `#0b0908` / `#12100d` family.
- **Do** ration Halo Gold to thin strokes, small marks and single glyphs. If a gold
  region reads as a shape, reduce it.
- **Do** size every Pixel occurrence as an exact multiple of the `0.6875rem` cell, and
  keep the three pixel forms (wordmark, favicon, docs icon) the same letter.
- **Do** dissolve an image's crop per-pixel in the shader, and mask the fallback
  `<img>` itself rather than the box that holds its instrumentation.
- **Do** produce depth with masks, screen blending, gradients and pools of light.
- **Do** author any content-hiding entrance as CSS keyframes with `animation-fill-mode:
  both`.
- **Do** ship a server-rendered fallback beneath every GL layer, default its uniforms
  to the *open* state, and freeze motion under `prefers-reduced-motion`.
- **Do** stop every animation loop off-screen and on hidden tabs.
- **Do** measure any number that appears on screen from the pixels actually underneath
  it, and set changing digits in `tabular-nums`.
- **Do** draw a new icon against the real thing at 20, 28, 64 and 140px, and cut
  whatever stops reading at the smallest size.

### Don't:

- **Don't** add a section, a feature list, a testimonial row or a footer. The page has
  one screen; the argument for a second one is an argument for a docs page.
- **Don't** import generic dark-SaaS chrome: no violet or blue gradient buttons, no
  glass cards in rows, no neon borders, no purple-on-black. A cool accent destroys the
  warm-earth identity instantly, and this palette was sampled rather than chosen — it
  is not a preference to be traded.
- **Don't** add a fourth type voice, and don't let an existing face take another's job.
- **Don't** present the paintings as framed imagery — no bordered image, card,
  carousel, lightbox or museum caption. Any visible rectangular image edge is a defect.
- **Don't** raise the background's Salvator or Baptism plates back to full strength;
  the specimen is the same painting and the icons sit over the Baptism's glow.
- **Don't** mask the `.portrait` wrapper. The readouts live inside it, and a fade
  across the frame takes the lowest one with it — see the No Edges Rule.
- **Don't** size the plate on width alone; its aspect makes it the tallest thing in
  the column and it will push the icon row off a laptop screen.
- **Don't** invent numbers. No fabricated metrics, confidence scores or decorative
  readouts. If a value appears on screen it is measured.
- **Don't** clip a gradient into text, on the wordmark or anywhere else. Gold is light;
  emphasis comes from size, weight and the glow.
- **Don't** let the sentence under the name grow past two lines at desktop width.
- **Don't** use `box-shadow` to raise an element. The install row's lift is a recorded
  outlier, not a precedent.
- **Don't** wrap a region in a background, card or panel to separate it.
- **Don't** drive an entrance from JavaScript, and don't use `motion` for anything whose
  start state is `opacity: 0`.
- **Don't** caption a flourish. If a conceit needs a legend to land, it is a lecture.
- **Don't** put a label above the wordmark to introduce it. That slot has been filled
  with decoration every time it existed.
