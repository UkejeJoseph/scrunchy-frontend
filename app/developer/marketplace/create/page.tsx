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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Check } from 'lucide-react';

const steps = [
  { id: 1, label: 'Type & Category' },
  { id: 2, label: 'Upload Assets' },
  { id: 3, label: 'Pricing' },
  { id: 4, label: 'Documentation' },
];

export default function CreatePackagePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [packageType, setPackageType] = useState('');
  const [category, setCategory] = useState('');

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-display font-bold mb-8">Create Package</h1>

          {/* Progress */}
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
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold mb-4">Package Type & Category</h2>
                <div>
                  <Label>Package Type *</Label>
                  <Select value={packageType} onValueChange={setPackageType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select package type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visual_pack">Visual Pack</SelectItem>
                      <SelectItem value="attribute_template">Attribute Template</SelectItem>
                      <SelectItem value="integration_kit">Integration Kit</SelectItem>
                      <SelectItem value="theme_pack">Theme Pack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fantasy">Fantasy</SelectItem>
                      <SelectItem value="scifi">Sci-Fi</SelectItem>
                      <SelectItem value="rpg">RPG</SelectItem>
                      <SelectItem value="fps">FPS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold mb-4">Upload Assets</h2>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <p className="text-gray-600 mb-4">Upload your package files</p>
                  <Button variant="outline">Select Files</Button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold mb-4">Pricing</h2>
                <RadioGroup defaultValue="free">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="free" id="free" />
                      <Label htmlFor="free">Free</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paid" id="paid" />
                      <Label htmlFor="paid">Paid</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold mb-4">Documentation</h2>
                <div>
                  <Label>README</Label>
                  <Textarea placeholder="Package description and usage instructions..." rows={10} />
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
                    setCurrentStep(currentStep + 1);
                  } else {
                    // Handle submission
                  }
                }}
              >
                {currentStep === steps.length ? 'Submit for Review' : 'Next'}
              </GradientButton>
            </div>
          </GlassCard>
        </div>
      </div>

      <Footer />
    </div>
  );
}

