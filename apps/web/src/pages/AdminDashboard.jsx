
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { DollarSign, Users, TrendingUp, Package, Plus } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import OrderCard from '@/components/OrderCard.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useOrders } from '@/hooks/useOrders';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const AdminDashboard = () => {
  const { orders, loading: ordersLoading, fetchAllOrders, updateOrderStatus } = useOrders();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalUsers: 0,
    totalOrders: 0,
    pendingOrders: 0
  });
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    fetchAllOrders();
    fetchProducts();
    fetchStats();
  }, []);

  const fetchProducts = async () => {
    try {
      const result = await pb.collection('products').getFullList({
        sort: '-created',
        $autoCancel: false
      });
      setProducts(result);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const allOrders = await pb.collection('orders').getFullList({ $autoCancel: false });
      const users = await pb.collection('users').getFullList({ $autoCancel: false });

      const totalRevenue = allOrders.reduce((sum, order) => sum + order.total_amount, 0);
      const pendingOrders = allOrders.filter(order => order.order_status === 'Pending').length;

      setStats({
        totalRevenue,
        totalUsers: users.length,
        totalOrders: allOrders.length,
        pendingOrders
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated');
      fetchStats();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await pb.collection('products').delete(productId, { $autoCancel: false });
      toast.success('Product deleted');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-green-500'
    },
    {
      title: 'Registered Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-500'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: TrendingUp,
      color: 'text-purple-500'
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: Package,
      color: 'text-yellow-500'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Weaura</title>
        <meta name="description" content="Manage products, orders, and users at Weaura." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-8" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
              Admin dashboard
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {statCards.map((stat, index) => (
                <div key={index} className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
              ))}
            </div>

            <Tabs defaultValue="orders" className="space-y-8">
              <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid">
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
              </TabsList>

              <TabsContent value="orders" className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-6">All orders</h2>
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
                      <p className="text-muted-foreground">
                        Orders will appear here once customers start purchasing
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {orders.map((order) => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          isAdmin={true}
                          onStatusChange={handleStatusChange}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="products" className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Product management</h2>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground opacity-50 cursor-not-allowed pointer-events-none">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </div>

                {productsLoading ? (
                  <div className="grid grid-cols-1 gap-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="bg-card rounded-xl p-6 border border-border">
                        <div className="space-y-3">
                          <div className="h-6 bg-muted rounded animate-pulse"></div>
                          <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {products.map((product) => (
                      <div key={product.id} className="bg-card rounded-xl p-6 border border-border flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted">
                            {product.images && product.images.length > 0 ? (
                              <img
                                src={pb.files.getUrl(product, product.images[0])}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-muted"></div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">{product.category}</p>
                            <p className="text-sm font-medium text-primary mt-1">
                              ${product.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" className="opacity-50 cursor-not-allowed pointer-events-none">
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AdminDashboard;
