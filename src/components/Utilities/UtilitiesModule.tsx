import React, { useState } from 'react';
import { useMess } from '../../context/MessContext';
import { UtilityCategory } from '../../types';
import { Zap, Plus, Trash2, Search, Calendar, User, FileText, Sliders, Sparkles, Tag } from 'lucide-react';
import { UtilityBillsPDFModal } from '../Reports/UtilityBillsPDFModal';
import { suggestExpenseCategory } from '../../utils/categorySuggester';

interface UtilitiesModuleProps {
  isAddModalOpen?: boolean;
  setIsAddModalOpen?: (open: boolean) => void;
}

export const UtilitiesModule: React.FC<UtilitiesModuleProps> = () => {
  const {
    currentPeriod,
    expenses,
    members,
    addExpense,
    deleteExpense,
    totalUtilityExpense,
    activeMembersCount,
    utilityPerMember,
    updateMember,
    isManagerMode,
  } = useMess();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'bills' | 'custom_shares'>('bills');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Form State
  const todayStr = `${currentPeriod.year}-${currentPeriod.month < 10 ? '0' + currentPeriod.month : currentPeriod.month}-09`;
  const [billDate, setBillDate] = useState<string>(todayStr);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<UtilityCategory>('Electricity');
  const [isCategoryManuallyChanged, setIsCategoryManuallyChanged] = useState(false);
  const [amount, setAmount] = useState<string>('');
  const [paidByMemberId, setPaidByMemberId] = useState<string>(members[0]?.id || 'm1');
  const [notes, setNotes] = useState('');

  // Map ExpenseCategory to UtilityCategory
  const mapToUtilityCategory = (titleStr: string): UtilityCategory | null => {
    const expCat = suggestExpenseCategory(titleStr);
    if (!expCat) return null;
    if (expCat === 'Gas') return 'Gas Cylinder';
    if (expCat === 'Internet') return 'Internet';
    if (expCat === 'Maid / Cook') return 'Cook / Maid';
    if (expCat === 'Rent') return 'House Rent';
    if (expCat === 'Utility') return 'Electricity';
    if (expCat === 'Miscellaneous') return 'Other Fixed Bills';
    return null;
  };

  const autoSuggestedCategory = mapToUtilityCategory(title);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    const suggested = mapToUtilityCategory(newTitle);
    if (suggested && !isCategoryManuallyChanged) {
      setCategory(suggested);
    }
  };

  const utilityCategories: UtilityCategory[] = [
    'Electricity',
    'Cook / Maid',
    'Internet',
    'Gas Cylinder',
    'House Rent',
    'Other Fixed Bills',
  ];

  const currentMonthPrefix = `${currentPeriod.year}-${currentPeriod.month < 10 ? '0' + currentPeriod.month : currentPeriod.month}`;

  // Utility expenses (category !== 'Market Shopping')
  const utilityExpenses = expenses.filter(
    (e) => e.date.startsWith(currentMonthPrefix) && e.category !== 'Market Shopping'
  );

  const filteredUtilities = utilityExpenses.filter((e) => {
    return (
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.date.includes(searchQuery) ||
      e.amount.toString().includes(searchQuery)
    );
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount || Number(amount) <= 0) return;

    addExpense({
      date: billDate,
      title: title.trim(),
      category: category as any,
      amount: Number(amount),
      paidByMemberId,
      notes: notes.trim(),
    });

    setTitle('');
    setAmount('');
    setNotes('');
    setIsCategoryManuallyChanged(false);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-500" />
            <span>Dedicated Utility & Fixed Bills</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Electricity, Maid allowance, Fiber WiFi, LP Gas & House Rent (Excluded from meal rate)
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsPdfModalOpen(true)}
            className="flex items-center gap-1.5 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-xs whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export Utility Statement PDF</span>
          </button>

          {/* Sub-Tab Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveSubTab('bills')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition whitespace-nowrap ${
                activeSubTab === 'bills'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Utility Log
            </button>
            <button
              onClick={() => setActiveSubTab('custom_shares')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition whitespace-nowrap ${
                activeSubTab === 'custom_shares'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Split Settings</span>
            </button>
          </div>

          {isManagerMode && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-lg text-xs font-bold transition shadow-xs whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Add Utility Bill</span>
            </button>
          )}
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">
            Total Monthly Utility Expense
          </span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
            ৳ {totalUtilityExpense.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400">Sum of electricity, maid, WiFi & rent</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">
            Equal Share per Active Member
          </span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
            ৳ {utilityPerMember.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400">
            Calculated across {activeMembersCount} active members
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">
            Active Members Count
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
            {activeMembersCount} Members
          </div>
          <span className="text-[10px] text-slate-400">Eligible for equal fixed cost division</span>
        </div>
      </div>

      {/* Tab Content */}
      {activeSubTab === 'bills' ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
          <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2">
            <h3 className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
              Utility & Fixed Bills Statement ({filteredUtilities.length} Records)
            </h3>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search utility bills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg pl-8 pr-3 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3 whitespace-nowrap">Date</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Bill Name</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Category</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Paid By</th>
                  <th className="py-2.5 px-3 text-right whitespace-nowrap">Amount</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUtilities.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No utility bills logged for this month.
                    </td>
                  </tr>
                ) : (
                  filteredUtilities.map((bill) => {
                    const payer = members.find((m) => m.id === bill.paidByMemberId);
                    return (
                      <tr key={bill.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                          {bill.date}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                          <div className="max-w-xs truncate">
                            <span>{bill.title}</span>
                            {bill.notes && (
                              <p className="text-[10px] text-slate-400 font-normal truncate">
                                {bill.notes}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                            {bill.category}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                          {payer ? payer.name : 'Mess Fund'}
                        </td>
                        <td className="py-2.5 px-3 text-right font-black text-slate-900 dark:text-white whitespace-nowrap">
                          ৳ {bill.amount.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          {isManagerMode ? (
                            <button
                              onClick={() => deleteExpense(bill.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition"
                              title="Delete Utility Bill"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <span className="text-slate-400 text-[10px] italic">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Custom Utility Shares per member */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Member Fixed Utility Allocation
              </h3>
              <p className="text-xs text-slate-500">
                By default, utility total is split equally among active members (৳ {utilityPerMember}). You can set custom fixed amounts for specific members below.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {members.map((m) => (
              <div key={m.id} className="py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${m.avatarColor}`}>
                    {m.name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      {m.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Room {m.roomNo} • {m.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-semibold">Share:</span>
                  <input
                    type="number"
                    placeholder={String(utilityPerMember)}
                    value={m.fixedUtilityShare ?? ''}
                    disabled={!isManagerMode}
                    onChange={(e) => {
                      const val = e.target.value === '' ? undefined : Number(e.target.value);
                      updateMember({ ...m, fixedUtilityShare: val });
                    }}
                    className={`w-24 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-2 py-1 text-xs font-bold text-right focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                      !isManagerMode ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">৳</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Utility Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-500" />
                <span>Add Utility / Fixed Bill</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Bill Date *</span>
                </label>
                <input
                  type="date"
                  required
                  value={billDate}
                  onChange={(e) => setBillDate(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Bill Title *</span>
                  </div>
                  {autoSuggestedCategory && (
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800 animate-pulse">
                      <Sparkles className="w-3 h-3 text-indigo-500" />
                      <span>Suggested: {autoSuggestedCategory}</span>
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electricity Recharge, Gas Cylinder, WiFi, Bua Salary..."
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                {/* Quick Utility Keyword Tags */}
                <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-400 font-semibold mr-0.5">Quick Keywords:</span>
                  {[
                    'Electricity Bill',
                    'Gas Cylinder',
                    'WiFi Internet',
                    'Cook Salary',
                    'House Rent',
                  ].map((kw) => (
                    <button
                      key={kw}
                      type="button"
                      onClick={() => {
                        setIsCategoryManuallyChanged(false);
                        handleTitleChange(kw);
                      }}
                      className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-950/80 text-slate-600 dark:text-slate-300 text-[10px] font-medium transition cursor-pointer"
                    >
                      +{kw}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Category *
                    </label>
                    {autoSuggestedCategory && !isCategoryManuallyChanged && (
                      <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-bold">
                        (Auto-Matched)
                      </span>
                    )}
                  </div>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value as UtilityCategory);
                      setIsCategoryManuallyChanged(true);
                    }}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-2.5 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {utilityCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Amount (৳) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="1200"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-1">
                  <User className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Paid By Member / Manager *</span>
                </label>
                <select
                  value={paidByMemberId}
                  onChange={(e) => setPaidByMemberId(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-2.5 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-1">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Notes / Particulars</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Optional details..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm"
                >
                  Save Utility Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Utility Bills PDF Report Modal */}
      <UtilityBillsPDFModal isOpen={isPdfModalOpen} onClose={() => setIsPdfModalOpen(false)} />
    </div>
  );
};
