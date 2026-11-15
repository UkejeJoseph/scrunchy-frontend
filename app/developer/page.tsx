'use client';

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { GlassCard } from '@/components/aceternity/glass-card';
import { GradientButton } from '@/components/aceternity/gradient-button';
import { Code, Book, Key, BarChart3, Package } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Code,
    title: 'SDK Integration',
    description: 'Easy-to-use SDKs for Python, C#, TypeScript, and more',
    href: '/developer/sdk',
  },
  {
    icon: Book,
    title: 'Documentation',
    description: 'Comprehensive guides and API reference',
    href: '/developer/docs',
  },
  {
    icon: Key,
    title: 'API Keys',
    description: 'Generate and manage API keys for your games',
    href: '/developer/api-keys',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Track usage and performance metrics',
    href: '/developer/analytics',
  },
  {
    icon: Package,
    title: 'Marketplace',
    description: 'Create and sell integration packages',
    href: '/developer/marketplace',
  },
];

export default function DeveloperPortalPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-display font-bold mb-4">
              Developer Portal
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Integrate Scrunchy assets into your games with our powerful SDK and tools
            </p>
            <GradientButton size="lg" asChild>
              <Link href="/developer/register">Register Your Game</Link>
            </GradientButton>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.title} href={feature.href}>
                  <GlassCard hover className="bg-white border-gray-200 h-full">
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </GlassCard>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

