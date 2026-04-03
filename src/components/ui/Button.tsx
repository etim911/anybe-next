'use client';
import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<any, ButtonProps>(
  ({ className = '', variant = 'primary', isLoading, fullWidth, children, disabled, ...props }, ref) => {
    
    const baseStyles = "relative inline-flex items-center justify-center font-display text-xs tracking-[4px] uppercase transition-all duration-300 ease-out focus:outline-none overflow-hidden group";
    
    const variants = {
      primary: "bg-transparent border border-brand-gold text-brand-gold hover:bg-brand-gold/10 hover:shadow-[0_0_20px_rgba(212,168,84,0.15)]",
      secondary: "bg-transparent border border-border text-cream hover:border-silver hover:bg-white/5",
      ghost: "bg-transparent text-silver-dim hover:text-cream hover:bg-white/5"
    };

    const width = fullWidth ? "w-full" : "";
    const opacity = disabled || isLoading ? "opacity-50 cursor-not-allowed" : "";

    return (
      <motion.button
        ref={ref}
        whileTap={disabled ? undefined : { scale: 0.97 }}
        className={`${baseStyles} ${variants[variant]} ${width} ${opacity} px-8 py-4 ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Subtle hover gradient sweep */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[150%] group-hover:animate-[sweep_1.5s_ease-in-out_infinite]" />
        
        {isLoading ? (
          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : null}
        <span className="relative z-10">{children as React.ReactNode}</span>
      </motion.button>
    );
  }
);
Button.displayName = 'Button';
