import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { HomepageProvider } from './context/HomepageContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { AdminDashboard } from './pages/AdminDashboard';

function MainApp() {
  const [currentView, setCurrentView] = useState<'home' | 'shop' | 'product' | 'checkout' | 'tracking' | 'profile' | 'admin'>('home');
  const [viewParam, setViewParam] = useState<string>('');

  const handleNavigate = (view: string, param?: string) => {
    setCurrentView(view as any);
    setViewParam(param || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      
      {/* Universal Navigation Header */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage onNavigate={handleNavigate} />
        )}

        {currentView === 'shop' && (
          <ShopPage
            initialQuery={viewParam}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'product' && (
          <ProductDetailPage
            slug={viewParam}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutPage
            onOrderPlaced={orderId => handleNavigate('tracking', orderId)}
            onBackToCart={() => handleNavigate('shop')}
          />
        )}

        {currentView === 'tracking' && (
          <OrderTrackingPage
            orderId={viewParam}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'profile' && (
          <UserProfilePage
            initialTab={viewParam}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Slide-Over Cart Drawer */}
      <CartDrawer
        onCheckout={() => handleNavigate('checkout')}
        onExplore={() => handleNavigate('shop')}
      />

      {/* Global Authentication & Register Modal */}
      <AuthModal />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <ToastProvider>
          <AuthProvider>
            <ProductProvider>
              <CartProvider>
                <WishlistProvider>
                  <HomepageProvider>
                    <MainApp />
                  </HomepageProvider>
                </WishlistProvider>
              </CartProvider>
            </ProductProvider>
          </AuthProvider>
        </ToastProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}
