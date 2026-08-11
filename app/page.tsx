import InstallCommand from '@/components/InstallCommand';
import LinkRow from '@/components/LinkRow';
import PaintingField from '@/components/PaintingField';
import Reveal from '@/components/Reveal';

/**
 * One screen, one action.
 *
 * The page is a single centred column: the Salvator Mundi bust, the name, one
 * line of what it does, the install command, three icons. Nothing scrolls,
 * nothing enumerates features — a visitor who has read the line either runs the
 * command or follows a link, and the old three-beat descent was in the way of
 * both.
 *
 * Salvator carries the identity now that the epicycle mark is gone. He is the
 * page's own argument for its name: the bust is a cutout on black, dissolved at
 * the bottom edge into the ground it sits on, so there is no line between figure
 * and dark — which is what sfumato means.
 */
export default function Home() {
  return (
    <>
      <PaintingField />

      <main className="stage">
        <Reveal className="portrait" delay={0.05}>
          {/* eslint-disable-next-line @next/next/no-img-element -- unoptimized on
              purpose: this is a static export, and the source webp is already the
              size it renders at */}
          <img
            src="/img/salvator-bust.webp"
            alt="Salvator Mundi, Leonardo da Vinci"
            width={820}
            height={912}
            decoding="async"
          />
        </Reveal>

        <Reveal delay={0.2}>
          <h1 className="wordmark">sfumato</h1>
        </Reveal>

        <Reveal delay={0.32}>
          <p className="lede">Your notes, rendered into decks, documents, pages and video.</p>
        </Reveal>

        <Reveal className="stage__act" delay={0.44}>
          <InstallCommand />
        </Reveal>

        <Reveal className="stage__act" delay={0.58}>
          <LinkRow />
        </Reveal>
      </main>
    </>
  );
}
