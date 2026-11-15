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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Check } from 'lucide-react';
import { useCreateAsset } from '@/hooks/useAssets';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useWallet } from '@solana/wallet-adapter-react';

const steps = [
  { id: 1, label: 'Upload Image' },
  { id: 2, label: 'Basic Info' },
  { id: 3, label: 'Attributes' },
  { id: 4, label: 'Rental Config' },
  { id: 5, label: 'Game Mappings' },
  { id: 6, label: 'Review' },
];

export default function CreateAssetPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { publicKey, signTransaction } = useWallet();
  const createAsset = useCreateAsset();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    imageUrl: '',
    name: '',
    description: '',
    assetType: '',
    rarity: '',
    baseAttributes: {} as Record<string, any>,
    rentalConfig: {
      pricePerHour: '',
      pricePerDay: '',
      maxRentalDuration: 86400 * 7,
      minRentalDuration: 3600,
    },
  });

  const progress = (currentStep / steps.length) * 100;
  
  if (!isAuthenticated) {
    router.push('/');
    return null;
  }
  
  const handleFinalSubmit = async () => {
    if (!formData.name || !formData.imageUrl || !formData.assetType || !formData.rarity) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (!publicKey || !signTransaction) {
      toast.error('Please connect your wallet');
      return;
    }
    
    try {
      const result = await createAsset.mutateAsync({
        name: formData.name,
        description: formData.description || undefined,
        imageUrl: formData.imageUrl,
        assetType: formData.assetType,
        rarity: formData.rarity,
        baseAttributes: Object.keys(formData.baseAttributes).length > 0 ? formData.baseAttributes : undefined,
        rentalConfig: formData.rentalConfig.pricePerHour ? {
          pricePerHour: Math.floor(parseFloat(formData.rentalConfig.pricePerHour) * 1e9).toString(),
          pricePerDay: formData.rentalConfig.pricePerDay ? Math.floor(parseFloat(formData.rentalConfig.pricePerDay) * 1e9).toString() : undefined,
          maxRentalDuration: formData.rentalConfig.maxRentalDuration,
          minRentalDuration: formData.rentalConfig.minRentalDuration,
        } : undefined,
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
          <h1 className="text-3xl font-display font-bold mb-8">Create Asset</h1>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        step.id <= currentStep
                          ? 'bg-purple-600 border-purple-600 text-white'
                          : 'bg-white border-gray-300 text-gray-400'
                      }`}
                    >
                      {step.id < currentStep ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <span className={`text-xs mt-2 ${step.id <= currentStep ? 'text-purple-600' : 'text-gray-400'}`}>
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        step.id < currentStep ? 'bg-purple-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Content */}
          <GlassCard className="bg-white border-gray-200 p-8">
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold mb-4">Upload Image</h2>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <p className="text-gray-600 mb-4">Enter image URL or upload file</p>
                  <Input
                    placeholder="https://example.com/image.png"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="mb-4"
                  />
                  <Button variant="outline">Or Select File</Button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold mb-4">Basic Information</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Asset Name *</Label>
                    <Input 
                      id="name" 
                      placeholder="Enter asset name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Enter description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Asset Type *</Label>
                      <Select 
                        value={formData.assetType}
                        onValueChange={(value) => setFormData({ ...formData, assetType: value })}
                      >
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="WEAPON">Weapon</SelectItem>
                          <SelectItem value="ARMOR">Armor</SelectItem>
                          <SelectItem value="CONSUMABLE">Consumable</SelectItem>
                          <SelectItem value="SKILL">Skill</SelectItem>
                          <SelectItem value="CHARACTER">Character</SelectItem>
                          <SelectItem value="VEHICLE">Vehicle</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="rarity">Rarity *</Label>
                      <Select 
                        value={formData.rarity}
                        onValueChange={(value) => setFormData({ ...formData, rarity: value })}
                      >
                        <SelectTrigger id="rarity">
                          <SelectValue placeholder="Select rarity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="COMMON">Common</SelectItem>
                          <SelectItem value="UNCOMMON">Uncommon</SelectItem>
                          <SelectItem value="RARE">Rare</SelectItem>
                          <SelectItem value="EPIC">Epic</SelectItem>
                          <SelectItem value="LEGENDARY">Legendary</SelectItem>
                          <SelectItem value="MYTHIC">Mythic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold mb-4">Attributes</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Attribute Name</Label>
                      <Input placeholder="e.g., Power" />
                    </div>
                    <div>
                      <Label>Value</Label>
                      <Input type="number" placeholder="e.g., 95" />
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Add Attribute</Button>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold mb-4">Rental Configuration</h2>
                <div className="space-y-4">
                  <div>
                    <Label>Price per Hour (SOL)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.1"
                      value={formData.rentalConfig.pricePerHour}
                      onChange={(e) => setFormData({
                        ...formData,
                        rentalConfig: { ...formData.rentalConfig, pricePerHour: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label>Price per Day (SOL)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="2.4"
                      value={formData.rentalConfig.pricePerDay}
                      onChange={(e) => setFormData({
                        ...formData,
                        rentalConfig: { ...formData.rentalConfig, pricePerDay: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 6 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold mb-4">Review</h2>
                <div className="space-y-2">
                  <p><strong>Name:</strong> {formData.name}</p>
                  <p><strong>Type:</strong> {formData.assetType}</p>
                  <p><strong>Rarity:</strong> {formData.rarity}</p>
                  {formData.rentalConfig.pricePerHour && (
                    <p><strong>Rental Price:</strong> {formData.rentalConfig.pricePerHour} SOL/hour</p>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                Back
              </Button>
              <GradientButton
                onClick={() => {
                  if (currentStep < steps.length) {
                    // Save form data to sessionStorage before moving to review
                    if (currentStep === steps.length - 1) {
                      sessionStorage.setItem('asset_form_data', JSON.stringify(formData));
                      router.push('/assets/create/review');
                    } else {
                      setCurrentStep(currentStep + 1);
                    }
                  } else {
                    handleFinalSubmit();
                  }
                }}
                disabled={createAsset.isPending}
              >
                {createAsset.isPending 
                  ? 'Creating...' 
                  : currentStep === steps.length - 1
                    ? 'Review & Mint' 
                    : currentStep === steps.length
                      ? 'Create Asset'
                      : 'Next'}
              </GradientButton>
            </div>
          </GlassCard>
        </div>
      </div>

      <Footer />
    </div>
  );
}

