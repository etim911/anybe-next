'use client';
import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedSparkleIcon = ({ className = "w-6 h-6" }) => {
  const pathVariants: any = {
    initial: { pathLength: 0, opacity: 0, fill: "rgba(212,168,84,0)" },
    animate: { 
      pathLength: 1, 
      opacity: 1, 
      fill: "rgba(212,168,84,0.2)",
      transition: { 
        pathLength: { duration: 1.5, ease: "easeInOut" },
        fill: { delay: 1, duration: 0.8 }
      }
    },
    hover: {
      scale: 1.1,
      filter: "drop-shadow(0px 0px 8px rgba(212,168,84,0.8))",
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.svg 
      className={className}
      viewBox="0 0 24 24" 
      initial="initial"
      whileInView="animate"
      whileHover="hover"
      viewport={{ once: true }}
    >
      <motion.path 
        d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" 
        stroke="#D4A854" 
        strokeWidth="1" 
        variants={pathVariants}
      />
    </motion.svg>
  );
};
