'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // This would ideally come from a context/store in auth
  const [isAuthenticated] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0c0b0a]/80 backdrop-blur-md border-b border-gold/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="font-cinzel text-2xl tracking-widest text-gold hover:text-cream transition-colors">
              ANYBE
            </Link>
          </div>

          <div className="hidden md:flex space-x-8 items-center font-cinzel text-sm tracking-wider uppercase">
            <Link href="/events" className="text-cream/80 hover:text-gold transition-colors">
              Events
            </Link>
            <Link href="/about" className="text-cream/80 hover:text-gold transition-colors">
              About
            </Link>
            {isAuthenticated ? (
              <Link href="/account" className="text-cream/80 hover:text-gold transition-colors">
                My Account
              </Link>
            ) : (
              <Link href="/auth" className="px-5 py-2 border border-gold/50 text-gold hover:bg-gold/10 transition-colors">
                Sign In
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-cream/80 hover:text-gold focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0c0b0a]/95 border-b border-gold/10"
          >
            <div className="px-4 pt-2 pb-6 space-y-4 flex flex-col font-cinzel text-center uppercase tracking-wider">
              <Link href="/events" className="block text-cream hover:text-gold transition-colors" onClick={() => setIsOpen(false)}>
                Events
              </Link>
              <Link href="/about" className="block text-cream hover:text-gold transition-colors" onClick={() => setIsOpen(false)}>
                About
              </Link>
              {isAuthenticated ? (
                <Link href="/account" className="block text-gold hover:text-cream transition-colors" onClick={() => setIsOpen(false)}>
                  My Account
                </Link>
              ) : (
                <Link href="/auth" className="block text-gold hover:text-cream transition-colors" onClick={() => setIsOpen(false)}>
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
