import React from 'react';

export interface OrnateFrameProps {
  children: React.ReactNode;
  className?: string;
  padding?: string;
}

export const OrnateFrame: React.FC<OrnateFrameProps> = ({ children, className = '', padding = 'pt-[20px] px-[20px] pb-[20px]' }) => {
  return (
    <div className={`relative ${padding} border border-border bg-gradient-to-br from-[#1a181499] to-[#0e0c0acc] ${className}`}>
      {/* Top/bottom ornament lines simulated with absolute divs since pseudo elements with background clip are tricky */}
      <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 bg-bg-deep px-[12px] text-[11px] tracking-[4px] text-silver-dim opacity-60">
        · ✦ ·
      </div>
      <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 bg-bg-deep px-[12px] text-[11px] tracking-[4px] text-silver-dim opacity-60">
        · ✦ ·
      </div>

      {/* Top Left Corner */}
      <div className="absolute top-[8px] left-[8px] w-[28px] h-[28px] opacity-40">
        <svg viewBox="0 0 40 40" className="w-full h-full"><path d="M2 38 C2 18 18 2 38 2" stroke="currentColor" className="text-silver" strokeWidth="1" fill="none" opacity="0.4"/><circle cx="4" cy="36" r="2" fill="currentColor" className="text-silver" opacity="0.3"/><circle cx="36" cy="4" r="2" fill="currentColor" className="text-silver" opacity="0.3"/></svg>
      </div>
      {/* Top Right Corner */}
      <div className="absolute top-[8px] right-[8px] w-[28px] h-[28px] opacity-40 scale-x-[-1]">
        <svg viewBox="0 0 40 40" className="w-full h-full"><path d="M2 38 C2 18 18 2 38 2" stroke="currentColor" className="text-silver" strokeWidth="1" fill="none" opacity="0.4"/><circle cx="4" cy="36" r="2" fill="currentColor" className="text-silver" opacity="0.3"/><circle cx="36" cy="4" r="2" fill="currentColor" className="text-silver" opacity="0.3"/></svg>
      </div>
      {/* Bottom Left Corner */}
      <div className="absolute bottom-[8px] left-[8px] w-[28px] h-[28px] opacity-40 scale-y-[-1]">
        <svg viewBox="0 0 40 40" className="w-full h-full"><path d="M2 38 C2 18 18 2 38 2" stroke="currentColor" className="text-silver" strokeWidth="1" fill="none" opacity="0.4"/><circle cx="4" cy="36" r="2" fill="currentColor" className="text-silver" opacity="0.3"/><circle cx="36" cy="4" r="2" fill="currentColor" className="text-silver" opacity="0.3"/></svg>
      </div>
      {/* Bottom Right Corner */}
      <div className="absolute bottom-[8px] right-[8px] w-[28px] h-[28px] opacity-40 scale-x-[-1] scale-y-[-1]">
        <svg viewBox="0 0 40 40" className="w-full h-full"><path d="M2 38 C2 18 18 2 38 2" stroke="currentColor" className="text-silver" strokeWidth="1" fill="none" opacity="0.4"/><circle cx="4" cy="36" r="2" fill="currentColor" className="text-silver" opacity="0.3"/><circle cx="36" cy="4" r="2" fill="currentColor" className="text-silver" opacity="0.3"/></svg>
      </div>

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export const Divider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`text-center text-silver-dim text-[14px] tracking-[4px] opacity-60 my-[18px] ${className}`}>
      - ✦ -
    </div>
  );
};