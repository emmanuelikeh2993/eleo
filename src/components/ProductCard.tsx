'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import { useStore } from '@/lib/store';
import { Plus, Minus, Check, Lock, ShieldCheck } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, currentUser, openAuthModal } = useStore();
  const [qty, setQty] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleAdd = () => {
    // Strict profile gate: Student MUST be signed in before adding to cart
    if (!currentUser) {
      openAuthModal('order');
      return;
    }
    addToCart(product, qty);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const formattedPrice = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(product.price);

  return (
    <article
      className={`border rounded-xl p-5 flex flex-col justify-between transition-all duration-200 ${
        product.available
          ? 'bg-white border-[#E2E8DF] shadow-xs hover:shadow-md hover:border-[#CBD5C8]'
          : 'bg-[#F4F6F4] border-[#E2E8DF] opacity-70'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex-1">
            <h3 className="font-bold text-base text-[#1C201D] leading-tight">
              {product.name}
            </h3>
            <span className="inline-block text-[11px] font-semibold text-[#0F2F1D] bg-[#E8F0EA] px-2 py-0.5 rounded-md mt-1">
              Pack of {product.pack_size} eggs
            </span>
          </div>

          {/* Price Callout */}
          <div className="text-right shrink-0">
            <span className="font-extrabold text-lg text-[#0F2F1D] block">
              {formattedPrice}
            </span>
          </div>
        </div>

        <p className="text-xs text-[#5A635D] leading-relaxed mb-4">
          {product.description}
        </p>
      </div>

      {/* Stock status & Action footer */}
      <div className="pt-3 border-t border-[#F0F4EF] flex items-center justify-between gap-2">
        <div>
          {product.available ? (
            <span className="inline-flex items-center gap-1 text-[11px] text-[#15803D] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
              <span>In Stock</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] text-[#DC2626] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
              <span>Sold Out Today</span>
            </span>
          )}
        </div>

        {product.available ? (
          <div className="flex items-center gap-2">
            {/* Quantity Stepper */}
            <div className="flex items-center border border-[#D5DDD2] rounded-lg bg-[#F9FAF8]">
              <button
                type="button"
                onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                aria-label="Decrease quantity"
                className="w-7 h-7 flex items-center justify-center text-[#5A635D] hover:text-[#1C201D] hover:bg-[#EEF2EC] rounded-l-lg transition-colors"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-7 text-center font-bold text-xs text-[#1C201D]">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((prev) => prev + 1)}
                aria-label="Increase quantity"
                className="w-7 h-7 flex items-center justify-center text-[#5A635D] hover:text-[#1C201D] hover:bg-[#EEF2EC] rounded-r-lg transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Add to Cart button */}
            <button
              type="button"
              onClick={handleAdd}
              disabled={addedAnimation}
              className={`h-8 px-3.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs ${
                addedAnimation
                  ? 'bg-[#15803D] text-white'
                  : 'bg-[#0F2F1D] text-white hover:bg-[#1B4329] active:scale-95'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  {!currentUser && <Lock className="w-3 h-3 text-[#A5C4AF]" />}
                  <span>{currentUser ? 'Add to Cart' : 'Sign In to Order'}</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled
            className="h-8 px-3.5 rounded-lg font-semibold text-xs bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
          >
            Unavailable
          </button>
        )}
      </div>
    </article>
  );
}
