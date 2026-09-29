'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { GoalType } from '@/types';
import { X, Lock, User, Phone, Building2, ShieldCheck, KeyRound, Sparkles } from 'lucide-react';

export function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authIntent,
    loginStudent,
    registerStudent,
    loginAdmin,
    setActiveTab,
  } = useStore();

  const [authMode, setAuthMode] = useState<'signin' | 'register' | 'admin'>(
    authIntent === 'admin' ? 'admin' : 'signin'
  );

  // Student Sign-in fields
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');

  // Student Register fields
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regHostel, setRegHostel] = useState('');
  const [regRoom, setRegRoom] = useState('');
  const [regPin, setRegPin] = useState('');
  const [regGoal, setRegGoal] = useState<GoalType>('muscle');

  // Admin fields
  const [adminPassword, setAdminPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update mode when authIntent changes
  React.useEffect(() => {
    if (authIntent === 'admin') {
      setAuthMode('admin');
    } else if (authMode === 'admin') {
      setAuthMode('signin');
    }
  }, [authIntent]);

  if (!isAuthModalOpen) return null;

  const handleStudentSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    const res = await loginStudent(phone, pin);
    setIsSubmitting(false);

    if (res.success) {
      if (authIntent === 'orders') setActiveTab('track');
      else if (authIntent === 'profile') setActiveTab('history');
      else setActiveTab('store');
    } else {
      setErrorMsg(res.error || 'Sign in failed. Check your phone number or PIN.');
    }
  };

  const handleStudentRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    const res = await registerStudent({
      name: regName,
      phone: regPhone,
      hostel: regHostel,
      room: regRoom,
      pin: regPin,
      goal: regGoal,
    });
    setIsSubmitting(false);

    if (res.success) {
      if (authIntent === 'orders') setActiveTab('track');
      else if (authIntent === 'profile') setActiveTab('history');
      else setActiveTab('store');
    } else {
      setErrorMsg(res.error || 'Registration failed.');
    }
  };

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    const res = await loginAdmin(adminPassword);
    setIsSubmitting(false);

    if (res.success) {
      setActiveTab('admin');
    } else {
      setErrorMsg(res.error || 'Invalid admin credentials.');
    }
  };

  const handleDemoStudentFill = () => {
    setPhone('08012345678');
    setPin('1234');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl border border-[#E2E8DF] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 bg-[#0F2F1D] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#86EFAC]" />
            <h2 className="font-bold text-sm">
              {authMode === 'admin'
                ? 'Admin Operations Access'
                : authMode === 'register'
                ? 'Student Registration'
                : 'Student Sign In'}
            </h2>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1 rounded-md text-white/70 hover:text-white hover:bg-white/10"
            aria-label="Close auth modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#E2E8DF] text-xs font-semibold bg-[#F9FAF8]">
          <button
            type="button"
            onClick={() => {
              setAuthMode('signin');
              setErrorMsg('');
            }}
            className={`flex-1 py-2.5 text-center transition-colors ${
              authMode === 'signin'
                ? 'bg-white border-b-2 border-[#0F2F1D] text-[#0F2F1D]'
                : 'text-[#5A635D] hover:text-[#1C201D]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('register');
              setErrorMsg('');
            }}
            className={`flex-1 py-2.5 text-center transition-colors ${
              authMode === 'register'
                ? 'bg-white border-b-2 border-[#0F2F1D] text-[#0F2F1D]'
                : 'text-[#5A635D] hover:text-[#1C201D]'
            }`}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('admin');
              setErrorMsg('');
            }}
            className={`py-2.5 px-3 text-center transition-colors flex items-center gap-1 ${
              authMode === 'admin'
                ? 'bg-white border-b-2 border-[#0F2F1D] text-[#0F2F1D]'
                : 'text-[#5A635D] hover:text-[#1C201D]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5">
          {errorMsg && (
            <div className="mb-4 p-2.5 bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] text-xs rounded-lg font-medium">
              {errorMsg}
            </div>
          )}

          {/* MODE 1: STUDENT SIGN IN */}
          {authMode === 'signin' && (
            <form onSubmit={handleStudentSignIn} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-[#1C201D] block mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 08012345678"
                    required
                    className="w-full h-9 pl-9 pr-3 border border-[#D5DDD2] rounded-md text-xs bg-[#F9FAF8] focus:border-[#0F2F1D] outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#1C201D] block mb-1">
                  Security PIN / Password
                </label>
                <div className="relative">
                  <KeyRound className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-3" />
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="4-digit PIN (default 1234)"
                    required
                    className="w-full h-9 pl-9 pr-3 border border-[#D5DDD2] rounded-md text-xs bg-[#F9FAF8] focus:border-[#0F2F1D] outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleDemoStudentFill}
                  className="text-[11px] text-[#0F2F1D] font-semibold hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-[#15803D]" />
                  <span>Use Demo Student (08012345678)</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 bg-[#0F2F1D] hover:bg-[#1B4329] text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
              >
                {isSubmitting ? 'Authorizing...' : 'Sign In & Continue'}
              </button>

              <p className="text-[11px] text-[#5A635D] text-center pt-1">
                New on campus?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className="font-bold text-[#0F2F1D] hover:underline"
                >
                  Create Student Account
                </button>
              </p>
            </form>
          )}

          {/* MODE 2: STUDENT REGISTRATION */}
          {authMode === 'register' && (
            <form onSubmit={handleStudentRegister} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#1C201D] block mb-1">
                  Full Name <span className="text-[#991B1B]">*</span>
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. David Adeleke"
                    required
                    className="w-full h-9 pl-9 pr-3 border border-[#D5DDD2] rounded-md text-xs bg-[#F9FAF8] focus:border-[#0F2F1D] outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#1C201D] block mb-1">
                  Phone Number (WhatsApp) <span className="text-[#991B1B]">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="e.g. 08123456789"
                    required
                    className="w-full h-9 pl-9 pr-3 border border-[#D5DDD2] rounded-md text-xs bg-[#F9FAF8] focus:border-[#0F2F1D] outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-[#1C201D] block mb-1">
                    Hostel / Hall <span className="text-[#991B1B]">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-2.5 top-3" />
                    <input
                      type="text"
                      value={regHostel}
                      onChange={(e) => setRegHostel(e.target.value)}
                      placeholder="e.g. Hall 2"
                      required
                      className="w-full h-9 pl-8 pr-2 border border-[#D5DDD2] rounded-md text-xs bg-[#F9FAF8] focus:border-[#0F2F1D] outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-[#1C201D] block mb-1">
                    Room No <span className="text-[#991B1B]">*</span>
                  </label>
                  <input
                    type="text"
                    value={regRoom}
                    onChange={(e) => setRegRoom(e.target.value)}
                    placeholder="e.g. B14"
                    required
                    className="w-full h-9 px-3 border border-[#D5DDD2] rounded-md text-xs bg-[#F9FAF8] focus:border-[#0F2F1D] outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#1C201D] block mb-1">
                  Create 4-Digit Security PIN <span className="text-[#991B1B]">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-3" />
                  <input
                    type="password"
                    maxLength={6}
                    value={regPin}
                    onChange={(e) => setRegPin(e.target.value)}
                    placeholder="4-digit PIN for future orders"
                    required
                    className="w-full h-9 pl-9 pr-3 border border-[#D5DDD2] rounded-md text-xs bg-[#F9FAF8] focus:border-[#0F2F1D] outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#1C201D] block mb-1">
                  Fitness & Nutrition Goal
                </label>
                <select
                  value={regGoal}
                  onChange={(e) => setRegGoal(e.target.value as GoalType)}
                  className="w-full h-9 px-3 border border-[#D5DDD2] rounded-md text-xs bg-[#F9FAF8] focus:border-[#0F2F1D] outline-hidden"
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
                disabled={isSubmitting}
                className="w-full h-10 bg-[#0F2F1D] hover:bg-[#1B4329] text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
              >
                {isSubmitting ? 'Registering...' : 'Register & Save Delivery Address'}
              </button>
            </form>
          )}

          {/* MODE 3: ADMIN ACCESS PORTAL */}
          {authMode === 'admin' && (
            <form onSubmit={handleAdminSignIn} className="space-y-3.5 text-xs">
              <div className="p-3 bg-[#FEF3C7] border border-[#FDE68A] rounded-lg text-[#92400E]">
                <p className="text-[11px] font-semibold leading-relaxed">
                  Restricted to authorized ELEO farm staff. For local demonstration, use passkey: <code className="bg-white px-1.5 py-0.5 rounded font-bold text-[#78350F]">admin123</code> or <code className="bg-white px-1.5 py-0.5 rounded font-bold text-[#78350F]">eleo2026</code>.
                </p>
              </div>

              <div>
                <label className="font-semibold text-[#1C201D] block mb-1">
                  Operations Passkey / Password
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-3" />
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter admin password"
                    required
                    className="w-full h-9 pl-9 pr-3 border border-[#D5DDD2] rounded-md text-xs bg-[#F9FAF8] focus:border-[#0F2F1D] outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 bg-[#0F2F1D] hover:bg-[#1B4329] text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
              >
                {isSubmitting ? 'Verifying...' : 'Unlock Admin Operations Console'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
