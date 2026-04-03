'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, leftElement, rightElement, className = '', onFocus, onBlur, value, defaultValue, placeholder, ...props },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    
    // Determine if label should float
    const hasValue = (value !== undefined && value !== '') || (defaultValue !== undefined && defaultValue !== '');
    const isFloating = isFocused || hasValue || !!placeholder;

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      if (onFocus) onFocus(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      if (onBlur) onBlur(e);
    };

    // Cast to any to avoid Next.js strict TS errors on intrinsic elements
    const MotionDiv = motion.div as React.ElementType;

    return (
      <div className="flex flex-col mb-4 relative group">
        <MotionDiv
          className={`relative rounded-none border transition-colors duration-300 bg-[#141210] ${
            error 
              ? 'border-red-500/50' 
              : isFocused 
                ? 'border-[#d4a854] shadow-[0_0_15px_rgba(212,168,84,0.15)]' 
                : 'border-[#d4a854]/30 hover:border-[#d4a854]/50'
          }`}
          animate={{
            boxShadow: isFocused && !error ? '0 0 15px rgba(212,168,84,0.25)' : '0 0 0px rgba(212,168,84,0)',
          }}
          transition={{ duration: 0.3 }}
        >
          {label && (
            <label 
              className={`absolute left-4 font-display tracking-wide transition-all duration-300 pointer-events-none z-10
                ${isFloating ? '-top-2.5 text-[10px] bg-[#141210] px-1 text-[#d4a854]' : 'top-3.5 text-sm text-cream/50'}
                ${leftElement && !isFloating ? 'left-10' : ''}
              `}
            >
              {label}
            </label>
          )}
          
          <div className="relative flex items-center">
            {leftElement && (
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#d4a854]/70">
                {leftElement}
              </div>
            )}
            <input
              ref={ref}
              onFocus={handleFocus}
              onBlur={handleBlur}
              value={value}
              defaultValue={defaultValue}
              placeholder={placeholder}
              className={`
                w-full bg-transparent text-cream font-cormorant placeholder-cream/30
                px-4 py-3 focus:outline-none transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed
                ${leftElement ? 'pl-10' : ''}
                ${rightElement ? 'pr-10' : ''}
                ${className}
              `}
              {...props}
            />
            {rightElement && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#d4a854]/70">
                {rightElement}
              </div>
            )}
          </div>
        </MotionDiv>
        {error && (
          <span className="text-red-500 text-xs mt-1 font-cormorant absolute -bottom-5">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
