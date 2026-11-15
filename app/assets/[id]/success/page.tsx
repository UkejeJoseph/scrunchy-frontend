'use client';

import { use } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { GlassCard } from '@/components/aceternity/glass-card';
import { GradientButton } from '@/components/aceternity/gradient-button';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Share2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AssetCreatedSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center"
            >
              <CheckCircle2 className="h-10 w-10 text-white" />
            </motion.div>

            <h1 className="text-4xl font-display font-bold mb-4">Asset Created Successfully!</h1>
            <p className="text-xl text-gray-600 mb-8">
              Your asset has been minted and is now on the blockchain.
            </p>

            <GlassCard className="bg-white border-gray-200 p-8 mb-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Asset ID</span>
                  <span className="font-mono text-sm">{id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Transaction Hash</span>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Explorer
                  </Button>
                </div>
              </div>
            </GlassCard>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GradientButton size="lg" asChild>
                <Link href={`/assets/${id}/list`}>
                  List for Rent
                </Link>
              </GradientButton>
              <GradientButton size="lg" variant="outline" asChild>
                <Link href={`/assets/${id}`}>
                  View Asset
                </Link>
              </GradientButton>
              <Button variant="outline" size="lg">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

