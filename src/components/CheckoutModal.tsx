'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { FulfillmentMethod, GoalType, Order } from '@/types';
import { X, Lock, CheckCircle2 } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  fulfillmentMethod: FulfillmentMethod;
  onOrderPlaced: (order: Order) => void;
}

export function CheckoutModal({
  isOpen,
  onClose,
  fulfillmentMethod,
  onOrderPlaced,
}: CheckoutModalProps) {
  const { userProfile, updateUserProfile, createOrder, cart, settings } = useStore();

  const [name, setName] = useState(userProfile.name || '');
  const [phone, setPhone] = useState(userProfile.phone || '');
  const [hostel, setHostel] = useState(userProfile.hostel || '');
  const [room, setRoom] = useState(userProfile.room || '');
  const [goal, setGoal] = useState<GoalType>(userProfile.goal || 'muscle');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const deliveryFee = fulfillmentMethod === 'delivery' ? settings.delivery_fee : 0;
  const total = subtotal + deliveryFee;

  const formatNgn = (amt: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amt);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 9) {
      setErrorMsg('Please provide a valid active phone or WhatsApp number.');
      return;
    }
    if (fulfillmentMethod === 'delivery') {
      if (!hostel.trim()) {
        setErrorMsg('Please specify your hostel or hall name.');
        return;
      }
      if (!room.trim()) {
        setErrorMsg('Please enter your room or block number.');
        return;
      }
    }

    try {
      setIsSubmitting(true);
      // Update saved profile for returning frictionless orders
      updateUserProfile({
        name: name.trim(),
        phone: phone.trim(),
        hostel: hostel.trim(),
        room: room.trim(),
        goal,
      });

      const newOrder = await createOrder({
        fulfillment_method: fulfillmentMethod,
        customer_note: note.trim() || undefined,
      });

      setIsSubmitting(false);
      onOrderPlaced(newOrder);
    } catch {
      setIsSubmitting(false);
      setErrorMsg('Failed to create order. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-[#E2E8DF] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 bg-[#0F2F1D] text-white flex items-center justify-between">
          <div>
            <h2 className="font-bold text-base">Hostel Delivery Details</h2>
            <p className="text-[11px] text-[#A5C4AF]">
              {fulfillmentMethod === 'delivery'
                ? 'Direct to your hostel door'
                : 'Campus Depot Pickup'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-white/70 hover:text-white hover:bg-white/10"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] text-xs rounded-lg font-medium">
              {errorMsg}
            </div>
          )}

          {/* Student Contact */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-[#1C201D] block mb-1">
                Full Name <span className="text-[#991B1B]">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. David Adeleke"
                required
                className="w-full h-10 px-3 border border-[#D5DDD2] rounded-md text-xs text-[#1C201D] placeholder-[#9CA3AF] focus:border-[#0F2F1D] focus:ring-1 focus:ring-[#0F2F1D] outline-hidden bg-[#F9FAF8]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#1C201D] block mb-1">
                Phone Number (WhatsApp) <span className="text-[#991B1B]">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 0812 345 6789"
                required
                className="w-full h-10 px-3 border border-[#D5DDD2] rounded-md text-xs text-[#1C201D] placeholder-[#9CA3AF] focus:border-[#0F2F1D] focus:ring-1 focus:ring-[#0F2F1D] outline-hidden bg-[#F9FAF8]"
              />
              <span className="text-[10px] text-[#5A635D] mt-0.5 block">
                The hostel runner will call or WhatsApp this number on arrival.
              </span>
            </div>
          </div>

          {/* Location details (if delivery) */}
          {fulfillmentMethod === 'delivery' && (
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#F0F4EF]">
              <div>
                <label className="text-xs font-semibold text-[#1C201D] block mb-1">
                  Hostel / Hall <span className="text-[#991B1B]">*</span>
                </label>
                <input
                  type="text"
                  value={hostel}
                  onChange={(e) => setHostel(e.target.value)}
                  placeholder="e.g. Hall 2 / Idia"
                  required
                  className="w-full h-10 px-3 border border-[#D5DDD2] rounded-md text-xs text-[#1C201D] placeholder-[#9CA3AF] focus:border-[#0F2F1D] focus:ring-1 focus:ring-[#0F2F1D] outline-hidden bg-[#F9FAF8]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1C201D] block mb-1">
                  Room / Block <span className="text-[#991B1B]">*</span>
                </label>
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="e.g. Room B14"
                  required
                  className="w-full h-10 px-3 border border-[#D5DDD2] rounded-md text-xs text-[#1C201D] placeholder-[#9CA3AF] focus:border-[#0F2F1D] focus:ring-1 focus:ring-[#0F2F1D] outline-hidden bg-[#F9FAF8]"
                />
              </div>
            </div>
          )}

          {/* Delivery Note */}
          <div>
            <label className="text-xs font-semibold text-[#1C201D] block mb-1">
              Delivery Directions / Note (Optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Leave with porter if I am in 2pm chemistry lab"
              className="w-full h-10 px-3 border border-[#D5DDD2] rounded-md text-xs text-[#1C201D] placeholder-[#9CA3AF] focus:border-[#0F2F1D] focus:ring-1 focus:ring-[#0F2F1D] outline-hidden bg-[#F9FAF8]"
            />
          </div>

          {/* Nutrition Goal */}
          <div>
            <label className="text-xs font-semibold text-[#1C201D] block mb-1">
              Your Primary Fitness / Health Goal
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value as GoalType)}
              className="w-full h-10 px-3 border border-[#D5DDD2] rounded-md text-xs text-[#1C201D] focus:border-[#0F2F1D] focus:ring-1 focus:ring-[#0F2F1D] outline-hidden bg-[#F9FAF8]"
            >
              <option value="muscle">Build Muscle (High daily protein intake)</option>
              <option value="gain">Gain Weight (Nutrient-dense clean calories)</option>
              <option value="lose">Lose Weight (Satiety & lean nutrition)</option>
              <option value="maintain">Maintain Weight (Balanced everyday staple)</option>
              <option value="healthier">Eat Healthier (Wholesome farm breakfast)</option>
            </select>
          </div>

          {/* Order Summary Pill */}
          <div className="bg-[#F0F5F1] p-3 rounded-lg border border-[#D5E4D8] flex items-center justify-between text-xs">
            <div>
              <span className="text-[#5A635D] block">Total with {fulfillmentMethod}:</span>
              <strong className="text-sm font-bold text-[#0F2F1D]">{formatNgn(total)}</strong>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#0F2F1D] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
              <span>Manual Bank Transfer</span>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-[#0F2F1D] hover:bg-[#1B4329] disabled:bg-[#5A635D] text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>
                {isSubmitting
                  ? 'Generating Order...'
                  : `Place Order (${formatNgn(total)})`}
              </span>
            </button>
            <p className="text-[10px] text-[#5A635D] text-center mt-2">
              Next step: Bank transfer account details & order tracking sequence.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
