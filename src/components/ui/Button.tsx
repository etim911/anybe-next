'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', isLoading, fullWidth, children, disabled, ...props }, ref) => {
    
    const baseStyles = "relative inline-flex items-center justify-center font-display text-base tracking-[0.2em] uppercase transition-colors duration-300 ease-out focus:outline-none overflow-hidden rounded-sm";
    
    const variants = {
      primary: "bg-bg-primary border border-brand-gold text-brand-gold",
      secondary: "bg-transparent border border-border text-brand-cream",
      ghost: "bg-transparent text-silver-dim"
    };

    const MotionButton = motion.button as any;

    return (
      <MotionButton
        ref={ref}
        initial="initial"
        whileHover={!disabled && !isLoading ? "hover" : "initial"}
        whileTap={!disabled && !isLoading ? "tap" : "initial"}
        variants={{
          initial: { scale: 1, boxShadow: '0px 0px 0px rgba(212,168,84,0)' },
          hover: { 
            scale: 1.02, 
            boxShadow: '0px 0px 20px rgba(212,168,84,0.3)',
            transition: { duration: 0.3 }
          },
          tap: { scale: 0.97 }
        }}
        className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''} px-8 py-4 ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Shiny Sweep Effect */}
        {variant === 'primary' && !disabled && (
          <motion.div
            variants={{
              initial: { x: '-100%', opacity: 0 },
              hover: { 
                x: '200%', 
                opacity: 1, 
                transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
              }
            }}
            className="absolute inset-0 z-0 w-1/2 bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent skew-x-[-20deg]"
          />
        )}
        
        <span className="relative z-10 flex items-center gap-2">
          {isLoading && (
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="h-4 w-4 rounded-full border-2 border-brand-gold border-t-transparent"
            />
          )}
          {children}
        </span>
      </MotionButton>
    );
  }
);
Button.displayName = 'Button';
