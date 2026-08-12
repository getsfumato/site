import InstallCommand from '@/components/InstallCommand';
import LinkRow from '@/components/LinkRow';
import PaintingField from '@/components/PaintingField';
import Reveal from '@/components/Reveal';
import SpecimenPlate from '@/components/SpecimenPlate';

/**
 * One screen, one action.
 *
 * The page is a single centred column: the Salvator Mundi bust, the name, one
 * line of what it does, the install command, three icons. Nothing scrolls,
 * nothing enumerates features — a visitor who has read the line either runs the
 * command or follows a link, and the old three-beat descent was in the way of
 * both.
 *
 * Salvator carries the identity now that the epicycle mark is gone, and he is
 * still the measured specimen: the page samples five regions of the painting and
 * reports what it finds. That is the product's argument in one object — a machine
 * looking very closely at gradation it cannot draw a line through — so the plate
 * moved to the top of the page rather than being deleted with the beats it used
 * to sit in.
 *
 * The plate's shader is also the only thing that removes the crop. The bust runs
 * off its own edges on three sides, so alpha is fully opaque at the boundary and a
 * plain image element reads as a rectangle sitting in the page; the dissolve has to
 * happen per-pixel, which is why the fallback image carries a radial mask of its
 * own until the GL layer takes over.
 */
export default function Home() {
  return (
    <>
      <PaintingField />

      <main className="stage">
        <Reveal className="portrait" delay={0.05}>
          <SpecimenPlate />
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
