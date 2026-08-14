import React, { useState, useEffect, useRef } from 'react';
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
  LogOut,
  KeyRound,
  Download,
  Palette,
  Mic,
  Wifi,
  WifiOff,
  Smartphone,
  Bell,
  UploadCloud,
  FileBadge,
  Sparkles,
  TrendingUp,
  Camera,
  BarChart3,
  Scale,
  Target,
  Trophy,
  Clock,
  Layers,
  Check,
  Sliders,
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
    isManagerMode,
    setIsAdminModalOpen,
    logoutAdmin,
    setIsThemeModalOpen,
    isOnline,
    pendingSyncQueue,
    setIsOfflineSyncModalOpen,
    setIsVoiceEntryModalOpen,
    setIsAPKModalOpen,
    setIsNotificationModalOpen,
    setIsProfileModalOpen,
    setIsBulkUploadModalOpen,
    setIsGoalModalOpen,
    setIsCategorizerModalOpen,
    setIsLeaderboardModalOpen,
    setIsMealReminderModalOpen,
    setIsBudgetForecastModalOpen,
    setIsExpenseScannerModalOpen,
    setIsComparisonChartModalOpen,
    setIsDebtSettlementModalOpen,
    overdueMembers,
  } = useMess();

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsToolsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const openTool = (callback: () => void) => {
    setIsToolsDropdownOpen(false);
    callback();
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/95 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs px-3 sm:px-6 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Brand & Location (Left) - Clearly stacked block with flex-col */}
        <div className="flex items-center gap-3 min-w-0 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0 ring-2 ring-emerald-500/20">
            <Shield className="w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="font-black text-slate-900 dark:text-white text-sm sm:text-base tracking-tight leading-tight whitespace-nowrap">
                The Shield Bachelors Mess System
              </h1>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                v2026
              </span>
            </div>
            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs font-medium mt-0.5 leading-none">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="truncate">Police Line, Magura Sadar</span>
            </div>
          </div>
        </div>

        {/* Right Section: Essential Controls + Manager Tools Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap md:ml-auto w-full md:w-auto justify-between md:justify-end">
          {/* Desktop Search Trigger */}
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-xl text-xs font-medium transition border border-slate-200 dark:border-slate-700 whitespace-nowrap cursor-pointer shrink-0"
            title="Search transactions, members & notes (⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden lg:inline">Search records...</span>
            <kbd className="bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded text-[10px] font-mono border border-slate-300 dark:border-slate-700 text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Month Switcher Dropdown */}
          <div className="relative shrink-0 z-10">
            <select
              value={`${currentPeriod.year}-${currentPeriod.month}`}
              onChange={(e) => {
                const [y, m] = e.target.value.split('-').map(Number);
                const found = periods.find((p) => p.year === y && p.month === m);
                if (found) setCurrentPeriod(found);
              }}
              className="appearance-none bg-slate-100 dark:bg-slate-800 border-2 border-emerald-500/40 dark:border-emerald-500/50 text-slate-900 dark:text-white font-bold text-xs sm:text-sm rounded-xl pl-2.5 sm:pl-3 pr-7 sm:pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition cursor-pointer shadow-xs"
              title="Select Active Mess Cycle Month"
            >
              {periods.map((p) => (
                <option key={`${p.year}-${p.month}`} value={`${p.year}-${p.month}`}>
                  📅 {p.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400 absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Notifications Trigger */}
          <button
            onClick={() => setIsNotificationModalOpen(true)}
            className="relative p-2 rounded-xl text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800/60 transition cursor-pointer shrink-0"
            title="Member Notification & SMS Dispatcher"
          >
            <Bell className="w-4 h-4" />
            {overdueMembers.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center shadow-xs animate-pulse">
                {overdueMembers.length}
              </span>
            )}
          </button>

          {/* Theme Switcher Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-700 cursor-pointer shrink-0"
            title="Toggle Light/Dark Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Manager / Viewer Mode Toggle & Actions */}
          {isManagerMode ? (
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 p-1 rounded-xl border border-emerald-200 dark:border-emerald-800 shrink-0 shadow-xs">
                <button
                  onClick={() => setIsAdminModalOpen(true)}
                  className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 text-white shadow-xs hover:bg-emerald-500 transition whitespace-nowrap cursor-pointer"
                  title="Manager Authenticated — Click to manage PIN or settings"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Manager Mode</span>
                  <span className="sm:hidden">Manager</span>
                </button>
                <button
                  onClick={logoutAdmin}
                  className="p-1 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/80 transition cursor-pointer"
                  title="Exit Manager Mode / Switch to Viewer Mode"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Manager Actions Consolidated Dropdown Menu */}
              <div className="relative shrink-0" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer border ${
                    isToolsDropdownOpen
                      ? 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-500/30'
                      : 'bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white border-transparent'
                  }`}
                  title="Manager Tools, Forecasts, Scanners & Operations"
                >
                  <Layers className="w-3.5 h-3.5 text-emerald-300 dark:text-white" />
                  <span>Manager Actions</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isToolsDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Floating Menu */}
                {isToolsDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-2 text-slate-800 dark:text-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto scrollbar-thin">
                    {/* Financial & Forecasting Section */}
                    <div className="mb-2">
                      <p className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Financial Intelligence & Forecasts
                      </p>
                      <div className="space-y-0.5">
                        <button
                          onClick={() => openTool(() => setIsBudgetForecastModalOpen(true))}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-700 dark:hover:text-emerald-300 transition text-left cursor-pointer group"
                        >
                          <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 group-hover:scale-105 transition">
                            <TrendingUp className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white leading-tight">Monthly Budget Forecast</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">Burn rate, surplus/deficit & scenario planner</p>
                          </div>
                        </button>

                        <button
                          onClick={() => openTool(() => setIsExpenseScannerModalOpen(true))}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/60 hover:text-purple-700 dark:hover:text-purple-300 transition text-left cursor-pointer group"
                        >
                          <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-950/80 text-purple-600 group-hover:scale-105 transition">
                            <Camera className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white leading-tight">Quick Expense Scanner</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">Scan bazaar memos, receipts & paste text</p>
                          </div>
                        </button>

                        <button
                          onClick={() => openTool(() => setIsComparisonChartModalOpen(true))}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-sky-50 dark:hover:bg-sky-950/60 hover:text-sky-700 dark:hover:text-sky-300 transition text-left cursor-pointer group"
                        >
                          <div className="p-1.5 rounded-lg bg-sky-100 dark:bg-sky-950/80 text-sky-600 group-hover:scale-105 transition">
                            <BarChart3 className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white leading-tight">Comparison Chart</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">Month-over-Month meal rates & expense curves</p>
                          </div>
                        </button>

                        <button
                          onClick={() => openTool(() => setIsDebtSettlementModalOpen(true))}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-amber-950/60 hover:text-amber-700 dark:hover:text-amber-300 transition text-left cursor-pointer group"
                        >
                          <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-600 group-hover:scale-105 transition">
                            <Scale className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white leading-tight">Debt Settlement Tracker</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">Dues matrix, 1-click WhatsApp & settlements</p>
                          </div>
                        </button>

                        <button
                          onClick={() => openTool(() => setIsGoalModalOpen(true))}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-teal-950/60 hover:text-teal-700 dark:hover:text-teal-300 transition text-left cursor-pointer group"
                        >
                          <div className="p-1.5 rounded-lg bg-teal-100 dark:bg-teal-950/80 text-teal-600 group-hover:scale-105 transition">
                            <Target className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white leading-tight">Monthly Goals & Pacing</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">Set target meal rate & daily shopping caps</p>
                          </div>
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1.5" />

                    {/* Reports & Documents Section */}
                    <div className="mb-2">
                      <p className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Reports & Documentation
                      </p>
                      <div className="space-y-0.5">
                        <button
                          onClick={() => openTool(() => setIsReportModalOpen(true))}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left cursor-pointer group"
                        >
                          <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:scale-105 transition">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white leading-tight">A4 PDF Statement Report</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">Printable monthly summary sheet</p>
                          </div>
                        </button>

                        <button
                          onClick={() => openTool(() => setIsExcelModalOpen(true))}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-700 dark:hover:text-emerald-300 transition text-left cursor-pointer group"
                        >
                          <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 group-hover:scale-105 transition">
                            <FileSpreadsheet className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white leading-tight">Excel Spreadsheet</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">Export & import .xlsx / CSV data</p>
                          </div>
                        </button>

                        <button
                          onClick={() => openTool(() => setIsProfileModalOpen(true))}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-teal-950/60 hover:text-teal-700 dark:hover:text-teal-300 transition text-left cursor-pointer group"
                        >
                          <div className="p-1.5 rounded-lg bg-teal-100 dark:bg-teal-950/80 text-teal-600 group-hover:scale-105 transition">
                            <FileBadge className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white leading-tight">Mess Profile & Handbook</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">Official rules, Wi-Fi & pay numbers</p>
                          </div>
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1.5" />

                    {/* Operations & Utilities Section */}
                    <div>
                      <p className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Operations & Data Utilities
                      </p>
                      <div className="space-y-0.5">
                        <button
                          onClick={() => openTool(() => setIsBulkUploadModalOpen(true))}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left cursor-pointer group"
                        >
                          <div className="p-1.5 rounded-lg bg-teal-100 dark:bg-teal-950/80 text-teal-600 group-hover:scale-105 transition">
                            <UploadCloud className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white leading-tight">Bulk Upload Wizard</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">Batch paste meal records & expenses</p>
                          </div>
                        </button>

                        <button
                          onClick={() => openTool(() => setIsBackupModalOpen(true))}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left cursor-pointer group"
                        >
                          <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 group-hover:scale-105 transition">
                            <Database className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white leading-tight">Snapshots & Backups</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">Restore points & JSON backups</p>
                          </div>
                        </button>

                        <button
                          onClick={() => openTool(() => setIsLeaderboardModalOpen(true))}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-amber-950/60 hover:text-amber-700 dark:hover:text-amber-300 transition text-left cursor-pointer group"
                        >
                          <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-600 group-hover:scale-105 transition">
                            <Trophy className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white leading-tight">Member Leaderboard</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">Badges, bazar ranking & points</p>
                          </div>
                        </button>

                        <button
                          onClick={() => openTool(() => setIsMealReminderModalOpen(true))}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-rose-50 dark:hover:bg-rose-950/60 hover:text-rose-700 dark:hover:text-rose-300 transition text-left cursor-pointer group"
                        >
                          <div className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-600 group-hover:scale-105 transition">
                            <Clock className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white leading-tight">Meal Count Reminders</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">Cutoff timers & unentered alerts</p>
                          </div>
                        </button>

                        <button
                          onClick={() => openTool(() => setIsCategorizerModalOpen(true))}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-700 dark:hover:text-indigo-300 transition text-left cursor-pointer group"
                        >
                          <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 group-hover:scale-105 transition">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white leading-tight">Smart Categorizer</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">Auto item tagging & classification</p>
                          </div>
                        </button>

                        <button
                          onClick={() => openTool(() => setIsVoiceEntryModalOpen(true))}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left cursor-pointer group"
                        >
                          <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-600 group-hover:scale-105 transition">
                            <Mic className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white leading-tight">AI Voice Assistant</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">Voice-to-expense & meal logger</p>
                          </div>
                        </button>

                        <button
                          onClick={() => openTool(() => setIsOfflineSyncModalOpen(true))}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left cursor-pointer group"
                        >
                          <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-emerald-600 group-hover:scale-105 transition">
                            {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4 text-amber-500" />}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white leading-tight">Offline Sync Queue</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">
                              {isOnline ? 'Online & synced' : `${pendingSyncQueue.length} items queued`}
                            </p>
                          </div>
                        </button>

                        <button
                          onClick={() => openTool(() => setIsAPKModalOpen(true))}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left cursor-pointer group"
                        >
                          <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 group-hover:scale-105 transition">
                            <Smartphone className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white leading-tight">Android APK Builder</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">PWA & standalone app export</p>
                          </div>
                        </button>

                        <button
                          onClick={() => openTool(() => setIsThemeModalOpen(true))}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left cursor-pointer group"
                        >
                          <div className="p-1.5 rounded-lg bg-pink-100 dark:bg-pink-950/80 text-pink-600 group-hover:scale-105 transition">
                            <Palette className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white leading-tight">Visual Theme & Cursor</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">Emerald, sapphire, cyber & cursor</p>
                          </div>
                        </button>

                        {deferredPrompt && (
                          <button
                            onClick={() => openTool(handleInstallApp)}
                            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition text-left cursor-pointer"
                          >
                            <Download className="w-4 h-4" />
                            <span>Install PWA App to Home Screen</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white transition shadow-sm whitespace-nowrap cursor-pointer shrink-0"
              title="Click to enter Manager Passcode & unlock editing"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Manager Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
