
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import BreadcrumbNav from '@/components/BreadcrumbNav.jsx';
import PaymentMethodCard from '@/components/PaymentMethodCard.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/hooks/useCart';
import { useOrders } from '@/hooks/useOrders';
import { toast } from 'sonner';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart, loading } = useCart();
  const { createOrder } = useOrders();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Prevent redirecting while the cart is still loading its initial state
    if (!loading && cartItems.length === 0) {
      console.log('Cart is empty, redirecting to /cart');
      navigate('/cart');
    }
  }, [cartItems.length, loading, navigate]);

  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    if (!transactionId.trim()) {
      toast.error('Please enter your transaction ID');
      return;
    }

    setIsProcessing(true);
    try {
      const orderItems = cartItems.map(item => ({
        product_id: item.product_id,
        product_name: item.product?.name,
        quantity: item.quantity,
        price: item.product?.price,
        size: item.size,
        color: item.color
      }));

      await createOrder(orderItems, cartTotal, paymentMethod, transactionId);
      await clearCart();
      
      toast.success('Order placed successfully');
      navigate('/dashboard', { state: { orderPlaced: true } });
    } catch (error) {
      toast.error(error.message || 'Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading checkout...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (cartItems.length === 0) {
    return null; // Will redirect via useEffect
  }

  return (
    <>
      <Helmet>
        <title>Checkout - Weaura</title>
        <meta name="description" content="Complete your purchase securely at Weaura with MTN MoMo or Airtel Money." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <BreadcrumbNav items={[{ label: 'Cart', href: '/cart' }, { label: 'Checkout' }]} />

            <h1 className="text-4xl md:text-5xl font-bold mb-8" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
              Checkout
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <section className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                  <h2 className="text-2xl font-semibold mb-6">Payment method</h2>
                  <div className="space-y-4">
                    <PaymentMethodCard
                      method="MTN MoMo"
                      selected={paymentMethod === 'MTN MoMo'}
                      onSelect={setPaymentMethod}
                    />
                    <PaymentMethodCard
                      method="Airtel Money"
                      selected={paymentMethod === 'Airtel Money'}
                      onSelect={setPaymentMethod}
                    />
                  </div>
                </section>

                <section className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                  <h2 className="text-2xl font-semibold mb-6">Transaction details</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="transactionId">Transaction ID</Label>
                      <Input
                        id="transactionId"
                        type="text"
                        placeholder="Enter your transaction ID"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="mt-2 bg-background text-foreground placeholder:text-muted-foreground"
                      />
                      <p className="text-sm text-muted-foreground mt-2">
                        After completing the payment, enter the transaction ID you received
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-card rounded-2xl p-6 shadow-sm border border-border sticky top-24">
                  <h2 className="text-xl font-semibold mb-6">Order summary</h2>

                  <div className="space-y-4 mb-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <div className="flex-1">
                          <p className="font-medium">{item.product?.name}</p>
                          <p className="text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-medium">
                          ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 mb-6 pt-6 border-t border-border">
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
                    onClick={handlePlaceOrder}
                    disabled={isProcessing || !paymentMethod || !transactionId.trim()}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg"
                  >
                    {isProcessing ? 'Processing...' : 'Place Order'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default CheckoutPage;
