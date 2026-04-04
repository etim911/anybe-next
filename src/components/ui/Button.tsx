'use client';
import React from 'react';
import { motion } from 'framer-motion';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', isLoading, fullWidth, children, disabled, ...props }, ref) => {
    
    const baseStyles = "relative inline-flex items-center justify-center font-display text-xs tracking-widest uppercase transition-all duration-300 ease-out focus:outline-none overflow-hidden group";
    
    const variants = {
      primary: "bg-transparent border border-brand-gold text-brand-gold hover:bg-brand-gold/10 hover:shadow-[0_0_20px_rgba(212,168,84,0.15)]",
      secondary: "bg-transparent border border-border text-cream hover:border-silver hover:bg-white/5",
      ghost: "bg-transparent text-silver-dim hover:text-cream hover:bg-white/5"
    };

    const width = fullWidth ? "w-full" : "";
    const opacity = disabled || isLoading ? "opacity-50 cursor-not-allowed" : "";

    // Cast motion.button to any to avoid Next.js 14 strict TS intrinsic element errors
    const MotionButton = motion.button as React.ElementType;

    return (
      <MotionButton
        ref={ref}
        whileTap={disabled || isLoading ? undefined : { scale: 0.97 }}
        className={`${baseStyles} ${variants[variant]} ${width} ${opacity} px-8 py-4 ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Subtle hover gradient sweep */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[150%] group-hover:animate-[sweep_1.5s_ease-in-out_infinite]" />
        
        {isLoading ? (
          <div className="mr-3 h-4 w-4 relative flex items-center justify-center animate-spin">
             <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#d4a854] via-[#d4a854]/50 to-transparent p-[2px]" style={{ WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), black 0)' }} />
          </div>
        ) : null}
        <span className="relative z-10">{children as React.ReactNode}</span>
      </MotionButton>
    );
  }
);
Button.displayName = 'Button';
