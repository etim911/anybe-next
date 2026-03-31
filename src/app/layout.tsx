import Link from 'next/link';
import type { Metadata } from 'next';
import './globals.css';
import { Footer } from '@/components/layout/Footer';
import { Navigation } from '@/components/layout/Navigation';

export const metadata: Metadata = {
  title: 'Anybe Night - An Immersive Crossing',
  description: 'What you experienced was not a performance - it was a crossing. A threshold into something truer.',
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
        
        <Navigation />

        <div className="flex-1 relative z-10 w-full pt-16">
          {children}
        </div>

        <Footer />
      </body>
    </html>
  );
}
