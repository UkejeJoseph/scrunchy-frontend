'use client';

import { useState, useMemo } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { GlassCard } from '@/components/aceternity/glass-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, Calendar, Download, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CountUp from 'react-countup';
import { useRentals } from '@/hooks/useMarketplace';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function EarningsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [period, setPeriod] = useState('30d');
  
  // Fetch all rentals to calculate earnings
  const { data: allRentals = [], isLoading } = useRentals({});
  
  if (!isAuthenticated) {
    router.push('/');
    return null;
  }
  
  // Calculate earnings from rentals (as owner)
  const earnings = useMemo(() => {
    const now = new Date();
    const periodMs = period === '7d' ? 7 * 24 * 60 * 60 * 1000 : 
                     period === '30d' ? 30 * 24 * 60 * 60 * 1000 :
                     period === '90d' ? 90 * 24 * 60 * 60 * 1000 : Infinity;
    const cutoffDate = new Date(now.getTime() - periodMs);
    
    const completedRentals = allRentals.filter(r => 
      r.status === 'COMPLETED' && new Date(r.createdAt) >= cutoffDate
    );
    
    const totalEarnings = completedRentals.reduce((sum, rental) => {
      return sum + parseInt(rental.rentalPrice);
    }, 0);
    
    const thisMonthEarnings = completedRentals.filter(r => {
      const rentalDate = new Date(r.createdAt);
      return rentalDate.getMonth() === now.getMonth() && rentalDate.getFullYear() === now.getFullYear();
    }).reduce((sum, rental) => sum + parseInt(rental.rentalPrice), 0);
    
    // Group by month for chart
    const monthlyData: Record<string, number> = {};
    completedRentals.forEach(rental => {
      const date = new Date(rental.createdAt);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = 0;
      }
      monthlyData[monthKey] += parseInt(rental.rentalPrice) / 1e9;
    });
    
    const earningsData = Object.entries(monthlyData).map(([date, earnings]) => ({
      date,
      earnings: Math.round(earnings * 100) / 100,
    }));
    
    return {
      total: totalEarnings / 1e9,
      thisMonth: thisMonthEarnings / 1e9,
      pending: 0, // Would need separate endpoint for pending
      chartData: earningsData.length > 0 ? earningsData : [
        { date: 'No Data', earnings: 0 }
      ],
    };
  }, [allRentals, period]);
  
  const stats = [
    { label: 'Total Earnings', value: Math.round(earnings.total * 100) / 100, suffix: ' SOL', icon: DollarSign, gradient: 'from-green-500 to-teal-500' },
    { label: 'This Month', value: Math.round(earnings.thisMonth * 100) / 100, suffix: ' SOL', icon: Calendar, gradient: 'from-blue-500 to-cyan-500' },
    { label: 'Pending Payout', value: earnings.pending, suffix: ' SOL', icon: TrendingUp, gradient: 'from-purple-500 to-pink-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-display font-bold">Earnings</h1>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <GlassCard key={stat.label} className="bg-white border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-600">{stat.label}</h3>
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${stat.gradient} flex items-center justify-center`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-2">
                    <CountUp end={stat.value} duration={2} suffix={stat.suffix} />
                  </div>
                </GlassCard>
              );
            })}
          </div>

          {/* Charts */}
          <Tabs defaultValue="earnings" className="space-y-6">
            <TabsList>
              <TabsTrigger value="earnings">Earnings Chart</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>

            <TabsContent value="earnings">
              <GlassCard className="bg-white border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-6">Earnings Over Time</h2>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={earnings.chartData}>
                      <defs>
                        <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#9333EA" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#9333EA" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="earnings" stroke="#9333EA" fillOpacity={1} fill="url(#colorEarnings)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </GlassCard>
            </TabsContent>

            <TabsContent value="transactions">
              <GlassCard className="bg-white border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Transaction History</h2>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
                <div className="space-y-4">
                  {/* Transaction list would go here */}
                  <p className="text-gray-600 text-center py-8">Transaction history will appear here</p>
                </div>
              </GlassCard>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
}

