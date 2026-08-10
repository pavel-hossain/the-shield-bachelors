import React, { useState } from 'react';
import { useMess } from '../../context/MessContext';
import { ExpenseCategory } from '../../types';
import { ShoppingBag, Plus, Trash2, History, Search, Receipt, Tag, Calendar, User, FileText } from 'lucide-react';
import { MarketShoppingPDFModal } from '../Reports/MarketShoppingPDFModal';

interface ExpensesModuleProps {
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
}

export const ExpensesModule: React.FC<ExpensesModuleProps> = ({
  isAddModalOpen,
  setIsAddModalOpen,
}) => {
  const {
    currentPeriod,
    expenses,
    members,
    addExpense,
    deleteExpense,
    totalMarketExpense,
    totalUtilityExpense,
    totalOverallExpense,
    isManagerMode,
  } = useMess();

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'history'>('overview');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Form State for Adding Expense
  const todayStr = `${currentPeriod.year}-${currentPeriod.month < 10 ? '0' + currentPeriod.month : currentPeriod.month}-09`;
  const [expenseDate, setExpenseDate] = useState<string>(todayStr);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Market Shopping');
  const [amount, setAmount] = useState<string>('');
  const [paidByMemberId, setPaidByMemberId] = useState<string>(members[0]?.id || 'm1');
  const [notes, setNotes] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount || Number(amount) <= 0) return;

    addExpense({
      date: expenseDate,
      title: title.trim(),
      category,
      amount: Number(amount),
      paidByMemberId,
      notes: notes.trim(),
    });

    setTitle('');
    setAmount('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  const categoriesList: ExpenseCategory[] = [
    'Market Shopping',
    'Utility',
    'Maid / Cook',
    'Gas',
    'Internet',
    'Rent',
    'Miscellaneous',
  ];

  // Filtered expenses
  const currentMonthPrefix = `${currentPeriod.year}-${currentPeriod.month < 10 ? '0' + currentPeriod.month : currentPeriod.month}`;
  const filteredExpenses = expenses.filter((e) => {
    const matchesMonth = e.date.startsWith(currentMonthPrefix);
    const matchesCategory =
      selectedCategoryFilter === 'All' || e.category === selectedCategoryFilter;
    const matchesQuery =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.date.includes(searchQuery) ||
      e.amount.toString().includes(searchQuery);

    return matchesMonth && matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-4 pb-20">
      {/* Header & Sub-Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-500" />
            <span>Market Shopping & Utility Expenses</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track daily market bazaar and fixed monthly bill expenditures
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsPdfModalOpen(true)}
            className="flex items-center gap-1.5 bg-slate-900 dark:bg-amber-600 hover:bg-slate-800 dark:hover:bg-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-xs whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export Shopping Voucher PDF</span>
          </button>

          {/* Sub-Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveSubTab('overview')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition whitespace-nowrap ${
                activeSubTab === 'overview'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Expense Overview
            </button>
            <button
              onClick={() => setActiveSubTab('history')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition whitespace-nowrap ${
                activeSubTab === 'history'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>History & Statement</span>
            </button>
          </div>

          {isManagerMode && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white px-3 py-2 rounded-lg text-xs font-bold transition shadow-xs whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Add Expense</span>
            </button>
          )}
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">
            Market Mess Bazaar
          </span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-0.5">
            ৳ {totalMarketExpense.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400">Used for calculating meal rate</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">
            Utilities, Maid & Rent
          </span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
            ৳ {totalUtilityExpense.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400">Shared equally per active member</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">
            Total Combined Expense
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
            ৳ {totalOverallExpense.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400">Market + Utility total</span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategoryFilter('All')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition whitespace-nowrap ${
            selectedCategoryFilter === 'All'
              ? 'bg-amber-600 text-white border-amber-600'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
          }`}
        >
          All Categories
        </button>
        {categoriesList.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition whitespace-nowrap ${
              selectedCategoryFilter === cat
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Expenses Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2">
          <h3 className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
            {activeSubTab === 'overview' ? 'Monthly Expense Log' : 'Expense Statement & History'}
          </h3>
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg pl-8 pr-3 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3 whitespace-nowrap">Date</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Expense Title</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Category</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Paid By / Shopper</th>
                <th className="py-2.5 px-3 text-right whitespace-nowrap">Amount</th>
                <th className="py-2.5 px-3 text-center whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No expense records found matching your query.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => {
                  const shopper = members.find((m) => m.id === exp.paidByMemberId);
                  return (
                    <tr key={exp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                        {exp.date}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                        <div className="max-w-xs truncate">
                          <span>{exp.title}</span>
                          {exp.notes && (
                            <p className="text-[10px] text-slate-400 font-normal truncate">
                              {exp.notes}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            exp.category === 'Market Shopping'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                          }`}
                        >
                          {exp.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {shopper ? shopper.name : 'Mess Fund'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-black text-slate-900 dark:text-white whitespace-nowrap">
                        ৳ {exp.amount.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        {isManagerMode ? (
                          <button
                            onClick={() => deleteExpense(exp.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition"
                            title="Delete Expense"
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

      {/* Add Expense Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-500" />
                <span>Add New Expense</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              {/* Explicit Date Input Requirement */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  <span>Expense Date *</span>
                </label>
                <input
                  type="date"
                  required
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-1">
                  <Tag className="w-3.5 h-3.5 text-amber-500" />
                  <span>Expense Title *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fish & Vegetables Market / Electricity Bill"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-2.5 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {categoriesList.map((cat) => (
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
                    placeholder="1500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-1">
                  <User className="w-3.5 h-3.5 text-amber-500" />
                  <span>Paid By / Market Shopper *</span>
                </label>
                <select
                  value={paidByMemberId}
                  onChange={(e) => setPaidByMemberId(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-2.5 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                  <span>Notes / Items Breakdown</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Optional details (e.g. Ruhi fish 2kg, Rice 10kg...)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white transition shadow-sm"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Market Shopping PDF Voucher Modal */}
      <MarketShoppingPDFModal isOpen={isPdfModalOpen} onClose={() => setIsPdfModalOpen(false)} />
    </div>
  );
};
