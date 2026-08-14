import React, { useState } from 'react';
import { useMess } from '../../context/MessContext';
import {
  Upload,
  X,
  FileSpreadsheet,
  Utensils,
  ShoppingBag,
  DollarSign,
  Users,
  CheckCircle2,
  AlertCircle,
  Copy,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Plus,
  Trash2,
  Table,
  Check,
} from 'lucide-react';
import { Expense, Deposit, Member } from '../../types';

export const BulkUploadHelperModal: React.FC = () => {
  const {
    isBulkUploadModalOpen,
    setIsBulkUploadModalOpen,
    members,
    meals,
    bulkUpsertMeals,
    bulkAddExpenses,
    bulkAddDeposits,
    bulkAddMembers,
    currentPeriod,
  } = useMess();

  const [activeTab, setActiveTab] = useState<'meals' | 'expenses' | 'deposits' | 'members'>('meals');

  // Success Toast
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // 1. MEAL MATRIX STATE
  const todayStr = new Date().toISOString().split('T')[0];
  const [mealDate, setMealDate] = useState<string>(todayStr);
  const [mealGridState, setMealGridState] = useState<Record<string, { b: number; l: number; d: number }>>(() => {
    const initial: Record<string, { b: number; l: number; d: number }> = {};
    members.forEach((m) => {
      const existing = meals.find((r) => r.date === todayStr && r.memberId === m.id);
      initial[m.id] = {
        b: existing ? existing.breakfast : 1,
        l: existing ? existing.lunch : 1,
        d: existing ? existing.dinner : 1,
      };
    });
    return initial;
  });

  // When mealDate changes, sync existing records
  const handleMealDateChange = (newDate: string) => {
    setMealDate(newDate);
    const updated: Record<string, { b: number; l: number; d: number }> = {};
    members.forEach((m) => {
      const existing = meals.find((r) => r.date === newDate && r.memberId === m.id);
      updated[m.id] = {
        b: existing ? existing.breakfast : 1,
        l: existing ? existing.lunch : 1,
        d: existing ? existing.dinner : 1,
      };
    });
    setMealGridState(updated);
  };

  // Quick Presets
  const applyMealPreset = (preset: '1-1-1' | '0-1-1' | '1-0-1' | '0-0-0') => {
    const [b, l, d] = preset.split('-').map(Number);
    const updated: Record<string, { b: number; l: number; d: number }> = {};
    members.forEach((m) => {
      updated[m.id] = { b, l, d };
    });
    setMealGridState(updated);
  };

  const handleCommitMeals = () => {
    const payload = members.map((m) => ({
      date: mealDate,
      memberId: m.id,
      breakfast: mealGridState[m.id]?.b || 0,
      lunch: mealGridState[m.id]?.l || 0,
      dinner: mealGridState[m.id]?.d || 0,
    }));
    const res = bulkUpsertMeals(payload);
    if (res.success) {
      setSuccessToast(`Successfully committed meals for ${res.count} members on ${mealDate}!`);
      setTimeout(() => setSuccessToast(null), 3500);
    }
  };

  // 2. EXPENSES PASTE PARSER STATE
  const [expenseRawText, setExpenseRawText] = useState(
    `2026-08-13, 1450, Market, Rice & Cooking Oil, Aktar
2026-08-13, 620, Market, Fish & Vegetables, Rakib
2026-08-13, 200, Utility, Filter Water Can, Manager`
  );

  const parsedExpenses = React.useMemo(() => {
    if (!expenseRawText.trim()) return [];
    const lines = expenseRawText.split('\n').filter((l) => l.trim().length > 0);
    return lines.map((line, idx) => {
      // Split by comma, tab, or pipe
      const parts = line.split(/[,\t|]/).map((p) => p.trim());
      const date = parts[0] || mealDate;
      const amount = parseFloat(parts[1]?.replace(/[^0-9.]/g, '') || '0');
      const category = parts[2] || 'Market';
      const title = parts[3] || (category === 'Market' ? 'Bazar Expense' : 'Utility Cost');
      const notes = parts[4] || '';

      const isValid = date.length >= 8 && amount > 0;
      return {
        id: `temp-exp-${idx}`,
        date,
        amount,
        category: (category.toLowerCase().includes('util') ? 'Utility' : 'Market') as any,
        title,
        notes,
        isValid,
      };
    });
  }, [expenseRawText, mealDate]);

  const handleCommitExpenses = () => {
    const validOnes = parsedExpenses
      .filter((e) => e.isValid)
      .map(({ isValid, id, ...rest }) => rest);

    if (validOnes.length === 0) {
      alert('No valid expense lines found to import.');
      return;
    }

    const res = bulkAddExpenses(validOnes);
    if (res.success) {
      setSuccessToast(`Successfully imported ${res.count} expenses into active database!`);
      setExpenseRawText('');
      setTimeout(() => setSuccessToast(null), 3500);
    }
  };

  // 3. DEPOSITS PASTE PARSER STATE
  const [depositRawText, setDepositRawText] = useState(
    `2026-08-12, Aktar Hossain, 2000, bKash, BK889911
2026-08-12, Kamrul Islam, 2500, Cash, CASH-09`
  );

  const parsedDeposits = React.useMemo(() => {
    if (!depositRawText.trim()) return [];
    const lines = depositRawText.split('\n').filter((l) => l.trim().length > 0);
    return lines.map((line, idx) => {
      const parts = line.split(/[,\t|]/).map((p) => p.trim());
      const date = parts[0] || mealDate;
      const memberQuery = parts[1] || '';
      const amount = parseFloat(parts[2]?.replace(/[^0-9.]/g, '') || '0');
      const method = parts[3] || 'bKash';
      const txId = parts[4] || '';

      // Match member
      const matchedMember = members.find(
        (m) =>
          m.name.toLowerCase().includes(memberQuery.toLowerCase()) ||
          m.roomNo === memberQuery ||
          m.phone.includes(memberQuery)
      );

      const isValid = Boolean(matchedMember && amount > 0 && date.length >= 8);
      return {
        id: `temp-dep-${idx}`,
        date,
        memberId: matchedMember?.id || '',
        memberName: matchedMember?.name || memberQuery || 'Unknown',
        amount,
        method: (method.toLowerCase().includes('cash')
          ? 'Cash'
          : method.toLowerCase().includes('nagad')
          ? 'Nagad'
          : method.toLowerCase().includes('bank')
          ? 'Bank'
          : 'bKash') as any,
        transactionId: txId,
        notes: `Bulk imported deposit`,
        isValid,
      };
    });
  }, [depositRawText, members, mealDate]);

  const handleCommitDeposits = () => {
    const validOnes = parsedDeposits
      .filter((d) => d.isValid)
      .map(({ isValid, id, memberName, ...rest }) => rest);

    if (validOnes.length === 0) {
      alert('No valid deposit lines with matched members found.');
      return;
    }

    const res = bulkAddDeposits(validOnes);
    if (res.success) {
      setSuccessToast(`Successfully imported ${res.count} deposits!`);
      setDepositRawText('');
      setTimeout(() => setSuccessToast(null), 3500);
    }
  };

  // 4. MEMBERS PASTE PARSER STATE
  const [memberRawText, setMemberRawText] = useState(
    `Tanvir Hasan, 01799887766, 103, Member
Mahfuzur Rahman, 01811223399, 103, Member`
  );

  const parsedMembers = React.useMemo(() => {
    if (!memberRawText.trim()) return [];
    const lines = memberRawText.split('\n').filter((l) => l.trim().length > 0);
    return lines.map((line, idx) => {
      const parts = line.split(/[,\t|]/).map((p) => p.trim());
      const name = parts[0] || '';
      const phone = parts[1] || '';
      const roomNo = parts[2] || '101';
      const role = (parts[3] || 'Member') as any;

      const isValid = Boolean(name.length >= 2);
      return {
        id: `temp-mem-${idx}`,
        name,
        phone,
        roomNo,
        role: (['Manager', 'Auditor', 'Member'].includes(role) ? role : 'Member') as any,
        status: 'Active' as const,
        joiningDate: mealDate,
        isValid,
      };
    });
  }, [memberRawText, mealDate]);

  const handleCommitMembers = () => {
    const validOnes = parsedMembers
      .filter((m) => m.isValid)
      .map(({ isValid, id, ...rest }) => rest);

    if (validOnes.length === 0) {
      alert('No valid members found.');
      return;
    }

    const res = bulkAddMembers(validOnes);
    if (res.success) {
      setSuccessToast(`Successfully onboarded ${res.count} new mess members!`);
      setMemberRawText('');
      setTimeout(() => setSuccessToast(null), 3500);
    }
  };

  if (!isBulkUploadModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-teal-700 via-emerald-800 to-teal-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 text-white shrink-0">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                Bulk Upload & Rapid Entry Wizard
              </h2>
              <p className="text-xs text-teal-100 font-medium">
                Batch matrix editor, smart text/CSV copy-paste parsers & multi-row importer
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsBulkUploadModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-2 bg-slate-50 dark:bg-slate-900/50 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('meals')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'meals'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Batch Meal Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('expenses')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'expenses'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Paste Expenses / Bazar</span>
          </button>

          <button
            onClick={() => setActiveTab('deposits')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'deposits'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Paste Member Deposits</span>
          </button>

          <button
            onClick={() => setActiveTab('members')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'members'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Bulk Add Members</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {successToast && (
            <div className="p-3 bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md animate-in slide-in-from-top">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successToast}</span>
            </div>
          )}

          {/* TAB 1: MEAL MATRIX RAPID FILLER */}
          {activeTab === 'meals' && (
            <div className="space-y-4">
              {/* Date & Preset Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Date:</label>
                  <input
                    type="date"
                    value={mealDate}
                    onChange={(e) => handleMealDateChange(e.target.value)}
                    className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-bold text-slate-500 mr-1">Quick Presets:</span>
                  <button
                    onClick={() => applyMealPreset('1-1-1')}
                    className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-lg text-xs font-bold hover:bg-emerald-200 transition"
                  >
                    All 1-1-1
                  </button>
                  <button
                    onClick={() => applyMealPreset('0-1-1')}
                    className="px-2.5 py-1 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800 rounded-lg text-xs font-bold hover:bg-indigo-200 transition"
                  >
                    All 0-1-1 (No Breakfast)
                  </button>
                  <button
                    onClick={() => applyMealPreset('1-0-1')}
                    className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 rounded-lg text-xs font-bold hover:bg-amber-200 transition"
                  >
                    All 1-0-1 (No Lunch)
                  </button>
                  <button
                    onClick={() => applyMealPreset('0-0-0')}
                    className="px-2.5 py-1 bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 rounded-lg text-xs font-bold hover:bg-rose-200 transition"
                  >
                    Zero All
                  </button>
                </div>
              </div>

              {/* Members Meal Grid Table */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                      <th className="p-3">Member</th>
                      <th className="p-3 text-center">Room</th>
                      <th className="p-3 text-center">Breakfast</th>
                      <th className="p-3 text-center">Lunch</th>
                      <th className="p-3 text-center">Dinner</th>
                      <th className="p-3 text-right">Daily Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                    {members.map((m) => {
                      const state = mealGridState[m.id] || { b: 0, l: 0, d: 0 };
                      const total = state.b + state.l + state.d;

                      return (
                        <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px] ${m.avatarColor}`}>
                                {m.name.charAt(0)}
                              </div>
                              <span className="font-bold text-slate-900 dark:text-white">{m.name}</span>
                            </div>
                          </td>
                          <td className="p-3 text-center font-mono text-slate-500">{m.roomNo}</td>
                          <td className="p-3 text-center">
                            <input
                              type="number"
                              min={0}
                              max={10}
                              step={0.5}
                              value={state.b}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                setMealGridState({
                                  ...mealGridState,
                                  [m.id]: { ...state, b: val },
                                });
                              }}
                              className="w-14 text-center bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg py-1 font-bold text-slate-900 dark:text-white"
                            />
                          </td>
                          <td className="p-3 text-center">
                            <input
                              type="number"
                              min={0}
                              max={10}
                              step={0.5}
                              value={state.l}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                setMealGridState({
                                  ...mealGridState,
                                  [m.id]: { ...state, l: val },
                                });
                              }}
                              className="w-14 text-center bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg py-1 font-bold text-slate-900 dark:text-white"
                            />
                          </td>
                          <td className="p-3 text-center">
                            <input
                              type="number"
                              min={0}
                              max={10}
                              step={0.5}
                              value={state.d}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                setMealGridState({
                                  ...mealGridState,
                                  [m.id]: { ...state, d: val },
                                });
                              }}
                              className="w-14 text-center bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg py-1 font-bold text-slate-900 dark:text-white"
                            />
                          </td>
                          <td className="p-3 text-right font-black text-slate-900 dark:text-white">
                            {total}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleCommitMeals}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Batch Meals for {mealDate}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PASTE EXPENSES */}
          {activeTab === 'expenses' && (
            <div className="space-y-4">
              <div className="p-3 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-xl text-xs text-teal-800 dark:text-teal-300">
                <p className="font-bold mb-0.5">Format: Date, Amount, Category (Market/Utility), Description, Buyer Notes</p>
                <p className="text-[11px] opacity-80">Supports comma (,), tab (\t), or semicolon (;) separated lines copied from Excel or WhatsApp notes.</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Paste Multiple Expense Lines
                </label>
                <textarea
                  rows={5}
                  value={expenseRawText}
                  onChange={(e) => setExpenseRawText(e.target.value)}
                  placeholder={`2026-08-14, 1500, Market, Bazar for lunch & dinner, Aktar\n2026-08-14, 350, Utility, Gas Cylinder refill share`}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl p-3 font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Parsed Preview Table */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                  <Table className="w-4 h-4 text-teal-600" />
                  <span>Parsed Preview ({parsedExpenses.filter((e) => e.isValid).length} Valid Rows)</span>
                </h4>

                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden max-h-48 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold sticky top-0">
                      <tr>
                        <th className="p-2">Date</th>
                        <th className="p-2">Amount</th>
                        <th className="p-2">Category</th>
                        <th className="p-2">Description</th>
                        <th className="p-2">Notes</th>
                        <th className="p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {parsedExpenses.map((exp, idx) => (
                        <tr key={idx} className={exp.isValid ? 'bg-white dark:bg-slate-900' : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600'}>
                          <td className="p-2 font-mono">{exp.date}</td>
                          <td className="p-2 font-black">৳ {exp.amount.toLocaleString()}</td>
                          <td className="p-2">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800">
                              {exp.category}
                            </span>
                          </td>
                          <td className="p-2">{exp.title}</td>
                          <td className="p-2 text-slate-400">{exp.notes}</td>
                          <td className="p-2">
                            {exp.isValid ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-rose-500" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleCommitExpenses}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Import {parsedExpenses.filter((e) => e.isValid).length} Expenses</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: PASTE DEPOSITS */}
          {activeTab === 'deposits' && (
            <div className="space-y-4">
              <div className="p-3 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-xl text-xs text-teal-800 dark:text-teal-300">
                <p className="font-bold mb-0.5">Format: Date, Member Name or Room, Amount, Method (bKash/Nagad/Cash), TrxID</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Paste Multiple Deposit Records
                </label>
                <textarea
                  rows={5}
                  value={depositRawText}
                  onChange={(e) => setDepositRawText(e.target.value)}
                  placeholder={`2026-08-14, Aktar Hossain, 3000, bKash, BK908811\n2026-08-14, Sumon Ahmed, 2500, Cash, CASH-09`}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl p-3 font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Parsed Deposits Preview */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                  <Table className="w-4 h-4 text-teal-600" />
                  <span>Parsed Deposits Preview ({parsedDeposits.filter((d) => d.isValid).length} Valid Rows)</span>
                </h4>

                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden max-h-48 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold sticky top-0">
                      <tr>
                        <th className="p-2">Date</th>
                        <th className="p-2">Member</th>
                        <th className="p-2">Amount</th>
                        <th className="p-2">Method</th>
                        <th className="p-2">Trx ID</th>
                        <th className="p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {parsedDeposits.map((dep, idx) => (
                        <tr key={idx} className={dep.isValid ? 'bg-white dark:bg-slate-900' : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600'}>
                          <td className="p-2 font-mono">{dep.date}</td>
                          <td className="p-2 font-bold text-slate-900 dark:text-white">{dep.memberName}</td>
                          <td className="p-2 font-black text-emerald-600">৳ {dep.amount.toLocaleString()}</td>
                          <td className="p-2">{dep.method}</td>
                          <td className="p-2 font-mono text-slate-400">{dep.transactionId}</td>
                          <td className="p-2">
                            {dep.isValid ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <span className="text-[10px] text-rose-500 font-bold">Unmatched Member</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleCommitDeposits}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Import {parsedDeposits.filter((d) => d.isValid).length} Deposits</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: BULK ADD MEMBERS */}
          {activeTab === 'members' && (
            <div className="space-y-4">
              <div className="p-3 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-xl text-xs text-teal-800 dark:text-teal-300">
                <p className="font-bold mb-0.5">Format: Full Name, Phone, Room Number, Role (Manager / Auditor / Member)</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Paste Member Roster
                </label>
                <textarea
                  rows={5}
                  value={memberRawText}
                  onChange={(e) => setMemberRawText(e.target.value)}
                  placeholder={`Tanvir Hasan, 01799887766, 103, Member\nMahfuzur Rahman, 01811223399, 103, Member`}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl p-3 font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden max-h-48 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold sticky top-0">
                    <tr>
                      <th className="p-2">Name</th>
                      <th className="p-2">Phone</th>
                      <th className="p-2">Room</th>
                      <th className="p-2">Role</th>
                      <th className="p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {parsedMembers.map((m, idx) => (
                      <tr key={idx} className="bg-white dark:bg-slate-900">
                        <td className="p-2 font-bold text-slate-900 dark:text-white">{m.name}</td>
                        <td className="p-2 font-mono">{m.phone}</td>
                        <td className="p-2">{m.roomNo}</td>
                        <td className="p-2">{m.role}</td>
                        <td className="p-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleCommitMembers}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Users className="w-4 h-4" />
                  <span>Onboard {parsedMembers.filter((m) => m.isValid).length} Members</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            Bulk operations create an automatic checkpoint snapshot for instant rollback.
          </div>
          <button
            onClick={() => setIsBulkUploadModalOpen(false)}
            className="px-5 py-2 bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-500 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
