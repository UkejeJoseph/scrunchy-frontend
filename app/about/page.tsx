'use client';

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { GlassCard } from '@/components/aceternity/glass-card';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-display font-bold mb-8">About Scrunchy</h1>
          
          <GlassCard className="bg-white border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Scrunchy is revolutionizing the gaming industry by creating the world's first rental-first, 
              cross-game asset marketplace. Our mission is to make Web3 gaming integration as simple as 
              copying an SDK snippet.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We believe that game assets should be accessible, interoperable, and profitable for everyone 
              in the gaming ecosystem - from players to creators to developers.
            </p>
          </GlassCard>

          <GlassCard className="bg-white border-gray-200 p-8">
            <h2 className="text-2xl font-semibold mb-4">Built on Solana</h2>
            <p className="text-gray-600 leading-relaxed">
              Powered by Solana's high-speed blockchain, Scrunchy enables instant transactions and 
              real-time asset verification. This makes micro-rentals economically viable and provides 
              the performance needed for real-time gaming use cases.
            </p>
          </GlassCard>
        </div>
      </div>

      <Footer />
    </div>
  );
}

