---
name: sfumato
description: A conservation lab reading a Leonardo — warm varnished dark, sampled ochre-gold, and mono instrumentation over dissolved paintings.
colors:
  ink-000: "#080706"
  ink-050: "#0b0908"
  ink-100: "#12100d"
  gold: "#cba053"
  gold-soft: "#ba9c6b"
  gold-dim: "#a28757"
  gold-deep: "#946712"
  slate: "#7d818e"
  ivory: "#e9e1d1"
  ivory-dim: "#b9b2a0"
  ivory-mute: "#8c8578"
  ivory-faint: "#827b6a"
  hair: "rgba(233, 225, 209, 0.1)"
typography:
  display:
    fontFamily: "Geist Pixel Square, ui-monospace, monospace"
    fontSize: "clamp(2.75rem, 9vw, 8.25rem)"
    fontWeight: 400
    lineHeight: 0.86
    letterSpacing: "0.02em"
  numeral:
    fontFamily: "Geist Pixel Square, ui-monospace, monospace"
    fontSize: "1.375rem"
    fontWeight: 400
    lineHeight: 1
  title:
    fontFamily: "Geist Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 3.4vw, 1.5rem)"
    fontWeight: 400
    lineHeight: 1.28
    letterSpacing: "-0.01em"
  lede:
    fontFamily: "Geist Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 2.6vw, 1.1875rem)"
    fontWeight: 300
    lineHeight: 1.62
  body:
    fontFamily: "Geist Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 300
    lineHeight: 1.68
  small:
    fontFamily: "Geist Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 300
    lineHeight: 1.6
  micro:
    fontFamily: "Geist Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "0.625rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "0.02em"
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
  readout:
    fontFamily: "Geist Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "0.5625rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0.04em"
    fontFeature: "tabular-nums"
rounded:
  none: "0"
  hairline: "2px"
  panel: "10px"
spacing:
  cell: "0.6875rem"
  s-1: "0.5rem"
  s-2: "0.75rem"
  s-3: "1.25rem"
  s-4: "2rem"
  s-5: "3.25rem"
  s-6: "5rem"
  s-7: "7rem"
components:
  install-row:
    textColor: "{colors.ivory}"
    typography: "{typography.code}"
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
  snippet:
    backgroundColor: "rgba(18, 16, 13, 0.5)"
    textColor: "{colors.ivory-dim}"
    typography: "{typography.code}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1.25rem"
  beat:
    backgroundColor: "transparent"
    textColor: "{colors.ivory-dim}"
    rounded: "{rounded.none}"
    padding: "3.25rem 0"
  beat-numeral:
    textColor: "{colors.gold}"
    typography: "{typography.numeral}"
  beat-tag:
    textColor: "{colors.ivory-faint}"
    typography: "{typography.label}"
  spec-key:
    textColor: "{colors.gold-dim}"
    typography: "{typography.label}"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.ivory-mute}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.2rem 0"
  nav-link-hover:
    textColor: "{colors.ivory}"
  reticle:
    backgroundColor: "transparent"
    textColor: "{colors.ivory-dim}"
    typography: "{typography.readout}"
    rounded: "{rounded.none}"
---

# Design System: sfumato

## Overview

**Creative North Star: "The Measured Leonardo"**

A conservation lab at night. A five-century-old painting is the subject; the page
is the instrument reading it. That gives every element one of exactly two jobs:
it is either **the painting** — warm, varnished, tonally continuous, emerging from
near-black rather than sitting on it — or it is **the instrument** — mono, uppercase,
widely tracked, hairline-thin, tabular, and utterly unhurried. The tension between
those two registers *is* the identity, and it is the same tension the product's
name describes: a machine looking very closely at gradation it cannot draw a line
through.

