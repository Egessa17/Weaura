import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/hooks/useCart';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart, loading } = useCart();
  const navigate = useNavigate();

  const [details, setDetails] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    deliveryZone: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!loading && cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems.length, loading, navigate]);

  const handleChange = (field) => (e) =>
    setDetails((prev) => ({ ...prev, [field]: e.target.value }));

  const handlePlaceOrder = async () => {
    if (!details.name.trim())    return toast.error('Please enter your full name');
    if (!details.phone.trim())   return toast.error('Please enter your phone number');
    if (!details.address.trim()) return toast.error('Please enter your delivery address');
    if (!paymentMethod)          return toast.error('Please select a payment method');
    if (!transactionId.trim())   return toast.error('Please enter your transaction ID');

    const itemMissingOptions = cartItems.some((item) =>
      ((item.product?.sizes?.length || 0) > 0 && !item.size)
      || ((item.product?.colors?.length || 0) > 0 && !item.color)
    );
    if (itemMissingOptions) {
      return toast.error('Please select size and color too to continue to place the order');
    }

    const normalizedTransactionId = transactionId.replace(/\s+/g, '');
    const requiredLength = paymentMethod === 'MTN MoMo' ? 11 : 12;
    if (!new RegExp(`^\\d{${requiredLength}}$`).test(normalizedTransactionId)) {
      return toast.error(`${paymentMethod} transaction IDs must contain exactly ${requiredLength} digits`);
    }

    setIsProcessing(true);

    try {
      const orderItems = cartItems.map((item) => ({
        product_id:   item.product_id,
        quantity:     item.quantity,
        size:         item.size,
        color:        item.color,
      }));

      const { data, error } = await supabase.functions.invoke('create-order', {
        body: {
          customer_name:    details.name,
          customer_phone:   details.phone,
          customer_email:   details.email   || null,
          customer_address: details.address,
          delivery_zone:    details.deliveryZone || null,
          items:            orderItems,
          payment_method:   paymentMethod,
          transaction_id:   normalizedTransactionId,
        },
      });

      if (error) {
        if (error.context instanceof Response) {
          const responseBody = await error.context.json().catch(() => null);
          throw new Error(responseBody?.error || error.message);
        }
        throw error;
      }
      const order = data?.order;
      if (!order?.id) throw new Error('Order was not created');

      clearCart();
      toast.success('Order submitted and awaiting payment verification.');
      navigate('/order-confirmed', {
        state: {
          name:    details.name,
          phone:   details.phone,
          orderId: order.id,
        },
      });
    } catch (error) {
      toast.error(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentOptions = ['MTN MoMo', 'Airtel Money'];

  const canSubmit =
    !isProcessing &&
    details.name.trim() &&
    details.phone.trim() &&
    details.address.trim() &&
    paymentMethod &&
    transactionId.trim();

  if (loading || cartItems.length === 0) return null;

  return (
    <>
      <Helmet>
        <title>Checkout - Weaura</title>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-8" style={{ letterSpacing: '-0.02em' }}>
              Checkout
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">

                {/* Customer details */}
                <section className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                  <h2 className="text-2xl font-semibold mb-6">Your details</h2>
                  <div className="space-y-4">

                    <div>
                      <Label htmlFor="name">Full name *</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={details.name}
                        onChange={handleChange('name')}
                        className="mt-2 bg-background"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="07XX XXX XXX"
                        value={details.phone}
                        onChange={handleChange('phone')}
                        className="mt-2 bg-background"
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        We will call this number to confirm your order
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="email">
                        Email{' '}
                        <span className="text-muted-foreground font-normal">
                          (optional — for order receipt)
                        </span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={details.email}
                        onChange={handleChange('email')}
                        className="mt-2 bg-background"
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Delivery address *</Label>
                      <Input
                        id="address"
                        type="text"
                        placeholder="e.g. Ntinda, Kampala — near the Shell station"
                        value={details.address}
                        onChange={handleChange('address')}
                        className="mt-2 bg-background"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="zone">
                        Delivery zone{' '}
                        <span className="text-muted-foreground font-normal">(optional)</span>
                      </Label>
                      <Input
                        id="zone"
                        type="text"
                        placeholder="e.g. Kampala Central, Wakiso, Entebbe"
                        value={details.deliveryZone}
                        onChange={handleChange('deliveryZone')}
                        className="mt-2 bg-background"
                      />
                    </div>
                  </div>
                </section>

                {/* Payment method */}
                <section className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                  <h2 className="text-2xl font-semibold mb-6">Payment method</h2>
                  <div className="space-y-3">
                    {paymentOptions.map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-colors ${
                          paymentMethod === method
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <span className="font-medium">{method}</span>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Transaction ID */}
                <section className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                  <h2 className="text-2xl font-semibold mb-2">Transaction ID</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Send payment to our MoMo number first, then paste the transaction ID from your SMS confirmation here.
                  </p>
                  <div>
                    <Label htmlFor="transactionId">MoMo transaction ID *</Label>
                    <Input
                      id="transactionId"
                      type="text"
                      placeholder="e.g. MP250611.1234.A56789"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="mt-2 bg-background font-mono"
                    />
                  </div>
                </section>

              </div>

              {/* Order summary — shows product total only, no transport line */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-2xl p-6 shadow-sm border border-border sticky top-24">
                  <h2 className="text-xl font-semibold mb-6">Order summary</h2>

                  <div className="space-y-4 mb-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <div className="flex-1 pr-2">
                          <p className="font-medium">{item.product?.name}</p>
                          <p className="text-muted-foreground text-xs mt-0.5">
                            Qty: {item.quantity}
                            {item.size && ` · ${item.size}`}
                            {item.color && ` · ${item.color}`}
                          </p>
                        </div>
                        <span className="font-medium whitespace-nowrap">
                          UGX {((item.product?.price || 0) * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Total — product price only, no transport breakdown */}
                  <div className="pt-4 border-t border-border mb-6">
                    <div className="flex justify-between items-baseline">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-3xl font-bold text-primary">
                        UGX {cartTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={handlePlaceOrder}
                    disabled={!canSubmit}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg"
                  >
                    {isProcessing ? 'Placing order...' : 'Place order'}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    We will call you to confirm before dispatching
                  </p>
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
