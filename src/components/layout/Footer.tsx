import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full relative z-10 py-6 border-t border-white/5 bg-transparent mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-[10px] tracking-[2px] font-cinzel text-cream/40 uppercase">
        
        <div className="flex items-center space-x-6 mb-4 md:mb-0">
          <span>&copy; {new Date().getFullYear()} ANYBE</span>
          <Link href="/terms" className="hover:text-gold transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-gold transition-colors">Privacy</Link>
          <a href="mailto:concierge@anybe.com" className="hover:text-gold transition-colors">Contact</a>
        </div>

        <div className="flex items-center space-x-4">
          <a href="https://night.anybe.com" className="hover:text-gold transition-colors">night.anybe.com</a>
          <span className="text-cream/20">|</span>
          <a href="tel:+12244227777" className="hover:text-gold transition-colors">+1 224 422 7777</a>
        </div>

      </div>
    </footer>
  );
};
