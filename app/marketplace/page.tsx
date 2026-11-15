'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Grid3x3, List } from 'lucide-react';
import { GlassCard } from '@/components/aceternity/glass-card';
import { RarityBadge } from '@/components/aceternity/rarity-badge';
import { GradientButton } from '@/components/aceternity/gradient-button';
import { AssetCard } from '@/components/marketplace/asset-card';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Filter, Loader2 } from 'lucide-react';
import { useAssets } from '@/hooks/useAssets';
import { toast } from 'sonner';

export default function MarketplacePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedRarities, setSelectedRarities] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);

  const assetTypes = ['WEAPON', 'ARMOR', 'CONSUMABLE', 'SKILL', 'VEHICLE', 'CHARACTER'];
  const rarities = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC'];

  // Map sortBy to API format
  const sortByMap: Record<string, 'price' | 'rarity' | 'created' | 'popular'> = {
    'newest': 'created',
    'price-low': 'price',
    'price-high': 'price',
    'rarity': 'rarity',
    'popularity': 'popular',
  };

  const orderMap: Record<string, 'asc' | 'desc'> = {
    'newest': 'desc',
    'price-low': 'asc',
    'price-high': 'desc',
    'rarity': 'desc',
    'popularity': 'desc',
  };

  // Build API params
  const apiParams = useMemo(() => ({
    search: searchQuery || undefined,
    type: selectedTypes.length === 1 ? selectedTypes[0] : undefined,
    rarity: selectedRarities.length === 1 ? selectedRarities[0] : undefined,
    sortBy: sortByMap[sortBy] || 'created',
    order: orderMap[sortBy] || 'desc',
    page,
    limit: 20,
  }), [searchQuery, selectedTypes, selectedRarities, sortBy, page]);

  const { data, isLoading, error } = useAssets(apiParams);

  const assets = data?.assets || [];
  const pagination = data?.pagination;

  // Transform API assets to match AssetCard format
  const transformedAssets = useMemo(() => {
    return assets.map((asset) => ({
      id: asset.id,
      name: asset.name,
      imageUrl: asset.imageUrl || '/placeholder-asset.jpg',
      rarity: asset.rarity as any,
      assetType: asset.assetType,
      floorPrice: 0, // Will be populated from listing if available
      rentalPricePerHour: 0, // Will be populated from listing if available
      isRentable: asset.isRentable,
      owner: {
        username: asset.owner.username || undefined,
        walletAddress: asset.owner.walletAddress,
      },
    }));
  }, [assets]);

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-sm mb-4">Price Range</h3>
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Min: {minPrice} SOL</span>
            <span>Max: {maxPrice} SOL</span>
          </div>
          <Slider
            value={[minPrice, maxPrice]}
            onValueChange={([min, max]) => {
              setMinPrice(min);
              setMaxPrice(max);
            }}
            min={0}
            max={100}
            step={0.1}
            className="w-full"
          />
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-sm mb-4">Asset Type</h3>
        <div className="space-y-2">
          {assetTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={type}
                checked={selectedTypes.includes(type)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedTypes([...selectedTypes, type]);
                  } else {
                    setSelectedTypes(selectedTypes.filter(t => t !== type));
                  }
                }}
              />
              <Label htmlFor={type} className="text-sm font-medium cursor-pointer">
                {type}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-sm mb-4">Rarity</h3>
        <div className="space-y-2">
          {rarities.map((rarity) => (
            <div key={rarity} className="flex items-center space-x-2">
              <Checkbox
                id={rarity}
                checked={selectedRarities.includes(rarity)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedRarities([...selectedRarities, rarity]);
                  } else {
                    setSelectedRarities(selectedRarities.filter(r => r !== rarity));
                  }
                }}
              />
              <Label htmlFor={rarity} className="cursor-pointer">
                <RarityBadge rarity={rarity as any} size="sm" />
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        onClick={() => {
          setMinPrice(0);
          setMaxPrice(100);
          setSelectedTypes([]);
          setSelectedRarities([]);
        }}
        className="w-full"
      >
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Top Bar */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 w-full md:max-w-md">
                <Input
                  placeholder="Search assets by name, type, or game..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="flex items-center gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rarity">Rarity: Highest</SelectItem>
                    <SelectItem value="popularity">Most Popular</SelectItem>
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

                {/* Mobile Filter Button */}
                <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                  <SheetTrigger asChild className="md:hidden">
                    <Button variant="outline" size="icon">
                      <Filter className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px]">
                    <h2 className="text-lg font-semibold mb-4">Filters</h2>
                    <FilterSidebar />
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Desktop Filter Sidebar */}
            <aside className="hidden md:block w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <FilterSidebar />
              </div>
            </aside>

            {/* Asset Grid/List */}
            <main className="flex-1">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                </div>
              ) : error ? (
                <GlassCard className="bg-white border-gray-200 p-8 text-center">
                  <p className="text-red-600">Error loading assets: {error instanceof Error ? error.message : 'Unknown error'}</p>
                </GlassCard>
              ) : transformedAssets.length === 0 ? (
                <GlassCard className="bg-white border-gray-200 p-8 text-center">
                  <p className="text-gray-600">No assets found. Try adjusting your filters.</p>
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
                          onRent={(id) => router.push(`/assets/${id}`)}
                          onFavorite={(id) => {
                            toast.info('Favorite feature coming soon');
                          }}
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
                          onRent={(id) => router.push(`/assets/${id}`)}
                          onFavorite={(id) => {
                            toast.info('Favorite feature coming soon');
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Pagination */}
                  {pagination && pagination.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-8">
                      <Button
                        variant="outline"
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-gray-600">
                        Page {pagination.page} of {pagination.totalPages}
                      </span>
                      <Button
                        variant="outline"
                        onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                        disabled={page >= pagination.totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

