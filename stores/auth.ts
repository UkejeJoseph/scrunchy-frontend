import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  walletAddress: string;
  username?: string;
  email?: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setToken: (token) => {
        set({ token });
        if (token) {
          localStorage.setItem('auth_token', token);
        } else {
          localStorage.removeItem('auth_token');
        }
      },
      setUser: (user) => set({ user }),
      logout: () => {
        set({ token: null, user: null });
        localStorage.removeItem('auth_token');
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);