Nothing here is decided by taste where it could be decided by measurement. The
palette is sampled from the three source paintings by k-means in CIELab, not
eyeballed from them — which is why the lapis reads as desaturated slate rather than
the ultramarine memory supplies, and why ochre-gold rather than any brand hue is
the accent. The wordmark is not drawn, it is *reconstructed*: a letterform run
through a DFT and rebuilt from its own harmonics, still orbiting. The specimen's
readouts are genuinely measured off the pixels underneath them. That provenance is
load-bearing. A future contributor who substitutes a plausible-looking value for a
measured one has broken the system even if it looks identical.

Density is low and deliberate; the page breathes in one continuous descent with no
panels, no cards, and no sections that announce themselves. Depth is atmospheric,
never physical: things surface out of darkness. There is exactly one flat colour
of light — a warm gold — and it is rationed hard enough that its every appearance
reads as emphasis.

**Key Characteristics:**

- Warm near-black ground (`#0b0908`), never neutral grey and never cool.
- One accent hue, ochre-gold, sampled from the Baptism's halos.
- Three type faces, one job each, zero overlap.
- Hairlines and rules instead of borders, cards, and boxes.
- Depth by emergence — atmosphere, masks and light pools, not shadows.
- Every number on screen is measured, or it is not on screen.

## Colors

Warm earth read through varnish: three near-blacks, one gold family, one ivory
family for language, and a single desaturated slate that appears only inside the
mark.

### Primary

- **Halo Gold** (`#cba053`): the hero accent, sampled from the Baptism's halos where
  it accounts for 24% of pixels. Reserved for the things the eye must find — the
  beat numerals, the `$` prompt, the shell under a hovered link, the reticle corner
  ticks, focus rings. It is never a fill and never a background.
- **Lit Gold** (`#ba9c6b`): the softer, lifted mid-tone of the same family; appears
  in the wordmark's gradient where the letterform catches light.
- **Patina Gold** (`#a28757`): the quiet, non-shouting gold for text that is
  interactive but at rest — the copy button's idle label, the spec keys, the
  specimen's block readouts, inline links.
- **Deep Ochre** (`#946712`): gold pushed into shadow. Used for structural hairlines
  (the eyebrow rule), the selection background, and the warm pool of light beneath
  the specimen. Too dark for text on the ground; treat it as a *material*, not a
  text colour.

### Secondary

- **Varnished Lapis** (`#7d818e`): Leonardo's ultramarine as it actually reads under
  five centuries of varnish — desaturated slate. It currently exists only inside
  `EpicycleMark`'s colour mixing, not as a CSS custom property. It is the honest
  secondary and the *only* sanctioned cool value in the system; if a second accent
  is ever needed, it is this one, promoted to a token — not a new hue.

### Neutral

- **Cave Black** (`#080706`): the deepest ground. The vignette's outer edge and the
  radial field's far falloff.
- **Ground Black** (`#0b0908`): the page ground and the browser theme colour. Warm,
  not neutral — its red channel is deliberately above its blue.
- **Umber Black** (`#12100d`): the lifted centre of the field's radial gradient, and
  the tint under code snippets at 50% alpha.
- **Lit Ivory** (`#e9e1d1`): sampled from lit flesh and drapery. All primary text,
  headings, and emphasis.
- **Veiled Ivory** (`#b9b2a0`): body prose and the lede. The default reading colour;
  primary ivory is reserved for emphasis *within* it.
- **Muted Ivory** (`#8c8578`): mono chrome at rest — eyebrows, footer notes, nav
  links, secondary lines.
- **Faint Ivory** (`#827b6a`): the quietest tier — beat tags and the attribution
  credit. As close to the ground as the 4.5:1 contrast floor permits, and no closer;
  it measures 4.7:1 and sets the hard lower bound for any text colour in the system.
- **Hairline** (`rgba(233, 225, 209, 0.1)`): every structural division on the page.
  Ivory at 10%, never a solid grey.

### Named Rules

**The Rationed Light Rule.** Gold is light, not paint. It appears as thin strokes,
small marks, single glyphs, and gradient passages — never as a filled button, badge,
panel, or block. If a gold region is large enough to read as a shape, it is wrong.

