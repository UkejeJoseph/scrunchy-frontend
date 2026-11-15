'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { GlassCard } from '@/components/aceternity/glass-card';
import { GradientButton } from '@/components/aceternity/gradient-button';
import { CheckCircle2, Key, Download, Book, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function GameRegistrationSuccessPage() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  
  useEffect(() => {
    const storedKey = sessionStorage.getItem('new_game_api_key');
    const storedGameId = sessionStorage.getItem('new_game_id');
    if (storedKey) {
      setApiKey(storedKey);
      sessionStorage.removeItem('new_game_api_key');
    }
    if (storedGameId) {
      setGameId(storedGameId);
      sessionStorage.removeItem('new_game_id');
    }
  }, []);
  
  const copyApiKey = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      toast.success('API key copied to clipboard!');
    }
  };
  
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

            <h1 className="text-4xl font-display font-bold mb-4">Game Registered Successfully!</h1>
            <p className="text-xl text-gray-600 mb-8">
              Your game has been registered. Get started by using your API key and downloading the SDK.
            </p>

            <GlassCard className="bg-white border-gray-200 p-8 mb-6">
              <div className="space-y-4">
                {gameId && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Game ID</span>
                    <span className="font-mono text-sm">{gameId}</span>
                  </div>
                )}
                {apiKey && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">API Key</span>
                      <Button variant="ghost" size="sm" onClick={copyApiKey}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg font-mono text-sm break-all">
                      {apiKey}
                    </div>
                    <p className="text-xs text-red-600 mt-2">⚠️ Save this key - you won&apos;t see it again!</p>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                    Active
                  </span>
                </div>
              </div>
            </GlassCard>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <GradientButton variant="outline" className="flex-col h-auto py-4" asChild>
                <Link href="/developer/api-keys">
                  <Key className="h-6 w-6 mb-2" />
                  <span>Generate API Key</span>
                </Link>
              </GradientButton>
              <GradientButton variant="outline" className="flex-col h-auto py-4" asChild>
                <Link href="/developer/sdk">
                  <Download className="h-6 w-6 mb-2" />
                  <span>Download SDK</span>
                </Link>
              </GradientButton>
              <GradientButton variant="outline" className="flex-col h-auto py-4" asChild>
                <Link href="/developer/docs">
                  <Book className="h-6 w-6 mb-2" />
                  <span>View Docs</span>
                </Link>
              </GradientButton>
            </div>

            <GradientButton size="lg" asChild>
              <Link href="/developer/dashboard">
                Go to Developer Dashboard
              </Link>
            </GradientButton>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

