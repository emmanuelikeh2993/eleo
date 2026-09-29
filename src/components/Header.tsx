'use client';

import React from 'react';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import { ShoppingBag, User, ShieldCheck, Egg, Sparkles, LogIn, LogOut, Home } from 'lucide-react';

interface HeaderProps {
  onOpenCart: () => void;
}

export function Header({ onOpenCart }: HeaderProps) {
  const {
    cart,
    activeTab,
    setActiveTab,
    isAdmin,
    currentUser,
    logout,
    openAuthModal,
    orders,
  } = useStore();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const pendingOrdersCount = orders.filter(
    (o) => o.order_status !== 'completed' && o.order_status !== 'cancelled'
  ).length;

  return (
    <header className="sticky top-0 z-40 bg-[#0F2F1D] text-white border-b border-[#1B4329] px-4 py-3 shadow-xs">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Brand identity */}
        <button
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-2.5 text-left focus:outline-hidden"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 p-0.5 shrink-0 border border-white/20">
            <Image
              src="/logo.jpg"
              alt="ELEO Logo"
              width={32}
              height={32}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div>
            <span className="font-bold tracking-tight text-base leading-none block">ELEO</span>
            <span className="text-[11px] text-[#A5C4AF] font-medium tracking-wide">Campus Egg Hub</span>
          </div>
        </button>

        {/* Right navigation triggers */}
        <div className="flex items-center gap-2">
          {/* User state / Auth Trigger */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full text-xs text-[#D8E6DC]">
              <span className="font-medium truncate max-w-[90px]">{currentUser.name.split(' ')[0]}</span>
              <button
                onClick={logout}
                title="Sign out"
                className="text-white/60 hover:text-white p-0.5"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('order')}
              className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-[#D8E6DC] flex items-center gap-1 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Admin Switcher */}
          <button
            onClick={() => {
              if (isAdmin) {
                logout();
              } else {
                openAuthModal('admin');
              }
            }}
            title={isAdmin ? 'Exit Admin View' : 'Admin Operations Login'}
            className={`p-1.5 rounded-lg text-xs font-medium flex items-center transition-colors ${
              isAdmin
                ? 'bg-[#15803D] text-white'
                : 'text-[#D8E6DC] hover:bg-white/10'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
          </button>

          {/* Cart trigger */}
          {!isAdmin && (
            <button
              onClick={onOpenCart}
              className="relative p-1.5 rounded-full hover:bg-white/10 text-white transition-colors focus:ring-2 focus:ring-white/40"
              aria-label="View shopping cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#B45309] text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#0F2F1D]">
                  {totalCartCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Primary Sub-navigation Tabs */}
      {!isAdmin && (
        <nav className="max-w-md mx-auto flex items-center justify-between border-t border-[#1B4329]/80 mt-2.5 pt-2 text-xs font-medium text-[#C2D8C9]">
          <button
            onClick={() => setActiveTab('landing')}
            className={`flex items-center gap-1 pb-1 transition-colors ${
              activeTab === 'landing'
                ? 'text-white border-b-2 border-[#A5C4AF] font-semibold'
                : 'hover:text-white'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>

          <button
            onClick={() => {
              if (!currentUser) openAuthModal('order');
              else setActiveTab('store');
            }}
            className={`flex items-center gap-1 pb-1 transition-colors ${
              activeTab === 'store'
                ? 'text-white border-b-2 border-[#A5C4AF] font-semibold'
                : 'hover:text-white'
            }`}
          >
            <Egg className="w-3.5 h-3.5" />
            <span>Order Eggs</span>
          </button>

          <button
            onClick={() => {
              if (!currentUser) openAuthModal('orders');
              else setActiveTab('track');
            }}
            className={`flex items-center gap-1 pb-1 relative transition-colors ${
              activeTab === 'track'
                ? 'text-white border-b-2 border-[#A5C4AF] font-semibold'
                : 'hover:text-white'
            }`}
          >
            <span>Live Tracker</span>
            {pendingOrdersCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#B45309] animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('nutrition')}
            className={`flex items-center gap-1 pb-1 transition-colors ${
              activeTab === 'nutrition'
                ? 'text-white border-b-2 border-[#A5C4AF] font-semibold'
                : 'hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Goals</span>
          </button>

          <button
            onClick={() => {
              if (!currentUser) openAuthModal('profile');
              else setActiveTab('history');
            }}
            className={`flex items-center gap-1 pb-1 transition-colors ${
              activeTab === 'history'
                ? 'text-white border-b-2 border-[#A5C4AF] font-semibold'
                : 'hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile</span>
          </button>
        </nav>
      )}
    </header>
  );
}