**The Warm Ground Rule.** Every dark value in this system has more red than blue.
There is no neutral grey and no cool black anywhere in the palette. A `#0a0a0a` or
a `slate-950` is an immediate identity break, however subtle it looks alone.

**The Three-Tier Text Rule.** Language descends through exactly three ivories —
Lit for emphasis, Veiled for prose, Muted for chrome — and a fourth (Faint) only for
attribution and tags. Reaching for an opacity on ivory instead of the next tier down
fragments the ramp.

## Typography

**Display Font:** Geist Pixel Square (with `ui-monospace`, monospace)
**Body Font:** Geist Sans (with `ui-sans-serif`, `system-ui`, sans-serif)
**Label/Mono Font:** Geist Mono (with `ui-monospace`, `SF Mono`, Menlo, monospace)

**Character:** Pixel and Mono *rhyme* — both are grid-derived, so they read as one
mechanical voice speaking at two volumes. Sans is the humanist outlier, which is
precisely why it is confined to language and kept quiet: light weight (300),
generous leading (1.6–1.68), low contrast. The grid carries the identity; the
humanist face carries the meaning.

### Hierarchy

- **Display** (Pixel, 400, `clamp(2.75rem, 9vw, 8.25rem)`, line-height 0.86): the
  wordmark, once. **Solid Lit Ivory**, with a wide soft gold drop-shadow
  (`0 0 26px rgba(203,160,83,0.22)`) so the pixel squares read as *lit* rather than
  printed. It previously carried a clipped ivory → gold gradient; that used gold as
  paint rather than as light, against this system's own Rationed Light Rule, and
  gradient display type is the most recognisable generated-page tell there is. At
  8rem the type needs no help being emphatic.
- **Numeral** (Pixel, 400, exactly `calc(var(--cell) * 2)` = 22px, line-height 1):
  the beat enumeration, in Halo Gold. Its optical top is nudged into the heading's
  cap height with `padding-top: 0.2rem`.
- **Title** (Sans, 400, `clamp(1.25rem, 3.4vw, 1.5rem)`, 1.28, `-0.01em`,
  `text-wrap: balance`): beat headings. Small on purpose — the artefact beside it,
  not the heading, carries the visual weight.
- **Lede** (Sans, 300, `clamp(1.0625rem, 2.6vw, 1.1875rem)`, 1.62, max `44ch`): the
  single opening paragraph. `<em>` inside it is *not italic* — it becomes weight 400
  in Lit Ivory.
- **Body** (Sans, 300, `0.9375rem`, 1.68, `text-wrap: pretty`): beat prose. Carries
  **no** `max-width` of its own; the grid column *is* the measure. `<em>` inside
  prose switches to Mono at `0.9em`, so technical terms borrow the machine voice
  instead of leaning.
- **Small** (Sans, 300, `0.875rem`, 1.6): the spec list's values and the footer note.
  The one step below body, shared by both so the footer doesn't invent its own size.
- **Micro** (Mono, `0.625rem`, `0.02em`): the attribution credit, and the lower endpoint
  of the install command's fluid size on the narrowest phones.
- **Label** (Mono, `0.6875rem` = one cell, `0.16em`, uppercase): every machine-voiced
  label on the page — eyebrows, beat tags, spec keys, nav links. One size, one case,
  one tracking, no exceptions.
- **Code** (Mono, `0.75rem`, 1.7): snippets and the install command.
- **Readout** (Mono, `0.5625rem`, `0.04em`, `tabular-nums`): the specimen's numeric
  labels, with a `0 1px 4px rgba(8,7,6,0.9)` text-shadow so 9px type survives over
  the figure.

### Named Rules

**The One Job Rule.** Pixel is identity and enumeration. Mono is machine surfaces.
Sans is human language. No face ever takes another's job. Sans never becomes chrome;
Mono never sets prose; Pixel never appears outside the wordmark and the numerals.

**The Cell Rule.** Every Pixel size is an exact multiple of the 11px mono cell — 2
cells for the numerals, 4–12 for the wordmark. The pixel grid and the mono grid never
drift out of step, which is why they read as one system rather than two fonts.

