import React, { useState, useEffect, useRef } from 'react';
import { useMess } from '../../context/MessContext';
import {
  ShieldCheck,
  Lock,
  X,
  KeyRound,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  LogOut,
  Settings,
} from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const {
    isAdminModalOpen,
    setIsAdminModalOpen,
    isManagerMode,
    loginAsAdmin,
    logoutAdmin,
    adminPin,
    updateAdminPin,
  } = useMess();

  const [pinInput, setPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Change PIN tab state
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [currentPinCheck, setCurrentPinCheck] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdminModalOpen) {
      setPinInput('');
      setErrorMsg(null);
      setSuccessMsg(null);
      setIsChangingPin(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isAdminModalOpen]);

  if (!isAdminModalOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) {
      setErrorMsg('Please enter the Manager PIN.');
      return;
    }

    const res = loginAsAdmin(pinInput.trim());
    if (res.success) {
      setPinInput('');
      setErrorMsg(null);
    } else {
      setErrorMsg(res.error || 'Incorrect PIN. Please try again.');
    }
  };

  const handlePinChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPinCheck !== adminPin) {
      setErrorMsg('Current PIN is incorrect.');
      return;
    }
    if (newPin.length < 4) {
      setErrorMsg('New PIN must be at least 4 characters long.');
      return;
    }
    if (newPin !== confirmNewPin) {
      setErrorMsg('New PINs do not match.');
      return;
    }

    updateAdminPin(newPin);
    setSuccessMsg('Manager PIN updated successfully!');
    setErrorMsg(null);
    setIsChangingPin(false);
    setCurrentPinCheck('');
    setNewPin('');
    setConfirmNewPin('');
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5 my-8 relative overflow-hidden">
        {/* Top Decorative Banner */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0">
              {isManagerMode ? <ShieldCheck className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                {isManagerMode ? 'Manager Admin Settings' : 'Manager Access Authentication'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isManagerMode ? 'You are authenticated as Mess Manager' : 'Enter passcode to unlock edit privileges'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAdminModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-2 text-rose-800 dark:text-rose-200 text-xs font-semibold animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-2 text-emerald-800 dark:text-emerald-200 text-xs font-semibold">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* LOGGED IN AS MANAGER CONTENT */}
        {isManagerMode && !isChangingPin ? (
          <div className="space-y-4">
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200 font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Admin Privileges Active</span>
              </div>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed">
                You have full Manager privileges to create, edit, update meals, add expenses/deposits, import Excel files, and close monthly cycles.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 pt-1">
              <button
                onClick={() => setIsChangingPin(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition border border-slate-200 dark:border-slate-700"
              >
                <Settings className="w-4 h-4 text-indigo-500" />
                <span>Change Manager Passcode PIN</span>
              </button>

              <button
                onClick={() => {
                  logoutAdmin();
                  setIsAdminModalOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition shadow-xs"
              >
                <LogOut className="w-4 h-4" />
                <span>Exit Admin Mode (Switch to Read-Only Member View)</span>
              </button>
            </div>
          </div>
        ) : isChangingPin ? (
          /* CHANGE PIN FORM */
          <form onSubmit={handlePinChangeSubmit} className="space-y-3.5">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Current PIN
              </label>
              <input
                type="password"
                required
                value={currentPinCheck}
                onChange={(e) => setCurrentPinCheck(e.target.value)}
                placeholder="Enter current PIN"
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                New PIN (min. 4 digits)
              </label>
              <input
                type="password"
                required
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="Enter new PIN"
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Confirm New PIN
              </label>
              <input
                type="password"
                required
                value={confirmNewPin}
                onChange={(e) => setConfirmNewPin(e.target.value)}
                placeholder="Re-enter new PIN"
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsChangingPin(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm"
              >
                Save New PIN
              </button>
            </div>
          </form>
        ) : (
          /* LOGIN FORM */
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Enter Manager Passcode PIN *</span>
                </label>
              </div>

              <div className="relative">
                <input
                  ref={inputRef}
                  type={showPin ? 'text' : 'password'}
                  maxLength={10}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter Manager PIN"
                  className="w-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-slate-900 dark:text-white rounded-xl pl-4 pr-10 py-2.5 text-base font-bold tracking-widest focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsAdminModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Authenticate & Unlock</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
