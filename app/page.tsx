import EpicycleMark from '@/components/EpicycleMark';
import PointerParallax from '@/components/PointerParallax';
import InstallCommand from '@/components/InstallCommand';
import PaintingField from '@/components/PaintingField';
import Reveal from '@/components/Reveal';
import SpecimenPlate from '@/components/SpecimenPlate';
import { integralGlyph } from '@/lib/fourier';

/**
 * One continuous descent across the full width.
 *
 * Every beat has the same two parts — a claim in plain language, and an artefact
 * beside it. The artefacts are what fill the width: a command, the specimen, a
 * table. The copy stays out of the internals; naming the parsers and the exact
 * viewports told the reader nothing they could act on.
 */
export default function Home() {
  // The letterform is static, so the harmonic count is resolved at build time
  // rather than reported back from the canvas after it mounts.
  const { harmonics } = integralGlyph();

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
              <p className="eyebrow">
                <span>{harmonics.length} harmonics</span>
                <span className="rule" />
                <span>one continuous stroke</span>
              </p>
            </Reveal>

            <Reveal delay={0.35}>
              <p className="lede">
                A local-first CLI that turns your own knowledge base into finished material —{' '}
                <em>slide decks</em>, <em>standalone pages</em> and <em>video</em>. Rendered on your
                machine.
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
                  Point it at whatever holds your knowledge — a folder of notes, a course, a repo.
                  What you hand it is what it teaches from, so you get your material explained
                  rather than a generic summary of the topic.
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
                  Nothing ships on the first draft. Every resource gets validated, opened and
                  looked at, and a correction is kept only when it actually makes the result
                  better.
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
                  Every run is kept as its own version and then published wherever you want it.
                  Generate the same thing again and the one before it is still sitting there.
                </p>
              </div>
              <div className="beat__aside">
                <ul className="spec">
                  <li>
                    <span className="spec__key">decks</span> slides with diagrams and maths
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
              <a href="https://github.com/getsfumato/cli">source</a>
              <a href="https://github.com/getsfumato/cli/tree/master/docs/guide">docs</a>
              <a href="https://github.com/getsfumato/cli/releases">releases</a>
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
