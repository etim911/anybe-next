'use client';
import { motion } from 'framer-motion';

export function LivingBackground() {
  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-bg-primary">
        <motion.div 
          animate={{ 
            opacity: [0.4, 0.6, 0.4],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[120%] h-[80%] rounded-[100%] blur-[120px] bg-radial-gradient from-brand-gold/10 to-transparent"
        />
        <motion.div 
          animate={{ 
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[150%] h-[60%] rounded-[100%] blur-[100px] bg-radial-gradient from-[#1a1814] to-transparent"
        />
      </div>
    </>
  );
}
