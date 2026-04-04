'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface CardProps extends Omit<HTMLMotionProps<"div">, 'children'> {
  variant?: 'default' | 'event' | 'featured';
  children?: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = 'default', className = '', ...props }, ref) => {
    const baseStyles = "bg-black/40 backdrop-blur-md border border-white/10 transition-all duration-500 overflow-hidden";
    
    const variants = {
      default: "rounded-sm p-6 hover:border-brand-gold/50 hover:shadow-[0_8px_30px_rgba(181,164,138,0.08)]",
      event: "rounded-md hover:border-white/20 hover:shadow-[0_8px_30px_rgba(255,255,255,0.05)] cursor-pointer group",
      featured: "rounded-md border-white/10 shadow-[0_0_32px_rgba(0,0,0,0.5)] p-8 relative isolate",
    };

    return (
      <motion.div
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        whileHover={{ y: -4 }}
        {...props}
      >
        {variant === 'featured' && (
          <div className="absolute inset-0 bg-gradient-to-b from-brand-gold/5 to-transparent -z-10 pointer-events-none" />
        )}
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';
