
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { User, Package, Heart, LogOut } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import OrderCard from '@/components/OrderCard.jsx';
import ProductCard from '@/components/ProductCard.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthContext } from '@/contexts/AuthContext.jsx';
import { useOrders } from '@/hooks/useOrders';
import { useWishlist } from '@/hooks/useWishlist';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const { currentUser, updateProfile, logout } = useAuthContext();
  const { orders, loading: ordersLoading } = useOrders();
  const { wishlistItems, loading: wishlistLoading } = useWishlist();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || ''
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setProfileData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        address: currentUser.address || ''
      });
    }
  }, [currentUser]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await updateProfile(currentUser.id, profileData);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <Helmet>
        <title>Dashboard - Weaura</title>
        <meta name="description" content="Manage your orders, profile, and wishlist at Weaura." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
                  My dashboard
                </h1>
                <p className="text-xl text-muted-foreground">
                  Welcome back, {currentUser?.name || currentUser?.email}
                </p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="text-destructive hover:text-destructive"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>

            <Tabs defaultValue="orders" className="space-y-8">
              <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
                <TabsTrigger value="orders" className="gap-2">
                  <Package className="w-4 h-4" />
                  Orders
                </TabsTrigger>
                <TabsTrigger value="profile" className="gap-2">
                  <User className="w-4 h-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="wishlist" className="gap-2">
                  <Heart className="w-4 h-4" />
                  Wishlist
                </TabsTrigger>
              </TabsList>

              <TabsContent value="orders" className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-6">Order history</h2>
                  {ordersLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-card rounded-xl p-6 border border-border">
                          <div className="space-y-3">
                            <div className="h-6 bg-muted rounded animate-pulse"></div>
                            <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
                            <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-20 bg-card rounded-2xl border border-border">
                      <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                      <p className="text-muted-foreground mb-6">
                        Start shopping to see your orders here
                      </p>
                      <Button onClick={() => navigate('/shop')} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        Start Shopping
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {orders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="profile" className="space-y-6">
                <div className="bg-card rounded-2xl p-8 shadow-sm border border-border max-w-2xl">
                  <h2 className="text-2xl font-semibold mb-6">Profile settings</h2>
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="mt-2 bg-background text-foreground placeholder:text-muted-foreground"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        disabled
                        className="mt-2 bg-muted text-muted-foreground"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Email cannot be changed
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        placeholder="+256 700 123 456"
                        className="mt-2 bg-background text-foreground placeholder:text-muted-foreground"
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        type="text"
                        value={profileData.address}
                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                        placeholder="Kampala, Uganda"
                        className="mt-2 bg-background text-foreground placeholder:text-muted-foreground"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isUpdating}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {isUpdating ? 'Updating...' : 'Update Profile'}
                    </Button>
                  </form>
                </div>
              </TabsContent>

              <TabsContent value="wishlist" className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-6">Saved items</h2>
                  {wishlistLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-card rounded-2xl overflow-hidden">
                          <div className="aspect-[3/4] bg-muted animate-pulse"></div>
                          <div className="p-5 space-y-3">
                            <div className="h-4 bg-muted rounded animate-pulse"></div>
                            <div className="h-6 bg-muted rounded animate-pulse w-3/4"></div>
                            <div className="h-8 bg-muted rounded animate-pulse w-1/2"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : wishlistItems.length === 0 ? (
                    <div className="text-center py-20 bg-card rounded-2xl border border-border">
                      <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No saved items</h3>
                      <p className="text-muted-foreground mb-6">
                        Save your favorite products to find them easily later
                      </p>
                      <Button onClick={() => navigate('/shop')} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        Browse Products
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlistItems.map((item) => (
                        <ProductCard key={item.id} product={item.product} />
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default DashboardPage;
