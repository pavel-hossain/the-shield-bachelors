import React, { useState } from 'react';
import { useMess } from '../../context/MessContext';
import { PaymentMethod } from '../../types';
import { CreditCard, Plus, Trash2, History, Search, Calendar, User, Hash, FileText } from 'lucide-react';
import { DepositsPDFModal } from '../Reports/DepositsPDFModal';

interface DepositsModuleProps {
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
}

export const DepositsModule: React.FC<DepositsModuleProps> = ({
  isAddModalOpen,
  setIsAddModalOpen,
}) => {
  const {
    currentPeriod,
    deposits,
    members,
    addDeposit,
    deleteDeposit,
    totalDepositsAmount,
    managerCashBalance,
    isManagerMode,
  } = useMess();

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'history'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMethodFilter, setSelectedMethodFilter] = useState<string>('All');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Form State for Adding Deposit
  const todayStr = `${currentPeriod.year}-${currentPeriod.month < 10 ? '0' + currentPeriod.month : currentPeriod.month}-09`;
  const [depositDate, setDepositDate] = useState<string>(todayStr);
  const [memberId, setMemberId] = useState<string>(members[0]?.id || 'm1');
  const [amount, setAmount] = useState<string>('');
  const [method, setMethod] = useState<PaymentMethod>('bKash');
  const [transactionId, setTransactionId] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    addDeposit({
      date: depositDate,
      memberId,
      amount: Number(amount),
      method,
      transactionId: transactionId.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    setAmount('');
    setTransactionId('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  const paymentMethodsList: PaymentMethod[] = ['Cash', 'bKash', 'Nagad', 'Bank Transfer'];

  // Filtered deposits
  const currentMonthPrefix = `${currentPeriod.year}-${currentPeriod.month < 10 ? '0' + currentPeriod.month : currentPeriod.month}`;
  const filteredDeposits = deposits.filter((d) => {
    const member = members.find((m) => m.id === d.memberId);
    const memberName = member ? member.name.toLowerCase() : '';

    const matchesMonth = d.date.startsWith(currentMonthPrefix);
    const matchesMethod = selectedMethodFilter === 'All' || d.method === selectedMethodFilter;
    const matchesQuery =
      memberName.includes(searchQuery.toLowerCase()) ||
      d.date.includes(searchQuery) ||
      d.amount.toString().includes(searchQuery) ||
      (d.transactionId && d.transactionId.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesMonth && matchesMethod && matchesQuery;
  });

  return (
    <div className="space-y-4 pb-20">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Member Deposits & Payments</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Record cash, bKash, and Nagad money collected from mess members
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsPdfModalOpen(true)}
            className="flex items-center gap-1.5 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-xs whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export Deposit Receipt PDF</span>
          </button>

          {/* Sub-Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveSubTab('overview')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition whitespace-nowrap ${
                activeSubTab === 'overview'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Deposit Summary
            </button>
            <button
              onClick={() => setActiveSubTab('history')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition whitespace-nowrap ${
                activeSubTab === 'history'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
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
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-lg text-xs font-bold transition shadow-xs whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Add Deposit</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">
            Total Monthly Deposits Collected
          </span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
            ৳ {totalDepositsAmount.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400">
            Total collected from all members in {currentPeriod.label}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">
            Manager Current Hand Cash
          </span>
          <div
            className={`text-2xl font-black mt-0.5 ${
              managerCashBalance >= 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            ৳ {managerCashBalance.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400">Total Deposits minus Expenses</span>
        </div>
      </div>

      {/* Payment Method Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedMethodFilter('All')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition whitespace-nowrap ${
            selectedMethodFilter === 'All'
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
          }`}
        >
          All Methods
        </button>
        {paymentMethodsList.map((m) => (
          <button
            key={m}
            onClick={() => setSelectedMethodFilter(m)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition whitespace-nowrap ${
              selectedMethodFilter === m
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Deposit Ledger Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2">
          <h3 className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
            {activeSubTab === 'overview' ? 'Deposit Transaction Ledger' : 'Deposit Statement & Logs'}
          </h3>
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by member, date, TRX..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg pl-8 pr-3 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3 whitespace-nowrap">Date</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Member Name</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Payment Method</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Reference / TRX ID</th>
                <th className="py-2.5 px-3 text-right whitespace-nowrap">Amount</th>
                <th className="py-2.5 px-3 text-center whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredDeposits.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No deposit records found matching your filter.
                  </td>
                </tr>
              ) : (
                filteredDeposits.map((dep) => {
                  const member = members.find((m) => m.id === dep.memberId);
                  return (
                    <tr key={dep.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                        {dep.date}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {member ? member.name : 'Unknown Member'}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {dep.method}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {dep.transactionId || 'CASH-REF'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-black text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                        + ৳ {dep.amount.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        {isManagerMode ? (
                          <button
                            onClick={() => deleteDeposit(dep.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition"
                            title="Delete Deposit"
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

      {/* Add Deposit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Add Member Deposit</span>
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
                  <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Deposit Date *</span>
                </label>
                <input
                  type="date"
                  required
                  value={depositDate}
                  onChange={(e) => setDepositDate(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-1">
                  <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Select Member *</span>
                </label>
                <select
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-2.5 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} (Room {m.roomNo})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Payment Method *
                  </label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-2.5 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {paymentMethodsList.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Deposit Amount (৳) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="3000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-1">
                  <Hash className="w-3.5 h-3.5 text-slate-400" />
                  <span>TRX ID / Reference Number</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. BK90123984 / Cash Slip"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-1">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Notes</span>
                </label>
                <input
                  type="text"
                  placeholder="Optional notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm"
                >
                  Save Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deposits History PDF Modal */}
      <DepositsPDFModal isOpen={isPdfModalOpen} onClose={() => setIsPdfModalOpen(false)} />
    </div>
  );
};
