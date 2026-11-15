'use client';

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { GlassCard } from '@/components/aceternity/glass-card';
import { GradientButton } from '@/components/aceternity/gradient-button';
import { RarityBadge } from '@/components/aceternity/rarity-badge';
import { Badge } from '@/components/ui/badge';
import { Clock, Loader2 } from 'lucide-react';
import { useRentals } from '@/hooks/useMarketplace';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function MyRentalsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { data: rentals = [], isLoading } = useRentals({ active: true });
  
  if (!isAuthenticated) {
    router.push('/');
    return null;
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-display font-bold mb-8">My Rentals</h1>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          ) : rentals.length === 0 ? (
            <GlassCard className="bg-white border-gray-200 p-12 text-center">
              <p className="text-gray-600 mb-4">You don&apos;t have any active rentals.</p>
              <GradientButton onClick={() => router.push('/marketplace')}>
                Browse Marketplace
              </GradientButton>
            </GlassCard>
          ) : (
            <div className="grid gap-6">
              {rentals.map((rental) => {
                const asset = rental.asset;
                const endTime = new Date(rental.endTime).getTime();
                const now = Date.now();
                const diff = endTime - now;
                const hours = Math.floor(diff / 3600000);
                const minutes = Math.floor((diff % 3600000) / 60000);
                const seconds = Math.floor((diff % 60000) / 1000);
                const isExpired = diff <= 0;
                
                return (
                  <GlassCard key={rental.id} className="bg-white border-gray-200 p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Asset Image */}
                      <div className="relative w-full md:w-32 h-32 rounded-lg overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                        {asset?.imageUrl ? (
                          <img src={asset.imageUrl} alt={asset.name} className="w-full h-full object-cover" />
                        ) : (
                          asset?.name || 'Asset'
                        )}
                      </div>

                      {/* Asset Info */}
                      <div className="flex-1">
                        {asset && (
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold">{asset.name}</h3>
                            <RarityBadge rarity={asset.rarity as any} size="sm" />
                            <Badge variant="outline">{asset.assetType}</Badge>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div>
                            <p className="text-sm text-gray-500">Rental Cost</p>
                            <p className="font-bold">{(parseInt(rental.rentalPrice) / 1e9).toFixed(4)} SOL</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Duration</p>
                            <p className="font-bold">{Math.floor(rental.duration / 3600)} hours</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Start Time</p>
                            <p className="font-mono text-sm">{new Date(rental.startTime).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Time Remaining
                            </p>
                            <p className={`font-bold ${isExpired ? 'text-red-600' : 'text-orange-600'}`}>
                              {isExpired ? 'Expired' : `${hours}h ${minutes}m ${seconds}s`}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        {asset && (
                          <GradientButton 
                            variant="outline" 
                            className="w-full"
                            onClick={() => router.push(`/assets/${asset.id || rental.assetId}`)}
                          >
                            View Asset
                          </GradientButton>
                        )}
                        <GradientButton className="w-full">
                          Return Early
                        </GradientButton>
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

