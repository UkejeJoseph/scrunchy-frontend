import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';

export interface UserProfile {
  id: string;
  walletAddress: string;
  username?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  stats?: {
    totalAssets: number;
    totalListings: number;
    totalRentals: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  bio?: string;
  avatarUrl?: string;
}

export function useUserProfile() {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => api.get<UserProfile>('/users/me'),
    enabled: !!useAuthStore.getState().token,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserDto) => api.put<UserProfile>('/users/me', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}

export function useUserAssets() {
  return useQuery({
    queryKey: ['user', 'assets'],
    queryFn: () => api.get<any[]>('/users/me/assets'),
    enabled: !!useAuthStore.getState().token,
  });
}

