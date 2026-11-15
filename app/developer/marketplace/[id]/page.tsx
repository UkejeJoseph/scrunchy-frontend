'use client';

import { use } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { GlassCard } from '@/components/aceternity/glass-card';
import { GradientButton } from '@/components/aceternity/gradient-button';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Download, ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PackageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  // Mock data
  const packageData = {
    id,
    name: 'Medieval Weapons Pack',
    description: 'Complete collection of medieval weapons including swords, axes, bows, and shields. Includes 2D icons, 3D models, attack animations, and pre-configured stats for RPG games.',
    thumbnailUrl: '/placeholder-package.jpg',
    rating: 4.8,
    reviewCount: 89,
    downloads: 1247,
    price: { model: 'one_time', amount: 49.99, currency: 'USD' },
    category: 'fantasy',
    type: 'visual_pack',
    version: '2.1.0',
    creator: 'Fantasy Game Studios',
    compatibility: {
      gameEngines: ['Unity', 'Unreal', 'Godot'],
      sdkVersions: ['1.0.0', '1.1.0', '1.2.0'],
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <Link href="/developer/marketplace">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Marketplace
            </Button>
          </Link>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Image */}
            <div>
              <div className="aspect-video relative rounded-lg overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold text-xl mb-4">
                {packageData.name}
              </div>
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge>{packageData.category}</Badge>
                  <Badge variant="outline">{packageData.type}</Badge>
                </div>
                <h1 className="text-4xl font-display font-bold mb-4">{packageData.name}</h1>
                <p className="text-gray-600 mb-4">{packageData.description}</p>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{packageData.rating}</span>
                    <span className="text-gray-500">({packageData.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Download className="h-5 w-5" />
                    <span>{packageData.downloads.toLocaleString()} downloads</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {packageData.price.model === 'free' ? (
                    <GradientButton size="lg" className="flex-1">
                      Install Free
                    </GradientButton>
                  ) : (
                    <>
                      <div className="flex-1">
                        <p className="text-3xl font-bold">${packageData.price.amount}</p>
                        <p className="text-sm text-gray-500">One-time purchase</p>
                      </div>
                      <GradientButton size="lg">Purchase & Install</GradientButton>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Details Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="contents">Contents</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <GlassCard className="bg-white border-gray-200 p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Version</h3>
                    <p>{packageData.version}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Creator</h3>
                    <p>{packageData.creator}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Compatible Engines</h3>
                    <div className="flex flex-wrap gap-2">
                      {packageData.compatibility.gameEngines.map((engine) => (
                        <Badge key={engine} variant="outline">{engine}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </TabsContent>

            <TabsContent value="contents">
              <GlassCard className="bg-white border-gray-200 p-6">
                <p className="text-gray-600">Package contents will be listed here</p>
              </GlassCard>
            </TabsContent>

            <TabsContent value="reviews">
              <GlassCard className="bg-white border-gray-200 p-6">
                <p className="text-gray-600">Reviews will appear here</p>
              </GlassCard>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
}

