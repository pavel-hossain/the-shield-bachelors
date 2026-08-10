import React from 'react';
import { useMess } from '../context/MessContext';
import {
  Shield,
  MapPin,
  Search,
  FileSpreadsheet,
  FileText,
  Sun,
  Moon,
  ChevronDown,
  ShieldCheck,
  UserCheck,
  Database,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    periods,
    currentPeriod,
    setCurrentPeriod,
    darkMode,
    setDarkMode,
    setIsSearchModalOpen,
    setIsReportModalOpen,
    setIsExcelModalOpen,
    setIsBackupModalOpen,
    userMode,
    setUserMode,
    isManagerMode,
  } = useMess();

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs px-3 sm:px-6 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        {/* Brand & Location (Left) */}
        <div className="flex items-center justify-between w-full lg:w-auto shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg tracking-tight leading-tight">
                The Shield Bachelors Mess System
              </h1>
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-medium mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Police Line, Magura Sadar</span>
              </div>
            </div>
          </div>

          {/* Mobile Right Quick Controls */}
          <div className="flex lg:hidden items-center gap-1.5">
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              title="Search History"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </div>

        {/* Center & Right Controls */}
        <div className="flex items-center justify-between lg:justify-end gap-2.5 w-full lg:w-auto flex-wrap">
          {/* Primary Controls Group: Month Switcher & Role Switcher */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {/* Month Switcher Dropdown */}
            <div className="relative shrink-0 z-10">
              <select
                value={`${currentPeriod.year}-${currentPeriod.month}`}
                onChange={(e) => {
                  const [y, m] = e.target.value.split('-').map(Number);
                  const found = periods.find((p) => p.year === y && p.month === m);
                  if (found) setCurrentPeriod(found);
                }}
                className="appearance-none bg-slate-100 dark:bg-slate-800 border-2 border-emerald-500/40 dark:border-emerald-500/50 text-slate-900 dark:text-white font-bold text-xs sm:text-sm rounded-xl pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition cursor-pointer shadow-xs"
                title="Select Active Mess Cycle Month"
              >
                {periods.map((p) => (
                  <option key={`${p.year}-${p.month}`} value={`${p.year}-${p.month}`}>
                    📅 {p.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Role Switcher Toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0 shadow-xs">
              <button
                onClick={() => setUserMode('Manager')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  isManagerMode
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Manager Mode: Full Access"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Manager</span>
              </button>
              <button
                onClick={() => setUserMode('Member')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  !isManagerMode
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Member Mode: Read-Only View"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Member View</span>
              </button>
            </div>
          </div>

          {/* Action Tools Group */}
          <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
            {/* Desktop Search Trigger */}
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="hidden lg:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-xl text-xs font-medium transition border border-slate-200 dark:border-slate-700 whitespace-nowrap"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search history...</span>
              <kbd className="bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded text-[10px] font-mono border border-slate-300 dark:border-slate-700 text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* Backup & Data Management Button */}
            <button
              onClick={() => setIsBackupModalOpen(true)}
              className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap shrink-0"
              title="Backup or Restore JSON Data"
            >
              <Database className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Backup / JSON</span>
            </button>

            {/* Excel Parser Button */}
            <button
              onClick={() => setIsExcelModalOpen(true)}
              className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap shrink-0"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Excel Tools</span>
            </button>

            {/* A4 PDF Statement Report Button */}
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="flex items-center gap-1.5 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs whitespace-nowrap shrink-0"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>A4 Statement</span>
            </button>

            {/* Desktop Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="hidden lg:flex p-1.5 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-700"
              title="Toggle Light/Dark Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
