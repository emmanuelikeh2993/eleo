'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { X, Trash2, Plus, Minus, ArrowRight, Truck, Store } from 'lucide-react';
import { FulfillmentMethod } from '@/types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: (method: FulfillmentMethod) => void;
}

export function CartDrawer({ isOpen, onClose, onProceedToCheckout }: CartDrawerProps) {
  const { cart, updateCartQuantity, removeFromCart, settings } = useStore();
  const [fulfillmentMethod, setFulfillmentMethod] = useState<FulfillmentMethod>('delivery');

  if (!isOpen) return null;

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const deliveryFee = fulfillmentMethod === 'delivery' ? settings.delivery_fee : 0;
  const grandTotal = subtotal + deliveryFee;

  const formatNgn = (amt: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amt);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-[#F9FAF8] h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 bg-white border-b border-[#E2E8DF] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-base text-[#1C201D]">Your Order Cart</h2>
            <span className="text-xs bg-[#E8F0EA] text-[#0F2F1D] px-2 py-0.5 rounded-full font-semibold">
              {cart.reduce((s, i) => s + i.quantity, 0)} crates
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-[#5A635D] hover:bg-[#EEF2EC] hover:text-[#1C201D] transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart items list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-12 h-12 rounded-full bg-[#E8F0EA] text-[#0F2F1D] flex items-center justify-center mx-auto mb-3 font-bold text-lg">
                0
              </div>
              <p className="font-semibold text-sm text-[#1C201D]">Your cart is empty</p>
              <p className="text-xs text-[#5A635D] mt-1 max-w-xs mx-auto">
                Select your fresh egg crates from the daily farm catalogue to begin your order.
              </p>
              <button
                onClick={onClose}
                className="mt-5 px-4 py-2 bg-[#0F2F1D] text-white text-xs font-semibold rounded-md hover:bg-[#1B4329]"
              >
                Browse Crates
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="bg-white p-3.5 rounded-lg border border-[#E2E8DF] flex items-start justify-between gap-3 shadow-2xs"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-xs text-[#1C201D] leading-tight">
                    {item.product.name}
                  </h4>
                  <p className="text-[11px] text-[#5A635D] mt-0.5">
                    {formatNgn(item.product.price)} each · {item.product.pack_size} pcs
                  </p>
                  <p className="text-xs font-bold text-[#0F2F1D] mt-2">
                    {formatNgn(item.product.price * item.quantity)}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-[#9CA3AF] hover:text-[#DC2626] transition-colors p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center border border-[#D5DDD2] rounded-md bg-[#F9FAF8]">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center text-[#5A635D] hover:bg-[#EEF2EC]"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-[#1C201D]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center text-[#5A635D] hover:bg-[#EEF2EC]"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Fulfillment selection & Checkout summary */}
        {cart.length > 0 && (
          <div className="p-4 bg-white border-t border-[#E2E8DF] space-y-4">
            {/* Fulfillment selector */}
            <div>
              <label className="text-xs font-bold text-[#1C201D] block mb-2">
                Fulfillment Method
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setFulfillmentMethod('delivery')}
                  className={`p-2.5 rounded-lg border text-left flex items-start gap-2 transition-all ${
                    fulfillmentMethod === 'delivery'
                      ? 'border-[#0F2F1D] bg-[#F0F5F1] text-[#0F2F1D] ring-1 ring-[#0F2F1D]'
                      : 'border-[#E2E8DF] bg-white text-[#5A635D] hover:border-[#CBD5C8]'
                  }`}
                >
                  <Truck className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Hostel Delivery</span>
                    <span className="text-[10px] text-[#5A635D] block">
                      +{formatNgn(settings.delivery_fee)}
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFulfillmentMethod('pickup')}
                  className={`p-2.5 rounded-lg border text-left flex items-start gap-2 transition-all ${
                    fulfillmentMethod === 'pickup'
                      ? 'border-[#0F2F1D] bg-[#F0F5F1] text-[#0F2F1D] ring-1 ring-[#0F2F1D]'
                      : 'border-[#E2E8DF] bg-white text-[#5A635D] hover:border-[#CBD5C8]'
                  }`}
                >
                  <Store className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Campus Pickup</span>
                    <span className="text-[10px] text-[#5A635D] block">Free (₦0)</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs border-t border-[#F0F4EF] pt-3 text-[#5A635D]">
              <div className="flex justify-between">
                <span>Crates Subtotal</span>
                <span className="font-medium text-[#1C201D]">{formatNgn(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>
                  {fulfillmentMethod === 'delivery'
                    ? 'Hostel Delivery Fee'
                    : 'Campus Pickup'}
                </span>
                <span className="font-medium text-[#1C201D]">
                  {deliveryFee === 0 ? 'Free' : formatNgn(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#0F2F1D] border-t border-[#E2E8DF] pt-2 mt-1">
                <span>Total Amount Due</span>
                <span>{formatNgn(grandTotal)}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={() => onProceedToCheckout(fulfillmentMethod)}
                className="w-full h-11 bg-[#0F2F1D] hover:bg-[#1B4329] text-white font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full h-9 bg-transparent hover:bg-[#F3F6F2] text-[#5A635D] font-medium text-xs rounded-lg transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
