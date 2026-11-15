'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ParticleBackground } from '@/components/aceternity/particle-background';
import { GlassCard } from '@/components/aceternity/glass-card';
import { GradientButton } from '@/components/aceternity/gradient-button';
import { WalletButton } from '@/components/wallet/wallet-button';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Wallet, Shield, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function ConnectPage() {
  const { connected } = useWallet();
  const { isAuthenticated, login } = useAuth();
  const router = useRouter();
  const [isSigning, setIsSigning] = useState(false);

  const handleSignMessage = async () => {
    if (connected && !isAuthenticated) {
      setIsSigning(true);
      try {
        await login();
        toast.success('Successfully authenticated!');
        router.push('/dashboard');
      } catch (error: any) {
        toast.error(error?.message || 'Failed to authenticate. Please try again.');
      } finally {
        setIsSigning(false);
      }
    }
  };

  const steps = [
    {
      id: 1,
      title: 'Connect Your Wallet',
      description: 'Use Phantom, Solflare, or any Solana wallet',
      icon: Wallet,
      completed: connected,
    },
    {
      id: 2,
      title: 'Sign Message',
      description: 'Sign a message to verify wallet ownership',
      icon: Shield,
      completed: isAuthenticated,
    },
    {
      id: 3,
      title: 'Start Using Scrunchy',
      description: 'Access your dashboard and start renting assets',
      icon: Zap,
      completed: false,
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600">
      {/* Particle background */}
      <div className="absolute inset-0">
        <ParticleBackground count={30} />
      </div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      
      <Navbar />
      
      <div className="relative z-10 pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="font-brand font-black text-5xl md:text-6xl mb-4 text-white drop-shadow-2xl">
              Connect Your Wallet
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Secure wallet-based authentication. No passwords, no emails. Just your Solana wallet.
            </p>
          </motion.div>

          <GlassCard className="p-8 md:p-12 mb-8">
            {/* Steps */}
            <div className="space-y-6 mb-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-start gap-4 p-4 rounded-lg transition-all ${
                    step.completed
                      ? 'bg-green-500/20 border border-green-500/50'
                      : 'bg-white/5 border border-white/10'
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                      step.completed
                        ? 'bg-green-500 text-white'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : (
                      <step.icon className="h-6 w-6" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {step.title}
                    </h3>
                    <p className="text-white/70">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Action Section */}
            <div className="space-y-4">
              {!connected && (
                <div className="text-center">
                  <p className="text-white/80 mb-4">
                    Step 1: Connect your Solana wallet to get started
                  </p>
                  <WalletButton />
                </div>
              )}

              {connected && !isAuthenticated && (
                <div className="text-center">
                  <p className="text-white/80 mb-4">
                    Step 2: Sign a message to verify your wallet ownership
                  </p>
                  <GradientButton
                    onClick={handleSignMessage}
                    disabled={isSigning}
                    className="px-8"
                  >
                    {isSigning ? 'Signing...' : (
                      <>
                        Sign Message to Authenticate
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </GradientButton>
                </div>
              )}

              {isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-4"
                >
                  <div className="flex items-center justify-center gap-2 text-green-400 mb-4">
                    <CheckCircle2 className="h-6 w-6" />
                    <p className="text-lg font-semibold">Successfully Authenticated!</p>
                  </div>
                  <GradientButton
                    onClick={() => router.push('/dashboard')}
                    className="px-8"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </GradientButton>
                </motion.div>
              )}
            </div>
          </GlassCard>

          {/* Info Section */}
          <GlassCard className="p-6 bg-blue-500/10 border-blue-500/30">
            <h3 className="text-lg font-semibold text-white mb-2">
              Why Wallet Authentication?
            </h3>
            <ul className="space-y-2 text-white/80 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-400" />
                <span><strong>No passwords:</strong> Your wallet is your identity</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-400" />
                <span><strong>Secure:</strong> Cryptographically verified ownership</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-400" />
                <span><strong>Decentralized:</strong> No central server storing your data</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-400" />
                <span><strong>Instant:</strong> Connect and authenticate in seconds</span>
              </li>
            </ul>
          </GlassCard>
        </div>
      </div>

      <Footer />
    </div>
  );
}

