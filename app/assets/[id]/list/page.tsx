'use client';

import { use } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { GlassCard } from '@/components/aceternity/glass-card';
import { GradientButton } from '@/components/aceternity/gradient-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useCreateListing } from '@/hooks/useMarketplace';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, Transaction } from '@solana/web3.js';

export default function ListAssetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { publicKey, signTransaction } = useWallet();
  const createListing = useCreateListing();
  
  const [enableRental, setEnableRental] = useState(true);
  const [rentalPrice, setRentalPrice] = useState([0.1]);
  const [deposit, setDeposit] = useState([1.0]);
  const [enableSale, setEnableSale] = useState(false);
  const [salePrice, setSalePrice] = useState('');
  
  if (!isAuthenticated) {
    router.push('/');
    return null;
  }
  
  const handleListAsset = async () => {
    if (!enableRental) {
      toast.error('Please enable rental to list the asset');
      return;
    }
    
    if (!publicKey || !signTransaction) {
      toast.error('Please connect your wallet');
      return;
    }
    
    try {
      // Convert SOL to lamports
      const pricePerHourLamports = Math.floor(rentalPrice[0] * 1e9).toString();
      const pricePerDayLamports = Math.floor(rentalPrice[0] * 24 * 1e9).toString();
      
      const result = await createListing.mutateAsync({
        assetId: id,
        pricePerHour: pricePerHourLamports,
        pricePerDay: pricePerDayLamports,
        maxRentalDuration: 86400 * 7, // 7 days
        minRentalDuration: 3600, // 1 hour
        autoRenewal: false,
      });
      
      // Sign and send transaction
      if (result.transaction) {
        const connection = new Connection('https://api.devnet.solana.com');
        const txBuffer = Buffer.from(result.transaction, 'base64');
        const transaction = Transaction.from(txBuffer);
        
        const signedTx = await signTransaction(transaction);
        const signature = await connection.sendRawTransaction(signedTx.serialize());
        await connection.confirmTransaction(signature);
        
        toast.success('Asset listed successfully!');
        router.push(`/assets/${id}`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to list asset');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Link href={`/assets/${id}`}>
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Asset
            </Button>
          </Link>

          <h1 className="text-3xl font-display font-bold mb-8">List Asset</h1>

          <GlassCard className="bg-white border-gray-200 p-8 mb-6">
            <h2 className="text-xl font-semibold mb-6">Rental Configuration</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Rental</Label>
                  <p className="text-sm text-gray-500">Allow others to rent this asset</p>
                </div>
                <Switch checked={enableRental} onCheckedChange={setEnableRental} />
              </div>

              {enableRental && (
                <>
                  <div>
                    <Label>Price per Hour (SOL)</Label>
                    <div className="mt-2">
                      <Slider
                        value={rentalPrice}
                        onValueChange={setRentalPrice}
                        min={0.01}
                        max={10}
                        step={0.01}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>0.01 SOL</span>
                        <span className="font-bold text-gray-900">{rentalPrice[0]} SOL</span>
                        <span>10 SOL</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Deposit Amount (SOL)</Label>
                    <div className="mt-2">
                      <Slider
                        value={deposit}
                        onValueChange={setDeposit}
                        min={0.1}
                        max={50}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>0.1 SOL</span>
                        <span className="font-bold text-gray-900">{deposit[0]} SOL</span>
                        <span>50 SOL</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </GlassCard>

          <GlassCard className="bg-white border-gray-200 p-8 mb-6">
            <h2 className="text-xl font-semibold mb-6">Sale Configuration (Optional)</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Sale</Label>
                  <p className="text-sm text-gray-500">Allow others to buy this asset</p>
                </div>
                <Switch checked={enableSale} onCheckedChange={setEnableSale} />
              </div>

              {enableSale && (
                <div>
                  <Label>Sale Price (SOL)</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    className="mt-2"
                  />
                </div>
              )}
            </div>
          </GlassCard>

          <div className="flex gap-4">
            <GradientButton 
              className="flex-1" 
              size="lg"
              onClick={handleListAsset}
              disabled={createListing.isPending || !enableRental}
            >
              {createListing.isPending ? 'Listing...' : 'List Asset'}
            </GradientButton>
            <Button variant="outline" size="lg" asChild>
              <Link href={`/assets/${id}`}>Cancel</Link>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

