import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full relative z-10 pt-6 pb-2 bg-transparent mt-14">
      {/* Gradient border effect */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Frosted glass vignette at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 via-black/40 to-transparent backdrop-blur-md pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto pl-[max(1.5rem,env(safe-area-inset-left))] pr-[max(1.5rem,env(safe-area-inset-right))] flex flex-col md:flex-row justify-between items-center text-sm tracking-widest font-display text-cream/40 uppercase">
        
        <div className="flex flex-wrap items-center justify-center gap-x-6 mb-4 md:mb-0">
          <span className="min-h-[44px] flex items-center">&copy; {new Date().getFullYear()} ANYBE</span>
          <Link href="/terms" className="hover:text-gold transition-colors min-h-[44px] flex items-center">Terms</Link>
          <Link href="/privacy" className="hover:text-gold transition-colors min-h-[44px] flex items-center">Privacy</Link>
          <a href="mailto:concierge@anybe.com" className="hover:text-gold transition-colors min-h-[44px] flex items-center">Contact</a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-4">
          <a href="https://night.anybe.com" className="hover:text-gold transition-colors min-h-[44px] flex items-center">night.anybe.com</a>
          <span className="text-cream/20">|</span>
          <a href="tel:+12244227777" className="hover:text-gold transition-colors min-h-[44px] flex items-center">+1 224 422 7777</a>
        </div>

      </div>
    </footer>
  );
};
