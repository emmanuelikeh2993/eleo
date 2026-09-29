'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Header } from '@/components/Header';
import { ActiveOrderBanner } from '@/components/ActiveOrderBanner';
import { LandingPage } from '@/components/LandingPage';
import { AuthModal } from '@/components/AuthModal';
import { ProductCard } from '@/components/ProductCard';
import { CartDrawer } from '@/components/CartDrawer';
import { CheckoutModal } from '@/components/CheckoutModal';
import { PaymentView } from '@/components/PaymentView';
import { OrderDocket } from '@/components/OrderDocket';
import { OrderHistoryView } from '@/components/OrderHistoryView';
import { NutritionView } from '@/components/NutritionView';
import { FulfillmentMethod, Order } from '@/types';
import {
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Lock,
  Egg,
} from 'lucide-react';

export default function HomePage() {
  const {
    products,
    cart,
    orders,
    activeOrderId,
    setActiveOrderId,
    activeTab,
    setActiveTab,
    currentUser,
    openAuthModal,
  } = useStore();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [fulfillmentMethod, setFulfillmentMethod] = useState<FulfillmentMethod>('delivery');
  const [pendingPaymentOrder, setPendingPaymentOrder] = useState<Order | null>(null);
  const [selectedDocketOrder, setSelectedDocketOrder] = useState<Order | null>(null);
  const [productCategoryFilter, setProductCategoryFilter] = useState<'all' | 'standard' | 'jumbo' | 'bundle'>('all');

  // Enforce auth-gated view:
  // - When logged in, never show the landing page (direct to store/active dashboard)
  // - When logged out (guest), only show the landing page
  useEffect(() => {
    if (currentUser && activeTab === 'landing') {
      setActiveTab('store');
    } else if (!currentUser && activeTab !== 'landing') {
      setActiveTab('landing');
    }
  }, [currentUser, activeTab, setActiveTab]);

  // Filtered products
  const filteredProducts = products.filter((p) => {
    if (productCategoryFilter === 'all') return true;
    return p.category === productCategoryFilter;
  });

  // Handle proceed from Cart to Checkout
  const handleProceedToCheckout = (method: FulfillmentMethod) => {
    setFulfillmentMethod(method);
    setIsCartOpen(false);
    // If not authenticated, request authorization before checkout
    if (!currentUser) {
      openAuthModal('order');
      return;
    }
    setIsCheckoutOpen(true);
  };

  // Handle successful order creation from Checkout
  const handleOrderPlaced = (order: Order) => {
    setIsCheckoutOpen(false);
    setPendingPaymentOrder(order);
  };

  // Active tracking order
  const activeOrder =
    selectedDocketOrder ||
    orders.find((o) => o.id === activeOrderId) ||
    orders[0] ||
    null;

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAF8] text-[#1C201D] selection:bg-[#DCFCE7] selection:text-[#0F2F1D]">
      {/* Global Responsive Header */}
      <Header onOpenCart={() => setIsCartOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 pb-20">
        {/* VIEW 1: BANK TRANSFER INSTRUCTIONS SCREEN */}
        {pendingPaymentOrder ? (
          <div className="pt-4">
            <PaymentView
              order={pendingPaymentOrder}
              onPaymentConfirmedByStudent={() => {
                setActiveOrderId(pendingPaymentOrder.id);
                setSelectedDocketOrder(pendingPaymentOrder);
                setPendingPaymentOrder(null);
                setActiveTab('track');
              }}
            />
          </div>
        ) : activeTab === 'landing' ? (
          /* VIEW 2: DEDICATED FULL-WIDTH LANDING PAGE */
          <LandingPage />
        ) : activeTab === 'track' ? (
          /* VIEW 3: LIVE ORDER TRACKING & DIGITAL DOCKET */
          <div className="pt-4 max-w-4xl mx-auto px-4 sm:px-6">
            {activeOrder ? (
              <OrderDocket
                order={activeOrder}
                onBackToStore={() => {
                  setSelectedDocketOrder(null);
                  setActiveTab('store');
                }}
              />
            ) : (
              <div className="max-w-md mx-auto p-8 text-center bg-white border border-[#E2E8DF] rounded-2xl m-4 shadow-xs">
                <div className="w-12 h-12 rounded-full bg-[#E8F0EA] text-[#0F2F1D] flex items-center justify-center mx-auto mb-3 font-bold text-lg">
                  !
                </div>
                <h3 className="font-bold text-base text-[#1C201D]">No Active Orders</h3>
                <p className="text-xs text-[#5A635D] mt-1.5 leading-relaxed">
                  You do not have an active crate delivery in progress. Select fresh crates from our catalogue to place an order.
                </p>
                <button
                  onClick={() => {
                    if (!currentUser) openAuthModal('order');
                    else setActiveTab('store');
                  }}
                  className="mt-5 px-5 py-2.5 bg-[#0F2F1D] text-white text-xs font-bold rounded-xl hover:bg-[#1B4329] transition-colors"
                >
                  Order Fresh Crates
                </button>
              </div>
            )}
          </div>
        ) : activeTab === 'history' ? (
          /* VIEW 4: CUSTOMER PROFILE & ORDER HISTORY */
          <div className="pt-4 max-w-4xl mx-auto px-4 sm:px-6">
            <OrderHistoryView
              onSelectOrder={(ord) => {
                setSelectedDocketOrder(ord);
                setActiveTab('track');
              }}
            />
          </div>
        ) : activeTab === 'nutrition' ? (
          /* VIEW 5: CUSTOMER GOALS & NUTRITION */
          <div className="pt-4 max-w-4xl mx-auto px-4 sm:px-6">
            <NutritionView />
          </div>
        ) : (
          /* VIEW 6: STOREFRONT & LIVE CATALOGUE */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {/* Active order alert ribbon if an order is open */}
            <ActiveOrderBanner />

            {/* Auth Gate Notification Banner if logged out */}
            {!currentUser && (
              <div className="bg-[#FEF3C7] border border-[#FDE68A] p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#92400E]">
                <div className="flex items-center gap-2.5">
                  <Lock className="w-4 h-4 text-[#B45309] shrink-0" />
                  <div>
                    <strong className="font-bold text-[#78350F]">Student Sign-In Required:</strong>{' '}
                    <span>Please sign in or set up your hostel room profile before adding crates to cart.</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <button
                    onClick={() => openAuthModal('order', 'signin')}
                    className="px-3.5 py-2 bg-white border border-[#FDE68A] hover:bg-[#FEF9C3] text-[#78350F] font-bold rounded-xl text-xs transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuthModal('order', 'register')}
                    className="px-4 py-2 bg-[#78350F] hover:bg-[#92400E] text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            )}

            {/* Catalogue Header */}
            <section className="bg-white border border-[#E2E8DF] rounded-2xl p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2F1D] tracking-tight">
                    Daily Fresh Farm Crates
                  </h1>
                  <p className="text-xs sm:text-sm text-[#5A635D] mt-1">
                    Select egg crates for same-day delivery straight to your campus hostel room or porter desk.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#15803D] font-bold bg-[#DCFCE7] px-3.5 py-1.5 rounded-full self-start sm:self-auto shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Harvested Today</span>
                </div>
              </div>

              {/* Category Quick Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pt-6 text-xs font-semibold">
                <button
                  onClick={() => setProductCategoryFilter('all')}
                  className={`px-4 py-2 rounded-xl transition-all shrink-0 ${
                    productCategoryFilter === 'all'
                      ? 'bg-[#0F2F1D] text-white shadow-xs'
                      : 'bg-[#F9FAF8] border border-[#E2E8DF] text-[#5A635D] hover:text-[#1C201D]'
                  }`}
                >
                  All Crates
                </button>
                <button
                  onClick={() => setProductCategoryFilter('standard')}
                  className={`px-4 py-2 rounded-xl transition-all shrink-0 ${
                    productCategoryFilter === 'standard'
                      ? 'bg-[#0F2F1D] text-white shadow-xs'
                      : 'bg-[#F9FAF8] border border-[#E2E8DF] text-[#5A635D] hover:text-[#1C201D]'
                  }`}
                >
                  Standard (30 Eggs)
                </button>
                <button
                  onClick={() => setProductCategoryFilter('bundle')}
                  className={`px-4 py-2 rounded-xl transition-all shrink-0 ${
                    productCategoryFilter === 'bundle'
                      ? 'bg-[#0F2F1D] text-white shadow-xs'
                      : 'bg-[#F9FAF8] border border-[#E2E8DF] text-[#5A635D] hover:text-[#1C201D]'
                  }`}
                >
                  Bulk Bundles (60 Eggs)
                </button>
              </div>
            </section>

            {/* Product Grid: 1 col on mobile, 2 col on tablet, 3-4 col on laptop/desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Interactive Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Room Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        fulfillmentMethod={fulfillmentMethod}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Student Authentication Modal */}
      <AuthModal />
    </div>
  );
}
