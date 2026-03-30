import React from 'react';

export interface OrnateFrameProps {
  children: React.ReactNode;
  className?: string;
}

export const OrnateFrame: React.FC<OrnateFrameProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative p-8 border border-gold/30 ${className}`}>
      {/* Top Left Corner */}
      <svg className="absolute -top-[1px] -left-[1px] w-8 h-8 text-gold/60" viewBox="0 0 100 100" fill="currentColor">
        <path d="M0,0 L100,0 C100,0 50,20 50,50 C50,80 0,100 0,100 Z" />
      </svg>
      {/* Top Right Corner */}
      <svg className="absolute -top-[1px] -right-[1px] w-8 h-8 text-gold/60 rotate-90" viewBox="0 0 100 100" fill="currentColor">
        <path d="M0,0 L100,0 C100,0 50,20 50,50 C50,80 0,100 0,100 Z" />
      </svg>
      {/* Bottom Left Corner */}
      <svg className="absolute -bottom-[1px] -left-[1px] w-8 h-8 text-gold/60 -rotate-90" viewBox="0 0 100 100" fill="currentColor">
        <path d="M0,0 L100,0 C100,0 50,20 50,50 C50,80 0,100 0,100 Z" />
      </svg>
      {/* Bottom Right Corner */}
      <svg className="absolute -bottom-[1px] -right-[1px] w-8 h-8 text-gold/60 rotate-180" viewBox="0 0 100 100" fill="currentColor">
        <path d="M0,0 L100,0 C100,0 50,20 50,50 C50,80 0,100 0,100 Z" />
      </svg>

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export const Divider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center space-x-4 opacity-70 my-8 ${className}`}>
      <div className="h-[1px] w-12 bg-gold/50"></div>
      <span className="text-gold/80 text-lg">✦</span>
      <div className="h-[1px] w-12 bg-gold/50"></div>
    </div>
  );
};
