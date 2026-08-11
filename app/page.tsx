import EpicycleMark from '@/components/EpicycleMark';
import PointerParallax from '@/components/PointerParallax';
import InstallCommand from '@/components/InstallCommand';
import PaintingField from '@/components/PaintingField';
import Reveal from '@/components/Reveal';
import SpecimenPlate from '@/components/SpecimenPlate';

/**
 * One continuous descent across the full width.
 *
 * Every beat has the same two parts — a claim in plain language, and an artefact
 * beside it. The artefacts are what fill the width: a command, the specimen, a
 * table. The copy stays out of the internals; naming the parsers and the exact
 * viewports told the reader nothing they could act on.
 *
 * The three beats are chronological — they are the order a run happens in, which
 * is the only reason the numerals earn their place. They are not feature indices.
 *
 * No eyebrow above the name. The slot used to hold the mark's harmonic count,
 * which measured the logo rather than the product; a number that tells a reader
 * with a folder of notes nothing they can act on is decoration wearing
 * instrumentation's clothes. The install block carries the status instead.
 */
export default function Home() {
  return (
    <>
      <PaintingField />

      <div className="wrap">
        <header className="hero">
          <div className="hero__mark">
            <PointerParallax>
              <EpicycleMark />
            </PointerParallax>
          </div>

          <div className="hero__text">
            <Reveal delay={0.15}>
              <h1 className="wordmark">sfumato</h1>
            </Reveal>

            <Reveal delay={0.35}>
              <p className="lede">
                A local-first CLI that turns the notes you already have into finished material:{' '}
                <em>slide decks</em>, <em>standalone pages</em>, <em>documents</em> and{' '}
                <em>narrated video</em>. Everything renders on your machine and lands in your vault.
              </p>
            </Reveal>

            <Reveal delay={0.5}>
              <InstallCommand />
            </Reveal>
          </div>
        </header>

        <main className="beats">
          <Reveal>
            <section className="beat">
              <p className="beat__index">
                <span className="beat__num">01</span>
                <span className="beat__tag">grounded</span>
              </p>
              <div className="beat__body">
                <h2 className="beat__title">It works from your material.</h2>
                <p className="prose">
                  Point it at the folder that already holds your knowledge: a vault of lecture
                  notes, a course, a repo. Sfumato reads that corpus and teaches from it, so what
                  comes back is your own material, explained.
                </p>
              </div>
              <div className="beat__aside">
                <pre className="snippet">
                  <code>
                    <span className="snippet__prompt">$</span> sfumato generate slides ./notes
                    {'\n'}
                    <span className="snippet__cont">
                      {'    '}--instruction &quot;Explain Fourier series visually&quot;
                    </span>
                  </code>
                </pre>
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section className="beat" id="measure">
              <p className="beat__index">
                <span className="beat__num">02</span>
                <span className="beat__tag">inspected</span>
              </p>
              <div className="beat__body">
                <h2 className="beat__title">Then it checks its own work.</h2>
                <p className="prose">
                  Every resource is rendered, opened and inspected before it reaches you. When that
                  inspection finds a problem, sfumato patches it and looks again. A patch survives
                  only on evidence that it improved the result.
                </p>
              </div>
              <div className="beat__aside">
                <SpecimenPlate />
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section className="beat">
              <p className="beat__index">
                <span className="beat__num">03</span>
                <span className="beat__tag">filed</span>
              </p>
              <div className="beat__body">
                <h2 className="beat__title">Nothing is overwritten.</h2>
                <p className="prose">
                  Each run is filed under <em>~/.sfumato</em> as its own immutable revision, then
                  published into your vault as PDF, HTML or MP4. A month of iterating leaves you a
                  month of versions, each one still at its own path.
                </p>
              </div>
              <div className="beat__aside">
                <ul className="spec">
                  <li>
                    <span className="spec__key">decks</span> slides with diagrams and maths
                  </li>
                  <li>
                    <span className="spec__key">documents</span> handouts and study notes, paginated
                  </li>
                  <li>
                    <span className="spec__key">pages</span> one self-contained HTML file
                  </li>
                  <li>
                    <span className="spec__key">video</span> narrated MP4
                  </li>
                  <li>
                    <span className="spec__key">models</span> local, or hosted if you prefer
                  </li>
                </ul>
              </div>
            </section>
          </Reveal>
        </main>

        <Reveal>
          <footer className="foot">
            <nav className="links" aria-label="Project links">
              <a href="https://github.com/getsfumato/sfumato">source</a>
              <a href="https://github.com/getsfumato/sfumato/tree/master/docs/guide">docs</a>
              <a href="https://github.com/getsfumato/sfumato/releases">releases</a>
            </nav>
            <p className="foot__note">
              <em>Sfumato</em>
              {' — '}
              Leonardo&rsquo;s technique of blending tone into tone with no line between them.
            </p>
            <p className="foot__credit">
              Ground: <span>Virgin of the Rocks</span>, <span>Salvator Mundi</span>,{' '}
              <span>The Baptism of Christ</span>. Leonardo da&nbsp;Vinci, public domain.
            </p>
          </footer>
        </Reveal>
      </div>
    </>
  );
}
