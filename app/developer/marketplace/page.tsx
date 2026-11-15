'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { GlassCard } from '@/components/aceternity/glass-card';
import { GradientButton } from '@/components/aceternity/gradient-button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Star, Download, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Mock data
const mockPackages = [
  {
    id: '1',
    name: 'Medieval Weapons Pack',
    description: '50+ high-quality medieval weapon assets',
    thumbnailUrl: '/placeholder-package.jpg',
    rating: 4.8,
    reviewCount: 89,
    downloads: 1247,
    price: { model: 'one_time', amount: 49.99, currency: 'USD' },
    category: 'fantasy',
    type: 'visual_pack',
  },
];

export default function DeveloperMarketplacePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold">Developer Marketplace</h1>
              <p className="text-gray-600 mt-2">Browse and install integration packages</p>
            </div>
            <GradientButton onClick={() => router.push('/developer/marketplace/create')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Package
            </GradientButton>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 w-full md:max-w-md">
                <Input
                  placeholder="Search packages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="fantasy">Fantasy</SelectItem>
                  <SelectItem value="scifi">Sci-Fi</SelectItem>
                  <SelectItem value="rpg">RPG</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Packages Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockPackages.map((pkg) => (
              <GlassCard key={pkg.id} hover className="bg-white border-gray-200 overflow-hidden">
                <div className="aspect-video relative bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                  {pkg.name}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold flex-1">{pkg.name}</h3>
                    <Badge variant="outline">{pkg.category}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{pkg.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{pkg.rating}</span>
                      <span className="text-sm text-gray-500">({pkg.reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Download className="h-4 w-4" />
                      <span>{pkg.downloads.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      {pkg.price.model === 'free' ? (
                        <span className="text-lg font-bold text-green-600">Free</span>
                      ) : (
                        <span className="text-lg font-bold">${pkg.price.amount}</span>
                      )}
                    </div>
                    <GradientButton size="sm">View Details</GradientButton>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

