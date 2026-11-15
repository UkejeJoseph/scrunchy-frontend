'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { GlassCard } from '@/components/aceternity/glass-card';
import { GradientButton } from '@/components/aceternity/gradient-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Copy, Eye, EyeOff, Trash2, Plus, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useGames, useGameApiKeys, useCreateApiKey, useRevokeApiKey } from '@/hooks/useGames';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useMemo, useEffect } from 'react';

export default function APIKeysPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { data: games = [] } = useGames();
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedGameId, setSelectedGameId] = useState('');
  
  // Get gameId from URL on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const gameId = params.get('gameId');
      if (gameId) {
        setSelectedGameId(gameId);
      }
    }
  }, []);
  
  // Filter user's games
  const userGames = useMemo(() => {
    if (!user) return [];
    return games.filter(game => game.developer.walletAddress === user.walletAddress);
  }, [games, user]);
  
  // Get API keys for selected game
  const { data: apiKeysData, isLoading: keysLoading } = useGameApiKeys(selectedGameId);
  const apiKeys = apiKeysData?.keys || [];
  
  const createApiKey = useCreateApiKey();
  const revokeApiKey = useRevokeApiKey();
  
  if (!isAuthenticated) {
    router.push('/');
    return null;
  }
  
  // Auto-select first game if none selected
  useEffect(() => {
    if (!selectedGameId && userGames.length > 0) {
      setSelectedGameId(userGames[0].id);
    }
  }, [selectedGameId, userGames]);

  const toggleKeyVisibility = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('API key copied to clipboard!');
  };

  const maskKey = (key: string) => {
    return key.slice(0, 12) + '...' + key.slice(-8);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold">API Keys</h1>
              <p className="text-gray-600 mt-2">Manage API keys for your games</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <GradientButton>
                  <Plus className="h-4 w-4 mr-2" />
                  Generate New Key
                </GradientButton>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Generate New API Key</DialogTitle>
                  <DialogDescription>
                    Create a new API key for one of your games
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label>Key Name</Label>
                    <Input
                      placeholder="e.g., Production Key"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Game</Label>
                    <Select value={selectedGameId} onValueChange={setSelectedGameId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a game" />
                      </SelectTrigger>
                      <SelectContent>
                        {userGames.map((game) => (
                          <SelectItem key={game.id} value={game.id}>
                            {game.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <GradientButton 
                    className="w-full"
                    onClick={async () => {
                      if (!selectedGameId || !newKeyName) {
                        toast.error('Please select a game and enter a key name');
                        return;
                      }
                      try {
                        const result = await createApiKey.mutateAsync({
                          gameId: selectedGameId,
                          data: { name: newKeyName },
                        });
                        toast.success('API key created! Make sure to copy it - you won\'t see it again.');
                        // Show the key in a dialog or copy to clipboard
                        if (result.apiKey) {
                          navigator.clipboard.writeText(result.apiKey);
                          toast.success('API key copied to clipboard!');
                        }
                        setNewKeyName('');
                      } catch (error) {
                        toast.error(error instanceof Error ? error.message : 'Failed to create API key');
                      }
                    }}
                    disabled={createApiKey.isPending}
                  >
                    {createApiKey.isPending ? 'Creating...' : 'Generate Key'}
                  </GradientButton>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {!selectedGameId ? (
            <GlassCard className="bg-white border-gray-200 p-12 text-center">
              <p className="text-gray-600 mb-4">Please select a game to view API keys</p>
            </GlassCard>
          ) : keysLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          ) : apiKeys.length === 0 ? (
            <GlassCard className="bg-white border-gray-200 p-12 text-center">
              <p className="text-gray-600 mb-4">You don&apos;t have any API keys for this game yet.</p>
              <GradientButton onClick={() => {
                // Open dialog
              }}>Generate Your First API Key</GradientButton>
            </GlassCard>
          ) : (
            <div className="space-y-4">
              {apiKeys.map((apiKey) => {
                const maskedKey = `${apiKey.prefix}...`;
                return (
                  <GlassCard key={apiKey.id} className="bg-white border-gray-200 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{apiKey.prefix}</h3>
                          <Badge variant={apiKey.environment === 'production' ? 'default' : 'outline'}>
                            {apiKey.environment}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Created: {new Date(apiKey.createdAt).toLocaleDateString()}</span>
                          {apiKey.lastUsedAt && (
                            <span>Last used: {new Date(apiKey.lastUsedAt).toLocaleDateString()}</span>
                          )}
                          <span>Rate limit: {apiKey.rateLimitPerMinute}/min</span>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={async () => {
                          if (confirm('Are you sure you want to revoke this API key?')) {
                            try {
                              await revokeApiKey.mutateAsync({
                                gameId: selectedGameId,
                                keyId: apiKey.id,
                              });
                              toast.success('API key revoked');
                            } catch (error) {
                              toast.error(error instanceof Error ? error.message : 'Failed to revoke key');
                            }
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
                      <code className="flex-1 font-mono text-sm">
                        {showKeys[apiKey.id] ? maskedKey : maskedKey}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(maskedKey)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
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

