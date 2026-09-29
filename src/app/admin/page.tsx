'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { AdminDashboard } from '@/components/AdminDashboard';
import { Lock, ShieldCheck, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';

export default function AdminPage() {
  const { isAdmin, setIsAdmin, loginAdmin, logout } = useStore();
  const [passkey, setPasskey] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    const res = await loginAdmin(passkey);
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Invalid administrator passkey.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAF8] text-[#1C201D] flex flex-col">
      {/* Admin Top Utility Bar */}
      <header className="bg-[#0F2F1D] text-white border-b border-[#1B4329] px-4 sm:px-6 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#A5C4AF] hover:text-white transition-colors"
              title="Return to Student Storefront"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/10 p-0.5 border border-white/20">
              <Image
                src="/logo.jpg"
                alt="ELEO Logo"
                width={32}
                height={32}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-base leading-none">
                  ELEO
                </span>
                <span className="text-[10px] font-bold bg-[#B45309] text-white px-2 py-0.5 rounded-sm uppercase tracking-wider">
                  Admin Console
                </span>
              </div>
              <span className="text-[11px] text-[#A5C4AF]">
                Dispatch & Payment Operations
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-xs text-[#C2D8C9] hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors font-medium"
            >
              View Student Store
            </Link>
            {isAdmin && (
              <button
                onClick={() => {
                  logout();
                  setIsAdmin(false);
                }}
                className="text-xs font-bold bg-[#DC2626] hover:bg-[#B91C1C] text-white px-3 py-1.5 rounded-lg transition-colors shadow-xs"
              >
                Sign Out Admin
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Admin Screen */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {isAdmin ? (
          <AdminDashboard />
        ) : (
          <div className="max-w-md mx-auto my-12 bg-white rounded-2xl shadow-xl border border-[#E2E8DF] p-6 sm:p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#E8F0EA] text-[#0F2F1D] flex items-center justify-center mx-auto mb-4 border border-[#CBD5C8]">
              <ShieldCheck className="w-7 h-7 text-[#0F2F1D]" />
            </div>

            <h1 className="text-xl font-extrabold text-[#0F2F1D]">
              Farm Operations Dispatch
            </h1>
            <p className="text-xs text-[#5A635D] mt-1.5 leading-relaxed">
              Restricted portal for Olowo Olamide Emmanuel and dispatch managers to reconcile Access Bank transfers and mark crate deliveries.
            </p>

            <form onSubmit={handleAdminLogin} className="mt-6 space-y-4 text-left">
              {errorMsg && (
                <div className="p-3 bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] text-xs rounded-lg font-medium">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-[#1C201D] block mb-1.5">
                  Enter Administrator Passkey
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-3 text-[#9CA3AF]" />
                  <input
                    type="password"
                    value={passkey}
                    onChange={(e) => setPasskey(e.target.value)}
                    placeholder="Enter passkey (e.g. admin123)"
                    required
                    autoFocus
                    className="w-full h-11 pl-9 pr-3 border border-[#D5DDD2] rounded-xl text-xs text-[#1C201D] placeholder-[#9CA3AF] focus:border-[#0F2F1D] focus:ring-1 focus:ring-[#0F2F1D] outline-hidden bg-[#F9FAF8]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-[#0F2F1D] hover:bg-[#1B4329] text-white font-bold text-xs rounded-xl flex items-center justify-center transition-all shadow-md active:scale-98"
              >
                {isSubmitting ? 'Authenticating...' : 'Enter Admin Console'}
              </button>

              <div className="pt-2 text-center">
                <span className="text-[11px] text-[#5A635D]">
                  Default demo passkey is <strong className="text-[#0F2F1D]">admin123</strong>
                </span>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
