'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import { ProductCard } from '@/components/ProductCard';
import gsap from 'gsap';
import {
  Egg,
  Package,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Phone,
  MessageCircle,
  Building2,
  Clock,
  Check,
  ChevronLeft,
  ChevronRight,
  Star,
  Flame,
  CreditCard,
  MapPin,
  RefreshCw,
  Award,
} from 'lucide-react';

export function LandingPage() {
  const { products, currentUser, setActiveTab, openAuthModal, orders } = useStore();
  const [selectedHeroPack, setSelectedHeroPack] = useState<number>(30);
  const [isAnimatingCrate, setIsAnimatingCrate] = useState(false);

  // Carousel sliding state for products
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Student reviews sliding carousel state
  const [reviewIndex, setReviewIndex] = useState(0);

  // GSAP animation container refs
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const leftSidebarRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);

  const reviews = [
    {
      id: 1,
      name: 'Tunde Adebayo',
      hall: 'Hall 2, Room 14',
      faculty: 'Biochemistry (300L)',
      text: 'The runner called me as soon as he reached the porter desk. Inspected all 30 eggs — zero cracks. Way better than walking to the campus gate under the blazing afternoon sun.',
      rating: 5,
      crate: 'Standard Crate of 30',
    },
    {
      id: 2,
      name: 'Chidinma Okeke',
      hall: 'Postgraduate Hall',
      faculty: 'M.Sc Public Health',
      text: 'Sent money directly from my Access Bank app to Olamide. Got confirmation in less than 2 minutes and had fresh eggs for evening meal prep right at my door.',
      rating: 5,
      crate: 'Double Crate (60 Eggs)',
    },
    {
      id: 3,
      name: 'Emmanuel Oladipo',
      hall: 'Hall 1, Room 28',
      faculty: 'Mechanical Eng.',
      text: 'Yolks are deep golden, not watery like off-campus market stuff. The 6-pack carton fits right inside our room mini-fridge for quick breakfast boiling.',
      rating: 5,
      crate: 'Half Crate (15 Eggs)',
    },
  ];

  // GSAP entrance animations with cleanup
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (leftSidebarRef.current) {
        gsap.from(leftSidebarRef.current, {
          opacity: 0,
          x: -24,
          duration: 0.8,
          ease: 'power3.out',
        });
      }
      if (rightContentRef.current) {
        gsap.from('.clay-pillar-card', {
          opacity: 0,
          y: 28,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
        });
      }
    }, pageContainerRef);

    return () => ctx.revert();
  }, []);

  // Auto-advance reviews carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setReviewIndex((prev) => (prev + 1) % reviews.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [reviews.length]);

  const heroCrate =
    products.find((p) => p.pack_size === selectedHeroPack) ||
    products[0] || {
      id: 'default-30',
      name: 'Standard Crate of 30 Fresh Eggs',
      price: 4200,
      pack_size: 30,
      description: 'Daily farm-collected brown eggs with thick sturdy shells.',
      available: true,
      category: 'crate_30',
    };

  const handlePackSwitch = (size: number) => {
    setIsAnimatingCrate(true);
    setSelectedHeroPack(size);
    setTimeout(() => setIsAnimatingCrate(false), 240);
  };

  const formatNaira = (amt: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amt);

  const handleOrderEggsClick = () => {
    if (!currentUser) {
      openAuthModal('order', 'register');
    } else {
      setActiveTab('store');
    }
  };

  const handleMyOrdersClick = () => {
    if (!currentUser) {
      openAuthModal('orders', 'signin');
    } else {
      setActiveTab('track');
    }
  };

  // Carousel sliding helpers
  const handlePrevSlide = () => {
    setCarouselIndex((prev) => Math.max(0, prev - 1));
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const handleNextSlide = () => {
    setCarouselIndex((prev) => Math.min(products.length - 1, prev + 1));
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  // Campus halls serviced
  const campusHalls = [
    { name: 'Hall 1', status: 'Runner En Route' },
    { name: 'Hall 2', status: 'Active Dispatch' },
    { name: 'Hall 3', status: 'Active Dispatch' },
    { name: 'Moremi Hall', status: 'Fast Doorstep' },
    { name: 'Fagunwa Hall', status: 'Direct Porter' },
    { name: 'Jaja Hall', status: 'Active Dispatch' },
    { name: 'Kofo Hall', status: 'Fast Doorstep' },
    { name: 'PG Quarters', status: 'Active Dispatch' },
  ];

  return (
    <div
      ref={pageContainerRef}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 relative"
    >
      {/* 
        ========================================================================
        TYPOLOGY B: THE SPLIT SCREEN (STICKY SIDEBAR)
        - Desktop (lg): Left 40% is sticky hero/intake; Right 60% is scrollable
        - Mobile/Tablet: Stacked seamless fluid flow with tactile clay cards
        ========================================================================
      */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        
        {/* ==================================================================== */}
        {/* LEFT COLUMN (40%): STICKY BRAND, THESIS & PHYSICAL INTAKE DOCK        */}
        {/* ==================================================================== */}
        <aside
          ref={leftSidebarRef}
          className="w-full lg:w-[42%] lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)] lg:overflow-y-auto flex flex-col justify-between p-6 sm:p-8 bg-[#0F2F1D] text-white rounded-3xl clay-card-dark border border-[#1B4329] space-y-6"
        >
          {/* Top Brand & Live Harvest Status */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#1B4329] border border-[#2B593C] text-[#DCFCE7] px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-[#86EFAC] animate-ping" />
              <span>Campus Direct · 6:30 AM Daily Harvest</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl xl:text-5xl font-extrabold tracking-tight leading-[1.12]">
              The ultimate <span className="text-[#86EFAC] italic font-normal">student nutrition</span> & campus egg dispatch.
            </h1>

            <p className="text-xs sm:text-sm text-[#C2D8C9] leading-relaxed">
              Collected farm-fresh daily from free-range layer pens. Delivered directly to your campus hostel door with 
              zero cracked eggs and zero gateway transaction fees.
            </p>
          </div>

          {/* Student Profile / Instant Auth Intake Card */}
          <div className="bg-[#153A24] border border-[#255235] p-5 rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Lock className="w-4 h-4 text-[#86EFAC]" />
                <span>Student Room Profile</span>
              </div>
              <span className="text-[10px] font-semibold text-[#86EFAC] bg-[#0F2F1D] px-2 py-0.5 rounded-md">
                15-Second Setup
              </span>
            </div>

            <p className="text-[11px] text-[#A5C4AF] leading-relaxed">
              {currentUser ? (
                <>
                  Logged in as <strong className="text-white">{currentUser.name}</strong> ({currentUser.hostel || 'Hostel'}, Room {currentUser.room || '—'})
                </>
              ) : (
                'Save your hostel room and phone number so future crate orders take under 15 seconds.'
              )}
            </p>

            {currentUser ? (
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setActiveTab('store')}
                  className="tactile-btn flex-1 py-2.5 bg-[#86EFAC] hover:bg-[#6EE7B7] text-[#0F2F1D] font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  <Egg className="w-4 h-4" />
                  <span>Order Now</span>
                </button>
                <button
                  onClick={() => setActiveTab('track')}
                  className="tactile-btn flex-1 py-2.5 bg-[#1B4329] hover:bg-[#255235] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-[#2B593C]"
                >
                  <Package className="w-3.5 h-3.5 text-[#86EFAC]" />
                  <span>My Dockets</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 pt-1">
                <button
                  onClick={() => openAuthModal('order', 'signin')}
                  className="tactile-btn flex-1 py-2.5 bg-[#1B4329] hover:bg-[#255235] text-white font-bold rounded-xl text-xs border border-[#2B593C] text-center"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal('order', 'register')}
                  className="tactile-btn flex-1 py-2.5 bg-[#86EFAC] hover:bg-[#6EE7B7] text-[#0F2F1D] font-extrabold rounded-xl text-xs text-center shadow-md"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Primary Action Buttons & Trust Micro-Grid */}
          <div className="space-y-4 pt-1">
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5">
              <button
                onClick={handleOrderEggsClick}
                className="tactile-btn w-full h-12 bg-[#86EFAC] hover:bg-[#6EE7B7] text-[#0F2F1D] font-black text-sm rounded-2xl flex items-center justify-center gap-2.5 shadow-lg"
              >
                <Egg className="w-4 h-4 fill-current" />
                <span>Browse Fresh Crates</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleMyOrdersClick}
                className="tactile-btn w-full h-11 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2"
              >
                <Package className="w-4 h-4 text-[#86EFAC]" />
                <span>Track Active Dockets</span>
              </button>
            </div>

            {/* Quick Guarantees Footnote */}
            <div className="pt-3 border-t border-[#1B4329] grid grid-cols-2 gap-2 text-[11px] text-[#A5C4AF]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#86EFAC] shrink-0" />
                <span>Zero Broken Guarantee</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#86EFAC] shrink-0" />
                <span>Access Bank Verified</span>
              </div>
            </div>
          </div>
        </aside>

        {/* ==================================================================== */}
        {/* RIGHT COLUMN (60%): INDEPENDENTLY SCROLLABLE CORE PILLARS & CATALOGUE */}
        {/* ==================================================================== */}
        <main ref={rightContentRef} className="w-full lg:w-[58%] space-y-6 sm:space-y-8">
          
          {/* TICKER: LIVE DISPATCH MARQUEE */}
          <div className="bg-[#0F2F1D] text-white rounded-2xl overflow-hidden py-2.5 px-4 shadow-sm border border-[#1B4329] flex items-center gap-3 clay-card-dark">
            <div className="flex items-center gap-1.5 shrink-0 bg-[#15803D] text-[#DCFCE7] text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>Live Drops</span>
            </div>
            <div className="overflow-hidden whitespace-nowrap flex-1 relative">
              <div className="animate-ticker text-xs font-medium text-[#C2D8C9] gap-8">
                <span className="inline-flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-[#86EFAC]" />
                  Runner dropped Crate of 30 at <strong>Hall 2, Room 14</strong>
                </span>
                <span className="text-[#86EFAC] font-bold">·</span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#86EFAC]" />
                  Access Bank verified for <strong>EGG-000108</strong> (₦4,200)
                </span>
                <span className="text-[#86EFAC] font-bold">·</span>
                <span className="inline-flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
                  Afternoon Hall Dispatch departs in <strong>20 minutes</strong>
                </span>
                <span className="text-[#86EFAC] font-bold">·</span>
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#86EFAC]" />
                  <strong>148 crates</strong> safely delivered today with zero cracks
                </span>
                <span className="text-[#86EFAC] font-bold">·</span>
                <span className="inline-flex items-center gap-2">
                  <Egg className="w-3.5 h-3.5 text-[#86EFAC]" />
                  6:30 AM fresh collection sorted into partitioned crates
                </span>
              </div>
            </div>
          </div>

          {/* PILLAR 1: INTERACTIVE CRATE PREVIEWER (ORGANIC CLAY) */}
          <section className="clay-pillar-card clay-card p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8DF] pb-4">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#15803D] bg-[#E8F0EA] px-2.5 py-1 rounded-full">
                  Pillar I · Farm-Fresh Daily Harvest
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0F2F1D] tracking-tight mt-1">
                  Daily Crate Pack Inspection
                </h2>
              </div>
              <span className="text-xs text-[#5A635D] font-medium flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-[#B45309]" /> High Student Demand
              </span>
            </div>

            {/* Pack Size Selector Tabs */}
            <div>
              <label className="text-xs font-bold text-[#1C201D] block mb-2">
                Tap pack size to inspect tray & nutrition:
              </label>
              <div className="grid grid-cols-4 gap-2 bg-[#F9FAF8] p-1.5 rounded-2xl border border-[#E2E8DF]">
                {[30, 15, 60, 6].map((size) => (
                  <button
                    key={size}
                    onClick={() => handlePackSwitch(size)}
                    className={`tactile-btn py-2 text-xs font-bold rounded-xl transition-all ${
                      selectedHeroPack === size
                        ? 'bg-[#0F2F1D] text-white shadow-md'
                        : 'text-[#5A635D] hover:text-[#1C201D] hover:bg-[#EEF2EC]'
                    }`}
                  >
                    {size === 30
                      ? '30 Pcs'
                      : size === 15
                      ? '15 Pcs'
                      : size === 60
                      ? '60 Double'
                      : '6 Mini'}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Crate Card */}
            <div
              className={`bg-[#F4F7F4] p-5 sm:p-6 rounded-2xl border border-[#D5E4D8] space-y-4 transition-all duration-300 ${
                isAnimatingCrate ? 'opacity-50 scale-98' : 'opacity-100 scale-100'
              }`}
            >
              <div className="flex items-baseline justify-between gap-3">
                <div>
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-[#0F2F1D]">
                    {heroCrate.name}
                  </h3>
                  <span className="text-xs text-[#5A635D] block mt-0.5">
                    Pack of {heroCrate.pack_size} sturdy brown eggs · Thick protective shells
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-2xl sm:text-3xl font-black text-[#0F2F1D] block">
                    {formatNaira(heroCrate.price)}
                  </span>
                  <span className="text-[10px] text-[#15803D] font-bold uppercase tracking-wider">
                    Direct Farm Price
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#5A635D] leading-relaxed">
                {heroCrate.description}
              </p>

              {/* Physical tray quality visualizer */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-[#E2E8DF] flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#15803D] shrink-0" />
                  <div>
                    <strong className="block text-[#0F2F1D] font-bold">Reinforced Partition</strong>
                    <span className="text-[11px] text-[#5A635D]">Prevents egg knocking during runner transit</span>
                  </div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#E2E8DF] flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-[#B45309] shrink-0" />
                  <div>
                    <strong className="block text-[#0F2F1D] font-bold">Deep Golden Yolks</strong>
                    <span className="text-[11px] text-[#5A635D]">6g organic bioavailable protein per egg</span>
                  </div>
                </div>
              </div>

              {/* Order Button for this crate */}
              <button
                onClick={handleOrderEggsClick}
                className="tactile-btn w-full h-12 bg-[#0F2F1D] hover:bg-[#1B4329] text-white font-extrabold text-xs rounded-xl flex items-center justify-between px-5 shadow-md"
              >
                <div className="flex items-center gap-2">
                  <Egg className="w-4 h-4 text-[#86EFAC]" />
                  <span>{currentUser ? 'Add to Hostel Cart' : 'Sign In to Order Crate'}</span>
                </div>
                <span className="font-bold text-[#86EFAC]">{formatNaira(heroCrate.price)}</span>
              </button>
            </div>
          </section>

          {/* PILLAR 2: SAME-DAY HOSTEL DOORSTEP DROP (CAMPUS COVERAGE) */}
          <section className="clay-pillar-card clay-card p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8DF] pb-4">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#15803D] bg-[#E8F0EA] px-2.5 py-1 rounded-full">
                  Pillar II · Doorstep Dispatch
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0F2F1D] tracking-tight mt-1">
                  Active Campus Hostel Coverage
                </h2>
              </div>
              <span className="text-xs text-[#15803D] font-bold bg-[#DCFCE7] px-2.5 py-0.5 rounded-full flex items-center gap-1.5 self-start sm:self-auto">
                <span className="w-2 h-2 rounded-full bg-[#15803D] animate-ping" />
                Runners on Duty
              </span>
            </div>

            <p className="text-xs text-[#5A635D] leading-relaxed">
              No need to leave your hostel or walk out to the main gate under the sun. Our verified campus runners deliver crates 
              straight to your room door or hall security porter.
            </p>

            {/* Hall Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {campusHalls.map((hall) => (
                <div
                  key={hall.name}
                  className="bg-[#F9FAF8] border border-[#E2E8DF] p-3 rounded-xl space-y-1 hover:border-[#CBD5C8] transition-colors"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F2F1D]">
                    <Building2 className="w-3.5 h-3.5 text-[#15803D]" />
                    <span>{hall.name}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-[#15803D] block">
                    {hall.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Zero Broken Guarantee Box */}
            <div className="bg-[#FEF3C7] border border-[#FDE68A] p-4 rounded-2xl flex items-start gap-3 text-xs text-[#92400E]">
              <ShieldCheck className="w-5 h-5 text-[#B45309] shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-[#78350F] block">Zero Broken Egg Guarantee</strong>
                <span className="leading-relaxed block mt-0.5">
                  Inspect your crate immediately upon runner handover. If any egg is cracked during transit, 
                  our runner replaces it instantly from their backup inspection crate.
                </span>
              </div>
            </div>
          </section>

          {/* PILLAR 3: VERIFIED ACCESS BANK TRANSFER (ZERO GATEWAY FEES) */}
          <section className="clay-pillar-card clay-card p-6 sm:p-8 space-y-6">
            <div className="border-b border-[#E2E8DF] pb-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#15803D] bg-[#E8F0EA] px-2.5 py-1 rounded-full">
                Pillar III · Transparent Finance
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0F2F1D] tracking-tight mt-1">
                Zero Fees · Direct Access Bank Verification
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#F9FAF8] border border-[#E2E8DF] p-5 rounded-2xl space-y-2">
                <div className="w-8 h-8 rounded-full bg-[#0F2F1D] text-white font-extrabold text-xs flex items-center justify-center">
                  1
                </div>
                <h4 className="font-bold text-sm text-[#1C201D]">Pick Crate & Copy</h4>
                <p className="text-[11px] text-[#5A635D] leading-relaxed">
                  Select your pack size. Note the exact total and official Access Bank account details.
                </p>
              </div>

              <div className="bg-[#F9FAF8] border border-[#E2E8DF] p-5 rounded-2xl space-y-2">
                <div className="w-8 h-8 rounded-full bg-[#0F2F1D] text-white font-extrabold text-xs flex items-center justify-center">
                  2
                </div>
                <h4 className="font-bold text-sm text-[#1C201D]">Transfer Exact Total</h4>
                <p className="text-[11px] text-[#5A635D] leading-relaxed">
                  Send to <strong>1431041473</strong> (Olowo Olamide Emmanuel). Zero card gateway charges.
                </p>
              </div>

              <div className="bg-[#F9FAF8] border border-[#E2E8DF] p-5 rounded-2xl space-y-2">
                <div className="w-8 h-8 rounded-full bg-[#0F2F1D] text-white font-extrabold text-xs flex items-center justify-center">
                  3
                </div>
                <h4 className="font-bold text-sm text-[#1C201D]">Track Live Docket</h4>
                <p className="text-[11px] text-[#5A635D] leading-relaxed">
                  System logs your order reference (EGG-XXXXXX) and your runner contacts your WhatsApp.
                </p>
              </div>
            </div>

            {/* Account Details Box */}
            <div className="bg-[#0F2F1D] text-white p-5 rounded-2xl border border-[#1B4329] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-[#86EFAC] font-extrabold uppercase tracking-wider block">
                  Official ELEO Settlement Account
                </span>
                <span className="font-mono text-xl sm:text-2xl font-bold tracking-wider block mt-0.5">
                  1431041473
                </span>
                <span className="text-xs text-[#A5C4AF]">
                  Access Bank · Olowo Olamide Emmanuel
                </span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('1431041473');
                  alert('Account Number 1431041473 copied to clipboard!');
                }}
                className="tactile-btn px-4 py-2 bg-[#86EFAC] hover:bg-[#6EE7B7] text-[#0F2F1D] font-bold text-xs rounded-xl self-start sm:self-auto"
              >
                Copy Account No.
              </button>
            </div>
          </section>

          {/* VERIFIED STUDENT REVIEWS SLIDER */}
          <section className="clay-pillar-card clay-card p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2E8DF]">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#15803D]">
                  Campus Voice
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0F2F1D]">
                  Verified Student Deliveries
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setReviewIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      reviewIndex === i ? 'w-6 bg-[#0F2F1D]' : 'w-2 bg-[#D5DDD2]'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="bg-[#F9FAF8] border border-[#E2E8DF] p-5 sm:p-6 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-[#F59E0B]">
                  {[...Array(reviews[reviewIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-[11px] font-bold text-[#0F2F1D] bg-[#E8F0EA] px-2.5 py-0.5 rounded-full">
                  {reviews[reviewIndex].crate}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#1C201D] italic leading-relaxed">
                &ldquo;{reviews[reviewIndex].text}&rdquo;
              </p>

              <div className="pt-2 border-t border-[#E2E8DF] flex items-center justify-between text-xs">
                <div>
                  <strong className="text-[#0F2F1D] font-bold block">
                    {reviews[reviewIndex].name}
                  </strong>
                  <span className="text-[#5A635D] text-[11px]">
                    {reviews[reviewIndex].hall} · {reviews[reviewIndex].faculty}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-[#15803D] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Hostel Drop
                </span>
              </div>
            </div>
          </section>

          {/* WHAT WE DO: 3-STEP ORDERING PROTOCOL */}
          <section id="what-we-do" className="clay-pillar-card clay-card p-6 sm:p-8 space-y-6 scroll-mt-24">
            <div className="text-center max-w-md mx-auto space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#15803D]">
                What We Do
              </span>
              <h3 className="font-display text-2xl font-bold text-[#0F2F1D]">
                How Campus Egg Delivery Works
              </h3>
              <p className="text-xs text-[#5A635D]">
                Designed for frictionless ordering right from your hostel study desk.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#F9FAF8] border border-[#E2E8DF] p-5 rounded-2xl space-y-2">
                <div className="w-8 h-8 rounded-full bg-[#0F2F1D] text-white font-extrabold text-xs flex items-center justify-center">
                  1
                </div>
                <h4 className="font-bold text-sm text-[#1C201D]">Create Profile</h4>
                <p className="text-xs text-[#5A635D] leading-relaxed">
                  Enter your name, WhatsApp line, and hostel room. We remember it so future orders take under 15 seconds.
                </p>
              </div>

              <div className="bg-[#F9FAF8] border border-[#E2E8DF] p-5 rounded-2xl space-y-2">
                <div className="w-8 h-8 rounded-full bg-[#0F2F1D] text-white font-extrabold text-xs flex items-center justify-center">
                  2
                </div>
                <h4 className="font-bold text-sm text-[#1C201D]">Pick & Transfer</h4>
                <p className="text-xs text-[#5A635D] leading-relaxed">
                  Select pack size and transfer the exact total to Access Bank (1431041473, Olowo Olamide Emmanuel).
                </p>
              </div>

              <div className="bg-[#F9FAF8] border border-[#E2E8DF] p-5 rounded-2xl space-y-2">
                <div className="w-8 h-8 rounded-full bg-[#0F2F1D] text-white font-extrabold text-xs flex items-center justify-center">
                  3
                </div>
                <h4 className="font-bold text-sm text-[#1C201D]">Doorstep Drop</h4>
                <p className="text-xs text-[#5A635D] leading-relaxed">
                  Watch your digital docket update live. The runner contacts your phone and delivers the crate to your door.
                </p>
              </div>
            </div>
          </section>

          {/* WHATSAPP DIRECT DISPATCH LINE */}
          <section className="clay-pillar-card bg-[#0F2F1D] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-[#1B4329]">
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="text-[11px] font-bold text-[#86EFAC] uppercase tracking-wider block">
                Direct Dispatch Line
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-extrabold leading-tight">
                Need Bulk Orders or Dispatch Support?
              </h3>
              <p className="text-xs text-[#A5C4AF] leading-relaxed max-w-md">
                Chat directly with Olowo Olamide Emmanuel on WhatsApp for room deliveries, hall bulk splits, or dispatch inquiries.
              </p>
            </div>

            <a
              href="https://wa.me/2348123456789?text=Hello%20ELEO%20Farm,%20I'm%20inquiring%20about%20a%20campus%20egg%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="tactile-btn h-12 px-6 bg-[#25D366] hover:bg-[#20BA5C] text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shrink-0"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Chat on WhatsApp</span>
            </a>
          </section>

        </main>
      </div>
    </div>
  );
}
