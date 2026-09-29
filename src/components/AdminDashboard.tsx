'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Product, Order, OrderStatus } from '@/types';
import {
  TrendingUp,
  Clock,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Plus,
  Edit2,
  DollarSign,
  Save,
  Check,
  Building2,
  Layers,
  ShoppingBag,
} from 'lucide-react';

export function AdminDashboard() {
  const {
    orders,
    products,
    settings,
    updateOrderStatus,
    updatePaymentStatus,
    updateProduct,
    addProduct,
    updateSettings,
    setIsAdmin,
    setActiveTab,
  } = useStore();

  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'orders' | 'products' | 'settings'>('orders');
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending_payment' | 'preparing' | 'ready' | 'completed'>('all');

  // Product editing modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdPrice, setNewProdPrice] = useState(4200);
  const [newProdPackSize, setNewProdPackSize] = useState(30);

  // Settings editing state
  const [bankName, setBankName] = useState(settings.bank_details.bank_name);
  const [accountName, setAccountName] = useState(settings.bank_details.account_name);
  const [accountNumber, setAccountNumber] = useState(settings.bank_details.account_number);
  const [deliveryFee, setDeliveryFee] = useState(settings.delivery_fee);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState(false);

  const formatNgn = (amt: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amt);

  // Calculate Metrics from orders
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysOrders = orders.filter((o) => o.created_at.startsWith(todayStr)).length;
  const pendingPayments = orders.filter((o) => o.payment_status === 'pending_confirmation').length;
  const ordersPreparing = orders.filter((o) => o.order_status === 'preparing').length;
  const ordersReady = orders.filter((o) => o.order_status === 'ready' || o.order_status === 'delivered').length;
  const completedOrders = orders.filter((o) => o.order_status === 'completed').length;
  const confirmedRevenue = orders
    .filter((o) => o.payment_status === 'confirmed' || o.order_status === 'completed')
    .reduce((sum, o) => sum + o.total, 0);

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'pending_payment') return o.payment_status === 'pending_confirmation';
    if (orderFilter === 'preparing') return o.order_status === 'preparing';
    if (orderFilter === 'ready') return o.order_status === 'ready' || o.order_status === 'delivered';
    if (orderFilter === 'completed') return o.order_status === 'completed';
    return true;
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      bank_details: {
        bank_name: bankName,
        account_name: accountName,
        account_number: accountNumber,
        instructions: settings.bank_details.instructions,
      },
      delivery_fee: Number(deliveryFee),
    });
    setSettingsSavedMsg(true);
    setTimeout(() => setSettingsSavedMsg(false), 2000);
  };

  const handleSaveProductEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct);
    setEditingProduct(null);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;
    addProduct({
      name: newProdName.trim(),
      description: newProdDesc.trim(),
      price: Number(newProdPrice),
      pack_size: Number(newProdPackSize),
      available: true,
    });
    setIsAddingProduct(false);
    setNewProdName('');
    setNewProdDesc('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="bg-[#0F2F1D] text-white p-5 rounded-2xl flex items-center justify-between shadow-xs">
        <div>
          <span className="text-[10px] font-bold text-[#A5C4AF] tracking-widest uppercase block">
            Farm Operations Console
          </span>
          <h1 className="font-extrabold text-lg">ELEO Admin Dashboard</h1>
        </div>

        <button
          onClick={() => {
            setIsAdmin(false);
            setActiveTab('store');
          }}
          className="text-xs font-semibold bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-xl border border-white/20 transition-colors"
        >
          Back to Store
        </button>
      </div>

      {/* 6 Key Operational Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-[#E2E8DF] shadow-2xs">
          <div className="flex items-center justify-between text-[#5A635D] text-xs">
            <span>Today&apos;s Orders</span>
            <ShoppingBag className="w-4 h-4 text-[#0F2F1D]" />
          </div>
          <div className="text-2xl font-bold text-[#1C201D] mt-1">{todaysOrders}</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-[#E2E8DF] shadow-2xs">
          <div className="flex items-center justify-between text-[#5A635D] text-xs">
            <span>Pending Payments</span>
            <Clock className="w-4 h-4 text-[#B45309]" />
          </div>
          <div className="text-2xl font-bold text-[#B45309] mt-1">{pendingPayments}</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-[#E2E8DF] shadow-2xs">
          <div className="flex items-center justify-between text-[#5A635D] text-xs">
            <span>Preparing Crates</span>
            <Package className="w-4 h-4 text-[#0F2F1D]" />
          </div>
          <div className="text-2xl font-bold text-[#1C201D] mt-1">{ordersPreparing}</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-[#E2E8DF] shadow-2xs">
          <div className="flex items-center justify-between text-[#5A635D] text-xs">
            <span>Ready / Dispatched</span>
            <Truck className="w-4 h-4 text-[#0F2F1D]" />
          </div>
          <div className="text-2xl font-bold text-[#1C201D] mt-1">{ordersReady}</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-[#E2E8DF] shadow-2xs">
          <div className="flex items-center justify-between text-[#5A635D] text-xs">
            <span>Completed</span>
            <CheckCircle className="w-4 h-4 text-[#15803D]" />
          </div>
          <div className="text-2xl font-bold text-[#15803D] mt-1">{completedOrders}</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-[#E2E8DF] shadow-2xs">
          <div className="flex items-center justify-between text-[#5A635D] text-xs">
            <span>Confirmed Revenue</span>
            <DollarSign className="w-4 h-4 text-[#15803D]" />
          </div>
          <div className="text-lg font-extrabold text-[#15803D] mt-1 truncate">
            {formatNgn(confirmedRevenue)}
          </div>
        </div>
      </div>

      {/* Admin Section Tabs */}
      <div className="flex items-center border-b border-[#E2E8DF] text-xs font-semibold">
        <button
          onClick={() => setActiveAdminSubTab('orders')}
          className={`px-4 py-2.5 border-b-2 flex items-center gap-1.5 transition-colors ${
            activeAdminSubTab === 'orders'
              ? 'border-[#0F2F1D] text-[#0F2F1D]'
              : 'border-transparent text-[#5A635D] hover:text-[#1C201D]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Orders Management ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('products')}
          className={`px-4 py-2.5 border-b-2 flex items-center gap-1.5 transition-colors ${
            activeAdminSubTab === 'products'
              ? 'border-[#0F2F1D] text-[#0F2F1D]'
              : 'border-transparent text-[#5A635D] hover:text-[#1C201D]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Product Catalogue ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('settings')}
          className={`px-4 py-2.5 border-b-2 flex items-center gap-1.5 transition-colors ${
            activeAdminSubTab === 'settings'
              ? 'border-[#0F2F1D] text-[#0F2F1D]'
              : 'border-transparent text-[#5A635D] hover:text-[#1C201D]'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Bank & Fees Settings</span>
        </button>
      </div>

      {/* TAB 1: ORDERS MANAGEMENT */}
      {activeAdminSubTab === 'orders' && (
        <div className="space-y-4">
          {/* Quick Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setOrderFilter('all')}
              className={`px-3 py-1.5 rounded-full font-medium shrink-0 transition-colors ${
                orderFilter === 'all'
                  ? 'bg-[#0F2F1D] text-white'
                  : 'bg-white border border-[#E2E8DF] text-[#5A635D]'
              }`}
            >
              All ({orders.length})
            </button>
            <button
              onClick={() => setOrderFilter('pending_payment')}
              className={`px-3 py-1.5 rounded-full font-medium shrink-0 transition-colors ${
                orderFilter === 'pending_payment'
                  ? 'bg-[#B45309] text-white'
                  : 'bg-white border border-[#E2E8DF] text-[#5A635D]'
              }`}
            >
              Pending Verification ({pendingPayments})
            </button>
            <button
              onClick={() => setOrderFilter('preparing')}
              className={`px-3 py-1.5 rounded-full font-medium shrink-0 transition-colors ${
                orderFilter === 'preparing'
                  ? 'bg-[#0F2F1D] text-white'
                  : 'bg-white border border-[#E2E8DF] text-[#5A635D]'
              }`}
            >
              Preparing ({ordersPreparing})
            </button>
            <button
              onClick={() => setOrderFilter('ready')}
              className={`px-3 py-1.5 rounded-full font-medium shrink-0 transition-colors ${
                orderFilter === 'ready'
                  ? 'bg-[#0F2F1D] text-white'
                  : 'bg-white border border-[#E2E8DF] text-[#5A635D]'
              }`}
            >
              Out / Ready ({ordersReady})
            </button>
            <button
              onClick={() => setOrderFilter('completed')}
              className={`px-3 py-1.5 rounded-full font-medium shrink-0 transition-colors ${
                orderFilter === 'completed'
                  ? 'bg-[#15803D] text-white'
                  : 'bg-white border border-[#E2E8DF] text-[#5A635D]'
              }`}
            >
              Completed ({completedOrders})
            </button>
          </div>

          {/* Orders List / Cards */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white border border-[#E2E8DF] rounded-xl p-8 text-center text-xs text-[#5A635D]">
              No orders found matching the filter &quot;{orderFilter}&quot;.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white border border-[#E2E8DF] rounded-xl p-4 shadow-2xs space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F0F4EF] pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-[#0F2F1D]">
                        {ord.order_number}
                      </span>
                      <span className="text-[11px] text-[#5A635D]">
                        {new Date(ord.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {ord.payment_status === 'confirmed' ? (
                        <span className="bg-[#DCFCE7] text-[#15803D] text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Payment Confirmed
                        </span>
                      ) : ord.payment_status === 'pending_confirmation' ? (
                        <span className="bg-[#FEF3C7] text-[#92400E] text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Transfer Needs Check
                        </span>
                      ) : (
                        <span className="bg-[#FEE2E2] text-[#991B1B] text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Unpaid
                        </span>
                      )}

                      <span className="bg-[#F3F6F2] text-[#1C201D] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        {ord.order_status}
                      </span>
                    </div>
                  </div>

                  {/* Customer & Location */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[#5A635D] block text-[11px]">Customer & Phone:</span>
                      <strong className="text-[#1C201D]">{ord.user.name}</strong> ·{' '}
                      <a href={`tel:${ord.user.phone}`} className="text-[#0F2F1D] underline">
                        {ord.user.phone}
                      </a>
                    </div>

                    <div>
                      <span className="text-[#5A635D] block text-[11px]">Destination:</span>
                      <strong className="text-[#1C201D]">{ord.delivery_location}</strong>
                    </div>

                    {ord.customer_note && (
                      <div className="col-span-2 bg-[#F9FAF8] p-2 rounded text-[11px] text-[#5A635D]">
                        <strong>Note:</strong> {ord.customer_note}
                      </div>
                    )}
                  </div>

                  {/* Order items & Total */}
                  <div className="flex items-center justify-between text-xs bg-[#F9FAF8] p-2.5 rounded-lg border border-[#F0F4EF]">
                    <div>
                      <span className="font-semibold text-[#1C201D]">
                        {ord.items.map((i) => `${i.quantity}x ${i.product_name}`).join(', ')}
                      </span>
                      <span className="text-[10px] text-[#5A635D] block">
                        Fulfillment: {ord.fulfillment_method === 'delivery' ? 'Hostel Delivery' : 'Campus Pickup'}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-extrabold text-sm text-[#0F2F1D]">
                        {formatNgn(ord.total)}
                      </span>
                    </div>
                  </div>

                  {/* Admin State Advancement Action Triggers (PDF Section 3) */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {/* Confirm Payment button */}
                    {ord.payment_status !== 'confirmed' && (
                      <button
                        onClick={() => {
                          updatePaymentStatus(ord.id, 'confirmed');
                          updateOrderStatus(ord.id, 'payment_confirmed');
                        }}
                        className="px-2.5 py-1.5 bg-[#15803D] hover:bg-[#166534] text-white text-xs font-semibold rounded-md flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Confirm Payment</span>
                      </button>
                    )}

                    {/* Mark Preparing */}
                    {ord.order_status === 'payment_confirmed' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'preparing')}
                        className="px-2.5 py-1.5 bg-[#0F2F1D] hover:bg-[#1B4329] text-white text-xs font-semibold rounded-md flex items-center gap-1"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>Mark Preparing</span>
                      </button>
                    )}

                    {/* Mark Ready */}
                    {ord.order_status === 'preparing' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'ready')}
                        className="px-2.5 py-1.5 bg-[#0F2F1D] hover:bg-[#1B4329] text-white text-xs font-semibold rounded-md flex items-center gap-1"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>
                          {ord.fulfillment_method === 'delivery'
                            ? 'Mark Dispatched / Out'
                            : 'Mark Ready for Pickup'}
                        </span>
                      </button>
                    )}

                    {/* Mark Delivered / Completed */}
                    {(ord.order_status === 'ready' || ord.order_status === 'delivered') && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'completed')}
                        className="px-2.5 py-1.5 bg-[#15803D] hover:bg-[#166534] text-white text-xs font-semibold rounded-md flex items-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Complete Order</span>
                      </button>
                    )}

                    {/* Cancel button */}
                    {ord.order_status !== 'completed' && ord.order_status !== 'cancelled' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'cancelled')}
                        className="px-2 py-1.5 border border-[#FCA5A5] text-[#991B1B] hover:bg-[#FEF2F2] text-xs font-medium rounded-md ml-auto"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PRODUCT MANAGEMENT */}
      {activeAdminSubTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm text-[#1C201D]">Farm Egg Products</h2>
            <button
              onClick={() => setIsAddingProduct(true)}
              className="px-3 py-1.5 bg-[#0F2F1D] hover:bg-[#1B4329] text-white text-xs font-semibold rounded-lg flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Crate</span>
            </button>
          </div>

          {/* Add Product Form */}
          {isAddingProduct && (
            <form onSubmit={handleCreateProduct} className="bg-white border border-[#0F2F1D] rounded-xl p-4 space-y-3 text-xs">
              <h3 className="font-bold text-sm text-[#0F2F1D]">New Egg Product</h3>
              <div>
                <label className="font-semibold block mb-1">Product Title</label>
                <input
                  type="text"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Jumbo Crate (30 Extra-Large)"
                  required
                  className="w-full h-9 px-3 border border-[#D5DDD2] rounded-md bg-[#F9FAF8]"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Description</label>
                <input
                  type="text"
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  placeholder="Farm description..."
                  className="w-full h-9 px-3 border border-[#D5DDD2] rounded-md bg-[#F9FAF8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Price (₦)</label>
                  <input
                    type="number"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    required
                    className="w-full h-9 px-3 border border-[#D5DDD2] rounded-md bg-[#F9FAF8]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Pack Size (Eggs)</label>
                  <input
                    type="number"
                    value={newProdPackSize}
                    onChange={(e) => setNewProdPackSize(Number(e.target.value))}
                    required
                    className="w-full h-9 px-3 border border-[#D5DDD2] rounded-md bg-[#F9FAF8]"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0F2F1D] text-white font-semibold rounded-md"
                >
                  Save Product
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingProduct(false)}
                  className="px-4 py-2 border border-[#D5DDD2] text-[#5A635D] rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Products Table/List */}
          <div className="space-y-3">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-[#E2E8DF] rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-2xs"
              >
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-[#1C201D]">{p.name}</h3>
                    <span className="text-[11px] text-[#5A635D]">({p.pack_size} eggs)</span>
                  </div>
                  <p className="text-xs text-[#5A635D] mt-0.5">{p.description}</p>
                  <span className="font-bold text-sm text-[#0F2F1D] mt-1 block">
                    {formatNgn(p.price)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Availability Toggle */}
                  <button
                    onClick={() => updateProduct({ ...p, available: !p.available })}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                      p.available
                        ? 'bg-[#DCFCE7] text-[#15803D] hover:bg-[#BBF7D0]'
                        : 'bg-[#FEE2E2] text-[#991B1B] hover:bg-[#FECACA]'
                    }`}
                  >
                    {p.available ? 'Available' : 'Sold Out'}
                  </button>

                  <button
                    onClick={() => setEditingProduct(p)}
                    className="p-1.5 border border-[#D5DDD2] rounded-md text-[#5A635D] hover:text-[#0F2F1D]"
                    title="Edit Product"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Edit Product Modal */}
          {editingProduct && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
              <form
                onSubmit={handleSaveProductEdit}
                className="bg-white rounded-xl p-5 w-full max-w-sm border border-[#E2E8DF] space-y-3 text-xs"
              >
                <h3 className="font-bold text-sm text-[#1C201D]">Edit Product</h3>

                <div>
                  <label className="font-semibold block mb-1">Title</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, name: e.target.value })
                    }
                    className="w-full h-9 px-3 border border-[#D5DDD2] rounded-md bg-[#F9FAF8]"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Price (₦)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                    }
                    className="w-full h-9 px-3 border border-[#D5DDD2] rounded-md bg-[#F9FAF8]"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Pack Size</label>
                  <input
                    type="number"
                    value={editingProduct.pack_size}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        pack_size: Number(e.target.value),
                      })
                    }
                    className="w-full h-9 px-3 border border-[#D5DDD2] rounded-md bg-[#F9FAF8]"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-[#0F2F1D] text-white font-semibold rounded-md"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 border border-[#D5DDD2] text-[#5A635D] rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SETTINGS MANAGEMENT */}
      {activeAdminSubTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white border border-[#E2E8DF] rounded-xl p-5 space-y-4 shadow-2xs text-xs">
          <div>
            <h2 className="font-bold text-sm text-[#1C201D]">Bank & Delivery Settings</h2>
            <p className="text-[11px] text-[#5A635D]">
              Changes update immediately on the student checkout screen without code deploys.
            </p>
          </div>

          {settingsSavedMsg && (
            <div className="p-2.5 bg-[#DCFCE7] text-[#15803D] rounded-lg font-semibold flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>Settings updated successfully.</span>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <div>
              <label className="font-semibold text-[#1C201D] block mb-1">Receiving Bank Name</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                required
                className="w-full h-9 px-3 border border-[#D5DDD2] rounded-md bg-[#F9FAF8]"
              />
            </div>

            <div>
              <label className="font-semibold text-[#1C201D] block mb-1">Account Holder Name</label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                required
                className="w-full h-9 px-3 border border-[#D5DDD2] rounded-md bg-[#F9FAF8]"
              />
            </div>

            <div>
              <label className="font-semibold text-[#1C201D] block mb-1">Bank Account Number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
                className="w-full h-9 px-3 border border-[#D5DDD2] rounded-md bg-[#F9FAF8] font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-[#1C201D] block mb-1">
                Standard Campus Hostel Delivery Fee (₦)
              </label>
              <input
                type="number"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(Number(e.target.value))}
                required
                className="w-full h-9 px-3 border border-[#D5DDD2] rounded-md bg-[#F9FAF8]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-10 bg-[#0F2F1D] text-white font-semibold rounded-md flex items-center justify-center gap-2 hover:bg-[#1B4329] transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </form>
      )}
    </div>
  );
}