**The Recurrence Rule.** Pixel must appear at least three times on any surface that
uses it at all. Used once it reads as a lone exotic; the repetition down the page is
what converts it from decoration into structure.

**The Single Label Voice Rule.** Every mono label shares one size, one case, and
`0.16em` tracking. That repetition is most of what makes unrelated regions feel like
one page. A label at a different size is a new voice, and there is no budget for one.

## Layout

**One grid, full width.** A single container (`.wrap`, `max-width: 86rem`,
`padding-inline: clamp(1.25rem, 4vw, 3rem)`) carries hero, beats, and footer. There
are no nested containers and no per-section centring — that is what stops the page
reading as unrelated panels.

**The width is filled with artefacts, not longer lines.** Every beat is a three
column grid — `4.5rem | minmax(0, 24rem) | minmax(0, 1fr)` — where the rail holds
the numeral and tag, the narrow middle column *is* the measure, and the wide third
column carries something to look at. Two earlier attempts failed in opposite
directions: full-viewport "acts" that each centred against arbitrary emptiness so
nothing aligned, and a `46rem` column that read as a phone layout on a 1400px screen.

**The rail is the spine.** Pixel numerals line up down the left edge, every beat hangs
off that same axis, and a single hairline (`border-top: 1px solid var(--hair)`)
separates them. No beat has a background, a card, or a container of its own.

**One rhythm.** All vertical space comes from the `--s-1` … `--s-7` scale
(0.5 / 0.75 / 1.25 / 2 / 3.25 / 5 / 7rem). Ad-hoc margins are not permitted.

**Collapse ladder** — three stages, verified at 320 / 390 / 560 / 760 / 1100 / 1409:

| Below | What changes |
| --- | --- |
| `68rem` | the artefact drops beneath the copy; the rail stays |
| `52rem` | the hero stacks and centres (mark above name) |
| `44rem` | the rail becomes a header row above the copy |
| `30rem` | container padding tightens; the install row stacks; plates re-size on `vw` |
| `22rem` | install command trades type size for showing the whole command |

The hero follows the same logic as the beats: the mark sits *beside* the name, not
above it, because stacked and centred it left the upper half of a wide screen empty.

### Named Rules

**The One Measure Rule.** The reading measure is enforced by the grid column, never
by a `max-width` on the paragraph. A second constraint inside an already-narrow column
is what left a third of every beat empty in an earlier pass.

**The No Panels Rule.** Regions are separated by a hairline and vertical rhythm, never
by a surface. If a section needs a background to be legible as a section, the rhythm
is wrong.

## Elevation & Depth

**Depth is emergence, not lift.** This system is flat in the UI sense and deep in the
atmospheric sense. Nothing casts a shadow to sit above the page; things instead
*surface out of* the dark. Four mechanisms carry all of it:

1. **The radial ground** — `radial-gradient(120% 90% at 50% 30%, ink-100, ink-000 78%)`
   lifts the centre of the viewport a few L\* above its edges.
2. **Screen-blended plates** — the three paintings composite with `mix-blend-mode:
   screen` (`1 - (1-a)(1-b)`) so each one's own varnished near-black drops out and only
   the lit passages appear. No plate ever has a visible rectangle.
3. **Radial masks** — every plate is masked with `radial-gradient(closest-side ellipse
   …, #000 4–8%, transparent 66–72%)`, so it has no edge anywhere.
4. **Pools of light** — a warm `rgba(148,103,18,0.16)` radial under the specimen, and
   the wordmark's `26px` gold drop-shadow. Light, not shade.

### Shadow Vocabulary

- **Panel lift** (`0 1px 0 rgba(233,225,209,0.05) inset, 0 18px 44px -22px
  rgba(0,0,0,0.9)`): the install row only. **Recorded as an outlier, not doctrine** —
  it is a UI reflex that sits slightly outside this world, and it is the one candidate
  for reconsideration in a future refinement pass. Do not propagate it to a second
  element on the grounds that it exists here.
