import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  withPadding?: boolean;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ 
  children, 
  className = '',
  withPadding = true 
}) => {
  return (
    <div className="relative min-h-screen bg-[#0c0b0a] text-cream flex flex-col font-cormorant overflow-x-hidden selection:bg-gold/30 selection:text-white">
      {/* Background Noise Texture Overlay */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      <main className={`relative z-10 flex-grow w-full max-w-7xl mx-auto ${withPadding ? 'px-4 sm:px-6 lg:px-8 py-24' : ''} ${className}`}>
        {children}
      </main>
    </div>
  );
};
