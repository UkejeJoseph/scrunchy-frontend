'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { GlassCard } from '@/components/aceternity/glass-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { GradientButton } from '@/components/aceternity/gradient-button';
import { Wallet } from 'lucide-react';
import { useUserProfile, useUpdateUser } from '@/hooks/useUser';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { data: user, isLoading } = useUserProfile();
  const updateUser = useUpdateUser();
  
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    avatarUrl: user?.avatarUrl || '',
  });
  
  const [notifications, setNotifications] = useState({
    email: false,
    rentalAlerts: true,
    earningsUpdates: true,
  });
  
  if (!isAuthenticated) {
    router.push('/');
    return null;
  }
  
  const handleSaveProfile = async () => {
    try {
      await updateUser.mutateAsync({
        username: formData.username || undefined,
        email: formData.email || undefined,
        bio: formData.bio || undefined,
        avatarUrl: formData.avatarUrl || undefined,
      });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    }
  };
  
  // Update form when user data loads
  if (user && !formData.username && user.username) {
    setFormData({
      username: user.username || '',
      email: user.email || '',
      bio: user.bio || '',
      avatarUrl: user.avatarUrl || '',
    });
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-display font-bold mb-8">Settings</h1>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="wallets">Wallets</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <GlassCard className="bg-white border-gray-200 p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                        {(user?.username || user?.walletAddress || 'U')[0].toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold">Profile Settings</h2>
                        <p className="text-gray-600">Update your profile information</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input 
                          id="username" 
                          placeholder="Enter username"
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="Enter email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Input 
                          id="bio" 
                          placeholder="Tell us about yourself"
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        />
                      </div>
                      <GradientButton 
                        onClick={handleSaveProfile}
                        disabled={updateUser.isPending}
                      >
                        {updateUser.isPending ? 'Saving...' : 'Save Changes'}
                      </GradientButton>
                    </div>
                  </>
                )}
              </GlassCard>
            </TabsContent>

            <TabsContent value="notifications">
              <GlassCard className="bg-white border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-gray-500">Receive email updates</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Rental Alerts</Label>
                      <p className="text-sm text-gray-500">Get notified about rentals</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Earnings Updates</Label>
                      <p className="text-sm text-gray-500">Monthly earnings reports</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </GlassCard>
            </TabsContent>

            <TabsContent value="payment">
              <GlassCard className="bg-white border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-6">Payment Methods</h2>
                <p className="text-gray-600 mb-4">Manage your payment methods</p>
                <Button variant="outline">Add Payment Method</Button>
              </GlassCard>
            </TabsContent>

            <TabsContent value="security">
              <GlassCard className="bg-white border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
                <div className="space-y-4">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500 mb-2">Add an extra layer of security</p>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                  <div>
                    <Label>Change Password</Label>
                    <p className="text-sm text-gray-500 mb-2">Update your password</p>
                    <Button variant="outline">Change Password</Button>
                  </div>
                </div>
              </GlassCard>
            </TabsContent>

            <TabsContent value="wallets">
              <GlassCard className="bg-white border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-6">Connected Wallets</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Wallet className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">Phantom Wallet</p>
                        <p className="text-sm text-gray-500 font-mono">0x1234...5678</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Disconnect</Button>
                  </div>
                  <Button variant="outline">Connect New Wallet</Button>
                </div>
              </GlassCard>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
}

