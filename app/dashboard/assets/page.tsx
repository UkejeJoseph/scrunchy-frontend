'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { GlassCard } from '@/components/aceternity/glass-card';
import { AssetCard } from '@/components/marketplace/asset-card';
import { GradientButton } from '@/components/aceternity/gradient-button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Grid3x3, List, Plus, Search, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAssets } from '@/hooks/useAssets';
import { useAuth } from '@/hooks/useAuth';
import { useMemo } from 'react';
import { toast } from 'sonner';

export default function MyAssetsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  // Filter to get user's assets - in real implementation, use a dedicated endpoint
  const { data, isLoading } = useAssets({ search: searchQuery });

  const userAssets = useMemo(() => {
    if (!data?.assets) return [];
    let filtered = data.assets;
    
    // Filter by status (would need owner check in real API)
    if (statusFilter === 'listed') {
      filtered = filtered.filter(a => a.isListed);
    } else if (statusFilter === 'unlisted') {
      filtered = filtered.filter(a => !a.isListed);
    } else if (statusFilter === 'rented') {
      filtered = filtered.filter(a => a.currentlyRented);
    }
    
    return filtered;
  }, [data, statusFilter]);

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

  if (!isAuthenticated) {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-display font-bold">My Assets</h1>
            <GradientButton onClick={() => router.push('/assets/create')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Asset
            </GradientButton>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 w-full md:max-w-md relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search your assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex items-center gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Assets</SelectItem>
                    <SelectItem value="listed">Listed</SelectItem>
                    <SelectItem value="unlisted">Unlisted</SelectItem>
                    <SelectItem value="rented">Currently Rented</SelectItem>
                  </SelectContent>
                </Select>
                
                <ToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v as 'grid' | 'list')}>
                  <ToggleGroupItem value="grid" aria-label="Grid view">
                    <Grid3x3 className="h-5 w-5" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="list" aria-label="List view">
                    <List className="h-5 w-5" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </div>

          {/* Assets Grid/List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          ) : transformedAssets.length === 0 ? (
            <GlassCard className="bg-white border-gray-200 p-12 text-center">
              <p className="text-gray-600 mb-4">You haven&apos;t created any assets yet.</p>
              <GradientButton onClick={() => router.push('/assets/create')}>
                Create Your First Asset
              </GradientButton>
            </GlassCard>
          ) : (
            <>
              {view === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {transformedAssets.map((asset) => (
                    <AssetCard
                      key={asset.id}
                      asset={asset}
                      variant="grid"
                      onView={(id) => router.push(`/assets/${id}`)}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {transformedAssets.map((asset) => (
                    <AssetCard
                      key={asset.id}
                      asset={asset}
                      variant="list"
                      onView={(id) => router.push(`/assets/${id}`)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

