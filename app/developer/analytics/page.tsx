'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { GlassCard } from '@/components/aceternity/glass-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Package, TrendingUp, DollarSign } from 'lucide-react';
import CountUp from 'react-countup';

// Mock data
const playerData = [
  { date: 'Jan', players: 100 },
  { date: 'Feb', players: 250 },
  { date: 'Mar', players: 400 },
  { date: 'Apr', players: 600 },
  { date: 'May', players: 850 },
  { date: 'Jun', players: 1250 },
];

const revenueData = [
  { date: 'Jan', revenue: 50 },
  { date: 'Feb', revenue: 120 },
  { date: 'Mar', revenue: 200 },
  { date: 'Apr', revenue: 180 },
  { date: 'May', revenue: 300 },
  { date: 'Jun', revenue: 450 },
];

const assetUsageData = [
  { name: 'Weapons', value: 45 },
  { name: 'Armor', value: 30 },
  { name: 'Consumables', value: 15 },
  { name: 'Other', value: 10 },
];

const COLORS = ['#9333EA', '#EC4899', '#3B82F6', '#10B981'];

export default function AnalyticsPage() {
  const [selectedGame, setSelectedGame] = useState('all');
  const [period, setPeriod] = useState('30d');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-display font-bold">Analytics</h1>
            <div className="flex gap-4">
              <Select value={selectedGame} onValueChange={setSelectedGame}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Games</SelectItem>
                  <SelectItem value="game_1">Dragon Quest RPG</SelectItem>
                </SelectContent>
              </Select>
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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <GlassCard className="bg-white border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Total Players</h3>
                <Users className="h-5 w-5 text-gray-400" />
              </div>
              <div className="text-3xl font-bold">
                <CountUp end={1250} duration={2} />
              </div>
            </GlassCard>
            <GlassCard className="bg-white border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Assets Used</h3>
                <Package className="h-5 w-5 text-gray-400" />
              </div>
              <div className="text-3xl font-bold">
                <CountUp end={45} duration={2} />
              </div>
            </GlassCard>
            <GlassCard className="bg-white border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <div className="text-3xl font-bold">
                <CountUp end={2500} duration={2} suffix=" SOL" />
              </div>
            </GlassCard>
            <GlassCard className="bg-white border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Growth</h3>
                <TrendingUp className="h-5 w-5 text-gray-400" />
              </div>
              <div className="text-3xl font-bold text-green-600">
                +25%
              </div>
            </GlassCard>
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <GlassCard className="bg-white border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-6">Player Growth</h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={playerData}>
                  <defs>
                    <linearGradient id="colorPlayers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9333EA" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#9333EA" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="players" stroke="#9333EA" fillOpacity={1} fill="url(#colorPlayers)" />
                </AreaChart>
              </ResponsiveContainer>
            </GlassCard>

            <GlassCard className="bg-white border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-6">Revenue</h2>
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

          <GlassCard className="bg-white border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">Asset Usage by Type</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={assetUsageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {assetUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
              </ResponsiveContainer>
            </GlassCard>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

