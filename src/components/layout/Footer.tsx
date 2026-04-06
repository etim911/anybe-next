import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full relative z-10 py-8 mt-14 bg-gradient-to-t from-black/80 to-transparent backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap items-center justify-center gap-x-8 text-[11px] tracking-[0.2em] font-display text-white/50 uppercase">
          <span>&copy; 2026 ANYBE</span>
          <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
        </div>
      </div>
    </footer>
  );
};
