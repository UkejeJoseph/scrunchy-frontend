'use client';

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { GlassCard } from '@/components/aceternity/glass-card';
import { GradientButton } from '@/components/aceternity/gradient-button';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Package, TrendingUp, Settings, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGames } from '@/hooks/useGames';
import { useAuth } from '@/hooks/useAuth';
import { useMemo } from 'react';

export default function DeveloperDashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { data: games = [], isLoading } = useGames();
  
  // Filter games by current user (would need proper filtering in API)
  const userGames = useMemo(() => {
    if (!user) return [];
    return games.filter(game => game.developer.walletAddress === user.walletAddress);
  }, [games, user]);
  
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
            <h1 className="text-3xl font-display font-bold">Developer Dashboard</h1>
            <GradientButton onClick={() => router.push('/developer/register')}>
              <Plus className="h-4 w-4 mr-2" />
              Register New Game
            </GradientButton>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <GlassCard className="bg-white border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Registered Games</h3>
                <Package className="h-5 w-5 text-gray-400" />
              </div>
              <div className="text-3xl font-bold">{userGames.length}</div>
            </GlassCard>
            <GlassCard className="bg-white border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Total Players</h3>
                <Users className="h-5 w-5 text-gray-400" />
              </div>
              <div className="text-3xl font-bold">-</div>
            </GlassCard>
            <GlassCard className="bg-white border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Assets Used</h3>
                <Package className="h-5 w-5 text-gray-400" />
              </div>
              <div className="text-3xl font-bold">-</div>
            </GlassCard>
            <GlassCard className="bg-white border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Revenue</h3>
                <TrendingUp className="h-5 w-5 text-gray-400" />
              </div>
              <div className="text-3xl font-bold">-</div>
            </GlassCard>
          </div>

          {/* Games Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          ) : userGames.length === 0 ? (
            <GlassCard className="bg-white border-gray-200 p-12 text-center">
              <p className="text-gray-600 mb-4">You haven&apos;t registered any games yet.</p>
              <GradientButton onClick={() => router.push('/developer/register')}>
                Register Your First Game
              </GradientButton>
            </GlassCard>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userGames.map((game) => (
                <GlassCard key={game.id} hover className="bg-white border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                        {game.name[0]}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{game.name}</h3>
                        <Badge variant={game.isActive ? 'default' : 'secondary'} className="mt-1">
                          {game.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                    <Link href={`/developer/games/${game.id}/settings`}>
                      <Settings className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    </Link>
                  </div>
                  
                  <div className="space-y-2 text-sm mb-4">
                    <p className="text-gray-600 line-clamp-2">{game.description}</p>
                  </div>

                  <div className="flex gap-2 mt-6">
                    <GradientButton variant="outline" className="flex-1" size="sm" asChild>
                      <Link href="/developer/analytics">Analytics</Link>
                    </GradientButton>
                    <GradientButton className="flex-1" size="sm" asChild>
                      <Link href={`/developer/api-keys?gameId=${game.id}`}>API Keys</Link>
                    </GradientButton>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

