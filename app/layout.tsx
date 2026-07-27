import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { GeistPixelSquare } from 'geist/font/pixel';
import './globals.css';

export const metadata: Metadata = {
  title: 'sfumato — one instruction, rendered',
  description:
    'A local-first CLI that turns one instruction into slide decks, standalone pages, and video — rendered on your machine, filed into your vault.',
  metadataBase: new URL('https://sfumato.sh'),
  icons: { icon: '/favicon.svg' },
  openGraph: {
    type: 'website',
    url: 'https://sfumato.sh/',
    title: 'sfumato — one instruction, rendered',
    description:
      'A local-first CLI that turns one instruction into slide decks, standalone pages, and video.',
  },
  twitter: { card: 'summary_large_image' },
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
