'use client';

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { GlassCard } from '@/components/aceternity/glass-card';
import { AssetCard } from '@/components/marketplace/asset-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Share2, Mail, Loader2 } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUser';
import { useAssets } from '@/hooks/useAssets';
import { useAuth } from '@/hooks/useAuth';
import { useMemo } from 'react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const { data: user, isLoading: userLoading } = useUserProfile();
  const { data: assetsData, isLoading: assetsLoading } = useAssets({});
  
  // Filter assets by user's wallet address
  const userAssets = useMemo(() => {
    if (!assetsData?.assets || !user) return [];
    return assetsData.assets.filter(asset => asset.owner.walletAddress === user.walletAddress);
  }, [assetsData, user]);
  
  const transformedAssets = useMemo(() => {
    return userAssets.map((asset) => ({
      id: asset.id,
      name: asset.name,
      imageUrl: asset.imageUrl || '/placeholder-asset.jpg',
      rarity: asset.rarity as any,
      assetType: asset.assetType,
      floorPrice: 0,
      rentalPricePerHour: 0,
      isRentable: asset.isRentable,
      owner: {
        username: asset.owner.username || undefined,
        walletAddress: asset.owner.walletAddress,
      },
    }));
  }, [userAssets]);
  
  const displayUser = user || authUser;
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {userLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          ) : !displayUser ? (
            <GlassCard className="bg-white border-gray-200 p-12 text-center">
              <p className="text-gray-600">User not found</p>
            </GlassCard>
          ) : (
            <>
              {/* Profile Header */}
              <GlassCard className="bg-white border-gray-200 p-8 mb-8">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold">
                    {(displayUser.username || displayUser.walletAddress)[0].toUpperCase()}
                  </div>
                  <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                      <h1 className="text-3xl font-display font-bold">{displayUser.username || 'User'}</h1>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            if (typeof window !== 'undefined' && navigator?.clipboard) {
                              navigator.clipboard.writeText(window.location.href);
                              toast.success('Profile link copied!');
                            } else {
                              toast.error('Clipboard not available');
                            }
                          }}
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{displayUser.bio || 'No bio available'}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">Wallet:</span>
                      <span className="font-mono">{displayUser.walletAddress}</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{user?.stats?.totalAssets || userAssets.length}</p>
                    <p className="text-sm text-gray-500">Assets Created</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{user?.stats?.totalRentals || 0}</p>
                    <p className="text-sm text-gray-500">Total Rentals</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{user?.stats?.totalListings || 0}</p>
                    <p className="text-sm text-gray-500">Listings</p>
                  </div>
                </div>
              </GlassCard>

          {/* Tabs */}
          <Tabs defaultValue="assets" className="space-y-6">
            <TabsList>
              <TabsTrigger value="assets">Assets</TabsTrigger>
              <TabsTrigger value="rentals">Rentals</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

              <TabsContent value="assets">
                {assetsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                  </div>
                ) : transformedAssets.length === 0 ? (
                  <GlassCard className="bg-white border-gray-200 p-8 text-center">
                    <p className="text-gray-600">No assets found</p>
                  </GlassCard>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {transformedAssets.map((asset) => (
                      <AssetCard
                        key={asset.id}
                        asset={asset}
                        variant="grid"
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="rentals">
                <GlassCard className="bg-white border-gray-200 p-8 text-center">
                  <p className="text-gray-600">Rental history will appear here</p>
                </GlassCard>
              </TabsContent>

              <TabsContent value="reviews">
                <GlassCard className="bg-white border-gray-200 p-8 text-center">
                  <p className="text-gray-600">Reviews will appear here</p>
                </GlassCard>
              </TabsContent>
            </Tabs>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

