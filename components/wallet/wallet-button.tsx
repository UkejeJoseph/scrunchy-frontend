'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useAuth } from '@/hooks/useAuth';
import { GradientButton } from '@/components/aceternity/gradient-button';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Wallet, Settings, LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function WalletButton() {
  const { connected, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const { isAuthenticated, user, login, logout, walletAddress } = useAuth();
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleConnectWallet = () => {
    setVisible(true);
  };

  const handleSignMessage = async () => {
    if (connected && !isAuthenticated) {
      setIsLoggingIn(true);
      try {
        await login();
        toast.success('Successfully authenticated!');
      } catch (error: any) {
        toast.error(error?.message || 'Failed to authenticate. Please try again.');
      } finally {
        setIsLoggingIn(false);
      }
    }
  };

  const handleDisconnect = async () => {
    try {
      await logout();
      await disconnect();
      toast.success('Disconnected successfully');
    } catch (error) {
      toast.error('Failed to disconnect');
    }
  };

  const displayAddress = walletAddress
    ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
    : publicKey
    ? `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`
    : '';

  // Authenticated state - show user menu
  if (isAuthenticated && user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="border-purple-500/50 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white hover:from-purple-500/30 hover:to-pink-500/30 backdrop-blur-sm"
          >
            <Wallet className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">{user.username || displayAddress}</span>
            <span className="sm:hidden">{displayAddress}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-black/90 border-white/20 backdrop-blur-xl">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium text-white">{user.username || 'User'}</p>
            <p className="text-xs text-gray-400 font-mono">{displayAddress}</p>
          </div>
          <DropdownMenuSeparator className="bg-white/20" />
          <DropdownMenuItem 
            onClick={() => router.push('/dashboard')}
            className="text-white hover:bg-white/10 focus:bg-white/10"
          >
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => router.push('/profile')}
            className="text-white hover:bg-white/10 focus:bg-white/10"
          >
            <User className="h-4 w-4 mr-2" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => router.push('/settings')}
            className="text-white hover:bg-white/10 focus:bg-white/10"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/20" />
          <DropdownMenuItem 
            onClick={handleDisconnect} 
            className="text-red-400 hover:bg-red-500/20 focus:bg-red-500/20"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect Wallet
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Connected but not authenticated - show sign message button
  if (connected && !isAuthenticated) {
    return (
      <GradientButton
        onClick={handleSignMessage}
        disabled={isLoggingIn}
        className="px-6"
      >
        {isLoggingIn ? 'Signing...' : 'Sign Message to Login'}
      </GradientButton>
    );
  }

  // Not connected - show connect wallet button
  return (
    <GradientButton
      onClick={handleConnectWallet}
      className="px-6"
    >
      <Wallet className="h-4 w-4 mr-2" />
      Connect Wallet
    </GradientButton>
  );
}

