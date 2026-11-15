'use client';

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { GlassCard } from '@/components/aceternity/glass-card';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-display font-bold mb-8">Privacy Policy</h1>
          
          <GlassCard className="bg-white border-gray-200 p-8">
            <div className="prose max-w-none">
              <p className="text-gray-600">
                Last updated: {new Date().toLocaleDateString()}
              </p>
              <p className="text-gray-600 mt-4">
                Your privacy is important to us. This privacy policy explains how we collect, 
                use, and protect your information.
              </p>
            </div>
          </GlassCard>
        </div>
      </div>

      <Footer />
    </div>
  );
}

