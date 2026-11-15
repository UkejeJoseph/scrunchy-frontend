'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ComponentPropsWithoutRef, forwardRef } from 'react';

interface GradientButtonProps extends Omit<ComponentPropsWithoutRef<typeof Button>, 'variant'> {
  gradient?: string;
  variant?: 'solid' | 'outline' | 'ghost';
  loading?: boolean;
}

export function GradientButton({
  children,
  gradient = 'from-purple-500 to-pink-500',
  variant = 'solid',
  loading = false,
  disabled = false,
  className,
  ...props
}: GradientButtonProps) {
  if (variant === 'solid') {
    return (
      <motion.div
        whileHover={!disabled && !loading ? { scale: 1.05 } : {}}
        whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
      >
        <Button
          className={cn(
            `bg-gradient-to-r ${gradient} text-white border-0`,
            'hover:shadow-lg hover:shadow-purple-500/50',
            className
          )}
          disabled={disabled || loading}
          {...props}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </span>
          ) : (
            children
          )}
        </Button>
      </motion.div>
    );
  }

  if (variant === 'outline') {
    return (
      <Button
        variant="outline"
        className={cn(
          'border-2 bg-transparent',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading...
          </span>
        ) : (
          children
        )}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      className={className}
      disabled={disabled || loading}
      {...props}
    >
      {children}
    </Button>
  );
}

