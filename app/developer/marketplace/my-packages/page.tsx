'use client';

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { GlassCard } from '@/components/aceternity/glass-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Download, TrendingUp, Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Mock data
const mockPackages = [
  {
    id: '1',
    name: 'Medieval Weapons Pack',
    status: 'approved',
    downloads: 1247,
    rating: 4.8,
    revenue: 4500,
    lastUpdated: '2024-01-20',
  },
];

export default function MyPackagesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-display font-bold mb-8">My Packages</h1>

          <div className="grid gap-6">
            {mockPackages.map((pkg) => (
              <GlassCard key={pkg.id} className="bg-white border-gray-200 p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-32 h-32 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                    {pkg.name}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">{pkg.name}</h3>
                      <Badge variant={pkg.status === 'approved' ? 'default' : 'secondary'}>
                        {pkg.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-gray-500">Downloads</p>
                        <p className="font-bold flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          {pkg.downloads.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Rating</p>
                        <p className="font-bold flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {pkg.rating}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Revenue</p>
                        <p className="font-bold flex items-center gap-1">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          ${pkg.revenue.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Last Updated</p>
                        <p className="font-bold">{pkg.lastUpdated}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" onClick={() => router.push(`/developer/marketplace/${pkg.id}/analytics`)}>
                      Analytics
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Empty State */}
          {mockPackages.length === 0 && (
            <GlassCard className="bg-white border-gray-200 p-12 text-center">
              <p className="text-gray-600 mb-4">You haven't created any packages yet.</p>
              <Button onClick={() => router.push('/developer/marketplace/create')}>
                Create Your First Package
              </Button>
            </GlassCard>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

