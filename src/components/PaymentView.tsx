'use client';

import React, { useState } from 'react';
import { Order } from '@/types';
import { useStore } from '@/lib/store';
import {
  Copy,
  Check,
  AlertCircle,
  Building2,
  MessageCircle,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

interface PaymentViewProps {
  order: Order;
  onPaymentConfirmedByStudent: () => void;
}

export function PaymentView({ order, onPaymentConfirmedByStudent }: PaymentViewProps) {
  const { settings, markPaymentSubmitted } = useStore();
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [senderAccountName, setSenderAccountName] = useState('');
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

  // WhatsApp verification message pre-fill
  const senderInfo = senderAccountName.trim() ? ` (Transferred from: ${senderAccountName.trim()})` : '';
  const whatsappMsg = encodeURIComponent(
    `Hello Olamide, I have made a bank transfer of ${formatNgn(order.total)} for Order ${order.order_number} to ${order.delivery_location}${senderInfo}. Please verify my payment.`
  );
  const whatsappUrl = `https://wa.me/${settings.support_whatsapp}?text=${whatsappMsg}`;

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-[#FEF3C7] border border-[#FDE68A] p-4 sm:p-5 rounded-2xl text-[#92400E]">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-[#B45309] mt-0.5" />
          <div>
            <h2 className="font-extrabold text-sm sm:text-base text-[#78350F]">
              Bank Transfer Payment Required
            </h2>
            <p className="text-xs text-[#92400E] mt-1 leading-relaxed">
              Please transfer the exact total below to the verified ELEO farm Access Bank account. Include your order reference number in the transfer narration for instant automated reconciliation.
            </p>
          </div>
        </div>
      </div>

      {/* Amount Callout Card */}
      <div className="bg-white border border-[#E2E8DF] rounded-2xl p-6 text-center shadow-xs space-y-2">
        <span className="text-xs font-bold text-[#5A635D] block uppercase tracking-wider">
          Total Amount to Transfer
        </span>
        <div className="text-3xl sm:text-4xl font-black text-[#0F2F1D] tracking-tight">
          {formatNgn(order.total)}
        </div>
        <div className="inline-flex items-center gap-2 mt-2 bg-[#F3F6F2] px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#0F2F1D] border border-[#D5E4D8]">
          <span>Payment Reference:</span>
          <strong className="font-mono font-bold text-[#1C201D] text-sm">
            {order.order_number}
          </strong>
          <button
            onClick={handleCopyRef}
            className="p-1 hover:text-[#15803D] transition-colors"
            title="Copy Order Reference"
          >
            {copiedRef ? (
              <span className="flex items-center gap-1 text-[11px] text-[#15803D] font-bold">
                <Check className="w-3.5 h-3.5" /> Copied
              </span>
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Receiving Bank Account Details Card */}
      <div className="bg-white border-2 border-[#CBD5C8] rounded-2xl p-6 sm:p-7 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0F4EF]">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#0F2F1D]" />
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-[#1C201D]">
              Receiving Bank Account
            </h3>
          </div>
          <span className="text-[10px] font-bold bg-[#004B87] text-white px-2 py-0.5 rounded-md uppercase">
            Access Bank Verified
          </span>
        </div>

        <div className="space-y-3.5 text-xs sm:text-sm">
          <div className="flex justify-between items-center py-1">
            <span className="text-[#5A635D] font-medium">Bank Name</span>
            <span className="font-extrabold text-[#1C201D] text-sm sm:text-base">
              {settings.bank_details.bank_name}
            </span>
          </div>

          <div className="flex justify-between items-center py-1">
            <span className="text-[#5A635D] font-medium">Account Name</span>
            <span className="font-extrabold text-[#1C201D]">
              {settings.bank_details.account_name}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F9FAF8] p-4 rounded-xl border border-[#D5DDD2]">
            <div>
              <span className="text-[10px] text-[#5A635D] uppercase tracking-wider block font-bold">
                Account Number (NUBAN)
              </span>
              <span className="font-mono font-black text-xl sm:text-2xl text-[#0F2F1D] tracking-wider block mt-0.5">
                {settings.bank_details.account_number}
              </span>
            </div>

            <button
              onClick={handleCopyAcc}
              className="h-10 px-4 bg-[#0F2F1D] hover:bg-[#1B4329] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95"
            >
              {copiedAcc ? (
                <>
                  <Check className="w-4 h-4 text-[#86EFAC]" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Account Number</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sender Name Assist for 3-Second Reconciliation */}
        <div className="pt-2">
          <label className="text-xs font-bold text-[#1C201D] block mb-1">
            Sender Bank Account Name (Optional, for instant alert matching):
          </label>
          <input
            type="text"
            value={senderAccountName}
            onChange={(e) => setSenderAccountName(e.target.value)}
            placeholder="e.g. David Adeleke (or name on debit alert)"
            className="w-full h-10 px-3.5 border border-[#D5DDD2] rounded-xl text-xs text-[#1C201D] placeholder-[#9CA3AF] focus:border-[#0F2F1D] focus:ring-1 focus:ring-[#0F2F1D] outline-hidden bg-[#F9FAF8]"
          />
          <span className="text-[10px] text-[#5A635D] mt-1 block">
            Helps Olamide confirm your payment immediately even if your bank strips the narration.
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleMadePayment}
          disabled={isProcessing}
          className="w-full h-13 bg-[#15803D] hover:bg-[#166534] text-white font-black text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
        >
          {isProcessing ? (
            <span>Confirming Order...</span>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5 text-[#86EFAC]" />
              <span>I Have Made This Transfer (Generate Docket)</span>
            </>
          )}
        </button>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-11 bg-white hover:bg-[#F3F6F2] border border-[#CBD5C8] text-[#1C201D] font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs"
        >
          <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]" />
          <span>Send Debit Receipt / Alert on WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
