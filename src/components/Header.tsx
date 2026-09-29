'use client';

import React from 'react';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import {
  ShoppingBag,
  User,
  Egg,
  Package,
  Target,
  LogIn,
  LogOut,
  Home,
  CheckCircle2,
} from 'lucide-react';

interface HeaderProps {
  onOpenCart: () => void;
}

export function Header({ onOpenCart }: HeaderProps) {
  const {
    cart,
    activeTab,
    setActiveTab,
    currentUser,
    logout,
    openAuthModal,
    orders,
  } = useStore();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const pendingOrdersCount = orders.filter(
    (o) => o.order_status !== 'completed' && o.order_status !== 'cancelled'
  ).length;

  const handleNavClick = (tab: 'landing' | 'store' | 'track' | 'history' | 'nutrition') => {
    // If user is trying to access personal order history or active track without logging in
    if ((tab === 'track' || tab === 'history') && !currentUser) {
      openAuthModal(tab === 'track' ? 'orders' : 'profile');
      return;
    }
    setActiveTab(tab);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0F2F1D] text-white border-b border-[#1B4329] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Brand Identity */}
          <button
            onClick={() => {
              if (currentUser) {
                setActiveTab('store');
              } else {
                setActiveTab('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="flex items-center gap-3 text-left focus:outline-hidden group"
          >
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-white/10 p-0.5 shrink-0 border border-white/20 group-hover:border-white/40 transition-colors">
              <Image
                src="/logo.jpg"
                alt="ELEO Logo"
                width={36}
                height={36}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-lg leading-none block">
                  ELEO
                </span>
                <span className="text-[10px] font-bold bg-[#15803D] text-[#DCFCE7] px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                  Campus
                </span>
              </div>
              <span className="text-[11px] text-[#A5C4AF] font-medium tracking-wide">
                Fresh Egg Hub
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {!currentUser ? (
              /* GUEST NAVIGATION: Home, What We Do */
              <>
                <button
                  onClick={() => {
                    setActiveTab('landing');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'landing'
                      ? 'bg-white/15 text-white shadow-xs'
                      : 'text-[#C2D8C9] hover:text-white hover:bg-white/5'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    setActiveTab('landing');
                    setTimeout(() => {
                      document.getElementById('what-we-do')?.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#C2D8C9] hover:text-white hover:bg-white/5 transition-all"
                >
                  What We Do
                </button>
              </>
            ) : (
              /* AUTHENTICATED STUDENT NAVIGATION: Order Eggs, Track Docket, My Orders, Goals */
              <>
                <button
                  onClick={() => handleNavClick('store')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeTab === 'store'
                      ? 'bg-white/15 text-white shadow-xs'
                      : 'text-[#C2D8C9] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Egg className="w-3.5 h-3.5 text-[#86EFAC]" />
                  <span>Order Eggs</span>
                </button>
                <button
                  onClick={() => handleNavClick('track')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeTab === 'track'
                      ? 'bg-white/15 text-white shadow-xs'
                      : 'text-[#C2D8C9] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Track Docket</span>
                  {pendingOrdersCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
                  )}
                </button>
                <button
                  onClick={() => handleNavClick('history')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeTab === 'history'
                      ? 'bg-white/15 text-white shadow-xs'
                      : 'text-[#C2D8C9] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>My Orders</span>
                </button>
                <button
                  onClick={() => handleNavClick('nutrition')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeTab === 'nutrition'
                      ? 'bg-white/15 text-white shadow-xs'
                      : 'text-[#C2D8C9] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Protein Goals</span>
                </button>
              </>
            )}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <>
                {/* User Auth Badge */}
                <div className="flex items-center gap-2 bg-white/10 pl-2.5 pr-1.5 py-1 rounded-full border border-white/15">
                  <div className="text-left text-xs leading-tight">
                    <span className="font-bold text-white block truncate max-w-[110px] sm:max-w-[140px]">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-[#A5C4AF] block truncate max-w-[110px] sm:max-w-[140px]">
                      {currentUser.hostel ? `${currentUser.hostel}, Rm ${currentUser.room}` : 'Verified Student'}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    title="Sign out of student account"
                    className="px-2 py-1 rounded-full text-[11px] font-semibold bg-[#DC2626]/80 hover:bg-[#DC2626] text-white flex items-center gap-1 transition-colors"
                  >
                    <LogOut className="w-3 h-3" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </button>
                </div>

                {/* Cart Trigger (for authenticated users) */}
                <button
                  onClick={onOpenCart}
                  className="relative p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all focus:ring-2 focus:ring-white/40 flex items-center gap-2 border border-white/15"
                  aria-label="View shopping cart"
                >
                  <ShoppingBag className="w-4 h-4 text-[#86EFAC]" />
                  <span className="hidden sm:inline text-xs font-bold">Cart</span>
                  {totalCartCount > 0 && (
                    <span className="bg-[#B45309] text-white font-extrabold text-[11px] min-w-5 h-5 px-1 rounded-full flex items-center justify-center border border-[#0F2F1D]">
                      {totalCartCount}
                    </span>
                  )}
                </button>
              </>
            ) : (
              /* GUEST ACTION BAR: Sign In & Register */
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('order', 'signin')}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-colors border border-white/20"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#86EFAC]" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => openAuthModal('order', 'register')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#15803D] hover:bg-[#166534] text-white flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <span>Sign Up</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row (visible on mobile screens only) */}
        <nav className="md:hidden flex items-center justify-start border-t border-[#1B4329] mt-3 pt-2 text-xs font-medium text-[#C2D8C9] overflow-x-auto gap-4">
          {!currentUser ? (
            /* GUEST MOBILE NAVIGATION: Clean Home & What We Do */
            <>
              <button
                onClick={() => {
                  setActiveTab('landing');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex items-center gap-1 px-3 py-1 rounded-md shrink-0 transition-colors ${
                  activeTab === 'landing'
                    ? 'bg-white/15 text-white font-bold'
                    : 'text-[#C2D8C9] hover:text-white'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('landing');
                  setTimeout(() => {
                    document.getElementById('what-we-do')?.scrollIntoView({ behavior: 'smooth' });
                  }, 50);
                }}
                className="flex items-center gap-1 px-3 py-1 rounded-md shrink-0 transition-colors text-[#C2D8C9] hover:text-white"
              >
                <span>What We Do</span>
              </button>
            </>
          ) : (
            /* AUTHENTICATED MOBILE NAVIGATION */
            <>
              <button
                onClick={() => handleNavClick('store')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md shrink-0 transition-colors ${
                  activeTab === 'store'
                    ? 'bg-white/15 text-white font-bold'
                    : 'text-[#C2D8C9] hover:text-white'
                }`}
              >
                <Egg className="w-3.5 h-3.5 text-[#86EFAC]" />
                <span>Order</span>
              </button>
              <button
                onClick={() => handleNavClick('track')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md shrink-0 transition-colors ${
                  activeTab === 'track'
                    ? 'bg-white/15 text-white font-bold'
                    : 'text-[#C2D8C9] hover:text-white'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Track</span>
              </button>
              <button
                onClick={() => handleNavClick('history')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md shrink-0 transition-colors ${
                  activeTab === 'history'
                    ? 'bg-white/15 text-white font-bold'
                    : 'text-[#C2D8C9] hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>My Orders</span>
              </button>
              <button
                onClick={() => handleNavClick('nutrition')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md shrink-0 transition-colors ${
                  activeTab === 'nutrition'
                    ? 'bg-white/15 text-white font-bold'
                    : 'text-[#C2D8C9] hover:text-white'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span>Goals</span>
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
