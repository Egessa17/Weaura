import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import {
  DollarSign, Users, TrendingUp, Package,
  Plus, LogOut, X, Edit, Trash2, Upload, History
} from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import OrderCard from '@/components/OrderCard.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useOrders } from '@/hooks/useOrders';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

// ── Empty product form state ──────────────────────────────────
const EMPTY_PRODUCT = {
  name: '',
  description: '',
  price: '',
  category: '',
  stock: '',
  rating: '',
  images: '',   // comma-separated URLs
  sizes: '',    // comma-separated e.g. "S,M,L,XL"
  colors: '',   // comma-separated e.g. "Red,Blue,Black"
};

const CATEGORIES = [
  'Men', 'Women', 'Unisex',
  'Shoes', 'Accessories', 'Bags', 'Jerseys'
];

// ── Product Modal ─────────────────────────────────────────────
const ProductModal = ({ product, onClose, onSaved }) => {
  const isEditing = !!product?.id;
  const [form, setForm] = useState(
    isEditing
      ? {
        ...product,
        images: (product.images || []).join(', '),
        sizes: (product.sizes || []).join(', '),
        colors: (product.colors || []).join(', '),
      }
      : EMPTY_PRODUCT
  );
  const [saving, setSaving] = useState(false);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const parseArray = (str) =>
    str.split(',').map((s) => s.trim()).filter(Boolean);

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error('Product name is required');
    if (!form.price) return toast.error('Price is required');
    if (!form.category) return toast.error('Category is required');

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        category: form.category,
        stock: parseInt(form.stock) || 0,
        rating: parseFloat(form.rating) || 0,
        images: parseArray(form.images),
        sizes: parseArray(form.sizes),
        colors: parseArray(form.colors),
      };

      if (isEditing) {
        const { error } = await supabase
          .from('products')
          .update(payload)
          .eq('id', product.id);
        if (error) throw error;
        toast.success('Product updated');
      } else {
        const { error } = await supabase
          .from('products')
          .insert(payload);
        if (error) throw error;
        toast.success('Product added');
      }

      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10">
          <h2 className="text-2xl font-bold">
            {isEditing ? 'Edit product' : 'Add new product'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          {/* Name */}
          <div>
            <Label htmlFor="p-name">Product name *</Label>
            <Input
              id="p-name"
              value={form.name}
              onChange={handleChange('name')}
              placeholder="e.g. Nike Air Force 1"
              className="mt-2 bg-background"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="p-desc">Description</Label>
            <textarea
              id="p-desc"
              value={form.description}
              onChange={handleChange('description')}
              placeholder="Describe the product..."
              rows={3}
              className="mt-2 w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Price + Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="p-price">Price (UGX) *</Label>
              <Input
                id="p-price"
                type="number"
                value={form.price}
                onChange={handleChange('price')}
                placeholder="e.g. 150000"
                className="mt-2 bg-background"
              />
            </div>
            <div>
              <Label htmlFor="p-stock">Stock quantity</Label>
              <Input
                id="p-stock"
                type="number"
                value={form.stock}
                onChange={handleChange('stock')}
                placeholder="e.g. 20"
                className="mt-2 bg-background"
                disabled={!!product}
              />
              {product && (
                <p className="text-xs text-muted-foreground mt-1">Use the Inventory tab to change stock.</p>
              )}
            </div>
          </div>

          {/* Category + Rating */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="p-category">Category *</Label>
              <select
                id="p-category"
                value={form.category}
                onChange={handleChange('category')}
                className="mt-2 w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="p-rating">Rating (0–5)</Label>
              <Input
                id="p-rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={form.rating}
                onChange={handleChange('rating')}
                placeholder="e.g. 4.5"
                className="mt-2 bg-background"
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <Label htmlFor="p-images">Image URLs</Label>
            <Input
              id="p-images"
              value={form.images}
              onChange={handleChange('images')}
              placeholder="https://image1.jpg, https://image2.jpg"
              className="mt-2 bg-background"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Paste image URLs separated by commas. Use Supabase Storage, Cloudinary, or any public image URL.
            </p>
            {/* Preview first image */}
            {form.images && (
              <div className="mt-3 flex gap-2 flex-wrap">
                {parseArray(form.images).slice(0, 4).map((url, i) => (
                  <div key={i} className="w-16 h-16 rounded-lg overflow-hidden bg-muted border border-border">
                    <img
                      src={url}
                      alt={`preview ${i + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sizes */}
          <div>
            <Label htmlFor="p-sizes">Available sizes</Label>
            <Input
              id="p-sizes"
              value={form.sizes}
              onChange={handleChange('sizes')}
              placeholder="S, M, L, XL, XXL"
              className="mt-2 bg-background"
            />
            <p className="text-xs text-muted-foreground mt-1">Separate with commas</p>
          </div>

          {/* Colors */}
          <div>
            <Label htmlFor="p-colors">Available colors</Label>
            <Input
              id="p-colors"
              value={form.colors}
              onChange={handleChange('colors')}
              placeholder="Black, White, Red, Navy"
              className="mt-2 bg-background"
            />
            <p className="text-xs text-muted-foreground mt-1">Separate with commas</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-border sticky bottom-0 bg-card">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {saving
              ? (isEditing ? 'Saving...' : 'Adding...')
              : (isEditing ? 'Save changes' : 'Add product')
            }
          </Button>
        </div>
      </div>
    </div>
  );
};

// ── Main AdminDashboard ───────────────────────────────────────
const AdminDashboard = () => {
  const { orders, loading: ordersLoading, fetchAllOrders, updateOrderStatus, verifyPayment, stats } = useOrders();
  const { adminUser, adminLogout } = useAdminAuth();

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditLoading, setAuditLoading] = useState(true);
  const [inventoryMovements, setInventoryMovements] = useState([]);
  const [inventoryLoading, setInventoryLoading] = useState(true);
  const [adjustingProductId, setAdjustingProductId] = useState(null);
  const [quantityChange, setQuantityChange] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('');

  useEffect(() => {
    fetchAllOrders();
    fetchProducts();
    fetchAuditLogs();
    fetchInventoryMovements();
  }, []);

  const fetchInventoryMovements = async () => {
    try {
      setInventoryLoading(true);
      const { data, error } = await supabase
        .from('inventory_movements')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);
      if (error) throw error;
      setInventoryMovements(data || []);
    } catch (error) {
      console.error('Error fetching inventory movements:', error);
      toast.error('Failed to load inventory history');
    } finally {
      setInventoryLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      setAuditLoading(true);
      const { data, error } = await supabase
        .from('admin_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);
      if (error) throw error;
      setAuditLogs(data || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast.error('Failed to load admin activity');
    } finally {
      setAuditLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setProductsLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated');
      fetchAllOrders();
      fetchAuditLogs();
    } catch {
      toast.error('Failed to update order status');
    }
  };

  const handleVerifyPayment = async (orderId, paymentMethod, transactionId) => {
    try {
      const result = await verifyPayment(orderId, paymentMethod, transactionId);
      if (!result.order.customer_email) {
        toast.success('Payment verified; no customer email was supplied');
      } else if (result.customer_email_sent) {
        toast.success('Payment verified and customer confirmation sent');
      } else {
        toast.warning('Payment verified, but the customer email failed');
      }
      fetchProducts();
      fetchAllOrders();
      fetchAuditLogs();
    } catch (error) {
      toast.error(error.message || 'Payment verification failed');
    }
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (!window.confirm(`Delete "${productName}"? This cannot be undone.`)) return;
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      if (error) throw error;
      toast.success('Product deleted');
      fetchProducts();
      fetchAuditLogs();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const handleInventoryAdjustment = async (product) => {
    const change = Number(quantityChange);
    if (!Number.isInteger(change) || change === 0) {
      return toast.error('Enter a whole-number adjustment such as 10 or -2');
    }
    if (adjustmentReason.trim().length < 3) {
      return toast.error('Enter a reason for this inventory change');
    }

    setAdjustingProductId(product.id);
    try {
      const { data, error } = await supabase.rpc('adjust_inventory', {
        p_product_id: product.id,
        p_quantity_change: change,
        p_reason: adjustmentReason.trim(),
      });
      if (error) throw error;

      if (data?.alert_needed) {
        const { error: emailError } = await supabase.functions.invoke('send-email', {
          body: { type: 'low_stock', product: data.product },
        });
        if (emailError) {
          toast.warning('Inventory updated, but low-stock email delivery failed');
        } else {
          toast.warning(`Low-stock emails sent: ${data.product.stock} pieces remaining`);
        }
      } else {
        toast.success('Inventory updated');
      }

      setQuantityChange('');
      setAdjustmentReason('');
      await Promise.all([fetchProducts(), fetchInventoryMovements(), fetchAuditLogs()]);
    } catch (error) {
      toast.error(error.message || 'Failed to update inventory');
    } finally {
      setAdjustingProductId(null);
    }
  };

  const beginInventoryAdjustment = (productId) => {
    if (adjustingProductId !== productId) {
      setQuantityChange('');
      setAdjustmentReason('');
      setAdjustingProductId(productId);
    }
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  const handleLogout = async () => {
    await adminLogout();
    window.location.href = '/hq';
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: `UGX ${(stats.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-500',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders || 0,
      icon: TrendingUp,
      color: 'text-purple-500',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders || 0,
      icon: Package,
      color: 'text-yellow-500',
    },
    {
      title: 'Delivered',
      value: stats.deliveredOrders || 0,
      icon: Users,
      color: 'text-blue-500',
    },
  ];

  const inventoryByCategory = products.reduce((groups, product) => {
    const category = product.category || 'Uncategorized';
    if (!groups[category]) groups[category] = [];
    groups[category].push(product);
    return groups;
  }, {});

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Weaura</title>
      </Helmet>

      {/* Product modal */}
      {modalOpen && (
        <ProductModal
          product={editingProduct}
          onClose={handleModalClose}
          onSaved={() => {
            fetchProducts();
            fetchAuditLogs();
          }}
        />
      )}

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Page header */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl md:text-5xl font-bold" style={{ letterSpacing: '-0.02em' }}>
                Admin dashboard
              </h1>
              <p className="text-lg font-medium text-muted-foreground ml-4 mr-auto">
                Welcome, {adminUser?.name || 'Administrator'}
              </p>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {statCards.map((stat, index) => (
                <div
                  key={index}
                  className="bg-card rounded-2xl p-6 shadow-sm border border-border"
                >
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
              ))}
            </div>

            <Tabs defaultValue="orders" className="space-y-8">
              <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="inventory">
                  Inventory{products.filter((product) => product.stock <= 15).length > 0
                    ? ` (${products.filter((product) => product.stock <= 15).length} low)`
                    : ''}
                </TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              {/* ── Orders tab ── */}
              <TabsContent value="orders" className="space-y-6">
                <h2 className="text-2xl font-semibold">All orders</h2>
                {ordersLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="bg-card rounded-xl p-6 border border-border">
                        <div className="space-y-3">
                          <div className="h-6 bg-muted rounded animate-pulse" />
                          <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                          <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
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
                        onVerifyPayment={handleVerifyPayment}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* ── Products tab ── */}
              <TabsContent value="products" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">
                    Products{' '}
                    <span className="text-muted-foreground text-lg font-normal">
                      ({products.length})
                    </span>
                  </h2>
                  <Button
                    onClick={handleOpenAdd}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add product
                  </Button>
                </div>

                {productsLoading ? (
                  <div className="grid grid-cols-1 gap-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="bg-card rounded-xl p-6 border border-border">
                        <div className="space-y-3">
                          <div className="h-6 bg-muted rounded animate-pulse" />
                          <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-20 bg-card rounded-2xl border border-border">
                    <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No products yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Add your first product to start selling
                    </p>
                    <Button
                      onClick={handleOpenAdd}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add first product
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="bg-card rounded-xl p-5 border border-border flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          {/* Thumbnail */}
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            {product.images && product.images.length > 0 ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="min-w-0">
                            <h3 className="font-semibold truncate">{product.name}</h3>
                            <div className="flex items-center gap-3 mt-1 flex-wrap">
                              <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                                {product.category}
                              </span>
                              <span className="text-sm font-medium text-primary">
                                UGX {Number(product.price).toLocaleString()}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Stock: {product.stock ?? 0}
                              </span>
                              {product.sizes && product.sizes.length > 0 && (
                                <span className="text-xs text-muted-foreground">
                                  Sizes: {product.sizes.join(', ')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenEdit(product)}
                            className="flex items-center gap-1"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            className="flex items-center gap-1 text-destructive hover:text-destructive border-destructive/30 hover:border-destructive"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="inventory" className="space-y-8">
                <div>
                  <h2 className="text-2xl font-semibold">Inventory</h2>
                  <p className="text-muted-foreground mt-1">
                    Stock at or below 15 pieces is highlighted. Positive adjustments add stock; negative adjustments remove stock.
                  </p>
                </div>

                {Object.entries(inventoryByCategory).map(([category, categoryProducts]) => (
                  <section key={category} className="space-y-3">
                    <h3 className="text-xl font-semibold">{category}</h3>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                      {categoryProducts.map((product) => {
                        const lowStock = product.stock <= 15;
                        return (
                          <div
                            key={product.id}
                            className={`rounded-xl border p-5 ${lowStock ? 'border-amber-500 bg-amber-50' : 'border-border bg-card'}`}
                          >
                            <div className="flex items-start justify-between gap-4 mb-4">
                              <div>
                                <h4 className="font-semibold">{product.name}</h4>
                                <p className="text-sm text-muted-foreground">UGX {Number(product.price).toLocaleString()}</p>
                              </div>
                              <div className={`text-right ${lowStock ? 'text-amber-700' : ''}`}>
                                <p className="text-2xl font-bold">{product.stock}</p>
                                <p className="text-xs font-medium">pieces available</p>
                                {lowStock && <p className="text-xs font-semibold mt-1">LOW STOCK</p>}
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-[110px_1fr_auto] gap-2">
                              <Input
                                type="number"
                                step="1"
                                value={adjustingProductId === product.id ? quantityChange : ''}
                                onFocus={() => beginInventoryAdjustment(product.id)}
                                onChange={(event) => {
                                  if (adjustingProductId !== product.id) setAdjustmentReason('');
                                  setAdjustingProductId(product.id);
                                  setQuantityChange(event.target.value);
                                }}
                                placeholder="+10 / -2"
                                className="bg-background"
                              />
                              <Input
                                value={adjustingProductId === product.id ? adjustmentReason : ''}
                                onFocus={() => beginInventoryAdjustment(product.id)}
                                onChange={(event) => {
                                  if (adjustingProductId !== product.id) setQuantityChange('');
                                  setAdjustingProductId(product.id);
                                  setAdjustmentReason(event.target.value);
                                }}
                                placeholder="Reason: restock, damage, correction..."
                                className="bg-background"
                              />
                              <Button
                                onClick={() => handleInventoryAdjustment(product)}
                                disabled={
                                  adjustingProductId !== product.id
                                  || !quantityChange
                                  || adjustmentReason.trim().length < 3
                                }
                              >
                                Apply
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                ))}

                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Recent inventory movements</h3>
                    <Button variant="outline" onClick={fetchInventoryMovements}>Refresh</Button>
                  </div>
                  {inventoryLoading ? (
                    <p className="text-muted-foreground">Loading inventory history...</p>
                  ) : inventoryMovements.length === 0 ? (
                    <p className="text-muted-foreground">No inventory movements recorded yet.</p>
                  ) : (
                    <div className="bg-card rounded-xl border border-border divide-y divide-border overflow-hidden">
                      {inventoryMovements.map((movement) => (
                        <div key={movement.id} className="p-4 grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-2 md:gap-6">
                          <div>
                            <p className="font-semibold">{movement.product_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {movement.reason} · {movement.admin_name}
                            </p>
                          </div>
                          <p className={`font-bold ${movement.quantity_change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {movement.quantity_change > 0 ? '+' : ''}{movement.quantity_change} ({movement.before_quantity} → {movement.after_quantity})
                          </p>
                          <p className="text-sm text-muted-foreground md:text-right">
                            {new Date(movement.created_at).toLocaleString('en-UG')}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </TabsContent>

              <TabsContent value="activity" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Admin activity</h2>
                  <Button variant="outline" onClick={fetchAuditLogs}>Refresh</Button>
                </div>
                {auditLoading ? (
                  <p className="text-muted-foreground">Loading activity...</p>
                ) : auditLogs.length === 0 ? (
                  <div className="text-center py-16 bg-card rounded-2xl border border-border">
                    <History className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No admin activity recorded yet</p>
                  </div>
                ) : (
                  <div className="bg-card rounded-2xl border border-border divide-y divide-border overflow-hidden">
                    {auditLogs.map((log) => (
                      <div key={log.id} className="p-4 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <div className="md:w-44 flex-shrink-0">
                          <p className="font-semibold">{log.admin_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(log.created_at).toLocaleString('en-UG')}
                          </p>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{log.action.replaceAll('_', ' ')}</p>
                          <p className="text-sm text-muted-foreground">
                            {log.entity_type}{log.entity_id ? ` #${log.entity_id.slice(0, 8)}` : ''}
                            {log.details?.from || log.details?.to
                              ? ` · ${log.details?.from || '—'} → ${log.details?.to || '—'}`
                              : ''}
                          </p>
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
