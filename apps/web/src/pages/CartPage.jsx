
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import BreadcrumbNav from '@/components/BreadcrumbNav.jsx';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useAuthContext } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const CartPage = () => {
  const { cartItems, loading, updateQuantity, removeFromCart, cartTotal } = useCart();
  const { currentUser } = useAuthContext();
  const navigate = useNavigate();

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeFromCart(itemId);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleCheckout = () => {
    console.log('Proceed to checkout clicked. Auth valid:', pb.authStore.isValid);
    if (!pb.authStore.isValid) {
      toast.error('Please log in to checkout');
      navigate('/login');
      return;
    }
    console.log('Navigating to /checkout');
    navigate('/checkout');
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading cart...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Shopping Cart - Weaura</title>
        <meta name="description" content="Review your shopping cart and proceed to checkout at Weaura." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <BreadcrumbNav items={[{ label: 'Cart' }]} />

            <h1 className="text-4xl md:text-5xl font-bold mb-8" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
              Shopping cart
            </h1>

            {cartItems.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="w-12 h-12 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
                <p className="text-muted-foreground mb-8">
                  Start shopping to add items to your cart
                </p>
                <Link to="/shop">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                      <div className="flex gap-6">
                        <div className="w-32 h-32 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                          {item.product?.images && item.product.images.length > 0 ? (
                            <img
                              src={pb.files.getUrl(item.product, item.product.images[0])}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted"></div>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg mb-1">
                                {item.product?.name || 'Product'}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {item.product?.category}
                              </p>
                            </div>
                            <button
                              onClick={() => handleRemove(item.id)}
                              className="text-destructive hover:text-destructive/80 transition-colors duration-200"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>

                          {(item.size || item.color) && (
                            <div className="flex gap-4 mb-4 text-sm">
                              {item.size && (
                                <span className="text-muted-foreground">
                                  Size: <span className="font-medium text-foreground">{item.size}</span>
                                </span>
                              )}
                              {item.color && (
                                <span className="text-muted-foreground">
                                  Color: <span className="font-medium text-foreground">{item.color}</span>
                                </span>
                              )}
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center border-2 border-border rounded-lg">
                              <button
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                className="p-2 hover:bg-muted transition-colors duration-200"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-4 font-semibold">{item.quantity}</span>
                              <button
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                className="p-2 hover:bg-muted transition-colors duration-200"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            <span className="text-2xl font-bold text-primary">
                              ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-card rounded-2xl p-6 shadow-sm border border-border sticky top-24">
                    <h2 className="text-xl font-semibold mb-6">Order summary</h2>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">${cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="font-medium">Free</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tax</span>
                        <span className="font-medium">$0.00</span>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-border mb-6">
                      <div className="flex justify-between items-baseline">
                        <span className="text-lg font-semibold">Total</span>
                        <span className="text-3xl font-bold text-primary">
                          ${cartTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={handleCheckout}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg mb-4 transition-all duration-200 active:scale-95"
                    >
                      Proceed to Checkout
                    </Button>

                    <Link to="/shop">
                      <Button variant="outline" className="w-full">
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default CartPage;
