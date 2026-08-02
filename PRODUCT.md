# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two confirmed primary audiences, both arriving with material they already own:

- **Students and self-learners** who keep a body of course material — a folder of
  notes, a vault, lecture PDFs, a repo — and want it turned into something they can
  actually study from: a deck, a page they can poke at, a narrated video. Their job
  is *understand my own material*, not *learn about a topic in general*.
- **Educators and content authors** — lecturers, course creators, technical writers —
  who turn existing material into teaching artefacts repeatedly, for a cohort or an
  audience, and need the output to be reproducible run over run.

Both are Obsidian-adjacent and comfortable in a terminal, but they are not shopping
for developer tooling; they are shopping for finished teaching material made from
what they already wrote.

The surface being designed is the marketing site (`sfumato.sh`). Its visitor is
someone evaluating whether to install the CLI at all.

## Product Purpose

Sfumato is a local-first Rust CLI that generates learning resources from an
instruction plus optional source files. It currently produces Marp slide decks,
standalone HTML pages, documents, and MP4 videos (`sfumato generate slides |
document | page | video`).

Success is a visitor installing the CLI and generating a first resource from their
own material — and, on the return trip, keeping it because the second and tenth runs
still land where they expect.

## Positioning

**It works from your material.** What you hand it is what it teaches from, so you get
your own notes explained rather than a generic model summary of the topic. That is
the spine of the story; a neighbouring tool cannot truthfully copy it without also
reading from the user's own corpus.

Three supporting truths sit beneath it and must not be promoted above it:

- it inspects its own output — resources are validated, rendered, opened and
  corrected, and a correction is kept only when it improves the result;
- it is local-first — rendering and models can run entirely on the user's machine;
- every run is kept as its own immutable revision; nothing is overwritten.

## Operating Context

- Users hold their knowledge in a directory of files, commonly an **Obsidian vault**.
  Generated output can be published back into that vault as processed PDF, HTML, or
  MP4, so the artefact lands where the user already reads.
- State lives under `~/.sfumato` as immutable revisions.
- Projects are registered per vault/path (`sfumato init project <name> --path …`) and
  carry their own themes, model defaults, page plugins, and model-backed tools.
- Model access is via connectors: **Ollama** (local), **OpenRouter** (hosted), and the
  local **Codex App Server**. Model profiles are assigned per capability per project.
- Two interfaces: explicit subcommands (preferred for scripts and agents) and an
  interactive Ratatui workspace when `sfumato` is run bare.
- Video generation runs a Hyperframe pipeline with workflow routing, storyboarded
  scene direction, managed visual blocks, deterministic snapshots, and an optional
  human review pause.

## Capabilities and Constraints

- Resource kinds today: **slides** (Marp), **pages** (one self-contained HTML file),
  **documents**, **video** (narrated MP4). Anything beyond these four is not a
  capability and must not be implied.
- Installation is `curl … | sh` against `public/install.sh`: POSIX `sh`, non-interactive,
  detects OS/arch including musl, verifies SHA-256 when published, installs to
  `~/.local/bin`. Overrides: `SFUMATO_VERSION`, `SFUMATO_BIN_DIR`, `SFUMATO_NO_MODIFY_PATH`.
- **Constraint — pre-release.** `getsfumato/cli` has no published releases and
  `sfumato` is not on crates.io, so the installer falls through to
  `cargo install --git`. Design must not imply a one-line binary install works today,
  and must not promise release timing.
- Written in Rust; hosted on Vercel with zero config. `install.sh` is served as
  `text/plain` so it can be read before being piped to a shell — that readability is
  a deliberate product commitment, not an implementation detail.
- Terminology to use consistently: **resource** (a generated artefact), **project**
  (a registered vault/path with its own defaults), **revision** (one immutable run),
  **connector** (a model provider), **instruction** (the user's prompt).

## Brand Commitments

- Name: **sfumato**, lowercase. Domain `sfumato.sh`. Source at
  `github.com/getsfumato/cli`.
- The name is Leonardo's technique of blending tone into tone with no line between
  them, and the site's identity is built on that: three public-domain Leonardo
  paintings (*Virgin of the Rocks*, *Salvator Mundi*, *The Baptism of Christ*) as
  ground and specimen, and a wordmark drawn as the S of sfumato in the manner of an
  integral sign, reconstructed from its own Fourier series. Attribution to Leonardo
  and the public domain stays on the page.
- Voice: plain, declarative, unhurried. Claims in the user's terms; internals stay in
  `sfumato-cli/docs`. Earlier drafts that named parsers, inspection viewports and
  patch semantics read as a changelog and were deliberately removed.
- Type discipline is a binding commitment: three Geist faces, one job each — Pixel
  Square for identity and enumeration, Mono for machine surfaces, Sans for human
  language only.

## Evidence on Hand

- **Real:** the working CLI and its complete operational documentation
  (`sfumato-cli/docs/guide`, plus `docs/architecture` and `docs/adr`); `install.sh`;
  the three pre-blurred Leonardo plates and the `salvator-bust.webp` cutout in
  `public/img/`; the measured luminance and gradient readouts in `lib/specimen.ts`,
  which are genuinely sampled rather than illustrative.
- **Absent, and must never be fabricated:** users, install counts, GitHub stars,
  testimonials, customer logos, case studies, press, benchmarks, pricing, funding, a
  roadmap with dates, or any published release.

## Product Principles

1. **The user's material is the source of truth.** Every claim, demo and artefact
   should show the product working *from something the visitor already owns*.
2. **Show the artefact, don't describe it.** The product makes things you can look at;
   the page earns belief by putting one beside every claim rather than adding adjectives.
3. **Real numbers or none.** Where the page measures something, it measures it for
   real. Plausible-looking invented metrics are worse than silence.
4. **Internals live in the docs.** The page carries what a reader can act on; parser
   names, viewport lists and patch semantics belong in `sfumato-cli/docs`.
5. **Honest about being early.** Pre-release status is stated where it matters rather
   than papered over with the visual language of an established product.

## Accessibility & Inclusion

- The entrance reveal must not depend on JavaScript. Content that starts at
  `opacity: 0` under a JS-driven animation leaves the page blank when JS fails,
  hydration errors, or a tab is throttled — a real regression already caught in
  development. Entrances stay CSS keyframes, which degrade to visible.
- The Leonardo ground is progressive enhancement: CSS plates paint on the server
  render and stay if WebGL is unavailable. `prefers-reduced-motion` freezes the flow
  and grain to a single static composition. Both behaviours are requirements, not
  optimisations.
