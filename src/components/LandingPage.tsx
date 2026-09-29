'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import { ProductCard } from '@/components/ProductCard';
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

  const reviews = [
    {
      id: 1,
      name: 'Tunde Adebayo',
      hall: 'Hall 2, Room 14',
      faculty: 'Biochemistry (300L)',
      text: 'The runner called me as soon as he reached the porter desk. Inspected all 30 eggs — zero cracks. Way better than walking to the campus gate under the sun.',
      rating: 5,
      crate: 'Standard Crate of 30',
    },
    {
      id: 2,
      name: 'Chidinma Okeke',
      hall: 'Postgraduate Hall',
      faculty: 'M.Sc Public Health',
      text: 'Sent money directly from my Access Bank app to Olamide. Got confirmation in less than 2 minutes and had fresh eggs for evening meal prep.',
      rating: 5,
      crate: 'Double Crate (60 Eggs)',
    },
    {
      id: 3,
      name: 'Emmanuel Oladipo',
      hall: 'Hall 1, Room 28',
      faculty: 'Mechanical Eng.',
      text: 'Yolks are deep golden, not watery like off-campus market stuff. The 6-pack carton fits right inside our room mini-fridge.',
      rating: 5,
      crate: 'Half Crate (15 Eggs)',
    },
  ];

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
      name: 'Standard Crate of 30',
      price: 4200,
      pack_size: 30,
      description: 'Daily farm-collected brown eggs with thick sturdy shells.',
      available: true,
    };

  const handlePackSwitch = (size: number) => {
    setIsAnimatingCrate(true);
    setSelectedHeroPack(size);
    setTimeout(() => setIsAnimatingCrate(false), 300);
  };

  const formatNgn = (amt: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amt);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-16">
      {/* LIVE CAMPUS DISPATCH MARQUEE TICKER (DYNAMIC SLIDING BANNER) */}
      <div className="bg-[#0F2F1D] text-white rounded-2xl overflow-hidden py-2.5 px-4 shadow-sm border border-[#1B4329] flex items-center gap-3">
        <div className="flex items-center gap-1.5 shrink-0 bg-[#15803D] text-[#DCFCE7] text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-xs">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span>Live Dispatch</span>
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
              Access Bank payment confirmed for order <strong>EGG-000108</strong>
            </span>
            <span className="text-[#86EFAC] font-bold">·</span>
            <span className="inline-flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
              Afternoon Hall Run departs in <strong>24 minutes</strong>
            </span>
            <span className="text-[#86EFAC] font-bold">·</span>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#86EFAC]" />
              <strong>142 crates</strong> safely delivered today with 0 broken eggs
            </span>
            <span className="text-[#86EFAC] font-bold">·</span>
            <span className="inline-flex items-center gap-2">
              <Egg className="w-3.5 h-3.5 text-[#86EFAC]" />
              Morning harvest from ELEO farm completed at <strong>6:30 AM</strong>
            </span>
            {/* Duplicate for seamless continuous looping */}
            <span className="text-[#86EFAC] font-bold">·</span>
            <span className="inline-flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 text-[#86EFAC]" />
              Runner dropped Crate of 30 at <strong>Hall 2, Room 14</strong>
            </span>
            <span className="text-[#86EFAC] font-bold">·</span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#86EFAC]" />
              Access Bank payment confirmed for order <strong>EGG-000108</strong>
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 1: HERO (2-COLUMN ON DESKTOP, ANIMATED & INTERACTIVE) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Bold Campus Message & Dynamic CTAs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Farm Provenance Pill with pulse glow */}
          <div className="inline-flex items-center gap-2 bg-[#E8F0EA] text-[#0F2F1D] px-4 py-1.5 rounded-full text-xs font-bold border border-[#CBD5C8] shadow-2xs animate-pulse-glow">
            <span className="w-2.5 h-2.5 rounded-full bg-[#15803D]" />
            <span>Campus Farm Direct · Same-Day Hostel Door Delivery</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F2F1D] tracking-tight leading-[1.12]">
              Fresh Farm Eggs.<br />
              <span className="text-[#15803D]">Delivered to Your Hostel Door.</span>
            </h1>
            <p className="text-sm sm:text-base text-[#5A635D] leading-relaxed max-w-xl">
              Freshly collected crates from ELEO Farm dispatched straight to your hall of residence. Zero gateway transaction fees, honest crate pricing, and direct Access Bank transfer.
            </p>
          </div>

          {/* Student Auth Context Card */}
          {currentUser ? (
            <div className="bg-[#E8F0EA] border border-[#CBD5C8] p-4 rounded-2xl flex items-center justify-between text-xs max-w-xl shadow-xs transition-card">
              <div>
                <span className="text-[11px] text-[#5A635D] block">Logged in student:</span>
                <strong className="font-extrabold text-[#0F2F1D] text-sm block">
                  {currentUser.name}
                </strong>
                <span className="text-xs text-[#5A635D]">
                  Default Delivery: <strong>{currentUser.hostel}, Room {currentUser.room}</strong>
                </span>
              </div>
              <button
                onClick={() => setActiveTab('store')}
                className="px-4 py-2 bg-[#0F2F1D] hover:bg-[#1B4329] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              >
                <span>Order for Room</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="bg-white border border-[#E2E8DF] p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs max-w-xl transition-card">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FEF3C7] text-[#B45309] flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#1C201D] block">
                    Student Profile Required to Order
                  </span>
                  <span className="text-[11px] text-[#5A635D]">
                    Sign in or set up your hostel room snapshot in 20 seconds.
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => openAuthModal('order')}
                  className="flex-1 sm:flex-initial px-4 py-2 bg-[#0F2F1D] text-white font-bold rounded-xl text-xs hover:bg-[#1B4329] transition-all shadow-sm text-center active:scale-95"
                >
                  Sign In / Register
                </button>
              </div>
            </div>
          )}

          {/* Primary Action Buttons with Micro-interactions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 max-w-xl">
            <button
              onClick={handleOrderEggsClick}
              className="h-12 px-6 bg-[#0F2F1D] hover:bg-[#1B4329] text-white font-extrabold text-sm rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-98"
            >
              <Egg className="w-4 h-4 text-[#86EFAC]" />
              <span>Browse Daily Crates</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleMyOrdersClick}
              className="h-12 px-5 bg-white hover:bg-[#F3F6F2] border border-[#D5DDD2] text-[#1C201D] font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-2xs hover:-translate-y-0.5 active:scale-98"
            >
              <Package className="w-4 h-4 text-[#0F2F1D]" />
              <span>Track Active Orders</span>
              {orders.length > 0 && (
                <span className="bg-[#E8F0EA] text-[#0F2F1D] text-xs px-2 py-0.5 rounded-full font-bold">
                  {orders.length}
                </span>
              )}
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#E2E8DF] max-w-xl text-xs text-[#5A635D]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
              <span className="font-semibold text-[#1C201D]">Access Bank Verified</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
              <span className="font-semibold text-[#1C201D]">Zero Broken Guarantee</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
              <span className="font-semibold text-[#1C201D]">Same-Day Room Drop</span>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Interactive "Today's Harvest Crate" Showcase */}
        <div className="lg:col-span-5">
          <div className="bg-white border-2 border-[#CBD5C8] rounded-3xl p-6 sm:p-7 shadow-xl space-y-6 relative overflow-hidden transition-all duration-300 hover:shadow-2xl">
            {/* Top Harvest Ribbon */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#15803D] bg-[#DCFCE7] px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#15803D] animate-ping" />
                Harvested Today · 6:30 AM
              </span>
              <span className="text-xs text-[#5A635D] font-medium flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-[#F59E0B]" /> High Demand
              </span>
            </div>

            {/* Interactive Pack Size Selector (with animated sliding feel) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-[#1C201D]">
                  Tap Pack Size to Preview:
                </label>
                <span className="text-[11px] text-[#15803D] font-bold">
                  {heroCrate.pack_size} Fresh Eggs
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 bg-[#F9FAF8] p-1.5 rounded-2xl border border-[#E2E8DF]">
                {[30, 15, 60, 6].map((size) => (
                  <button
                    key={size}
                    onClick={() => handlePackSwitch(size)}
                    className={`py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
                      selectedHeroPack === size
                        ? 'bg-[#0F2F1D] text-white shadow-sm scale-102'
                        : 'text-[#5A635D] hover:text-[#1C201D] hover:bg-[#EEF2EC]'
                    }`}
                  >
                    {size === 60 ? '60 Double' : size === 6 ? '6 Mini' : `${size} Pcs`}
                  </button>
                ))}
              </div>
            </div>

            {/* Animated Crate Visual & Price Details Card */}
            <div
              className={`bg-[#F0F5F1] p-5 sm:p-6 rounded-2xl border border-[#D5E4D8] space-y-3 transition-all duration-300 ${
                isAnimatingCrate ? 'opacity-60 scale-98 translate-x-1' : 'opacity-100 scale-100 translate-x-0'
              }`}
            >
              <div className="flex items-baseline justify-between">
                <div>
                  <h3 className="font-extrabold text-xl text-[#0F2F1D]">
                    {heroCrate.name}
                  </h3>
                  <span className="text-xs text-[#5A635D] block mt-0.5">
                    Pack of {heroCrate.pack_size} sturdy brown eggs
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-black text-[#0F2F1D] block">
                    {formatNgn(heroCrate.price)}
                  </span>
                  <span className="text-[10px] text-[#15803D] font-bold uppercase tracking-wider">
                    Direct Farm Price
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#5A635D] leading-relaxed">
                {heroCrate.description}
              </p>

              <div className="flex items-center gap-2 pt-1 text-xs font-semibold text-[#0F2F1D]">
                <ShieldCheck className="w-4 h-4 text-[#15803D] shrink-0" />
                <span>Heavy-duty partition tray prevents breakage during campus transit</span>
              </div>
            </div>

            {/* Order Action Button */}
            <button
              onClick={handleOrderEggsClick}
              className="w-full h-12 bg-[#0F2F1D] hover:bg-[#1B4329] text-white font-extrabold text-xs rounded-xl flex items-center justify-between px-5 transition-all shadow-md hover:shadow-lg active:scale-98"
            >
              <div className="flex items-center gap-2">
                <Egg className="w-4 h-4 text-[#86EFAC]" />
                <span>{currentUser ? `Add ${heroCrate.pack_size}-Pack to Order` : 'Sign In to Order Crate'}</span>
              </div>
              <span className="font-bold">{formatNgn(heroCrate.price)}</span>
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2: SLIDING CRATE SHOWCASE CAROUSEL (DYNAMIC ANIMATION) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#E2E8DF]">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#B45309]" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F2F1D] tracking-tight">
                Featured Campus Crates
              </h2>
            </div>
            <p className="text-xs text-[#5A635D] mt-0.5">
              Swipe or slide through available pack sizes for today&apos;s campus delivery.
            </p>
          </div>

          {/* Carousel Slide Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevSlide}
              aria-label="Previous crate"
              className="w-9 h-9 rounded-xl bg-white border border-[#D5DDD2] hover:bg-[#EEF2EC] flex items-center justify-center text-[#0F2F1D] transition-colors shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextSlide}
              aria-label="Next crate"
              className="w-9 h-9 rounded-xl bg-white border border-[#D5DDD2] hover:bg-[#EEF2EC] flex items-center justify-center text-[#0F2F1D] transition-colors shadow-2xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable / Sliding Container */}
        <div
          ref={carouselRef}
          className="flex gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-none scroll-smooth"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="min-w-[280px] sm:min-w-[320px] max-w-[340px] shrink-0 snap-start transition-card"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: CAMPUS OPERATIONAL PILLARS (4 CARDS WITH HOVER LIFT) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E2E8DF] p-5 rounded-2xl shadow-xs space-y-2 transition-card">
          <div className="w-10 h-10 rounded-xl bg-[#E8F0EA] text-[#0F2F1D] flex items-center justify-center">
            <Truck className="w-5 h-5 text-[#0F2F1D]" />
          </div>
          <h3 className="font-bold text-sm text-[#1C201D]">Hostel Doorstep Drop</h3>
          <p className="text-xs text-[#5A635D] leading-relaxed">
            Our campus runners bring your crates directly to your room door or hall security desk.
          </p>
        </div>

        <div className="bg-white border border-[#E2E8DF] p-5 rounded-2xl shadow-xs space-y-2 transition-card">
          <div className="w-10 h-10 rounded-xl bg-[#E8F0EA] text-[#0F2F1D] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-[#0F2F1D]" />
          </div>
          <h3 className="font-bold text-sm text-[#1C201D]">Zero Broken Guarantee</h3>
          <p className="text-xs text-[#5A635D] leading-relaxed">
            Inspect your crate on delivery. Any cracked egg is replaced on the spot by our runner.
          </p>
        </div>

        <div className="bg-white border border-[#E2E8DF] p-5 rounded-2xl shadow-xs space-y-2 transition-card">
          <div className="w-10 h-10 rounded-xl bg-[#E8F0EA] text-[#0F2F1D] flex items-center justify-center">
            <Building2 className="w-5 h-5 text-[#0F2F1D]" />
          </div>
          <h3 className="font-bold text-sm text-[#1C201D]">Access Bank Verified</h3>
          <p className="text-xs text-[#5A635D] leading-relaxed">
            Transfer directly to Olowo Olamide Emmanuel (1431041473). Zero payment fees deducted.
          </p>
        </div>

        <div className="bg-white border border-[#E2E8DF] p-5 rounded-2xl shadow-xs space-y-2 transition-card">
          <div className="w-10 h-10 rounded-xl bg-[#E8F0EA] text-[#0F2F1D] flex items-center justify-center">
            <Egg className="w-5 h-5 text-[#0F2F1D]" />
          </div>
          <h3 className="font-bold text-sm text-[#1C201D]">100% Farm Fresh</h3>
          <p className="text-xs text-[#5A635D] leading-relaxed">
            Collected daily from healthy layer hens. Thick shells and deep golden protein yolks.
          </p>
        </div>
      </section>

      {/* SECTION 4: CAMPUS STUDENT REVIEWS (SLIDING TESTIMONIAL DECK) */}
      <section className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#15803D]">
              Verified Campus Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2F1D] tracking-tight">
              What Students Are Saying
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setReviewIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  reviewIndex === idx ? 'w-6 bg-[#0F2F1D]' : 'w-2 bg-[#D5DDD2]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Active Animated Review Slide */}
        <div className="relative overflow-hidden min-h-[160px]">
          <div
            key={reviews[reviewIndex].id}
            className="bg-[#F9FAF8] border border-[#E2E8DF] p-6 sm:p-7 rounded-2xl space-y-3 animate-in fade-in slide-in-from-right duration-300"
          >
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

            <p className="text-sm sm:text-base text-[#1C201D] italic leading-relaxed">
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
              <span className="text-[11px] font-bold text-[#15803D]">
                ✓ Verified Hostel Delivery
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: 3-STEP CAMPUS ORDERING WORKFLOW / WHAT WE DO */}
      <section id="what-we-do" className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 scroll-mt-24">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#15803D]">
            What We Do
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2F1D] tracking-tight">
            How Campus Egg Delivery Works
          </h2>
          <p className="text-xs text-[#5A635D]">
            Designed for frictionless ordering from your hostel bunk or study desk.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#F9FAF8] border border-[#E2E8DF] p-6 rounded-2xl space-y-3 transition-card">
            <div className="w-8 h-8 rounded-full bg-[#0F2F1D] text-white font-extrabold text-sm flex items-center justify-center">
              1
            </div>
            <h3 className="font-bold text-base text-[#1C201D]">Create Student Profile</h3>
            <p className="text-xs text-[#5A635D] leading-relaxed">
              Enter your name, active WhatsApp number, and hostel room. We remember it so future orders take under 15 seconds.
            </p>
          </div>

          <div className="bg-[#F9FAF8] border border-[#E2E8DF] p-6 rounded-2xl space-y-3 transition-card">
            <div className="w-8 h-8 rounded-full bg-[#0F2F1D] text-white font-extrabold text-sm flex items-center justify-center">
              2
            </div>
            <h3 className="font-bold text-base text-[#1C201D]">Pick Crate & Transfer</h3>
            <p className="text-xs text-[#5A635D] leading-relaxed">
              Choose your crate and transfer the exact total to Access Bank (1431041473, Olowo Olamide Emmanuel).
            </p>
          </div>

          <div className="bg-[#F9FAF8] border border-[#E2E8DF] p-6 rounded-2xl space-y-3 transition-card">
            <div className="w-8 h-8 rounded-full bg-[#0F2F1D] text-white font-extrabold text-sm flex items-center justify-center">
              3
            </div>
            <h3 className="font-bold text-base text-[#1C201D]">Doorstep Handover</h3>
            <p className="text-xs text-[#5A635D] leading-relaxed">
              Watch your digital docket update live. The runner contacts your phone and delivers the crate to your room.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 6: CAMPUS HOSTEL COVERAGE & WHATSAPP SUPPORT */}
      <section className="bg-[#0F2F1D] text-white rounded-3xl p-6 sm:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <span className="text-xs font-bold text-[#86EFAC] uppercase tracking-wider block">
            Direct Dispatch Line
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
            Need Bulk Hostel Orders or Fast Dispatch?
          </h2>
          <p className="text-xs text-[#A5C4AF] leading-relaxed">
            Chat directly with Olowo Olamide Emmanuel on WhatsApp for room deliveries, hall bulk splits, or dispatch inquiries.
          </p>
        </div>

        <a
          href="https://wa.me/2348123456789?text=Hello%20ELEO%20Farm,%20I'm%20inquiring%20about%20a%20campus%20egg%20order."
          target="_blank"
          rel="noopener noreferrer"
          className="h-12 px-6 bg-[#25D366] hover:bg-[#20BA5C] text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shrink-0 active:scale-98 hover:scale-102"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>Chat on WhatsApp</span>
        </a>
      </section>
    </div>
  );
}
