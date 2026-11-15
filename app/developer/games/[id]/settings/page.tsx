'use client';

import { use } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { GlassCard } from '@/components/aceternity/glass-card';
import { GradientButton } from '@/components/aceternity/gradient-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useGame } from '@/hooks/useGames';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function GameSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { data: game, isLoading } = useGame(id);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    websiteUrl: '',
  });
  
  useEffect(() => {
    if (game) {
      setFormData({
        name: game.name,
        description: game.description,
        websiteUrl: game.websiteUrl || '',
      });
    }
  }, [game]);
  
  if (!isAuthenticated) {
    router.push('/');
    return null;
  }
  
  const handleSave = async () => {
    // Note: Update game endpoint would need to be added to API
    toast.info('Game update endpoint coming soon');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Link href="/developer/dashboard">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <h1 className="text-3xl font-display font-bold mb-8">Game Settings</h1>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          ) : !game ? (
            <GlassCard className="bg-white border-gray-200 p-12 text-center">
              <p className="text-gray-600">Game not found</p>
            </GlassCard>
          ) : (
            <>
              <GlassCard className="bg-white border-gray-200 p-8 mb-6">
                <h2 className="text-xl font-semibold mb-6">Game Information</h2>
                <div className="space-y-6">
                  <div>
                    <Label>Game Name</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label>Website URL</Label>
                    <Input
                      type="url"
                      value={formData.websiteUrl}
                      onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                    />
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="bg-white border-gray-200 p-8 mb-6">
                <h2 className="text-xl font-semibold mb-6">Webhooks</h2>
                <div className="space-y-4">
                  <div>
                    <Label>Webhook URL</Label>
                    <Input placeholder="https://your-game.com/webhook" />
                  </div>
                  <Button variant="outline">Test Webhook</Button>
                </div>
              </GlassCard>

              <div className="flex gap-4">
                <GradientButton className="flex-1" size="lg" onClick={handleSave}>
                  Save Changes
                </GradientButton>
                <Button variant="outline" size="lg" onClick={() => router.back()}>
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

