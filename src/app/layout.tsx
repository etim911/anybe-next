import Link from 'next/link';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

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
    <html lang="en">
      <body className="fixed inset-0 overflow-hidden overscroll-none bg-[#0c0b0a] text-[#ece6d8] font-serif antialiased relative flex flex-col">
        <div className="fixed inset-0 pointer-events-none z-0" style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(30, 27, 22, 0.5) 0%, transparent 60%), radial-gradient(ellipse at 50% 100%, rgba(20, 18, 14, 0.8) 0%, transparent 50%)'
        }}></div>
        <div className="noise-overlay"></div>
        
        <Header />

        <main className="flex-1 overflow-y-auto overscroll-contain w-full relative z-10 pt-16">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
