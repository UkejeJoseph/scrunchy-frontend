'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | string;

interface RarityBadgeProps {
  rarity: Rarity;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

const rarityConfig = {
  Common: {
    gradient: 'from-gray-400 to-gray-600',
    className: 'bg-gradient-to-r from-gray-400 to-gray-600 text-white',
  },
  Uncommon: {
    gradient: 'from-green-400 to-green-600',
    className: 'bg-gradient-to-r from-green-400 to-green-600 text-white',
  },
  Rare: {
    gradient: 'from-blue-400 to-blue-600',
    className: 'bg-gradient-to-r from-blue-400 to-blue-600 text-white',
  },
  Epic: {
    gradient: 'from-purple-400 to-purple-600',
    className: 'bg-gradient-to-r from-purple-400 to-purple-600 text-white',
  },
  Legendary: {
    gradient: 'from-yellow-400 via-orange-500 to-yellow-600',
    className: 'bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600 text-white',
  },
};

const sizeClasses = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
};

export function RarityBadge({
  rarity,
  size = 'md',
  animated = true,
  className
}: RarityBadgeProps) {
  // Normalize rarity to Title Case so uppercase API values still work
  const normalized =
    typeof rarity === 'string'
      ? rarity.charAt(0).toUpperCase() + rarity.slice(1).toLowerCase()
      : 'Common';

  const config = rarityConfig[normalized as keyof typeof rarityConfig] || rarityConfig.Common;
  
  const BadgeContent = (
    <Badge
      className={cn(
        config.className,
        sizeClasses[size],
        'font-semibold shadow-lg',
        className
      )}
    >
      {rarity}
    </Badge>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        {BadgeContent}
      </motion.div>
    );
  }

  return BadgeContent;
}

