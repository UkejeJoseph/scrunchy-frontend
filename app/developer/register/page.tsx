'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { GlassCard } from '@/components/aceternity/glass-card';
import { GradientButton } from '@/components/aceternity/gradient-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from 'next/navigation';
import { useCreateGame } from '@/hooks/useGames';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const assetTypes = ['WEAPON', 'ARMOR', 'SKILL', 'POWERUP', 'CONSUMABLE', 'CHARACTER', 'VEHICLE', 'OTHER'];

export default function RegisterGamePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const createGame = useCreateGame();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    websiteUrl: '',
    logoUrl: '',
    supportedTypes: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    if (formData.supportedTypes.length === 0) {
      toast.error('Please select at least one supported asset type');
      return;
    }
    
    try {
      const result = await createGame.mutateAsync({
        name: formData.name,
        description: formData.description,
        websiteUrl: formData.websiteUrl || undefined,
        logoUrl: formData.logoUrl || undefined,
        supportedTypes: formData.supportedTypes,
      });
      
      // Store API key temporarily to show on success page
      if (result.apiKey) {
        sessionStorage.setItem('new_game_api_key', result.apiKey);
        sessionStorage.setItem('new_game_id', result.game.id);
      }
      
      router.push('/developer/register/success');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to register game');
    }
  };
  
  const toggleAssetType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      supportedTypes: prev.supportedTypes.includes(type)
        ? prev.supportedTypes.filter(t => t !== type)
        : [...prev.supportedTypes, type],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="text-3xl font-display font-bold mb-8">Register Your Game</h1>

          <GlassCard className="bg-white border-gray-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Game Name *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your game name"
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your game"
                  rows={4}
                />
              </div>

              <div>
                <Label>Supported Asset Types *</Label>
                <p className="text-sm text-gray-500 mb-3">Select which asset types your game supports</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {assetTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type}
                        checked={formData.supportedTypes.includes(type)}
                        onCheckedChange={() => toggleAssetType(type)}
                      />
                      <Label htmlFor={type} className="text-sm font-medium cursor-pointer capitalize">
                        {type.toLowerCase()}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="website">Website URL</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  placeholder="https://yourgame.com"
                />
              </div>

              <div>
                <Label>Game Logo</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mt-2">
                  <p className="text-gray-600 mb-4">Upload your game logo</p>
                  <Button variant="outline" type="button">Select File</Button>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <GradientButton 
                  type="submit" 
                  className="flex-1" 
                  size="lg"
                  disabled={createGame.isPending}
                >
                  {createGame.isPending ? 'Registering...' : 'Register Game'}
                </GradientButton>
                <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>
                  Cancel
                </Button>
              </div>
            </form>
          </GlassCard>
        </div>
      </div>

      <Footer />
    </div>
  );
}

