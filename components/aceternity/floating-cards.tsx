'use client';

import { motion } from 'framer-motion';
import { GlassCard } from './glass-card';
import Image from 'next/image';

interface FloatingCard {
  id: string;
  imageUrl: string;
  name: string;
  x: number;
  y: number;
  delay: number;
}

interface FloatingCardsProps {
  cards: FloatingCard[];
}

export function FloatingCards({ cards }: FloatingCardsProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {cards.map((card) => (
        <motion.div
          key={card.id}
          className="absolute"
          initial={{ x: card.x, y: card.y, opacity: 0 }}
          animate={{
            x: [card.x, card.x + 20, card.x],
            y: [card.y, card.y - 30, card.y],
            opacity: [0, 1, 0.8],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: card.delay,
            ease: 'easeInOut',
          }}
          style={{
            left: `${card.x}%`,
            top: `${card.y}%`,
          }}
        >
          <GlassCard className="w-32 h-32 p-2 bg-white/20">
            <div className="w-full h-full rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-semibold">
              {card.name}
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}

