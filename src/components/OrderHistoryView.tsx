'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Order, GoalType } from '@/types';
import { User, Package, RotateCcw, ChevronRight, Save, Check } from 'lucide-react';

interface OrderHistoryViewProps {
  onSelectOrder: (order: Order) => void;
}

export function OrderHistoryView({ onSelectOrder }: OrderHistoryViewProps) {
  const { userProfile, updateUserProfile, orders, reorder, setActiveTab } = useStore();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userProfile.name || '');
  const [phone, setPhone] = useState(userProfile.phone || '');
  const [hostel, setHostel] = useState(userProfile.hostel || '');
  const [room, setRoom] = useState(userProfile.room || '');
  const [goal, setGoal] = useState<GoalType>(userProfile.goal || 'muscle');
  const [savedAlert, setSavedAlert] = useState(false);

  const formatNgn = (amt: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amt);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, phone, hostel, room, goal });
    setIsEditing(false);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2000);
  };

  const getStatusBadge = (status: Order['order_status']) => {
    switch (status) {
      case 'received':
        return <span className="bg-[#FEF3C7] text-[#92400E] text-[10px] font-bold px-2 py-0.5 rounded-full">Received</span>;
      case 'payment_confirmed':
        return <span className="bg-[#E0F2FE] text-[#0369A1] text-[10px] font-bold px-2 py-0.5 rounded-full">Paid</span>;
      case 'preparing':
        return <span className="bg-[#FEF9C3] text-[#854D0E] text-[10px] font-bold px-2 py-0.5 rounded-full">Preparing</span>;
      case 'ready':
      case 'delivered':
        return <span className="bg-[#DCFCE7] text-[#15803D] text-[10px] font-bold px-2 py-0.5 rounded-full">Dispatched</span>;
      case 'completed':
        return <span className="bg-[#F3F4F6] text-[#374151] text-[10px] font-bold px-2 py-0.5 rounded-full">Completed</span>;
      case 'cancelled':
        return <span className="bg-[#FEE2E2] text-[#991B1B] text-[10px] font-bold px-2 py-0.5 rounded-full">Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Student Profile Card */}
      <div className="bg-white border border-[#E2E8DF] rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0F4EF]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#E8F0EA] text-[#0F2F1D] flex items-center justify-center font-bold text-xs">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-[#1C201D]">Student Profile</h2>
              <span className="text-[11px] text-[#5A635D]">Saved hostel delivery address</span>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs font-semibold text-[#0F2F1D] hover:underline"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {savedAlert && (
          <div className="mt-3 p-2 bg-[#DCFCE7] text-[#15803D] text-xs font-semibold rounded-md flex items-center gap-1.5">
            <Check className="w-4 h-4" />
            <span>Profile details updated successfully.</span>
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="mt-3 space-y-3 text-xs">
            <div>
              <label className="font-semibold text-[#1C201D] block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full h-9 px-3 border border-[#D5DDD2] rounded-md text-xs bg-[#F9FAF8]"
              />
            </div>

            <div>
              <label className="font-semibold text-[#1C201D] block mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="WhatsApp Phone"
                className="w-full h-9 px-3 border border-[#D5DDD2] rounded-md text-xs bg-[#F9FAF8]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-[#1C201D] block mb-1">Hostel</label>
                <input
                  type="text"
                  value={hostel}
                  onChange={(e) => setHostel(e.target.value)}
                  placeholder="Hostel / Hall"
                  className="w-full h-9 px-3 border border-[#D5DDD2] rounded-md text-xs bg-[#F9FAF8]"
                />
              </div>
              <div>
                <label className="font-semibold text-[#1C201D] block mb-1">Room</label>
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="Room No"
                  className="w-full h-9 px-3 border border-[#D5DDD2] rounded-md text-xs bg-[#F9FAF8]"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-[#1C201D] block mb-1">Primary Nutrition Goal</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value as GoalType)}
                className="w-full h-9 px-3 border border-[#D5DDD2] rounded-md text-xs bg-[#F9FAF8]"
              >
                <option value="muscle">Build Muscle</option>
                <option value="gain">Gain Weight</option>
                <option value="lose">Lose Weight</option>
                <option value="maintain">Maintain Weight</option>
                <option value="healthier">Eat Healthier</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full h-9 bg-[#0F2F1D] text-white font-semibold text-xs rounded-md flex items-center justify-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </form>
        ) : (
          <div className="mt-3 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#5A635D]">Name:</span>
              <strong className="text-[#1C201D]">{userProfile.name || 'Not set yet'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5A635D]">Phone:</span>
              <strong className="text-[#1C201D]">{userProfile.phone || 'Not set yet'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5A635D]">Hostel / Room:</span>
              <strong className="text-[#1C201D]">
                {userProfile.hostel ? `${userProfile.hostel}, Room ${userProfile.room}` : 'Not set yet'}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5A635D]">Goal:</span>
              <strong className="text-[#0F2F1D] capitalize">{userProfile.goal || 'muscle'}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-[#1C201D] flex items-center gap-2">
          <Package className="w-4 h-4 text-[#0F2F1D]" />
          <span>My Orders & Reorders</span>
          <span className="text-xs font-normal text-[#5A635D]">({orders.length})</span>
        </h3>

        {orders.length === 0 ? (
          <div className="bg-white border border-[#E2E8DF] rounded-xl p-8 text-center">
            <Package className="w-10 h-10 text-[#CBD5C8] mx-auto mb-2" />
            <p className="font-semibold text-xs text-[#1C201D]">No previous orders</p>
            <p className="text-[11px] text-[#5A635D] mt-1">
              Your placed orders and digital delivery dockets will appear here.
            </p>
            <button
              onClick={() => setActiveTab('store')}
              className="mt-4 px-4 py-2 bg-[#0F2F1D] text-white text-xs font-semibold rounded-md"
            >
              Order Farm Eggs
            </button>
          </div>
        ) : (
          orders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white border border-[#E2E8DF] rounded-xl p-4 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-[#0F2F1D]">
                      {ord.order_number}
                    </span>
                    {getStatusBadge(ord.order_status)}
                  </div>
                  <span className="text-[11px] text-[#5A635D] block mt-0.5">
                    {new Date(ord.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-sm text-[#1C201D] block">
                    {formatNgn(ord.total)}
                  </span>
                  <span className="text-[10px] text-[#5A635D]">
                    {ord.items.reduce((s, i) => s + i.quantity, 0)} crates
                  </span>
                </div>
              </div>

              {/* Items summary */}
              <div className="text-xs text-[#5A635D] bg-[#F9FAF8] p-2.5 rounded-lg border border-[#F0F4EF]">
                {ord.items.map((i) => `${i.quantity}x ${i.product_name}`).join(', ')}
              </div>

              {/* Card Actions */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => onSelectOrder(ord)}
                  className="flex-1 h-8 bg-[#0F2F1D] hover:bg-[#1B4329] text-white font-semibold text-xs rounded-md flex items-center justify-center gap-1 transition-colors"
                >
                  <span>Track Docket</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => reorder(ord)}
                  className="h-8 px-3 border border-[#D5DDD2] hover:bg-[#F3F6F2] text-[#1C201D] font-semibold text-xs rounded-md flex items-center gap-1.5 transition-colors"
                  title="Re-add these crates to cart"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reorder</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
