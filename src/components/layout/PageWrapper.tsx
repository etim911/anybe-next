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
    <div className="relative bg-transparent text-cream flex flex-col font-serif overflow-x-hidden selection:bg-gold/30 selection:text-white">
      <main className={`relative z-10 flex-grow w-full max-w-7xl mx-auto ${withPadding ? 'px-4 sm:px-6 lg:px-8 py-24' : ''} ${className}`}>
        {children}
      </main>
    </div>
  );
};
