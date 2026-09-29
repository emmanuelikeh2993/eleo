'use client';

import React from 'react';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import {
  Egg,
  Package,
  User,
  Truck,
  ShieldCheck,
  Sparkles,
  Lock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export function LandingPage() {
  const { currentUser, setActiveTab, openAuthModal, orders } = useStore();

  const handleOrderEggsClick = () => {
    if (!currentUser) {
      openAuthModal('order');
    } else {
      setActiveTab('store');
    }
  };

  const handleMyOrdersClick = () => {
    if (!currentUser) {
      openAuthModal('orders');
    } else {
      setActiveTab('track');
    }
  };

  const handleMyProfileClick = () => {
    if (!currentUser) {
      openAuthModal('profile');
    } else {
      setActiveTab('history');
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-[calc(100vh-60px)] flex flex-col justify-between px-4 py-6">
      {/* Top Hero Section */}
      <div className="space-y-6">
        {/* Farm Provenance Pill */}
        <div className="inline-flex items-center gap-2 bg-[#F0F5F1] text-[#0F2F1D] px-3 py-1 rounded-full text-xs font-semibold border border-[#D5E4D8]">
          <span className="w-2 h-2 rounded-full bg-[#15803D] animate-ping" />
          <span>Campus Farm Direct · Same-Day Delivery</span>
        </div>

        {/* Hero Title & Emblem */}
        <div className="space-y-3">
          <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md border-2 border-[#0F2F1D]/10">
            <Image
              src="/logo.jpg"
              alt="ELEO Farm & Foods"
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-[#5A635D] block">
              ELEO Farm & Foods
            </span>
            <h1 className="text-3xl font-extrabold text-[#0F2F1D] tracking-tight leading-tight mt-1">
              Fresh Eggs.<br />Simple Ordering.
            </h1>
          </div>

          <p className="text-xs text-[#5A635D] leading-relaxed max-w-sm">
            Freshly harvested farm egg crates dispatched straight to your campus hostel room or hall porter lodge. Honest crate pricing, no gateway markups.
          </p>
        </div>

        {/* User Status Bar if logged in */}
        {currentUser ? (
          <div className="bg-[#E8F0EA] border border-[#CBD5C8] p-3.5 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="text-[11px] text-[#5A635D] block">Signed in as:</span>
              <strong className="font-bold text-[#0F2F1D] text-sm">{currentUser.name}</strong>
              <span className="text-[11px] text-[#5A635D] block">
                {currentUser.hostel}, Room {currentUser.room}
              </span>
            </div>
            <span className="text-[10px] font-bold bg-[#15803D] text-white px-2 py-0.5 rounded-full">
              Verified Student
            </span>
          </div>
        ) : (
          <div className="bg-white border border-[#E2E8DF] p-3 rounded-xl flex items-center justify-between text-xs shadow-2xs">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#B45309]" />
              <span className="text-[#5A635D]">Fast Student Authorization</span>
            </div>
            <button
              onClick={() => openAuthModal('order')}
              className="text-xs font-bold text-[#0F2F1D] hover:underline"
            >
              Sign In / Register
            </button>
          </div>
        )}

        {/* 3 Main Action Triggers (From PDF Section 2 Specification) */}
        <div className="space-y-2.5 pt-1">
          {/* Primary Action: Order Eggs */}
          <button
            onClick={handleOrderEggsClick}
            className="w-full h-12 bg-[#0F2F1D] hover:bg-[#1B4329] text-white font-bold text-sm rounded-xl flex items-center justify-between px-4 transition-all shadow-md active:scale-98"
          >
            <div className="flex items-center gap-2.5">
              <Egg className="w-5 h-5 text-[#86EFAC]" />
              <span>Order Eggs</span>
            </div>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Secondary Action: My Orders */}
          <button
            onClick={handleMyOrdersClick}
            className="w-full h-12 bg-white hover:bg-[#F3F6F2] border border-[#D5DDD2] text-[#1C201D] font-bold text-sm rounded-xl flex items-center justify-between px-4 transition-all shadow-2xs active:scale-98"
          >
            <div className="flex items-center gap-2.5">
              <Package className="w-5 h-5 text-[#0F2F1D]" />
              <span>My Orders & Tracking</span>
            </div>
            {orders.length > 0 && (
              <span className="text-xs bg-[#E8F0EA] text-[#0F2F1D] px-2 py-0.5 rounded-full font-bold">
                {orders.length}
              </span>
            )}
          </button>

          {/* Tertiary Action: My Profile */}
          <button
            onClick={handleMyProfileClick}
            className="w-full h-12 bg-white hover:bg-[#F3F6F2] border border-[#D5DDD2] text-[#1C201D] font-bold text-sm rounded-xl flex items-center justify-between px-4 transition-all shadow-2xs active:scale-98"
          >
            <div className="flex items-center gap-2.5">
              <User className="w-5 h-5 text-[#0F2F1D]" />
              <span>My Profile & Address</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#9CA3AF]" />
          </button>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
          <div className="bg-white p-3 rounded-xl border border-[#E2E8DF]">
            <Truck className="w-4 h-4 text-[#0F2F1D] mx-auto mb-1.5" />
            <strong className="block text-[11px] font-bold text-[#1C201D]">Hostel Direct</strong>
            <span className="text-[10px] text-[#5A635D]">Delivered to your room</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-[#E2E8DF]">
            <Sparkles className="w-4 h-4 text-[#B45309] mx-auto mb-1.5" />
            <strong className="block text-[11px] font-bold text-[#1C201D]">Daily Fresh</strong>
            <span className="text-[10px] text-[#5A635D]">Laid within 24h</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-[#E2E8DF]">
            <ShieldCheck className="w-4 h-4 text-[#15803D] mx-auto mb-1.5" />
            <strong className="block text-[11px] font-bold text-[#1C201D]">Safe Transfer</strong>
            <span className="text-[10px] text-[#5A635D]">Manual verification</span>
          </div>
        </div>
      </div>

      {/* Footer / Admin Portal Trigger */}
      <div className="pt-8 border-t border-[#E2E8DF] mt-6 text-center text-xs text-[#5A635D] space-y-2">
        <div className="flex items-center justify-center gap-1 text-[11px]">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
          <span>ELEO Farm & Foods · Campus Egg Commerce</span>
        </div>

        <div>
          <button
            onClick={() => openAuthModal('admin')}
            className="text-[11px] text-[#5A635D] hover:text-[#0F2F1D] font-medium underline"
          >
            Farm Operations Staff Portal
          </button>
        </div>
      </div>
    </div>
  );
}