- **Readout legibility** (`text-shadow: 0 1px 4px rgba(8,7,6,0.9)`): applied to 9px
  mono over the specimen figure. Functional, not decorative.

### Named Rules

**The Emergence Rule.** Depth is produced by masks, screen blending, gradients and
light pools — never by `box-shadow`. If a new element needs to feel raised, give it
light or give it space; do not give it a shadow.

**The No Edges Rule.** Imagery in this system has no boundary. Every plate is masked
to transparency and the specimen's alpha is faded per-edge (20% at the foot where the
crop cuts through solid chest, 10% at the flanks, near zero at the crown) precisely
because alpha alone cannot remove a *crop*. A rectangular image edge anywhere is a
defect.

## Shapes

**Square by default.** The form language is orthogonal and unrounded: `0` radius on
snippets, spec rows, beats, buttons, and rules. Two exceptions, both deliberate — the
install row's `10px` panel radius, and `2px` on focus-ring targets so an outline
doesn't corner-clip awkwardly.

Structure is drawn with **lines, not boxes**. A 1px `--hair` rule separates beats and
the footer. The snippet is marked by a single left border in
`rgba(203,160,83,0.22)` — one edge, not four. The eyebrow's divider is a `1.5rem × 1px`
Deep Ochre rule rather than a slash character, so it rhymes with the beat rules.

The specimen's reticles are the sharpest expression of this: **corner ticks, not
frames**. Each region is a 1px `rgba(233,225,209,0.34)` box whose `::before` /
`::after` draw 5×5px gold L-brackets at opposing corners, breathing between 0.16 and
0.46 alpha on a 5.5s alternating cycle with staggered negative delays. It reads as a
measurement being taken, not as a box around something.

### Named Rules

**The One Edge Rule.** When something needs marking off, mark one side. A left border,
a top rule, two corner ticks. Four borders make a card, and there are no cards here.

## Components

### Buttons

There is exactly one button in the system, and it is a text button.

- **Shape:** square (`0` radius), separated from its field by a single
  `rgba(203,160,83,0.18)` left border rather than a background.
- **Copy (primary action label):** Patina Gold (`#a28757`) mono at `0.75rem`,
  `0.08em` tracking, transparent background, `0 1.1rem` padding, full-height.
- **Hover:** label to Halo Gold, background to `rgba(203,160,83,0.08)` over
  `0.2s var(--ease)`. The wash is a breath of light, not a fill.
- **Focus:** `2px solid var(--gold)` outline at `-2px` offset so the ring sits inside
  the row's own border rather than doubling it.
- **Press:** `scale(0.94)` on a stiff spring (stiffness 500, damping 30).
- **State label:** the text itself is the feedback — `copy` → `copied` → back after
  2000ms, or `select it` when the clipboard is unavailable. The label *swaps*
  (`AnimatePresence mode="wait"`, y ±6px, 160ms) rather than cross-fading in place, so
  the width change doesn't jitter mid-transition. There is no icon, no toast, no
  checkmark.

### Install Row (signature)

The page's primary call to action and the only lifted object in the system.

- **Corner style:** `10px`.
- **Background:** `linear-gradient(180deg, rgba(37,31,24,0.72), rgba(11,9,8,0.82))`
  with `backdrop-filter: blur(14px) saturate(120%)`.
- **Border:** `1px solid rgba(203,160,83,0.2)`, warming to `0.34` on hover over `0.3s`.
- **Shadow strategy:** see Elevation — the panel-lift shadow lives here and nowhere else.
- **Internal padding:** `0.85rem 0.5rem 0.85rem 1rem` on the command; the button
  carries its own.
- **Behaviour:** the command is real, selectable `<code>` with a gold `$` prompt
  (`user-select: none`) and horizontal overflow with scrollbars hidden. Below `30rem`
  the row stacks and the button's border moves from left to top. Below `22rem` type
  size is traded down so the whole command is visible — a half-shown install command
  reads as broken.

### Snippet

