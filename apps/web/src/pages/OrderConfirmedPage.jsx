import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const OrderConfirmedPage = () => {
  const { state } = useLocation();
  const name  = state?.name  || 'there';
  const phone = state?.phone || 'your number';

  return (
    <>
      <Helmet>
        <title>Order Confirmed - Weaura</title>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 flex items-center justify-center py-16 px-4">
          <div className="text-center max-w-md">
            <div className="flex justify-center mb-6">
              <CheckCircle className="w-20 h-20 text-green-500" />
            </div>

            <h1 className="text-4xl font-bold mb-3" style={{ letterSpacing: '-0.02em' }}>
              Order placed!
            </h1>

            <p className="text-xl text-muted-foreground mb-6">
              Thank you, {name}. Your order is confirmed.
            </p>

            <div className="bg-card border border-border rounded-2xl p-6 mb-8 text-left space-y-3">
              <p className="text-sm font-medium text-foreground">What happens next:</p>
              <p className="text-sm text-muted-foreground">
                1. Our team will review your order and verify your payment.
              </p>
              <p className="text-sm text-muted-foreground">
                2. We will call you on{' '}
                <span className="font-medium text-foreground">{phone}</span>{' '}
                to confirm before we dispatch.
              </p>
              <p className="text-sm text-muted-foreground">
                3. Your order will be delivered in Weaura packaging within the agreed timeframe.
              </p>
            </div>

            <Button asChild className="w-full py-6 text-lg">
              <Link to="/shop">Continue shopping</Link>
            </Button>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default OrderConfirmedPage;
