import { useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/lib/api';
import bs58 from 'bs58';
import { toast } from 'sonner';

export function useAuth() {
  const { publicKey, signMessage, connected, disconnect } = useWallet();
  const { token, user, setToken, setUser, logout: logoutStore } = useAuthStore();

  const login = useCallback(async () => {
    if (!publicKey || !signMessage) {
      toast.error('Wallet not connected');
      return;
    }

    try {
      // Step 1: Get nonce from backend
      const { nonce } = await api.post<{ nonce: string; expiresAt: string }>(
        '/api/auth/nonce',
        {
          walletAddress: publicKey.toBase58(),
        }
      );

      // Step 2: Sign the nonce message
      const message = new TextEncoder().encode(nonce);
      const signature = await signMessage(message);
      const signatureBase58 = bs58.encode(signature);

      // Step 3: Verify signature and get JWT token
      const { token: jwtToken, user: userData } = await api.post<{
        token: string;
        user: {
          id: string;
          walletAddress: string;
          username?: string;
          createdAt: string;
        };
      }>('/api/auth/verify', {
        walletAddress: publicKey.toBase58(),
        signature: signatureBase58,
        message: nonce,
      });

      // Step 4: Store token and user
      setToken(jwtToken);
      setUser({
        ...userData,
        email: undefined,
        avatarUrl: undefined,
        bio: undefined,
      });

      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to connect wallet');
    }
  }, [publicKey, signMessage, setToken, setUser]);

  const logout = useCallback(async () => {
    logoutStore();
    await disconnect();
    toast.success('Disconnected');
  }, [logoutStore, disconnect]);

  const fetchUser = useCallback(async () => {
    if (!token) return;

    try {
      const userData = await api.get<{
        id: string;
        walletAddress: string;
        username?: string;
        email?: string;
        avatarUrl?: string;
        bio?: string;
        createdAt: string;
      }>('/api/auth/me');

      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      // If token is invalid, logout
      logoutStore();
    }
  }, [token, setUser, logoutStore]);

  return {
    isAuthenticated: !!token && !!user,
    isConnected: connected,
    user,
    token,
    login,
    logout,
    fetchUser,
    walletAddress: publicKey?.toBase58(),
  };
}

