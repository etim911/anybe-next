import React from 'react';

export interface OrnateFrameProps {
  children: React.ReactNode;
  className?: string;
  padding?: string;
}

export const OrnateFrame: React.FC<OrnateFrameProps> = ({ 
  children, 
  className = '', 
  padding = 'px-6 py-10' 
}) => {
  return (
    <div className={`relative w-full max-w-[480px] mx-auto ${padding} ${className}`}>
      {/* SVG Border overlay covering the exact dimensions of the content box */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none" 
        preserveAspectRatio="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main Border Box */}
        <rect x="0.5" y="0.5" width="calc(100% - 1px)" height="calc(100% - 1px)" fill="none" stroke="currentColor" className="text-border" strokeWidth="1" opacity="0.4"/>
        
        {/* Top/Bottom Ornaments */}
        <text x="50%" y="0" dominantBaseline="middle" textAnchor="middle" className="fill-bg-primary text-xs tracking-widest font-display">
          <tspan dx="-20">·</tspan><tspan dx="10" fill="currentColor" className="fill-silver-dim">✦</tspan><tspan dx="10">·</tspan>
        </text>
        <text x="50%" y="100%" dominantBaseline="middle" textAnchor="middle" className="fill-bg-primary text-xs tracking-widest font-display">
          <tspan dx="-20">·</tspan><tspan dx="10" fill="currentColor" className="fill-silver-dim">✦</tspan><tspan dx="10">·</tspan>
        </text>

        {/* Top Left Corner */}
        <path d="M0 24 C0 10 10 0 24 0" fill="none" stroke="currentColor" className="text-silver" strokeWidth="1" opacity="0.4" />
        <circle cx="1.5" cy="23" r="1.5" fill="currentColor" className="text-silver" opacity="0.4"/>
        <circle cx="23" cy="1.5" r="1.5" fill="currentColor" className="text-silver" opacity="0.4"/>

        {/* Top Right Corner */}
        <path d="Mcalc(100% - 24px) 0 Ccalc(100% - 10px) 0 100% 10px 100% 24" fill="none" stroke="currentColor" className="text-silver" strokeWidth="1" opacity="0.4" />
        <circle cx="calc(100% - 23px)" cy="1.5" r="1.5" fill="currentColor" className="text-silver" opacity="0.4"/>
        <circle cx="calc(100% - 1.5px)" cy="23" r="1.5" fill="currentColor" className="text-silver" opacity="0.4"/>

        {/* Bottom Left Corner */}
        <path d="M0 calc(100% - 24px) C0 calc(100% - 10px) 10 100% 24 100%" fill="none" stroke="currentColor" className="text-silver" strokeWidth="1" opacity="0.4" />
        <circle cx="1.5" cy="calc(100% - 23px)" r="1.5" fill="currentColor" className="text-silver" opacity="0.4"/>
        <circle cx="23" cy="calc(100% - 1.5px)" r="1.5" fill="currentColor" className="text-silver" opacity="0.4"/>

        {/* Bottom Right Corner */}
        <path d="Mcalc(100% - 24px) 100% Ccalc(100% - 10px) 100% 100% calc(100% - 10px) 100% calc(100% - 24px)" fill="none" stroke="currentColor" className="text-silver" strokeWidth="1" opacity="0.4" />
        <circle cx="calc(100% - 23px)" cy="calc(100% - 1.5px)" r="1.5" fill="currentColor" className="text-silver" opacity="0.4"/>
        <circle cx="calc(100% - 1.5px)" cy="calc(100% - 23px)" r="1.5" fill="currentColor" className="text-silver" opacity="0.4"/>
      </svg>

      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
};