- **Style:** one left border in `rgba(203,160,83,0.22)`, background
  `rgba(18,16,13,0.5)`, `0` radius, `--s-2 --s-3` padding, Mono `0.75rem` / 1.7 in
  Veiled Ivory.
- **Detail:** gold `$` prompt, Muted Ivory continuation lines, `overflow-x: auto` with
  the scrollbar hidden in both engines.

### Spec List

- **Style:** an unstyled `<ul>` as a two-column grid (`5rem | minmax(0,1fr)`,
  `4.25rem` below 30rem), baseline-aligned, `--s-1` row gap.
- **Key:** the mono label voice in Patina Gold. **Value:** Sans `0.875rem` in Veiled
  Ivory. No bullets, no rules, no table chrome — alignment alone does the work.

### Navigation

- **Style:** the mono label voice in Muted Ivory, undecorated, `0.2rem 0` padding.
- **Hover:** text to Lit Ivory, plus a 1px Halo Gold underline that wipes in from the
  left (`transform: scaleX(0 → 1)`, `transform-origin: left`, `0.28s var(--ease)`).
- **Focus:** `2px solid var(--gold)` at `4px` offset, `2px` radius.
- **Layout:** a wrapping flex row, `0.35rem 1.5rem` gap. There is no site nav and no
  header — the footer link row is the only navigation.

### The Mark (signature)

`EpicycleMark` — the S of *sfumato* drawn as an integral sign, reconstructed from its
own Fourier series and rendered as an ASCII coverage field on a 2D canvas.

- **Frame:** `clamp(240px, 24vw, 330px)` at `3 / 4`. The floor is generous because
  below ~240px the character grid is too coarse to hold the terminal hooks together.
- **Grid:** 8px cells, ramp `. : - = + * # @`, letter occupying 62% of the frame.
- **Colour:** mixes between Halo Gold, Lit Ivory and Varnished Lapis — the only place
  slate appears.
- **Motion:** a 6000ms revolution that **never stops**. The first pass reveals the
  letter as the pen reaches each cell; afterwards the letter stands complete and the
  chain keeps orbiting with a travelling point of heat (decay 0.935/frame, radius 2.2
  cells) at the pen. A one-shot animation would make the epicycles invisible to anyone
  arriving a few seconds late, which defeats the point of showing them. The loop pauses
  off-screen and on hidden tabs; clicking replays the reveal.
- **Parallax:** ±10px pointer-led drift on springs (stiffness 60, damping 18, mass
  0.6) so it lags and settles rather than snapping. Disabled for coarse pointers and
  reduced motion.

### The Specimen (signature)

`SpecimenPlate` — Salvator Mundi lifted off his ground and measured.

- **Stage:** `max-width: 26rem` (`24rem` below 44rem), aspect `820 / 912`, over a warm
  radial light pool.
- **Layering:** a plain `<img>` paints first and a Three.js canvas cross-fades over it
  at `700ms` once ready. Five regions quantise into blocks via an unrolled shader loop,
  cross-fading *colours* rather than coordinates — mixing coordinates smears a region
  toward its block centres instead of dissolving into them.
- **Instrumentation:** DOM, not shader, because 9px type must stay crisp. Corner-tick
  reticles, `rgba(233,225,209,0.18)` leader lines, and tabular readouts carrying real
  measured μ (mean luminance) and ∇ (mean gradient magnitude) values.
- **No legend.** A machine peering at a Leonardo is the whole idea; captioning it
  turned the conceit into a lecture. The numbers are for whoever reads the source.
- **Reveal:** wipes in from the foot; `uReveal` deliberately finishes above 1.0,
  because a window ending at exactly 1.0 closes again as the value passes it.
- **Reciprocity:** the ambient field dims to 30% while the specimen is on screen
  (IntersectionObserver, `-35% 0px -35% 0px` root margin — a ratio threshold cannot
  work on a section taller than the viewport). Two Leonardos at full strength at once
  read as a duplicate.

### The Ground (signature)

