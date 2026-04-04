import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Cinzel, Cinzel_Decorative } from 'next/font/google';
import './globals.css';
import { Footer } from "@/components/layout/Footer";
import { LivingBackground } from "@/components/layout/LivingBackground";
import { Header } from '@/components/layout/Header';
import { NoiseOverlay } from '@/components/ui/NoiseOverlay';

const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
  adjustFontFallback: true,
});

const cinzel = Cinzel({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
  adjustFontFallback: true,
});

const cinzelDecorative = Cinzel_Decorative({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-cinzel-decorative',
  display: 'swap',
  adjustFontFallback: true,
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover'
};

export const metadata: Metadata = {
  title: 'Anybe Night - An Immersive Crossing',
  description: 'What you experienced was not a performance - it was a crossing. A threshold into something truer. July 17, 2026. Los Angeles. 100 guests only.',
  openGraph: {
    title: 'Anybe Night - An Immersive Crossing',
    description: 'What you experienced was not a performance - it was a crossing. A threshold into something truer. July 17, 2026. Los Angeles. 100 guests only.',
    type: 'website',
    url: 'https://night.anybe.com',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`overscroll-none ${cormorant.variable} ${cinzel.variable} ${cinzelDecorative.variable}`}>
      <body className="bg-bg-primary text-text-primary font-serif antialiased relative flex flex-col overscroll-none">
        <NoiseOverlay />
        <LivingBackground />
        
        <Header />

        <main className="flex-1 overflow-y-auto overscroll-contain w-full relative z-10 pt-16 flex flex-col [-webkit-overflow-scrolling:touch] pb-[env(safe-area-inset-bottom)]">
          <div className="flex-1 shrink-0 flex flex-col">
            {children}
          </div>
          <div className="shrink-0 mt-auto">
            <Footer />
          </div>
        </main>
      </body>
    </html>
  );
}
