import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface Listing {
  id: string;
  listingId: string;
  assetId: string;
  pricePerHour: string;
  pricePerDay: string;
  maxRentalDuration: number;
  minRentalDuration: number;
  autoRenewal: boolean;
  isAvailable: boolean;
  totalRentals: number;
  totalRevenue: string;
  asset: any;
  listedAt: string;
}

export interface Rental {
  id: string;
  rentalId: string;
  assetId: string;
  listingId: string;
  renterId: string;
  gameId: string | null;
  rentalPrice: string;
  duration: number;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
  timeRemaining?: number;
  asset?: any;
  listing?: any;
}

export interface CreateListingDto {
  assetId: string;
  pricePerHour: string;
  pricePerDay: string;
  maxRentalDuration: number;
  minRentalDuration: number;
  autoRenewal?: boolean;
}

export interface CreateRentalDto {
  listingId: string;
  duration: number;
  gameId?: string;
}

export function useListings(params?: { page?: number; limit?: number; priceMin?: string; priceMax?: string }) {
  return useQuery({
    queryKey: ['listings', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });
      }
      const queryString = searchParams.toString();
      return api.get<{
        listings: Listing[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }>(`/marketplace/listings${queryString ? `?${queryString}` : ''}`);
    },
  });
}

export function useListing(id: string) {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: () => api.get<Listing>(`/marketplace/listings/${id}`),
    enabled: !!id,
  });
}

export function useCreateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateListingDto) =>
      api.post<{ listing: Listing; transaction: string }>('/marketplace/listings', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}

export function useRentals(params?: { status?: string; active?: boolean }) {
  return useQuery({
    queryKey: ['rentals', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.status) searchParams.append('status', params.status);
      if (params?.active) searchParams.append('active', 'true');
      const queryString = searchParams.toString();
      return api.get<Rental[]>(`/marketplace/rentals/me${queryString ? `?${queryString}` : ''}`);
    },
  });
}

export function useCreateRental() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRentalDto) =>
      api.post<{ rental: Rental; transaction: string }>('/marketplace/rentals', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}

export function useCompleteRental() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      api.post<{ rental: Rental; transaction: string }>(`/marketplace/rentals/${id}/complete`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
    },
  });
}

