'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { GlassCard } from '@/components/aceternity/glass-card';
import { RarityBadge } from '@/components/aceternity/rarity-badge';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { useRentals } from '@/hooks/useMarketplace';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function RentalHistoryPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Fetch all rentals (completed, expired, etc.)
  const { data: allRentals = [], isLoading } = useRentals({});
  
  if (!isAuthenticated) {
    router.push('/');
    return null;
  }
  
  // Filter rentals
  const filteredRentals = allRentals.filter((rental) => {
    if (typeFilter === 'rental') return true;
    if (dateRange?.from && new Date(rental.createdAt) < dateRange.from) return false;
    if (dateRange?.to && new Date(rental.createdAt) > dateRange.to) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-display font-bold">Rental History</h1>
            
            <div className="flex gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {dateRange?.from ? format(dateRange.from, 'MMM dd') : 'From'} - {dateRange?.to ? format(dateRange.to, 'MMM dd') : 'To'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={(range) => setDateRange(range)}
                  />
                </PopoverContent>
              </Popover>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="rental">Rentals</SelectItem>
                  <SelectItem value="purchase">Purchases</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Timeline */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          ) : filteredRentals.length === 0 ? (
            <GlassCard className="bg-white border-gray-200 p-12 text-center">
              <p className="text-gray-600">No rental history found.</p>
            </GlassCard>
          ) : (
            <div className="space-y-6">
              {filteredRentals.map((rental, index) => {
                const asset = rental.asset;
                const rentalDate = new Date(rental.createdAt);
                const duration = Math.floor(rental.duration / 3600);
                
                return (
                  <div key={rental.id} className="flex gap-6">
                    {/* Timeline Line */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      {index < filteredRentals.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 mt-2" />
                      )}
                    </div>

                    {/* Content */}
                    <GlassCard className="flex-1 bg-white border-gray-200 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          {asset && (
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold">{asset.name}</h3>
                              <RarityBadge rarity={asset.rarity as any} size="sm" />
                              <Badge variant="outline">{asset.assetType}</Badge>
                            </div>
                          )}
                          <p className="text-sm text-gray-500">
                            {format(rentalDate, 'MMMM dd, yyyy')} • {duration} hours
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Cost</p>
                          <p className="font-bold text-lg">{(parseInt(rental.rentalPrice) / 1e9).toFixed(4)} SOL</p>
                          <Badge className="mt-2" variant={rental.status === 'COMPLETED' ? 'default' : 'secondary'}>
                            {rental.status}
                          </Badge>
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

