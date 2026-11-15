'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { GlassCard } from '@/components/aceternity/glass-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import CountUp from 'react-countup';

const stats = [
  { id: 'assets', title: 'Total Assets', value: 24, icon: Package, gradient: 'from-blue-500 to-cyan-500' },
  { id: 'rentals', title: 'Active Rentals', value: 8, icon: TrendingUp, gradient: 'from-purple-500 to-pink-500' },
  { id: 'earnings', title: 'Total Earnings', value: 1250, suffix: ' SOL', icon: DollarSign, gradient: 'from-green-500 to-teal-500' },
  { id: 'monthly', title: 'This Month', value: 450, suffix: ' SOL', icon: Calendar, gradient: 'from-orange-500 to-red-500', change: '+12.5%' },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-display font-bold mb-8">Dashboard</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <GlassCard key={stat.id} className="bg-white border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${stat.gradient} flex items-center justify-center`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold mb-1">
                    <CountUp end={stat.value} duration={2} suffix={stat.suffix} />
                  </div>
                  {stat.change && (
                    <p className="text-xs text-green-600">{stat.change} from last month</p>
                  )}
                </GlassCard>
              );
            })}
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="assets">My Assets</TabsTrigger>
              <TabsTrigger value="rentals">My Rentals</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="earnings">Earnings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <GlassCard className="bg-white border-gray-200 p-8">
                <p className="text-gray-600">Welcome to your dashboard! Overview content goes here.</p>
              </GlassCard>
            </TabsContent>

            <TabsContent value="assets" className="mt-6">
              <GlassCard className="bg-white border-gray-200 p-8">
                <p className="text-gray-600">Your assets will appear here.</p>
              </GlassCard>
            </TabsContent>

            <TabsContent value="rentals" className="mt-6">
              <GlassCard className="bg-white border-gray-200 p-8">
                <p className="text-gray-600">Your active rentals will appear here.</p>
              </GlassCard>
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <GlassCard className="bg-white border-gray-200 p-8">
                <p className="text-gray-600">Rental history will appear here.</p>
              </GlassCard>
            </TabsContent>

            <TabsContent value="earnings" className="mt-6">
              <GlassCard className="bg-white border-gray-200 p-8">
                <p className="text-gray-600">Earnings analytics will appear here.</p>
              </GlassCard>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
}

