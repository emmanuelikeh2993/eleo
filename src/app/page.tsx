'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Header } from '@/components/Header';
import { PwaInstallBanner } from '@/components/PwaInstallBanner';
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
import { AdminDashboard } from '@/components/AdminDashboard';
import { FulfillmentMethod, Order } from '@/types';
import { ShoppingBag, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const {
    products,
    cart,
    orders,
    activeOrderId,
    setActiveOrderId,
    activeTab,
    setActiveTab,
    isAdmin,
    currentUser,
    openAuthModal,
  } = useStore();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [fulfillmentMethod, setFulfillmentMethod] = useState<FulfillmentMethod>('delivery');
  const [pendingPaymentOrder, setPendingPaymentOrder] = useState<Order | null>(null);
  const [selectedDocketOrder, setSelectedDocketOrder] = useState<Order | null>(null);
  const [productCategoryFilter, setProductCategoryFilter] = useState<'all' | 'standard' | 'jumbo' | 'bundle'>('all');

  // Total cart calculation
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartAmount = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const formatNgn = (amt: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amt);

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
      {/* PWA Install Notification */}
      <PwaInstallBanner />

      {/* Global Header */}
      <Header onOpenCart={() => setIsCartOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 pb-24">
        {/* VIEW 1: ADMIN OPERATIONS DASHBOARD */}
        {isAdmin ? (
          <AdminDashboard />
        ) : pendingPaymentOrder ? (
          /* VIEW 2: BANK TRANSFER INSTRUCTIONS SCREEN */
          <div className="pt-2">
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
          /* VIEW 3: DEDICATED LANDING PAGE */
          <LandingPage />
        ) : activeTab === 'track' ? (
          /* VIEW 4: LIVE ORDER TRACKING & DIGITAL DOCKET */
          <div className="pt-2">
            {activeOrder ? (
              <OrderDocket
                order={activeOrder}
                onBackToStore={() => {
                  setSelectedDocketOrder(null);
                  setActiveTab('store');
                }}
              />
            ) : (
              <div className="max-w-md mx-auto p-8 text-center bg-white border border-[#E2E8DF] rounded-xl m-4">
                <div className="w-12 h-12 rounded-full bg-[#E8F0EA] text-[#0F2F1D] flex items-center justify-center mx-auto mb-3 font-bold">
                  !
                </div>
                <h3 className="font-bold text-sm text-[#1C201D]">No Active Orders</h3>
                <p className="text-xs text-[#5A635D] mt-1">
                  You have not placed an order yet. Choose a fresh crate from our campus catalogue to begin.
                </p>
                <button
                  onClick={() => {
                    if (!currentUser) openAuthModal('order');
                    else setActiveTab('store');
                  }}
                  className="mt-4 px-4 py-2 bg-[#0F2F1D] text-white text-xs font-semibold rounded-md"
                >
                  Order Eggs
                </button>
              </div>
            )}
          </div>
        ) : activeTab === 'history' ? (
          /* VIEW 5: CUSTOMER PROFILE & ORDER HISTORY */
          <div className="pt-2">
            <OrderHistoryView
              onSelectOrder={(ord) => {
                setSelectedDocketOrder(ord);
                setActiveTab('track');
              }}
            />
          </div>
        ) : activeTab === 'nutrition' ? (
          /* VIEW 6: CUSTOMER GOALS & NUTRITION */
          <div className="pt-2">
            <NutritionView />
          </div>
        ) : (
          /* VIEW 7: STOREFRONT & CATALOGUE */
          <>
            {/* Active order alert ribbon */}
            <ActiveOrderBanner />

            {/* Catalogue Header */}
            <section className="bg-white border-b border-[#E2E8DF] px-4 py-5">
              <div className="max-w-md mx-auto">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-extrabold text-[#0F2F1D] tracking-tight leading-tight">
                      Farm Egg Catalogue
                    </h1>
                    <p className="text-xs text-[#5A635D] mt-0.5">
                      Select crates for same-day hostel room delivery
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-[#15803D] font-semibold bg-[#DCFCE7] px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>In Stock Today</span>
                  </div>
                </div>

                {/* Category Quick Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pt-3 text-xs">
                  <button
                    onClick={() => setProductCategoryFilter('all')}
                    className={`px-3 py-1 rounded-full font-medium transition-colors shrink-0 ${
                      productCategoryFilter === 'all'
                        ? 'bg-[#0F2F1D] text-white'
                        : 'bg-[#F9FAF8] border border-[#E2E8DF] text-[#5A635D]'
                    }`}
                  >
                    All Crates
                  </button>
                  <button
                    onClick={() => setProductCategoryFilter('standard')}
                    className={`px-3 py-1 rounded-full font-medium transition-colors shrink-0 ${
                      productCategoryFilter === 'standard'
                        ? 'bg-[#0F2F1D] text-white'
                        : 'bg-[#F9FAF8] border border-[#E2E8DF] text-[#5A635D]'
                    }`}
                  >
                    Standard (30 & 15)
                  </button>
                  <button
                    onClick={() => setProductCategoryFilter('jumbo')}
                    className={`px-3 py-1 rounded-full font-medium transition-colors shrink-0 ${
                      productCategoryFilter === 'jumbo'
                        ? 'bg-[#0F2F1D] text-white'
                        : 'bg-[#F9FAF8] border border-[#E2E8DF] text-[#5A635D]'
                    }`}
                  >
                    Jumbo Grade
                  </button>
                  <button
                    onClick={() => setProductCategoryFilter('bundle')}
                    className={`px-3 py-1 rounded-full font-medium transition-colors shrink-0 ${
                      productCategoryFilter === 'bundle'
                        ? 'bg-[#0F2F1D] text-white'
                        : 'bg-[#F9FAF8] border border-[#E2E8DF] text-[#5A635D]'
                    }`}
                  >
                    Athlete Bundles
                  </button>
                </div>
              </div>
            </section>

            {/* Catalogue Section */}
            <section className="max-w-md mx-auto px-4 py-5 space-y-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}

              {/* Campus Trust Note */}
              <div className="bg-[#F0F5F1] border border-[#D5E4D8] rounded-xl p-4 text-xs text-[#0F2F1D] space-y-1.5 mt-6">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#15803D]" />
                  <span>Freshness & Shell Integrity Guarantee</span>
                </div>
                <p className="text-[11px] text-[#425046] leading-relaxed">
                  Every crate is collected within 24 hours of laying, checked for cracked shells, and transported in rigid cartons directly to campus hostel blocks. If any egg is broken during hostel delivery, we replace it instantly.
                </p>
              </div>
            </section>
          </>
        )}
      </main>

      {/* PERSISTENT STICKY BOTTOM CART TRAY */}
      {!isAdmin && !pendingPaymentOrder && activeTab !== 'landing' && totalCartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E2E8DF] p-3 shadow-lg">
          <div className="max-w-md mx-auto flex items-center justify-between gap-3">
            <div>
              <span className="text-[11px] text-[#5A635D] block">
                {totalCartCount} {totalCartCount === 1 ? 'crate' : 'crates'} selected
              </span>
              <strong className="text-base font-extrabold text-[#0F2F1D]">
                {formatNgn(totalCartAmount)}
              </strong>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="h-11 px-5 bg-[#0F2F1D] hover:bg-[#1B4329] text-white font-bold text-xs rounded-lg flex items-center gap-2 transition-all active:scale-95 shadow-xs"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Review Order</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        fulfillmentMethod={fulfillmentMethod}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Authorization Modal */}
      <AuthModal />
    </div>
  );
}
