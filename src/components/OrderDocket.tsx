'use client';

import React from 'react';
import { Order, OrderStatus } from '@/types';
import { useStore } from '@/lib/store';
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  CheckCheck,
  MessageCircle,
  Copy,
  Check,
  ArrowLeft,
  XCircle,
} from 'lucide-react';

interface OrderDocketProps {
  order: Order;
  onBackToStore?: () => void;
}

export function OrderDocket({ order, onBackToStore }: OrderDocketProps) {
  const { settings, setActiveTab } = useStore();
  const [copiedRef, setCopiedRef] = React.useState(false);

  const formatNgn = (amt: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amt);

  const handleCopy = () => {
    navigator.clipboard.writeText(order.order_number);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const steps: { key: OrderStatus; label: string; icon: React.ElementType }[] = [
    { key: 'received', label: 'Order Received', icon: Clock },
    { key: 'payment_confirmed', label: 'Payment Confirmed', icon: CheckCircle2 },
    { key: 'preparing', label: 'Preparing Crates', icon: Package },
    {
      key: 'ready',
      label:
        order.fulfillment_method === 'delivery'
          ? 'Out for Delivery'
          : 'Ready for Pickup',
      icon: Truck,
    },
    { key: 'completed', label: 'Order Completed', icon: CheckCheck },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'received':
        return 0;
      case 'payment_confirmed':
        return 1;
      case 'preparing':
        return 2;
      case 'ready':
      case 'delivered':
        return 3;
      case 'completed':
        return 4;
      case 'cancelled':
        return -1;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(order.order_status);

  // WhatsApp quick dispatch inquiry link
  const whatsappMsg = encodeURIComponent(
    `Hello ELEO Farm, I'm inquiring about order ${order.order_number} (${order.fulfillment_method} to ${order.delivery_location}).`
  );
  const whatsappUrl = `https://wa.me/${settings.support_whatsapp}?text=${whatsappMsg}`;

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6 space-y-5">
      {onBackToStore && (
        <button
          onClick={onBackToStore}
          className="text-xs text-[#5A635D] hover:text-[#0F2F1D] flex items-center gap-1 font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Storefront</span>
        </button>
      )}

      {/* The Physical Receipt-Style Order Docket */}
      <div className="bg-white border-2 border-[#E2E8DF] rounded-xl overflow-hidden shadow-sm relative">
        {/* Receipt Top Header */}
        <div className="bg-[#0F2F1D] text-white p-5 text-center relative">
          <span className="text-[10px] tracking-widest uppercase font-semibold text-[#A5C4AF] block mb-1">
            ELEO Farm & Foods · Campus Delivery Docket
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight font-mono">
            {order.order_number}
          </h2>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <span className="text-xs text-white/80">
              {new Date(order.created_at).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            <button
              onClick={handleCopy}
              className="p-1 rounded text-white/70 hover:text-white hover:bg-white/10"
              title="Copy Order Reference"
            >
              {copiedRef ? (
                <Check className="w-3.5 h-3.5 text-[#86EFAC]" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Perforated Divider Styling */}
        <div className="relative h-3 bg-[#0F2F1D] flex items-center justify-between px-2 overflow-hidden">
          <div className="w-full border-t border-dashed border-[#A5C4AF]/60" />
        </div>

        {/* Live Milestone Stepper */}
        <div className="p-5 border-b border-[#E2E8DF] bg-[#F9FAF8]">
          <h3 className="text-xs font-bold text-[#1C201D] uppercase tracking-wider mb-4">
            Live Order Status
          </h3>

          {order.order_status === 'cancelled' ? (
            <div className="bg-[#FEE2E2] border border-[#FCA5A5] p-3 rounded-lg text-[#991B1B] flex items-center gap-2 text-xs font-semibold">
              <XCircle className="w-5 h-5 shrink-0" />
              <span>This order was cancelled by the administrator.</span>
            </div>
          ) : (
            <div className="relative pl-6 space-y-5">
              {/* Vertical connector line */}
              <div className="absolute top-2.5 bottom-2.5 left-2.5 w-0.5 bg-[#E2E8DF]" />

              {steps.map((step, idx) => {
                const isPassed = idx < currentIndex;
                const isCurrent = idx === currentIndex;
                const Icon = step.icon;

                return (
                  <div key={step.key} className="relative flex items-center gap-3 text-xs">
                    {/* Step Icon */}
                    <div
                      className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-colors ${
                        isPassed
                          ? 'bg-[#15803D] border-[#15803D] text-white'
                          : isCurrent
                          ? 'bg-[#0F2F1D] border-[#0F2F1D] text-white ring-4 ring-[#0F2F1D]/15'
                          : 'bg-white border-[#CBD5C8] text-[#9CA3AF]'
                      }`}
                    >
                      {isPassed ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-semibold ${
                            isCurrent
                              ? 'text-[#0F2F1D] font-bold text-sm'
                              : isPassed
                              ? 'text-[#1C201D]'
                              : 'text-[#9CA3AF]'
                          }`}
                        >
                          {step.label}
                        </span>

                        {isCurrent && (
                          <span className="text-[10px] font-bold text-[#B45309] bg-[#FEF3C7] px-2 py-0.5 rounded-full">
                            Active Stage
                          </span>
                        )}
                      </div>

                      {/* Helper status notes */}
                      {idx === 0 && order.payment_status === 'pending_confirmation' && (
                        <p className="text-[11px] text-[#B45309] mt-0.5">
                          Bank transfer confirmation pending with ELEO operations desk.
                        </p>
                      )}
                      {idx === 0 && order.payment_status === 'unpaid' && (
                        <p className="text-[11px] text-[#991B1B] mt-0.5 font-medium">
                          Awaiting bank transfer confirmation.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Customer & Delivery Docket Details */}
        <div className="p-5 border-b border-[#E2E8DF] space-y-3 text-xs">
          <h3 className="font-bold text-xs uppercase tracking-wider text-[#1C201D]">
            Delivery Docket Details
          </h3>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[#5A635D] block">Customer</span>
              <strong className="text-[#1C201D] font-semibold">{order.user.name}</strong>
            </div>

            <div>
              <span className="text-[#5A635D] block">Phone (WhatsApp)</span>
              <strong className="text-[#1C201D] font-semibold">{order.user.phone}</strong>
            </div>

            <div className="col-span-2 pt-1">
              <span className="text-[#5A635D] block">Fulfillment Location</span>
              <strong className="text-[#0F2F1D] font-bold">
                {order.delivery_location}
              </strong>
            </div>

            {order.customer_note && (
              <div className="col-span-2 pt-1 bg-[#F9FAF8] p-2.5 rounded-md border border-[#E2E8DF]">
                <span className="text-[10px] text-[#5A635D] block font-semibold uppercase">
                  Delivery Note:
                </span>
                <p className="text-xs text-[#1C201D] italic mt-0.5">
                  &ldquo;{order.customer_note}&rdquo;
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Items Breakdown */}
        <div className="p-5 space-y-2.5 text-xs">
          <h3 className="font-bold text-xs uppercase tracking-wider text-[#1C201D]">
            Crates Summary
          </h3>

          <div className="divide-y divide-[#F0F4EF]">
            {order.items.map((item) => (
              <div key={item.id} className="py-2 flex justify-between items-center">
                <div>
                  <span className="font-semibold text-[#1C201D] block">
                    {item.quantity}x {item.product_name}
                  </span>
                  <span className="text-[11px] text-[#5A635D]">
                    {item.pack_size} eggs per crate · {formatNgn(item.unit_price)}
                  </span>
                </div>
                <span className="font-bold text-[#1C201D]">
                  {formatNgn(item.total_price)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[#E2E8DF] space-y-1 text-xs">
            <div className="flex justify-between text-[#5A635D]">
              <span>Subtotal</span>
              <span>{formatNgn(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-[#5A635D]">
              <span>Delivery Fee</span>
              <span>
                {order.delivery_fee === 0 ? 'Free' : formatNgn(order.delivery_fee)}
              </span>
            </div>
            <div className="flex justify-between font-extrabold text-sm text-[#0F2F1D] border-t border-[#E2E8DF] pt-2">
              <span>Total Paid / Due</span>
              <span>{formatNgn(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 bg-[#F9FAF8] border-t border-[#E2E8DF] flex flex-col gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-10 bg-[#15803D] hover:bg-[#166534] text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Dispatch Coordinator</span>
          </a>

          <button
            onClick={() => setActiveTab('store')}
            className="w-full h-9 bg-white border border-[#D5DDD2] text-[#1C201D] font-semibold text-xs rounded-lg hover:bg-[#EEF2EC] transition-colors"
          >
            Order More Eggs
          </button>
        </div>
      </div>
    </div>
  );
}
