'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Heart, Eye, Clock } from 'lucide-react';
import { GlassCard } from '@/components/aceternity/glass-card';
import { RarityBadge } from '@/components/aceternity/rarity-badge';
import { GradientButton } from '@/components/aceternity/gradient-button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface AssetCardProps {
  asset: {
    id: string;
    name: string;
    imageUrl: string;
    rarity: string;
    assetType: string;
    floorPrice: number;
    rentalPricePerHour?: number;
    isRentable: boolean;
    owner: {
      username?: string;
      walletAddress: string;
    };
  };
  variant?: 'grid' | 'list';
  onView?: (id: string) => void;
  onRent?: (id: string) => void;
  onFavorite?: (id: string) => void;
}

export function AssetCard({
  asset,
  variant = 'grid',
  onView,
  onRent,
  onFavorite
}: AssetCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  if (variant === 'list') {
    return (
      <GlassCard hover glow className="flex gap-4 p-4 bg-white border-gray-200">
        <div className="relative h-24 w-24 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-purple-400 to-pink-400">
          <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-semibold">
            {asset.name}
          </div>
        </div>
        <div className="flex-1 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg">{asset.name}</h3>
              <RarityBadge rarity={asset.rarity as any} size="sm" />
            </div>
            <p className="text-sm text-gray-600">{asset.assetType}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Floor Price</p>
              <p className="font-bold">{asset.floorPrice} SOL</p>
            </div>
            <GradientButton size="sm" onClick={() => onView?.(asset.id)}>
              View
            </GradientButton>
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <GlassCard
        hover
        glow
        className="group cursor-pointer overflow-hidden bg-white border-gray-200"
        onClick={() => onView?.(asset.id)}
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400">
          <motion.div
            className="absolute inset-0 flex items-center justify-center text-white font-semibold"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            {asset.name}
          </motion.div>
          
          {/* Gradient Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Badge */}
          <div className="absolute top-3 right-3 z-10">
            <RarityBadge rarity={asset.rarity as any} size="sm" />
          </div>
          
          {/* Quick Actions */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center gap-2 z-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            transition={{ duration: 0.3 }}
          >
            <GradientButton
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onView?.(asset.id);
              }}
              className="bg-white/90 backdrop-blur-sm"
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </GradientButton>
            {asset.isRentable && (
              <GradientButton
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onRent?.(asset.id);
                }}
              >
                <Clock className="h-4 w-4 mr-1" />
                Rent
              </GradientButton>
            )}
          </motion.div>
          
          {/* Favorite Button */}
          <motion.button
            className="absolute top-3 left-3 p-2 rounded-full bg-black/50 backdrop-blur-sm z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorited(!isFavorited);
              onFavorite?.(asset.id);
            }}
          >
            <Heart 
              className={cn(
                "h-4 w-4 transition-colors",
                isFavorited ? "text-red-500 fill-red-500" : "text-white"
              )} 
            />
          </motion.button>
        </div>
        
        {/* Info */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg truncate flex-1">{asset.name}</h3>
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 ml-2 whitespace-nowrap">
              {asset.assetType}
            </span>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <div>
              <p className="text-xs text-gray-500">Floor Price</p>
              <p className="font-bold text-lg">{asset.floorPrice} SOL</p>
            </div>
            
            {asset.isRentable && (
              <div>
                <p className="text-xs text-gray-500">Rent/hr</p>
                <p className="font-bold text-green-600 text-lg">
                  {asset.rentalPricePerHour} SOL
                </p>
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

