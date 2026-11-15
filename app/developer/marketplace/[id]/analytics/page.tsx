'use client';

import { use, useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { GlassCard } from '@/components/aceternity/glass-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Download, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import CountUp from 'react-countup';

export default function PackageAnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [period, setPeriod] = useState('30d');

  // Mock data
  const downloadsData = [
    { date: 'Jan', downloads: 50 },
    { date: 'Feb', downloads: 120 },
    { date: 'Mar', downloads: 200 },
    { date: 'Apr', downloads: 180 },
    { date: 'May', downloads: 300 },
    { date: 'Jun', downloads: 450 },
  ];

  const revenueData = [
    { date: 'Jan', revenue: 250 },
    { date: 'Feb', revenue: 600 },
    { date: 'Mar', revenue: 1000 },
    { date: 'Apr', revenue: 900 },
    { date: 'May', revenue: 1500 },
    { date: 'Jun', revenue: 2250 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <Link href={`/developer/marketplace/${id}`}>
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Package
            </Button>
          </Link>

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-display font-bold">Package Analytics</h1>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <GlassCard className="bg-white border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Total Downloads</h3>
                <Download className="h-5 w-5 text-gray-400" />
              </div>
              <div className="text-3xl font-bold">
                <CountUp end={1247} duration={2} />
              </div>
            </GlassCard>
            <GlassCard className="bg-white border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
                <TrendingUp className="h-5 w-5 text-gray-400" />
              </div>
              <div className="text-3xl font-bold">
                $<CountUp end={4500} duration={2} />
              </div>
            </GlassCard>
            <GlassCard className="bg-white border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Average Rating</h3>
                <TrendingUp className="h-5 w-5 text-gray-400" />
              </div>
              <div className="text-3xl font-bold">4.8</div>
            </GlassCard>
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            <GlassCard className="bg-white border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-6">Downloads Over Time</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={downloadsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="downloads" stroke="#9333EA" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </GlassCard>

            <GlassCard className="bg-white border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-6">Revenue Over Time</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#9333EA" />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

