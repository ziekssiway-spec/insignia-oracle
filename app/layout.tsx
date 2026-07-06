import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import AmbientOracle from '@/components/AmbientOracle';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'The Insignia Oracle — Your crest, divined.',
  description:
    'Answer twenty questions and the Oracle will design a crest unique to you — engraved in gold, matched to the words you were meant to live by.',
  openGraph: {
    title: 'The Insignia Oracle',
    description: 'Your crest, divined.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        <AmbientOracle />
        {children}
      </body>
    </html>
  );
}
