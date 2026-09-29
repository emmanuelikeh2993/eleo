'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { Clock, ChevronRight } from 'lucide-react';

export function ActiveOrderBanner() {
  const { orders, activeOrderId, setActiveOrderId, setActiveTab } = useStore();

  const activeOrder = orders.find(
    (o) =>
      o.id === activeOrderId ||
      (o.order_status !== 'completed' && o.order_status !== 'cancelled')
  );

  if (!activeOrder || activeOrder.order_status === 'completed' || activeOrder.order_status === 'cancelled') {
    return null;
  }

  const getStatusLabel = () => {
    switch (activeOrder.order_status) {
      case 'received':
        return activeOrder.payment_status === 'pending_confirmation'
          ? 'Transfer Verification in Progress'
          : 'Waiting for Bank Transfer';
      case 'payment_confirmed':
        return 'Payment Verified & Confirmed';
      case 'preparing':
        return 'Packing Fresh Crates';
      case 'ready':
        return activeOrder.fulfillment_method === 'delivery'
          ? 'Out for Hostel Delivery'
          : 'Ready for Pickup at Campus Depot';
      default:
        return 'In Progress';
    }
  };

  return (
    <div className="bg-[#FEF3C7] border-y border-[#FDE68A] px-4 py-2.5 text-[#92400E]">
      <div className="max-w-md mx-auto flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 overflow-hidden">
          <Clock className="w-4 h-4 shrink-0 text-[#B45309]" />
          <div className="truncate">
            <span className="font-bold text-[#78350F] mr-1.5">{activeOrder.order_number}:</span>
            <span className="font-medium">{getStatusLabel()}</span>
          </div>
        </div>

        <button
          onClick={() => {
            setActiveOrderId(activeOrder.id);
            setActiveTab('track');
          }}
          className="shrink-0 flex items-center gap-0.5 font-bold text-[#B45309] hover:underline"
        >
          <span>Track</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
