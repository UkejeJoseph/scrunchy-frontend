import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface Asset {
  id: string;
  assetId: string;
  mintAddress: string;
  name: string;
  description: string | null;
  imageUrl: string;
  assetType: string;
  rarity: string;
  baseAttributes: Record<string, any>;
  isRentable: boolean;
  isListed: boolean;
  currentlyRented: boolean;
  owner: {
    id: string;
    username: string | null;
    walletAddress: string;
  };
  createdAt: string;
}

export interface AssetListParams {
  type?: string;
  rarity?: string;
  rentable?: boolean;
  search?: string;
  sortBy?: 'price' | 'rarity' | 'created' | 'popular';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface AssetListResponse {
  assets: Asset[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateAssetDto {
  name: string;
  description?: string;
  imageUrl: string;
  assetType: string;
  rarity: string;
  baseAttributes?: Record<string, any>;
  gameMappings?: Record<string, any>;
  rentalConfig?: {
    pricePerHour?: string;
    pricePerDay?: string;
    maxRentalDuration?: number;
    minRentalDuration?: number;
  };
}

export function useAssets(params?: AssetListParams) {
  return useQuery({
    queryKey: ['assets', params],
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
      return api.get<AssetListResponse>(`/assets${queryString ? `?${queryString}` : ''}`);
    },
  });
}

export function useAsset(id: string) {
  return useQuery({
    queryKey: ['asset', id],
    queryFn: () => api.get<Asset>(`/assets/${id}`),
    enabled: !!id,
  });
}

export function useCreateAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAssetDto) => api.post<{ asset: Asset; transaction: string }>('/assets', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });
}

