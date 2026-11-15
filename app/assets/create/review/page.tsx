'use client';

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { GlassCard } from '@/components/aceternity/glass-card';
import { GradientButton } from '@/components/aceternity/gradient-button';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RarityBadge } from '@/components/aceternity/rarity-badge';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCreateAsset } from '@/hooks/useAssets';
import { useAuth } from '@/hooks/useAuth';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

export default function ReviewAssetPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { publicKey, signTransaction } = useWallet();
  const createAsset = useCreateAsset();
  
  // Get form data from sessionStorage or URL params
  const [assetData, setAssetData] = useState<any>(null);
  
  useEffect(() => {
    const stored = sessionStorage.getItem('asset_form_data');
    if (stored) {
      setAssetData(JSON.parse(stored));
    }
  }, []);
  
  if (!isAuthenticated) {
    router.push('/');
    return null;
  }
  
  if (!assetData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 pb-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <GlassCard className="bg-white border-gray-200 p-12 text-center">
              <p className="text-gray-600 mb-4">No asset data found. Please start from the beginning.</p>
              <Button onClick={() => router.push('/assets/create')}>Go to Create Asset</Button>
            </GlassCard>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  const handleMint = async () => {
    if (!publicKey || !signTransaction) {
      toast.error('Please connect your wallet');
      return;
    }
    
    try {
      const result = await createAsset.mutateAsync({
        name: assetData.name,
        description: assetData.description,
        imageUrl: assetData.imageUrl,
        assetType: assetData.assetType,
        rarity: assetData.rarity,
        baseAttributes: assetData.baseAttributes,
        rentalConfig: assetData.rentalConfig,
      });
      
      // Sign and send transaction
      if (result.transaction) {
        const { Connection, Transaction } = await import('@solana/web3.js');
        const connection = new Connection('https://api.devnet.solana.com');
        const txBuffer = Buffer.from(result.transaction, 'base64');
        const transaction = Transaction.from(txBuffer);
        
        const signedTx = await signTransaction(transaction);
        const signature = await connection.sendRawTransaction(signedTx.serialize());
        await connection.confirmTransaction(signature);
        
        toast.success('Asset created successfully!');
        router.push(`/assets/${result.asset.id}/success`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create asset');
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href="/assets/create">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Edit
            </Button>
          </Link>

          <h1 className="text-3xl font-display font-bold mb-8">Review & Mint Asset</h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Preview */}
            <div>
              <GlassCard className="bg-white border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Preview</h2>
                <div className="aspect-square relative rounded-lg overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold mb-4">
                  {assetData.imageUrl ? (
                    <img src={assetData.imageUrl} alt={assetData.name} className="w-full h-full object-cover" />
                  ) : (
                    assetData.name
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-2xl font-bold">{assetData.name}</h3>
                  <RarityBadge rarity={assetData.rarity as any} size="sm" />
                </div>
                <p className="text-gray-600 mb-4">{assetData.description || 'No description'}</p>
                <Badge variant="outline">{assetData.assetType}</Badge>
              </GlassCard>
            </div>

            {/* Details */}
            <div className="space-y-6">
              <GlassCard className="bg-white border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4">Asset Details</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name</span>
                    <span className="font-medium">{assetData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type</span>
                    <span className="font-medium">{assetData.assetType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rarity</span>
                    <RarityBadge rarity={assetData.rarity as any} size="sm" />
                  </div>
                </div>
              </GlassCard>

              {assetData.baseAttributes && Object.keys(assetData.baseAttributes).length > 0 && (
                <GlassCard className="bg-white border-gray-200 p-6">
                  <h2 className="text-xl font-semibold mb-4">Attributes</h2>
                  <div className="space-y-2">
                    {Object.entries(assetData.baseAttributes).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-600 capitalize">{key}</span>
                        <span className="font-medium">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}

              {assetData.rentalConfig && assetData.rentalConfig.pricePerHour && (
                <GlassCard className="bg-white border-gray-200 p-6">
                  <h2 className="text-xl font-semibold mb-4">Rental Configuration</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price per Hour</span>
                      <span className="font-medium">{assetData.rentalConfig.pricePerHour} SOL</span>
                    </div>
                    {assetData.rentalConfig.pricePerDay && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price per Day</span>
                        <span className="font-medium">{assetData.rentalConfig.pricePerDay} SOL</span>
                      </div>
                    )}
                  </div>
                </GlassCard>
              )}

              <GlassCard className="bg-white border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4">Cost Breakdown</h2>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Minting Fee</span>
                    <span className="font-medium">~0.01 SOL</span>
                  </div>
                  <div className="h-px bg-gray-200" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>~0.01 SOL</span>
                  </div>
                </div>
                <GradientButton 
                  className="w-full" 
                  size="lg"
                  onClick={handleMint}
                  disabled={createAsset.isPending}
                >
                  {createAsset.isPending ? 'Minting...' : 'Mint Asset'}
                </GradientButton>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

