'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ParticleBackground } from './particle-background';

interface GradientBackgroundProps {
  gradient?: string;
  children: React.ReactNode;
  className?: string;
  overlay?: boolean;
  particles?: boolean;
}

export function GradientBackground({ 
  gradient = 'from-purple-600 via-pink-600 to-blue-600',
  children,
  className = '',
  overlay = true,
  particles = false
}: GradientBackgroundProps) {
  return (
    <div className={cn('relative min-h-screen overflow-hidden', className)}>
      {/* Animated gradient background */}
      <motion.div
        className={cn('absolute inset-0 bg-gradient-to-br opacity-90', gradient)}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          backgroundSize: '200% 200%',
        }}
      />
      
      {/* Animated gradient overlay for depth - reduced opacity for better contrast */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
        animate={{
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Glassmorphism overlay */}
      {overlay && (
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
      )}
      
      {/* Particle background */}
      {particles && <ParticleBackground count={30} />}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

