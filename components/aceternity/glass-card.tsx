'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  glow?: boolean;
}

export function GlassCard({ 
  children, 
  className,
  hover = true,
  onClick,
  glow = false
}: GlassCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={cn(
        'relative rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl',
        'p-6 shadow-xl overflow-hidden',
        hover && 'transition-all duration-300',
        onClick && 'cursor-pointer',
        glow && isHovered && 'shadow-2xl shadow-purple-500/50',
        className
      )}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={hover ? { 
        scale: 1.02, 
        y: -4,
        borderColor: 'rgba(255, 255, 255, 0.4)',
      } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
    >
      {/* Animated gradient border on hover */}
      {isHovered && glow && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

