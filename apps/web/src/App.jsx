import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from './components/ScrollToTop.jsx';
import { AdminAuthProvider } from './contexts/AdminAuthContext.jsx';
import AdminProtectedRoute from './components/AdminProtectedRoute.jsx';
import HomePage from './pages/HomePage.jsx';
import ShopPage from './pages/ShopPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrderConfirmedPage from './pages/OrderConfirmedPage.jsx';
import AdminLoginPage from './pages/AdminLoginPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

function App() {
  return (
    <Router>
      <AdminAuthProvider>
        <ScrollToTop />
        <Routes>
          {/* Public customer routes — no login required */}
          <Route path="/"               element={<HomePage />} />
          <Route path="/shop"           element={<ShopPage />} />
          <Route path="/product/:id"    element={<ProductDetailPage />} />
          <Route path="/cart"           element={<CartPage />} />
          <Route path="/checkout"       element={<CheckoutPage />} />
          <Route path="/order-confirmed" element={<OrderConfirmedPage />} />

          {/* Admin routes — hidden at /hq, not linked anywhere on the site */}
          <Route path="/hq" element={<AdminLoginPage />} />
          <Route
            path="/hq/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
                  <p className="text-xl text-muted-foreground mb-8">Page not found</p>
                  <a href="/" className="text-primary hover:underline">
                    Back to home
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
        <Toaster />
      </AdminAuthProvider>
    </Router>
  );
}

export default App;
