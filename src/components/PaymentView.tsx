'use client';

import React, { useState } from 'react';
import { Order } from '@/types';
import { useStore } from '@/lib/store';
import { Copy, Check, ArrowRight, AlertCircle, Building2 } from 'lucide-react';

interface PaymentViewProps {
  order: Order;
  onPaymentConfirmedByStudent: () => void;
}

export function PaymentView({ order, onPaymentConfirmedByStudent }: PaymentViewProps) {
  const { settings, markPaymentSubmitted } = useStore();
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatNgn = (amt: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amt);

  const handleCopyAcc = () => {
    navigator.clipboard.writeText(settings.bank_details.account_number);
    setCopiedAcc(true);
    setTimeout(() => setCopiedAcc(false), 2000);
  };

  const handleCopyRef = () => {
    navigator.clipboard.writeText(order.order_number);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleMadePayment = () => {
    setIsProcessing(true);
    markPaymentSubmitted(order.id);
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentConfirmedByStudent();
    }, 600);
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      {/* Banner */}
      <div className="bg-[#FEF3C7] border border-[#FDE68A] p-4 rounded-xl text-[#92400E]">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0 text-[#B45309] mt-0.5" />
          <div>
            <h2 className="font-bold text-sm text-[#78350F]">
              Bank Transfer Payment Required
            </h2>
            <p className="text-xs text-[#92400E] mt-0.5 leading-relaxed">
              Please transfer the exact total below to the ELEO farm bank account using your order number as payment narration.
            </p>
          </div>
        </div>
      </div>

      {/* Amount Callout Card */}
      <div className="bg-white border border-[#E2E8DF] rounded-xl p-5 text-center shadow-xs">
        <span className="text-xs font-semibold text-[#5A635D] block mb-1">
          Total Amount to Transfer
        </span>
        <div className="text-3xl font-extrabold text-[#0F2F1D] tracking-tight">
          {formatNgn(order.total)}
        </div>
        <div className="inline-flex items-center gap-1.5 mt-2 bg-[#F3F6F2] px-3 py-1 rounded-full text-xs font-medium text-[#0F2F1D]">
          <span>Order Reference:</span>
          <strong className="font-bold text-[#1C201D]">{order.order_number}</strong>
          <button
            onClick={handleCopyRef}
            className="ml-1 p-0.5 hover:text-[#15803D]"
            title="Copy Order Number"
          >
            {copiedRef ? <Check className="w-3.5 h-3.5 text-[#15803D]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Bank Account Details Card */}
      <div className="bg-white border border-[#E2E8DF] rounded-xl p-5 space-y-3.5 shadow-xs">
        <div className="flex items-center gap-2 pb-3 border-b border-[#F0F4EF]">
          <Building2 className="w-4 h-4 text-[#0F2F1D]" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-[#1C201D]">
            Receiving Bank Account
          </h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-[#5A635D]">Bank Name</span>
            <span className="font-bold text-[#1C201D] text-sm">
              {settings.bank_details.bank_name}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#5A635D]">Account Name</span>
            <span className="font-semibold text-[#1C201D]">
              {settings.bank_details.account_name}
            </span>
          </div>

          <div className="flex justify-between items-center bg-[#F9FAF8] p-3 rounded-lg border border-[#E2E8DF]">
            <div>
              <span className="text-[10px] text-[#5A635D] uppercase tracking-wider block">
                Account Number
              </span>
              <span className="font-mono font-bold text-lg text-[#0F2F1D] tracking-wider block">
                {settings.bank_details.account_number}
              </span>
            </div>

            <button
              onClick={handleCopyAcc}
              className="px-3 py-1.5 bg-[#0F2F1D] text-white rounded-md text-xs font-semibold flex items-center gap-1 hover:bg-[#1B4329] transition-colors"
            >
              {copiedAcc ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#86EFAC]" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-[#F3F6F2] p-3 rounded-lg border border-[#D5E4D8] text-[11px] text-[#0F2F1D] leading-relaxed">
            <strong>Important:</strong> Put <code className="bg-white px-1.5 py-0.5 rounded font-bold text-[#78350F]">{order.order_number}</code> in the transfer remark so our operations administrator can verify your transfer immediately.
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="pt-2">
        <button
          onClick={handleMadePayment}
          disabled={isProcessing}
          className="w-full h-12 bg-[#0F2F1D] hover:bg-[#1B4329] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
        >
          <span>
            {isProcessing ? 'Verifying Submission...' : "I've Made Payment"}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <p className="text-[11px] text-[#5A635D] text-center mt-2.5">
          Tapping above updates your order status to pending verification and routes you to the live tracking docket.
        </p>
      </div>
    </div>
  );
}
