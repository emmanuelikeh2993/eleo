'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import { useStore } from '@/lib/store';
import { Plus, Minus, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useStore();
  const [qty, setQty] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleAdd = () => {
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
      className={`border rounded-lg p-4 transition-all ${
        product.available
          ? 'bg-white border-[#E2E8DF] shadow-xs'
          : 'bg-[#F3F4F3]/70 border-[#E2E8DF] opacity-75'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm text-[#1C201D] leading-tight">
              {product.name}
            </h3>
          </div>
          <p className="text-xs text-[#5A635D] mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & availability badge */}
        <div className="text-right shrink-0">
          <span className="font-bold text-base text-[#0F2F1D] block">
            {formattedPrice}
          </span>
          {product.available ? (
            <span className="inline-block text-[11px] text-[#15803D] font-medium bg-[#DCFCE7] px-2 py-0.5 rounded-full mt-0.5">
              In Stock ({product.pack_size} pcs)
            </span>
          ) : (
            <span className="inline-block text-[11px] text-[#991B1B] font-medium bg-[#FEE2E2] px-2 py-0.5 rounded-full mt-0.5">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Action footer */}
      <div className="flex items-center justify-between pt-3 mt-2 border-t border-[#F0F4EF]">
        <div className="text-xs text-[#5A635D]">
          Pack size: <strong className="text-[#1C201D]">{product.pack_size} eggs</strong>
        </div>

        {product.available ? (
          <div className="flex items-center gap-2">
            {/* Quantity Stepper */}
            <div className="flex items-center border border-[#D5DDD2] rounded-md bg-[#F9FAF8]">
              <button
                type="button"
                onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                aria-label="Decrease quantity"
                className="w-8 h-8 flex items-center justify-center text-[#5A635D] hover:text-[#1C201D] hover:bg-[#EEF2EC] rounded-l-md transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-7 text-center font-bold text-xs text-[#1C201D]">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((prev) => prev + 1)}
                aria-label="Increase quantity"
                className="w-8 h-8 flex items-center justify-center text-[#5A635D] hover:text-[#1C201D] hover:bg-[#EEF2EC] rounded-r-md transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Add to Cart button */}
            <button
              type="button"
              onClick={handleAdd}
              disabled={addedAnimation}
              className={`h-8 px-3.5 rounded-md font-semibold text-xs flex items-center gap-1.5 transition-all ${
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
                <span>Add to Cart</span>
              )}
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled
            className="h-8 px-3.5 rounded-md font-medium text-xs bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
          >
            Unavailable
          </button>
        )}
      </div>
    </article>
  );
}
