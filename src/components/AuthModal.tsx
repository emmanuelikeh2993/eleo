'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { GoalType } from '@/types';
import {
  X,
  Lock,
  User,
  Phone,
  Building2,
  KeyRound,
  CheckCircle2,
  MessageCircle,
  HelpCircle,
} from 'lucide-react';

export function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authIntent,
    authInitialMode,
    loginStudent,
    registerStudent,
    resetStudentPin,
    setActiveTab,
    settings,
  } = useStore();

  const [authMode, setAuthMode] = useState<'signin' | 'register' | 'forgot'>('signin');

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

  // Forgot Password fields
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotRoom, setForgotRoom] = useState('');
  const [forgotNewPin, setForgotNewPin] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
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
    setForgotPhone('');
    setForgotRoom('');
    setForgotNewPin('');
    setErrorMsg('');
    setSuccessMsg('');
  };

  // Synchronize modal mode with authInitialMode when opened
  useEffect(() => {
    if (isAuthModalOpen) {
      setAuthMode(authInitialMode || 'signin');
      resetAllFields();
    }
  }, [isAuthModalOpen, authInitialMode]);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    resetAllFields();
    closeAuthModal();
  };

  const handleStudentSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
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
    setSuccessMsg('');
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

  const handleResetPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);
    const res = await resetStudentPin(forgotPhone, forgotRoom, forgotNewPin);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMsg('Your security PIN has been updated successfully! You can now sign in.');
      setForgotPhone('');
      setForgotRoom('');
      setForgotNewPin('');
    } else {
      setErrorMsg(res.error || 'PIN reset failed.');
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
                {authMode === 'register'
                  ? 'Create Student Profile (Sign Up)'
                  : authMode === 'forgot'
                  ? 'Reset Security PIN'
                  : 'Student Sign In'}
              </h2>
              <p className="text-[11px] text-[#A5C4AF]">
                {authMode === 'register'
                  ? 'Required for direct hostel room egg delivery'
                  : authMode === 'forgot'
                  ? 'Verify your registered room to set a new PIN'
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

        {/* Tab Switcher (Sign In vs Sign Up) */}
        {authMode !== 'forgot' && (
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
              Sign Up
            </button>
          </div>
        )}

        {/* Explainer Banner */}
        <div className="bg-[#F0F5F1] px-5 py-2.5 border-b border-[#D5E4D8] flex items-center gap-2 text-xs text-[#0F2F1D]">
          <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
          <span className="text-[11px] leading-tight">
            {authMode === 'forgot'
              ? 'Enter your phone number and room to verify your account identity.'
              : 'Hostel room details ensure the runner delivers directly to your door.'}
          </span>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] text-xs rounded-lg font-medium">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-xs rounded-lg font-medium flex flex-col gap-2">
              <span>{successMsg}</span>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  resetAllFields();
                }}
                className="self-start text-xs font-bold text-[#0F2F1D] underline"
              >
                Sign In Now →
              </button>
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

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('forgot');
                    resetAllFields();
                  }}
                  className="text-xs font-semibold text-[#0F2F1D] hover:underline"
                >
                  Forgot PIN / Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-[#0F2F1D] hover:bg-[#1B4329] text-white font-bold text-xs rounded-xl flex items-center justify-center transition-all shadow-md active:scale-98"
              >
                {isSubmitting ? 'Verifying Account...' : 'Sign In & Access Store'}
              </button>

              <div className="pt-3 border-t border-[#F0F4EF] text-center">
                <span className="text-xs text-[#5A635D]">Don&apos;t have an account? </span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    resetAllFields();
                  }}
                  className="text-xs font-bold text-[#0F2F1D] hover:underline"
                >
                  Sign Up
                </button>
              </div>
            </form>
          )}

          {/* MODE 2: STUDENT REGISTRATION (SIGN UP) */}
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

              <div className="pt-3 border-t border-[#F0F4EF] text-center">
                <span className="text-xs text-[#5A635D]">Already have an account? </span>
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

          {/* MODE 3: FORGOTTEN PIN / PASSWORD RECOVERY */}
          {authMode === 'forgot' && (
            <form onSubmit={handleResetPin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#1C201D] block mb-1">
                  Registered Phone / WhatsApp Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-[#9CA3AF]" />
                  <input
                    type="tel"
                    value={forgotPhone}
                    onChange={(e) => setForgotPhone(e.target.value)}
                    placeholder="e.g. 08012345678"
                    required
                    className="w-full h-10 pl-9 pr-3 border border-[#D5DDD2] rounded-lg text-xs text-[#1C201D] placeholder-[#9CA3AF] focus:border-[#0F2F1D] focus:ring-1 focus:ring-[#0F2F1D] outline-hidden bg-[#F9FAF8]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#1C201D] block mb-1">
                  Registered Hostel Room Number
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3 top-3 text-[#9CA3AF]" />
                  <input
                    type="text"
                    value={forgotRoom}
                    onChange={(e) => setForgotRoom(e.target.value)}
                    placeholder="e.g. Room 14 or 14"
                    required
                    className="w-full h-10 pl-9 pr-3 border border-[#D5DDD2] rounded-lg text-xs text-[#1C201D] placeholder-[#9CA3AF] focus:border-[#0F2F1D] focus:ring-1 focus:ring-[#0F2F1D] outline-hidden bg-[#F9FAF8]"
                  />
                </div>
                <span className="text-[10px] text-[#5A635D] mt-1 block">
                  Used to verify you are the account owner without SMS delays.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-[#1C201D] block mb-1">
                  Enter New 4-Digit Security PIN
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-3 text-[#9CA3AF]" />
                  <input
                    type="password"
                    maxLength={4}
                    value={forgotNewPin}
                    onChange={(e) => setForgotNewPin(e.target.value)}
                    placeholder="e.g. 5678"
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
                {isSubmitting ? 'Verifying & Saving...' : 'Save New Security PIN'}
              </button>

              <div className="pt-2 text-center">
                <a
                  href={`https://wa.me/${settings.support_whatsapp}?text=Hello%20ELEO%20Farm,%20I'm%20having%20trouble%20recovering%20my%20account%20PIN.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] text-[#15803D] font-bold hover:underline"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Or ask Dispatch for help on WhatsApp</span>
                </a>
              </div>

              <div className="pt-3 border-t border-[#F0F4EF] text-center">
                <span className="text-xs text-[#5A635D]">Remember your PIN? </span>
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
