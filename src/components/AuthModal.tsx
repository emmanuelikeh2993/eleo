'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { GoalType } from '@/types';
import { X, Lock, User, Phone, Building2, KeyRound, Sparkles, CheckCircle2 } from 'lucide-react';

export function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authIntent,
    loginStudent,
    registerStudent,
    setActiveTab,
  } = useStore();

  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');

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

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear all form fields completely to protect privacy
  const resetAllFields = () => {
    setPhone('');
    setPin('');
    setRegName('');
    setRegPhone('');
    setRegHostel('');
    setRegRoom('');
    setRegPin('');
    setRegGoal('muscle');
    setErrorMsg('');
  };

  // Whenever modal opens or closes, always present fresh blank fields
  React.useEffect(() => {
    if (isAuthModalOpen) {
      resetAllFields();
      setErrorMsg('');
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    resetAllFields();
    closeAuthModal();
  };

  const handleStudentSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    const res = await loginStudent(phone, pin);
    setIsSubmitting(false);

    if (res.success) {
      resetAllFields();
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
      resetAllFields();
      if (authIntent === 'orders') setActiveTab('track');
      else if (authIntent === 'profile') setActiveTab('history');
      else setActiveTab('store');
    } else {
      setErrorMsg(res.error || 'Registration failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#E2E8DF] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 bg-[#0F2F1D] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#86EFAC]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-base">
                {authMode === 'register' ? 'Create Student Profile' : 'Student Sign In'}
              </h2>
              <p className="text-[11px] text-[#A5C4AF]">
                {authMode === 'register'
                  ? 'Required for direct hostel room egg delivery'
                  : 'Welcome back to ELEO Campus Hub'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close auth modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#E2E8DF] text-xs font-bold bg-[#F9FAF8]">
          <button
            type="button"
            onClick={() => {
              setAuthMode('signin');
              resetAllFields();
            }}
            className={`flex-1 py-3 text-center transition-colors ${
              authMode === 'signin'
                ? 'border-b-2 border-[#0F2F1D] text-[#0F2F1D] bg-white'
                : 'text-[#5A635D] hover:text-[#1C201D]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('register');
              resetAllFields();
            }}
            className={`flex-1 py-3 text-center transition-colors ${
              authMode === 'register'
                ? 'border-b-2 border-[#0F2F1D] text-[#0F2F1D] bg-white'
                : 'text-[#5A635D] hover:text-[#1C201D]'
            }`}
          >
            Register Student Profile
          </button>
        </div>

        {/* Context Explainer Banner */}
        <div className="bg-[#F0F5F1] px-5 py-2.5 border-b border-[#D5E4D8] flex items-center gap-2 text-xs text-[#0F2F1D]">
          <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
          <span className="text-[11px] leading-tight">
            Your hostel & room details ensure the runner delivers directly to your door.
          </span>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] text-xs rounded-lg font-medium">
              {errorMsg}
            </div>
          )}

          {/* MODE 1: STUDENT SIGN IN */}
          {authMode === 'signin' && (
            <form onSubmit={handleStudentSignIn} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#1C201D] block mb-1">
                  Active Phone / WhatsApp Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-[#9CA3AF]" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 08012345678"
                    required
                    className="w-full h-10 pl-9 pr-3 border border-[#D5DDD2] rounded-lg text-xs text-[#1C201D] placeholder-[#9CA3AF] focus:border-[#0F2F1D] focus:ring-1 focus:ring-[#0F2F1D] outline-hidden bg-[#F9FAF8]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#1C201D] block mb-1">
                  4-Digit Security PIN
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-3 text-[#9CA3AF]" />
                  <input
                    type="password"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="4-digit PIN"
                    required
                    className="w-full h-10 pl-9 pr-3 border border-[#D5DDD2] rounded-lg text-xs text-[#1C201D] placeholder-[#9CA3AF] focus:border-[#0F2F1D] focus:ring-1 focus:ring-[#0F2F1D] outline-hidden bg-[#F9FAF8] tracking-widest"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-[#0F2F1D] hover:bg-[#1B4329] text-white font-bold text-xs rounded-xl flex items-center justify-center transition-all shadow-md active:scale-98"
              >
                {isSubmitting ? 'Verifying Account...' : 'Sign In & Access Store'}
              </button>

              <div className="pt-2 border-t border-[#F0F4EF] text-center">
                <span className="text-xs text-[#5A635D]">New student ordering for first time? </span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    resetAllFields();
                  }}
                  className="text-xs font-bold text-[#0F2F1D] hover:underline"
                >
                  Create Student Profile
                </button>
              </div>
            </form>
          )}

          {/* MODE 2: STUDENT REGISTRATION */}
          {authMode === 'register' && (
            <form onSubmit={handleStudentRegister} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-[#1C201D] block mb-1">
                  Full Name <span className="text-[#DC2626]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-[#9CA3AF]" />
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. David Adeleke"
                    required
                    className="w-full h-10 pl-9 pr-3 border border-[#D5DDD2] rounded-lg text-xs text-[#1C201D] placeholder-[#9CA3AF] focus:border-[#0F2F1D] focus:ring-1 focus:ring-[#0F2F1D] outline-hidden bg-[#F9FAF8]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#1C201D] block mb-1">
                  Active Phone / WhatsApp Number <span className="text-[#DC2626]">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-[#9CA3AF]" />
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="e.g. 08012345678"
                    required
                    className="w-full h-10 pl-9 pr-3 border border-[#D5DDD2] rounded-lg text-xs text-[#1C201D] placeholder-[#9CA3AF] focus:border-[#0F2F1D] focus:ring-1 focus:ring-[#0F2F1D] outline-hidden bg-[#F9FAF8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-bold text-[#1C201D] block mb-1">
                    Hostel / Hall <span className="text-[#DC2626]">*</span>
                  </label>
                  <input
                    type="text"
                    value={regHostel}
                    onChange={(e) => setRegHostel(e.target.value)}
                    placeholder="e.g. Hall 2"
                    required
                    className="w-full h-10 px-3 border border-[#D5DDD2] rounded-lg text-xs text-[#1C201D] placeholder-[#9CA3AF] focus:border-[#0F2F1D] focus:ring-1 focus:ring-[#0F2F1D] outline-hidden bg-[#F9FAF8]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#1C201D] block mb-1">
                    Room / Block <span className="text-[#DC2626]">*</span>
                  </label>
                  <input
                    type="text"
                    value={regRoom}
                    onChange={(e) => setRegRoom(e.target.value)}
                    placeholder="e.g. Room 14"
                    required
                    className="w-full h-10 px-3 border border-[#D5DDD2] rounded-lg text-xs text-[#1C201D] placeholder-[#9CA3AF] focus:border-[#0F2F1D] focus:ring-1 focus:ring-[#0F2F1D] outline-hidden bg-[#F9FAF8]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#1C201D] block mb-1">
                  Create 4-Digit Security PIN <span className="text-[#DC2626]">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-3 text-[#9CA3AF]" />
                  <input
                    type="password"
                    maxLength={4}
                    value={regPin}
                    onChange={(e) => setRegPin(e.target.value)}
                    placeholder="e.g. 1234"
                    required
                    className="w-full h-10 pl-9 pr-3 border border-[#D5DDD2] rounded-lg text-xs text-[#1C201D] placeholder-[#9CA3AF] focus:border-[#0F2F1D] focus:ring-1 focus:ring-[#0F2F1D] outline-hidden bg-[#F9FAF8] tracking-widest"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#1C201D] block mb-1">
                  Campus Health & Nutrition Goal
                </label>
                <select
                  value={regGoal}
                  onChange={(e) => setRegGoal(e.target.value as GoalType)}
                  className="w-full h-10 px-3 border border-[#D5DDD2] rounded-lg text-xs text-[#1C201D] focus:border-[#0F2F1D] focus:ring-1 focus:ring-[#0F2F1D] outline-hidden bg-[#F9FAF8]"
                >
                  <option value="muscle">Muscle Gain & Gym Protein</option>
                  <option value="budget">Budget Meal Prep & Quick Cooking</option>
                  <option value="study">Study Focus & Brain Fuel</option>
                  <option value="weight">Healthy Energy & Weight Control</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-[#0F2F1D] hover:bg-[#1B4329] text-white font-bold text-xs rounded-xl flex items-center justify-center transition-all shadow-md active:scale-98 mt-2"
              >
                {isSubmitting ? 'Creating Profile...' : 'Complete Profile & Start Ordering'}
              </button>

              <div className="pt-2 border-t border-[#F0F4EF] text-center">
                <span className="text-xs text-[#5A635D]">Already have a profile? </span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    resetAllFields();
                  }}
                  className="text-xs font-bold text-[#0F2F1D] hover:underline"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
