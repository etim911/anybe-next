import Link from 'next/link';
import type { Metadata } from 'next';
import './globals.css';
import { Footer } from '@/components/layout/Footer';

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
      <body className="bg-bg-primary text-cream font-serif antialiased min-h-screen relative flex flex-col">
        <div className="fixed inset-0 pointer-events-none z-0" style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(30, 27, 22, 0.5) 0%, transparent 60%), radial-gradient(ellipse at 50% 100%, rgba(20, 18, 14, 0.8) 0%, transparent 50%)'
        }}></div>
        <div className="noise-overlay"></div>
        
        <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between py-4 px-6 bg-gradient-to-b from-bg-primary/95 to-bg-primary/0 backdrop-blur-[4px]">
          <Link href="/" className="flex items-center gap-2.5 opacity-85 hover:opacity-100 transition-opacity">
            <svg viewBox="0 0 100 80" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
              <g fill="#c4bfb3">
                <rect x="28" y="2" width="44" height="24" rx="12" fill="none" stroke="#c4bfb3" strokeWidth="2.5"/>
                <circle cx="60" cy="14" r="7" fill="#c4bfb3"/>
                <circle cx="36" cy="42" r="8" fill="none" stroke="#c4bfb3" strokeWidth="2.5"/>
                <path d="M36 50 L36 70 M28 58 L44 58 M36 70 L28 80 M36 70 L44 80" stroke="#c4bfb3" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                <circle cx="64" cy="42" r="8" fill="none" stroke="#c4bfb3" strokeWidth="2.5"/>
                <path d="M64 50 L64 70 M56 58 L72 58 M64 70 L56 80 M64 70 L72 80" stroke="#c4bfb3" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              </g>
            </svg>
            <span className="font-decorative text-cream tracking-[1px] text-base hidden sm:inline-block">Anybe</span>
          </Link>
          
        </nav>

        <div className="flex-1 relative z-10 w-full pt-16">
          {children}
        </div>

        <Footer />
      </body>
    </html>
  );
}
