import React, { useState } from 'react';
import { useMess } from '../../context/MessContext';
import { MemberFinancialSummary } from '../../types';
import {
  Calculator,
  TrendingUp,
  Receipt,
  Wallet,
  CreditCard,
  Search,
  Filter,
  ArrowUpDown,
  Download,
  FileSpreadsheet,
  FileText,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Users,
  ChevronRight,
  X,
  Info,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';

export const MonthlyFinancialSummaryModule: React.FC = () => {
  const {
    currentPeriod,
    periods,
    setCurrentPeriod,
    totalMarketExpense,
    totalUtilityExpense,
    totalOverallExpense,
    totalMessMeals,
    totalEffectiveMeals,
    actualMealRate,
    effectiveMealRate,
    utilityPerMember,
    totalDepositsAmount,
    managerCashBalance,
    memberSummaries,
    members,
    deposits,
    setIsReportModalOpen,
    setIsExportSummaryModalOpen,
    setSelectedMemberForStatement,
  } = useMess();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Due' | 'Credit' | 'Settled'>('All');
  const [sortBy, setSortBy] = useState<'name' | 'room' | 'payable' | 'deposits' | 'netBalance' | 'meals'>('netBalance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Selected Member for detailed Balance Sheet Breakdown modal/drawer
  const [activeMemberDetail, setActiveMemberDetail] = useState<MemberFinancialSummary | null>(null);

  // Overall Financial Totals
  const totalBilledPayable = memberSummaries.reduce((sum, s) => sum + s.totalPayable, 0);
  const totalDueAmount = memberSummaries
    .filter((s) => s.netBalance < 0)
    .reduce((sum, s) => sum + Math.abs(s.netBalance), 0);
  const totalCreditAmount = memberSummaries
    .filter((s) => s.netBalance > 0)
    .reduce((sum, s) => sum + s.netBalance, 0);

  const dueMembersCount = memberSummaries.filter((s) => s.statusLabel === 'Due').length;
  const creditMembersCount = memberSummaries.filter((s) => s.statusLabel === 'Credit').length;
  const settledMembersCount = memberSummaries.filter((s) => s.statusLabel === 'Settled').length;

  // Filter & Sort member list
  const filteredSummaries = memberSummaries
    .filter((summary) => {
      const matchSearch =
        summary.member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (summary.member.roomNo && summary.member.roomNo.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (summary.member.phone && summary.member.phone.includes(searchQuery));

      if (!matchSearch) return false;

      if (filterStatus === 'Due') return summary.netBalance < -50;
      if (filterStatus === 'Credit') return summary.netBalance > 50;
      if (filterStatus === 'Settled') return Math.abs(summary.netBalance) <= 50;
      return true;
    })
    .sort((a, b) => {
      let valA: any = 0;
      let valB: any = 0;

      if (sortBy === 'name') {
        valA = a.member.name.toLowerCase();
        valB = b.member.name.toLowerCase();
      } else if (sortBy === 'room') {
        valA = a.member.roomNo || '';
        valB = b.member.roomNo || '';
      } else if (sortBy === 'payable') {
        valA = a.totalPayable;
        valB = b.totalPayable;
      } else if (sortBy === 'deposits') {
        valA = a.totalDeposits;
        valB = b.totalDeposits;
      } else if (sortBy === 'netBalance') {
        valA = a.netBalance;
        valB = b.netBalance;
      } else if (sortBy === 'meals') {
        valA = a.effectiveMeals;
        valB = b.effectiveMeals;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  // Export CSV generator helper
  const exportFullCSV = () => {
    const csvRows: string[] = [];
    const todayStr = new Date().toISOString().split('T')[0];

    csvRows.push(`"The Shield Bachelors Mess - Monthly Financial Summary"`);
    csvRows.push(`"Cycle Period:","${currentPeriod.label}"`);
    csvRows.push(`"Export Date:","${todayStr}"`);
    csvRows.push(`"Total Market Expenses (৳):",${totalMarketExpense}`);
    csvRows.push(`"Total Utility Expenses (৳):",${totalUtilityExpense}`);
    csvRows.push(`"Total Overall Mess Bill (৳):",${totalOverallExpense}`);
    csvRows.push(`"Total Mess Meals (Actual):",${totalMessMeals}`);
    csvRows.push(`"Total Effective Meals:",${totalEffectiveMeals}`);
    csvRows.push(`"Effective Meal Rate (৳/meal):",${effectiveMealRate}`);
    csvRows.push(`"Total Deposits Received (৳):",${totalDepositsAmount}`);
    csvRows.push(`"Manager Cash Balance (৳):",${managerCashBalance}`);
    csvRows.push('');

    csvRows.push(
      [
        '"Member Name"',
        '"Room No"',
        '"Status"',
        '"Actual Meals"',
        '"Effective Meals"',
        '"Meal Cost (৳)"',
        '"Utility Share (৳)"',
        '"Carried Balance (৳)"',
        '"Net Payable (৳)"',
        '"Total Deposits (৳)"',
        '"Net Balance (৳)"',
        '"Status Label"',
      ].join(',')
    );

    memberSummaries.forEach((s) => {
      csvRows.push(
        [
          `"${s.member.name.replace(/"/g, '""')}"`,
          `"${s.member.roomNo || '-'}"`,
          `"${s.member.status}"`,
          s.actualMeals,
          s.effectiveMeals,
          s.mealCost,
          s.utilityCostShare,
          s.carriedBalance || 0,
          s.totalPayable,
          s.totalDeposits,
          s.netBalance,
          `"${s.statusLabel}"`,
        ].join(',')
      );
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Shield_Mess_Financial_Summary_${currentPeriod.label.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // WhatsApp Reminder launcher
  const sendWhatsAppReminder = (memberName: string, phone: string, dueAmount: number) => {
    const text = encodeURIComponent(
      `Hello ${memberName},\nThis is a polite reminder from The Shield Bachelors Mess for ${currentPeriod.label}.\n\nYour calculated mess balance for this month shows an outstanding due of ৳ ${dueAmount.toLocaleString()}.\nKindly clear your deposit with the Mess Manager.\n\nThank you!`
    );
    const cleanPhone = phone ? phone.replace(/[^0-9]/g, '') : '';
    const fullPhone = cleanPhone.startsWith('88') ? cleanPhone : `88${cleanPhone}`;
    window.open(`https://wa.me/${fullPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Module Title & Actions Header */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-600/30 text-emerald-400 border border-emerald-500/30">
              <Calculator className="w-5 h-5" />
            </span>
            <h2 className="text-base sm:text-xl font-extrabold tracking-tight">
              Monthly Financial Summary — {currentPeriod.label}
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Real-time mess bill breakdown, per-meal rate formula, and individual member balance sheets.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>A4 PDF Report</span>
          </button>
          <button
            onClick={exportFullCSV}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsExportSummaryModalOpen(true)}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Summary & Backups</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Total Mess Bill */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Mess Bill
            </span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              ৳ {totalOverallExpense.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Current cycle total expenses
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-600 dark:text-slate-400 font-medium">🛒 Market: ৳ {totalMarketExpense.toLocaleString()}</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-medium">⚡ Utility: ৳ {totalUtilityExpense.toLocaleString()}</span>
          </div>
        </div>

        {/* Card 2: Per-Meal Rate Breakdown */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Effective Meal Rate
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
              ৳ {effectiveMealRate} <span className="text-xs font-bold text-slate-400">/ meal</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Actual Rate: ৳ {actualMealRate} / meal
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-600 dark:text-slate-400">Actual Meals: <strong>{totalMessMeals}</strong></span>
            <span className="text-emerald-600 dark:text-emerald-400">Effective: <strong>{totalEffectiveMeals}</strong></span>
          </div>
        </div>

        {/* Card 3: Total Deposits & Cash Balance */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Deposits Paid
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              ৳ {totalDepositsAmount.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Collected from all members
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-600 dark:text-slate-400">Manager Cash:</span>
            <span
              className={`font-bold ${
                managerCashBalance >= 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              ৳ {managerCashBalance.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Card 4: Due Collections Outstanding */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Outstanding Dues
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-rose-600 dark:text-rose-400 tracking-tight">
              ৳ {totalDueAmount.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {dueMembersCount} member(s) with unpaid due
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-600 dark:text-slate-400">Total Member Credits:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">৳ {totalCreditAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Per-Meal Rate Calculation Formula Box */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border border-emerald-200/80 dark:border-emerald-800/60 rounded-2xl p-4 shadow-2xs space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Per-Meal Rate Formula Engine
            </h3>
          </div>
          <span className="text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
            Benchmark Rule Active (Min 45 Meals)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
          <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Step 1: Total Pure Market Shopping</span>
            <div className="text-base font-black text-slate-900 dark:text-white mt-0.5">
              ৳ {totalMarketExpense.toLocaleString()}
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              Only food/bazaar expenses are included in per-meal rate
            </p>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Step 2: Effective Mess Meals</span>
            <div className="text-base font-black text-slate-900 dark:text-white mt-0.5">
              {totalEffectiveMeals} <span className="text-xs font-normal text-slate-400">(Actual: {totalMessMeals})</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              Active members under 45 meals are adjusted to 45 benchmark meals
            </p>
          </div>

          <div className="bg-emerald-600 text-white p-3 rounded-xl shadow-xs">
            <span className="text-[10px] uppercase font-extrabold text-emerald-100 block">Step 3: Effective Meal Rate</span>
            <div className="text-lg font-black text-white mt-0.5">
              ৳ {effectiveMealRate} / meal
            </div>
            <p className="text-[10px] text-emerald-100/90 mt-0.5">
              ৳ {totalMarketExpense.toLocaleString()} ÷ {totalEffectiveMeals} meals
            </p>
          </div>
        </div>
      </div>

      {/* Main Section: Member Balance Sheets Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden space-y-4 p-4">
        {/* Table Controls Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Member Individual Balance Sheets</span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                {filteredSummaries.length} Member(s)
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Click on any member row to open their full itemized monthly statement
            </p>
          </div>

          {/* Search & Filters Group */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search Input */}
            <div className="relative min-w-[180px] sm:min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search member or room..."
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs rounded-xl pl-8 pr-3 py-1.5 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Status Tabs */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold">
              <button
                onClick={() => setFilterStatus('All')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  filterStatus === 'All'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All ({members.length})
              </button>
              <button
                onClick={() => setFilterStatus('Due')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  filterStatus === 'Due'
                    ? 'bg-rose-600 text-white shadow-2xs font-bold'
                    : 'text-rose-600 dark:text-rose-400 hover:text-rose-700'
                }`}
              >
                Due ({dueMembersCount})
              </button>
              <button
                onClick={() => setFilterStatus('Credit')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  filterStatus === 'Credit'
                    ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                    : 'text-emerald-600 dark:text-emerald-400 hover:text-emerald-700'
                }`}
              >
                Credit ({creditMembersCount})
              </button>
              <button
                onClick={() => setFilterStatus('Settled')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  filterStatus === 'Settled'
                    ? 'bg-slate-700 text-white shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Settled ({settledMembersCount})
              </button>
            </div>
          </div>
        </div>

        {/* Responsive Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-extrabold text-[10px]">
                <th className="py-2.5 px-3">Member & Room</th>
                <th className="py-2.5 px-3">Meals (Act / Eff)</th>
                <th className="py-2.5 px-3">Meal Bill (৳)</th>
                <th className="py-2.5 px-3">Fixed Utility (৳)</th>
                <th className="py-2.5 px-3">Carried / Prev (৳)</th>
                <th className="py-2.5 px-3 font-black text-slate-700 dark:text-slate-300">Total Payable (৳)</th>
                <th className="py-2.5 px-3">Deposits Paid (৳)</th>
                <th className="py-2.5 px-3 font-black text-right">Net Balance (৳)</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-800 dark:text-slate-200">
              {filteredSummaries.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400 font-medium">
                    No matching member balance sheets found for "{searchQuery}".
                  </td>
                </tr>
              ) : (
                filteredSummaries.map((s) => {
                  const isDue = s.netBalance < -50;
                  const isCredit = s.netBalance > 50;

                  return (
                    <tr
                      key={s.member.id}
                      onClick={() => setActiveMemberDetail(s)}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition cursor-pointer"
                    >
                      {/* Member Info */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-full ${s.member.avatarColor} font-extrabold text-[11px] flex items-center justify-center shrink-0 shadow-2xs`}
                          >
                            {s.member.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block truncate max-w-[140px]">
                              {s.member.name}
                            </span>
                            <span className="text-[10px] text-slate-400">Room {s.member.roomNo || '-'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Meals */}
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 dark:text-white">{s.effectiveMeals}</span>
                        <span className="text-[10px] text-slate-400 ml-1">({s.actualMeals} act)</span>
                      </td>

                      {/* Meal Cost */}
                      <td className="py-3 px-3">৳ {s.mealCost.toLocaleString()}</td>

                      {/* Utility Cost Share */}
                      <td className="py-3 px-3">৳ {s.utilityCostShare.toLocaleString()}</td>

                      {/* Carried Opening Balance */}
                      <td className="py-3 px-3">
                        {s.carriedBalance ? (
                          <span className={s.carriedBalance < 0 ? 'text-rose-500 font-semibold' : 'text-emerald-500 font-semibold'}>
                            ৳ {s.carriedBalance.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-slate-400">৳ 0</span>
                        )}
                      </td>

                      {/* Total Payable */}
                      <td className="py-3 px-3 font-extrabold text-slate-900 dark:text-white">
                        ৳ {s.totalPayable.toLocaleString()}
                      </td>

                      {/* Total Deposits */}
                      <td className="py-3 px-3 font-semibold text-emerald-600 dark:text-emerald-400">
                        ৳ {s.totalDeposits.toLocaleString()}
                      </td>

                      {/* Net Final Balance */}
                      <td className="py-3 px-3 text-right">
                        {isCredit && (
                          <span className="inline-flex items-center gap-1 font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                            + ৳ {s.netBalance.toLocaleString()} (Credit)
                          </span>
                        )}
                        {isDue && (
                          <span className="inline-flex items-center gap-1 font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/80 px-2 py-0.5 rounded-lg border border-rose-200 dark:border-rose-900">
                            - ৳ {Math.abs(s.netBalance).toLocaleString()} (Due)
                          </span>
                        )}
                        {!isCredit && !isDue && (
                          <span className="inline-flex items-center font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg">
                            Settled
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setSelectedMemberForStatement(s.member)}
                            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                            title="View Detailed Member Statement"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>

                          {isDue && s.member.phone && (
                            <button
                              onClick={() => sendWhatsAppReminder(s.member.name, s.member.phone, Math.abs(s.netBalance))}
                              className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 transition"
                              title="Send WhatsApp Payment Reminder"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Itemized Member Balance Sheet Detail Modal */}
      {activeMemberDetail && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-5 space-y-4 my-auto animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl ${activeMemberDetail.member.avatarColor} font-black text-sm flex items-center justify-center shadow-xs`}
                >
                  {activeMemberDetail.member.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {activeMemberDetail.member.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Room {activeMemberDetail.member.roomNo || '-'} • Phone: {activeMemberDetail.member.phone || 'N/A'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveMemberDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Calculations Breakdown */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-2 text-xs">
              <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">
                {currentPeriod.label} Ledger Itemization
              </h4>

              <div className="space-y-1.5 pt-1 text-slate-700 dark:text-slate-300">
                <div className="flex justify-between">
                  <span>Meal Cost ({activeMemberDetail.effectiveMeals} meals × ৳{effectiveMealRate}):</span>
                  <span className="font-bold text-slate-900 dark:text-white">৳ {activeMemberDetail.mealCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fixed Utility Share:</span>
                  <span className="font-bold text-slate-900 dark:text-white">৳ {activeMemberDetail.utilityCostShare.toLocaleString()}</span>
                </div>
                {activeMemberDetail.carriedBalance !== 0 && (
                  <div className="flex justify-between">
                    <span>Carried Opening Balance:</span>
                    <span className="font-bold text-amber-500">৳ {(activeMemberDetail.carriedBalance || 0).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between pt-1.5 border-t border-slate-200 dark:border-slate-700 font-extrabold text-sm text-slate-900 dark:text-white">
                  <span>Total Net Payable Bill:</span>
                  <span>৳ {activeMemberDetail.totalPayable.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>Total Deposits Paid This Month:</span>
                  <span>৳ {activeMemberDetail.totalDeposits.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-sm font-black">
                <span>Final Balance:</span>
                <span
                  className={
                    activeMemberDetail.netBalance > 50
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : activeMemberDetail.netBalance < -50
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-slate-500'
                  }
                >
                  {activeMemberDetail.netBalance > 0
                    ? `+ ৳ ${activeMemberDetail.netBalance.toLocaleString()} (Credit)`
                    : activeMemberDetail.netBalance < 0
                    ? `- ৳ ${Math.abs(activeMemberDetail.netBalance).toLocaleString()} (Due)`
                    : 'Settled (৳ 0)'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              {activeMemberDetail.netBalance < 0 && activeMemberDetail.member.phone && (
                <button
                  onClick={() =>
                    sendWhatsAppReminder(
                      activeMemberDetail.member.name,
                      activeMemberDetail.member.phone,
                      Math.abs(activeMemberDetail.netBalance)
                    )
                  }
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-xl text-xs font-bold transition shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send WhatsApp Due Reminder</span>
                </button>
              )}
              <button
                onClick={() => {
                  setSelectedMemberForStatement(activeMemberDetail.member);
                  setActiveMemberDetail(null);
                }}
                className="flex items-center gap-1.5 bg-slate-900 dark:bg-slate-800 text-white px-3 py-2 rounded-xl text-xs font-bold transition"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Full Member Statement</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
