'use client';

import { motion } from 'framer-motion';
import { GradientBackground } from '@/components/aceternity/gradient-background';
import { GradientButton } from '@/components/aceternity/gradient-button';
import { GlassCard } from '@/components/aceternity/glass-card';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { WalletButton } from '@/components/wallet/wallet-button';
import { useRouter } from 'next/navigation';
import { Gamepad2, Sparkles, Code, Check, ArrowRight, TrendingUp, Users, Package, Zap } from 'lucide-react';
import CountUp from 'react-countup';

const features = [
  {
    id: 'players',
    icon: Gamepad2,
    title: 'Rent, Don\'t Buy',
    description: 'Access premium game items through affordable rentals. No need to spend hundreds on assets you\'ll use once.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 'creators',
    icon: Sparkles,
    title: 'Earn Perpetually',
    description: 'Create once, earn forever. Your assets generate passive income through rentals across multiple games.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'developers',
    icon: Code,
    title: 'Plug & Play SDK',
    description: 'Integrate Web3 assets in minutes. Our SDK handles everything - verification, payments, and more.',
    gradient: 'from-green-500 to-teal-500',
  },
];

const steps = [
  {
    id: 'step1',
    icon: Gamepad2,
    title: 'Connect Your Wallet',
    description: 'Link your Solana wallet (Phantom, Solflare, etc.) in seconds',
    number: 1,
  },
  {
    id: 'step2',
    icon: Package,
    title: 'Browse & Rent Assets',
    description: 'Discover thousands of game items. Rent what you need, when you need it',
    number: 2,
  },
  {
    id: 'step3',
    icon: Zap,
    title: 'Use in Your Games',
    description: 'Your rented assets work instantly across all integrated games',
    number: 3,
  },
];

const stats = [
  { id: 'assets', label: 'Total Assets', value: 10000, suffix: '+' },
  { id: 'users', label: 'Active Users', value: 5000, suffix: '+' },
  { id: 'games', label: 'Integrated Games', value: 50, suffix: '+' },
  { id: 'rentals', label: 'Total Rentals', value: 100000, suffix: '+' },
];

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <GradientBackground className="min-h-screen flex items-center justify-center pt-20" particles>
        <div className="container mx-auto px-4 py-20">
          <div className="text-center space-y-8 max-w-5xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-display font-bold text-5xl md:text-7xl lg:text-8xl text-white leading-tight drop-shadow-2xl"
              style={{
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 40px rgba(147, 51, 234, 0.3)',
              }}
            >
              Own Your Gaming Power
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-white max-w-2xl mx-auto leading-relaxed drop-shadow-lg"
              style={{
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.4)',
              }}
            >
              Create, trade, and rent game items across multiple games.
              Built on Solana for instant transactions.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="min-w-[200px]"
              >
                <WalletButton />
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <GradientButton
                  size="lg"
                  variant="outline"
                  onClick={() => router.push('/marketplace')}
                  className="min-w-[200px] border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                >
                  Explore Marketplace
                </GradientButton>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex items-center justify-center gap-2 text-white text-sm pt-4 drop-shadow-md"
              style={{
                textShadow: '0 1px 5px rgba(0, 0, 0, 0.3)',
              }}
            >
              <Check className="h-4 w-4" />
              <span>Trusted by 10,000+ gamers • 5,000+ assets • 50+ games</span>
            </motion.div>
          </div>
        </div>
      </GradientBackground>

      {/* Value Proposition Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-display font-bold text-4xl md:text-5xl text-gray-900 mb-4">
              Why Choose Scrunchy?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The future of gaming asset ownership
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard hover glow className="h-full bg-white border-gray-200">
                    <div className="text-center space-y-4">
                      <motion.div
                        className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center shadow-lg`}
                        whileHover={{ 
                          rotate: 360, 
                          scale: 1.15,
                          boxShadow: '0 0 30px rgba(147, 51, 234, 0.6)',
                        }}
                        transition={{ duration: 0.6 }}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </motion.div>
                      
                      <h3 className="font-display font-bold text-2xl text-gray-900">
                        {feature.title}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-display font-bold text-4xl md:text-5xl text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in 3 simple steps
            </p>
          </motion.div>

          <div className="relative mt-16">
            {/* Progress Line */}
            <div className="absolute top-12 left-0 right-0 h-1 bg-gray-200 hidden md:block">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
              />
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 relative">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="text-center"
                  >
                    <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-6 relative z-10">
                      <Icon className="w-12 h-12 text-white" />
                      <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white flex items-center justify-center text-purple-600 font-bold shadow-lg">
                        {step.number}
                      </span>
                    </div>
                    
                    <h3 className="font-display font-bold text-2xl text-gray-900 mb-4">
                      {step.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="text-center bg-white/10 border-white/20">
                  <motion.div
                    className="text-5xl font-display font-bold text-white mb-2"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    <CountUp
                      end={stat.value}
                      duration={2}
                      suffix={stat.suffix}
                    />
                  </motion.div>
                  <p className="text-white/80 text-sm">{stat.label}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl p-12 md:p-20 gradient-hero animate-gradient"
          >
            <div className="relative z-10 text-center space-y-6">
              <h2 className="font-display font-bold text-4xl md:text-5xl text-white">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Join thousands of gamers and creators on Scrunchy
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <GradientButton size="lg" className="min-w-[200px]">
                  Connect Wallet
                </GradientButton>
                <GradientButton
                  size="lg"
                  variant="outline"
                  className="min-w-[200px] border-2 border-white/30 text-white hover:bg-white/10"
                >
                  Learn More
                </GradientButton>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
