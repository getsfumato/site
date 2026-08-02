import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { GeistPixelSquare } from 'geist/font/pixel';
import './globals.css';

/**
 * The description leads with the user's material rather than "one instruction",
 * which is the positioning the page itself now argues: what you hand it is what it
 * teaches from. The old copy put the prompt at the centre and made sfumato sound
 * like every other generator.
 */
const TITLE = 'sfumato — your material, rendered';
const DESCRIPTION =
  'A local-first CLI that turns the notes you already have into finished material: slide decks, standalone pages, documents and narrated video, rendered on your machine and filed into your vault.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase: new URL('https://sfumato.sh'),
  icons: { icon: '/favicon.svg' },
  openGraph: {
    type: 'website',
    url: 'https://sfumato.sh/',
    title: TITLE,
    description: DESCRIPTION,
  },
  // `summary_large_image` without an og:image renders as a bare text card on X and
  // gets no preview at all in some clients. `summary` is honest until a real card
  // image exists — likely a generated deck once there is one to show.
  twitter: { card: 'summary' },
};

export const viewport: Viewport = {
  themeColor: '#0b0908',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${GeistPixelSquare.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
