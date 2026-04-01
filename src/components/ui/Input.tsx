import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, leftElement, rightElement, className = '', ...props },
    ref
  ) => {
    return (
      <div className="flex flex-col mb-4 relative">
        {label && (
          <label className="text-sm font-display text-cream mb-2 tracking-wide">
            {label}
          </label>
        )}
        <div className="relative">
          {leftElement && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-cream/50">
              {leftElement}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full bg-[#141210] border border-gold/30 rounded-none
              text-cream font-cormorant placeholder-cream/30
              px-4 py-3 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/50 transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed
              ${leftElement ? 'pl-10' : ''}
              ${rightElement ? 'pr-10' : ''}
              ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : ''}
              ${className}
            `}
            {...props}
          />
          {rightElement && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <span className="text-red-500 text-xs mt-1 font-cormorant">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
