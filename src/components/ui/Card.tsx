import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface CardProps extends Omit<HTMLMotionProps<"div">, 'children'> {
  variant?: 'default' | 'event' | 'featured';
  children?: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = 'default', className = '', ...props }, ref) => {
    const baseStyles = "bg-[#141210]/95 border border-gold/20 backdrop-blur-sm transition-all duration-500 overflow-hidden";
    
    const variants = {
      default: "rounded-sm p-6 hover:border-gold/50 hover:shadow-[0_8px_30px_rgba(181,164,138,0.08)]",
      event: "rounded-md hover:border-gold hover:shadow-[0_8px_30px_rgba(181,164,138,0.12)] cursor-pointer group",
      featured: "rounded-md border-gold/50 shadow-[0_0_20px_rgba(181,164,138,0.1)] p-8 relative isolate",
    };

    return (
      <motion.div
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        whileHover={{ y: -4 }}
        {...props}
      >
        {variant === 'featured' && (
          <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent -z-10 pointer-events-none" />
        )}
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';
