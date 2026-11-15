import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface Game {
  id: string;
  gameId: string;
  name: string;
  description: string;
  websiteUrl?: string | null;
  logoUrl?: string | null;
  developer: {
    id: string;
    username?: string | null;
    walletAddress: string;
  };
  isActive: boolean;
  createdAt: string;
}

export interface CreateGameDto {
  name: string;
  description: string;
  websiteUrl?: string;
  logoUrl?: string;
  supportedTypes: string[];
}

export interface ApiKey {
  id: string;
  prefix: string;
  environment: 'test' | 'production';
  permissions: string[];
  rateLimitPerMinute: number;
  lastUsedAt?: string | null;
  createdAt: string;
}

export function useGames() {
  return useQuery({
    queryKey: ['games'],
    queryFn: () => api.get<Game[]>('/games'),
  });
}

export function useGame(id: string) {
  return useQuery({
    queryKey: ['game', id],
    queryFn: () => api.get<Game>(`/games/${id}`),
    enabled: !!id,
  });
}

export function useCreateGame() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGameDto) =>
      api.post<{ game: Game; apiKey: string }>('/games', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
  });
}

export function useGameApiKeys(gameId: string) {
  return useQuery({
    queryKey: ['game-api-keys', gameId],
    queryFn: () => api.get<{ keys: ApiKey[] }>(`/games/${gameId}/api-keys`),
    enabled: !!gameId,
  });
}

export function useCreateApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ gameId, data }: { gameId: string; data: { name: string; environment?: string; permissions?: string[]; rateLimitPerMinute?: number } }) =>
      api.post<{ apiKey: string; keyPrefix: string }>(`/games/${gameId}/api-keys`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['game-api-keys', variables.gameId] });
    },
  });
}

export function useRevokeApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ gameId, keyId }: { gameId: string; keyId: string }) =>
      api.post<{ success: boolean }>(`/games/${gameId}/api-keys/${keyId}/revoke`, {}),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['game-api-keys', variables.gameId] });
    },
  });
}

