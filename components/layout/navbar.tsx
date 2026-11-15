'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { WalletButton } from '@/components/wallet/wallet-button';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/developer', label: 'Developers' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/30 shadow-2xl">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.h1
              className="font-brand font-black text-3xl navbar-logo"
              whileHover={{ scale: 1.05 }}
            >
              Scrunchy
            </motion.h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-purple-300',
                  pathname === item.href
                    ? 'text-purple-300 font-semibold'
                    : 'text-white drop-shadow-sm'
                )}
              >
                {item.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <Link
                href="/connect"
                className={cn(
                  'text-sm font-medium transition-colors hover:text-purple-300',
                  pathname === '/connect'
                    ? 'text-purple-300 font-semibold'
                    : 'text-white drop-shadow-sm'
                )}
              >
                Connect
              </Link>
            )}
            <WalletButton />
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="glass-effect border-white/20">
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'text-lg font-medium transition-colors',
                      pathname === item.href
                        ? 'text-purple-400'
                        : 'text-white'
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                <div onClick={() => setMobileMenuOpen(false)}>
                  <WalletButton />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