`PaintingField` — all three plates, flow distortion, grain and vignette resolved in a
single fragment shader: one draw call, one full-screen quad, pixel ratio capped at
1.25 because the field is entirely soft gradients.

- **Progressive enhancement is a requirement, not an optimisation.** CSS plates paint
  on the server render and stay if WebGL is unavailable; the GL layer fades in over
  them (`900ms`) only once it has textures and has drawn a frame.
- **Flow** is layered sines rather than turbulence — periodic and cheap, but at this
  amplitude it reads as the paintings breathing, which is all it needs to do.
- **Reduced motion** freezes flow and grain to a single static composition.
- **`prefers-contrast: more`** drops plate opacity to 0.16 and the GL layer to 0.3,
  and promotes prose to Lit Ivory.

### Reveal

- Entrance is **CSS keyframes, never JavaScript**: `opacity 0 → 1`,
  `translateY(14px) → 0`, `blur(7px) → 0` over `1.1s var(--ease)` with `both` fill and
  a per-element `--reveal-delay`.
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

- **Do** keep every dark value warmer than neutral — more red than blue, in the
  `#080706` / `#0b0908` / `#12100d` family.
- **Do** ration Halo Gold (`#cba053`) to thin strokes, small marks and single glyphs.
  If a gold region reads as a shape, reduce it.
- **Do** size every Pixel occurrence as an exact multiple of the `0.6875rem` cell, and
  make it recur at least three times per surface.
- **Do** give every mono label the same size, uppercase, and `0.16em` tracking.
- **Do** let the grid column set the measure and leave `.prose` without a `max-width`.
- **Do** mark structure with one edge — a left border, a top hairline, two corner ticks.
- **Do** produce depth with masks, screen blending, gradients and pools of light.
- **Do** author any content-hiding entrance as CSS keyframes with `animation-fill-mode:
  both`.
- **Do** ship a server-rendered fallback beneath every GL layer, and freeze motion
  under `prefers-reduced-motion`.
- **Do** measure any number that appears on screen, from the pixels actually underneath
  it, and use `tabular-nums` wherever digits change.

### Don't:

- **Don't** import generic dark-SaaS chrome: no violet or blue gradient buttons, no
  glass cards in rows, no neon borders, no purple-on-black. A cool accent destroys the
  warm-earth identity instantly, and this palette was sampled rather than chosen — it
  is not a preference to be traded.
- **Don't** add a fourth type voice, and don't let an existing face take another's job.
  Sans never becomes chrome, Mono never sets prose, Pixel never appears outside the
  wordmark and the enumeration.
- **Don't** present the paintings as framed imagery — no bordered image, card,
  carousel, lightbox, or museum caption. They are ground and specimen, masked and
  dissolved. Any visible rectangular image edge is a defect.
- **Don't** invent numbers. No fabricated metrics, confidence scores, percentages, or
  decorative readouts. The specimen's μ and ∇ are real; a plausible-looking substitute
  would have been easier and would have meant nothing.
- **Don't** clip a gradient into text, on the wordmark or anywhere else. Gold is light;
  emphasis comes from size, weight, and the glow.
- **Don't** put a label above or beneath a heading to introduce it. The heading carries
  its own weight, and the slot fills with decoration every time it exists — it held a
  harmonic count measuring the logo before it was removed.
- **Don't** let any text colour fall below Faint Ivory (`#827b6a`, 4.7:1). That value is
  the floor, not a starting point to tune downward from.
- **Don't** use `box-shadow` to raise an element. The install row's lift is a recorded
  outlier, not a precedent.
- **Don't** wrap a region in a background, card, or panel to separate it. Hairline plus
  rhythm, or the rhythm is wrong.
- **Don't** put a second `max-width` inside an already-narrow grid column.
- **Don't** drive an entrance from JavaScript, and don't use `motion` for anything whose
  start state is `opacity: 0`.
- **Don't** shrink the mark's frame below 240px, or the terminal hooks break apart.
- **Don't** caption a flourish. If a conceit needs a legend to land, it is a lecture.
