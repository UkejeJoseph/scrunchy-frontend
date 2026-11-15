'use client';

import { use } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { GlassCard } from '@/components/aceternity/glass-card';
import { RarityBadge } from '@/components/aceternity/rarity-badge';
import { GradientButton } from '@/components/aceternity/gradient-button';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAsset } from '@/hooks/useAssets';
import { useListings } from '@/hooks/useMarketplace';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

export default function AssetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { data: asset, isLoading: assetLoading, error: assetError } = useAsset(id);
  
  // Get listings for this asset
  const { data: listingsData } = useListings({ limit: 100 });
  const listing = listingsData?.listings.find(l => l.assetId === id);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <Link href="/marketplace">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Marketplace
            </Button>
          </Link>

          {assetLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          ) : assetError || !asset ? (
            <GlassCard className="bg-white border-gray-200 p-8 text-center">
              <p className="text-red-600">
                {assetError instanceof Error ? assetError.message : 'Asset not found'}
              </p>
            </GlassCard>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Image Gallery */}
              <div>
                <div className="aspect-square relative rounded-lg overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400 mb-4">
                  {asset.imageUrl ? (
                    <img src={asset.imageUrl} alt={asset.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white font-semibold text-xl">
                      {asset.name}
                    </div>
                  )}
                </div>
              </div>

              {/* Asset Info */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <RarityBadge rarity={asset.rarity as any} size="md" />
                    <span className="px-3 py-1 rounded-full bg-gray-200 text-sm">{asset.assetType}</span>
                  </div>
                  <h1 className="text-4xl font-display font-bold mb-2">{asset.name}</h1>
                  <p className="text-gray-600">{asset.description || 'No description available'}</p>
                </div>

                {/* Owner Card */}
                <GlassCard className="bg-white border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                        {asset.owner.username?.[0] || asset.owner.walletAddress[0]}
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Owned by</p>
                        <p className="font-semibold">{asset.owner.username || asset.owner.walletAddress.slice(0, 8) + '...'}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => router.push(`/profile`)}>View Profile</Button>
                  </div>
                </GlassCard>

                {/* Pricing Card */}
                {listing && (
                  <GlassCard className="bg-white border-gray-200">
                    <h2 className="font-semibold text-lg mb-4">Rental Pricing</h2>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Price per Hour</span>
                        <span className="text-2xl font-bold">{(parseInt(listing.pricePerHour) / 1e9).toFixed(4)} SOL</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Price per Day</span>
                        <span className="text-xl font-semibold">{(parseInt(listing.pricePerDay) / 1e9).toFixed(4)} SOL</span>
                      </div>
                    </div>
                  </GlassCard>
                )}

                <GlassCard className="bg-white border-gray-200">
                  <div className="flex gap-2">
                    {asset.isRentable && listing && (
                      <GradientButton 
                        className="flex-1"
                        onClick={() => {
                          if (!isAuthenticated) {
                            toast.error('Please connect your wallet to rent assets');
                            return;
                          }
                          router.push(`/marketplace/listings/${listing.id}`);
                        }}
                      >
                        Rent Asset
                      </GradientButton>
                    )}
                    {asset.isRentable && !listing && (
                      <p className="text-sm text-gray-500 text-center w-full py-2">Not currently listed for rent</p>
                    )}
                  </div>
                </GlassCard>

                {/* Attributes */}
                {asset.baseAttributes && Object.keys(asset.baseAttributes).length > 0 && (
                  <GlassCard className="bg-white border-gray-200">
                    <h2 className="font-semibold text-lg mb-4">Base Attributes</h2>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(asset.baseAttributes).map(([key, value]) => (
                        <div key={key} className="flex flex-col p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-500 capitalize">{key}</span>
                          <span className="font-semibold text-lg">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

