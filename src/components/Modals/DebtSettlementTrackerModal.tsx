import React, { useState, useMemo } from 'react';
import { useMess } from '../../context/MessContext';
import {
  X,
  CreditCard,
  CheckCircle2,
  Clock,
  ArrowRight,
  Copy,
  Check,
  Send,
  Smartphone,
  Building,
  DollarSign,
  AlertCircle,
  Share2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface TransferPlan {
  id: string;
  fromMember: string;
  toMember: string;
  amount: number;
  status: 'pending' | 'settled';
  timestamp: string;
}

export const DebtSettlementTrackerModal: React.FC = () => {
  const {
    isDebtSettlementModalOpen,
    setIsDebtSettlementModalOpen,
    memberSummaries,
    currentPeriod,
    addDeposit,
    isManagerMode,
  } = useMess();

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [settledTransferIds, setSettledTransferIds] = useState<Record<string, boolean>>({});

  // Payment numbers specified by the user
  const PAYMENT_METHODS = [
    {
      provider: 'bKash (Personal)',
      number: '01948545255',
      color: 'from-pink-600 to-rose-600',
      badge: 'bKash',
    },
    {
      provider: 'Nagad (Personal)',
      number: '01948545255',
      color: 'from-orange-600 to-amber-600',
      badge: 'Nagad',
    },
    {
      provider: 'Rocket (Personal)',
      number: '018776890414',
      color: 'from-purple-600 to-indigo-600',
      badge: 'Rocket',
    },
    {
      provider: 'Dutch Bangla Bank (DBBL)',
      number: '2281600015015',
      color: 'from-blue-600 to-cyan-600',
      badge: 'DBBL A/C',
    },
  ];

  // Calculate Minimal Cash Flow settlement plan
  const settlementTransfers = useMemo(() => {
    // Separate creditors (positive balance - mess owes them money) and debtors (negative balance - they owe mess money)
    const debtors: { name: string; amount: number }[] = [];
    const creditors: { name: string; amount: number }[] = [];

    memberSummaries.forEach((m) => {
      const net = Math.round(m.netBalance);
      if (net < 0) {
        debtors.push({ name: m.member.name, amount: Math.abs(net) });
      } else if (net > 0) {
        creditors.push({ name: m.member.name, amount: net });
      }
    });

    // Sort descending
    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    const transfers: TransferPlan[] = [];
    let dIdx = 0;
    let cIdx = 0;

    const dCopy = debtors.map((d) => ({ ...d }));
    const cCopy = creditors.map((c) => ({ ...c }));

    while (dIdx < dCopy.length && cIdx < cCopy.length) {
      const debtor = dCopy[dIdx];
      const creditor = cCopy[cIdx];
      const settlementAmount = Math.min(debtor.amount, creditor.amount);

      if (settlementAmount > 0) {
        transfers.push({
          id: `transfer_${debtor.name.replace(/\s+/g, '')}_${creditor.name.replace(/\s+/g, '')}`,
          fromMember: debtor.name,
          toMember: creditor.name,
          amount: settlementAmount,
          status: 'pending',
          timestamp: new Date().toISOString(),
        });
      }

      debtor.amount -= settlementAmount;
      creditor.amount -= settlementAmount;

      if (debtor.amount <= 1) dIdx++;
      if (creditor.amount <= 1) cIdx++;
    }

    // If there is residual debtor balance against the general mess treasury
    while (dIdx < dCopy.length) {
      if (dCopy[dIdx].amount > 1) {
        transfers.push({
          id: `transfer_${dCopy[dIdx].name.replace(/\s+/g, '')}_treasury`,
          fromMember: dCopy[dIdx].name,
          toMember: 'Mess Manager Treasury',
          amount: dCopy[dIdx].amount,
          status: 'pending',
          timestamp: new Date().toISOString(),
        });
      }
      dIdx++;
    }

    return transfers;
  }, [memberSummaries]);

  const totalOutstandingDebt = memberSummaries
    .filter((m) => m.netBalance < 0)
    .reduce((sum, m) => sum + Math.abs(m.netBalance), 0);

  const totalSurplusOwed = memberSummaries
    .filter((m) => m.netBalance > 0)
    .reduce((sum, m) => sum + m.netBalance, 0);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleMarkSettled = (transfer: TransferPlan) => {
    setSettledTransferIds((prev) => ({
      ...prev,
      [transfer.id]: !prev[transfer.id],
    }));
  };

  const generateWhatsAppSummary = () => {
    const lines = [
      `📢 *The Shield Mess - Debt Settlement (${currentPeriod.label})*`,
      `📍 Line, Magura Sadar`,
      `---------------------------------`,
      `💳 *Payment Accounts:*`,
      `• bKash / Nagad: 01948545255`,
      `• Rocket: 018776890414`,
      `• DBBL Bank A/C: 2281600015015`,
      `---------------------------------`,
      `⚡ *Required Settlements:*`,
      ...settlementTransfers.map(
        (t) => `👉 *${t.fromMember}* owes *৳ ${t.amount.toLocaleString()}* -> Pay to *${t.toMember}*`
      ),
      `---------------------------------`,
      `Please confirm after sending transaction reference.`,
    ];
    return lines.join('\n');
  };

  if (!isDebtSettlementModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-slate-900 dark:text-white animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-950/20 to-orange-950/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight">Debt Settlement & Payoff Tracker</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 text-[11px] font-bold">
                  Zero-Sum Reconciliation
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Optimized minimal transfer matrix and verified payment channels
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDebtSettlementModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 scrollbar-thin">
          {/* Top Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                Total Outstanding Due
              </span>
              <p className="text-xl sm:text-2xl font-black text-rose-700 dark:text-rose-300 mt-1">
                ৳ {Math.round(totalOutstandingDebt).toLocaleString()}
              </p>
              <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-0.5">
                Amount owed by members in deficit
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Total Refundable Surplus
              </span>
              <p className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1">
                ৳ {Math.round(totalSurplusOwed).toLocaleString()}
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                Surplus credit to be returned/settled
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Transfers Required
              </span>
              <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                {settlementTransfers.length} <span className="text-xs font-normal text-slate-400">transactions</span>
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Minimum transfers via greedy resolution
              </p>
            </div>
          </div>

          {/* Official Verified Mess Payment Accounts Strip */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-500" />
                <span>Verified Mess Payment Accounts (Manager Line)</span>
              </span>
              <span className="text-[10px] text-slate-400">Click to copy number</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {PAYMENT_METHODS.map((method) => (
                <div
                  key={method.badge}
                  onClick={() => handleCopy(method.number, method.badge)}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition cursor-pointer flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {method.provider}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {method.badge}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2 font-mono font-black text-xs sm:text-sm text-slate-900 dark:text-white">
                    <span>{method.number}</span>
                    {copiedKey === method.badge ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 transition" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Minimal Cash Flow Settlement Checklist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Simplified Settlement Action Plan</span>
              </span>
              <button
                onClick={() => handleCopy(generateWhatsAppSummary(), 'whatsapp_summary')}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900 text-xs font-bold transition cursor-pointer border border-emerald-300 dark:border-emerald-800"
              >
                {copiedKey === 'whatsapp_summary' ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'whatsapp_summary' ? 'Copied Notice!' : 'Copy WhatsApp Notice'}</span>
              </button>
            </div>

            {settlementTransfers.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-400 space-y-2">
                <ShieldCheck className="w-8 h-8 mx-auto text-emerald-500" />
                <p className="text-sm font-bold text-slate-900 dark:text-white">All Mess Accounts are Settled!</p>
                <p className="text-xs">No outstanding debts or imbalances found for this billing cycle.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {settlementTransfers.map((transfer) => {
                  const isSettled = settledTransferIds[transfer.id];
                  return (
                    <div
                      key={transfer.id}
                      className={`p-3.5 rounded-2xl border transition flex flex-wrap items-center justify-between gap-3 ${
                        isSettled
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/50 opacity-70'
                          : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 shadow-xs'
                      }`}
                    >
                      {/* Left: Transfer Flow */}
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleMarkSettled(transfer)}
                          className={`p-1.5 rounded-lg border transition cursor-pointer ${
                            isSettled
                              ? 'bg-emerald-500 border-emerald-600 text-white'
                              : 'border-slate-300 dark:border-slate-600 text-transparent hover:border-emerald-500'
                          }`}
                        >
                          <Check className="w-4 h-4" />
                        </button>

                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2 text-xs font-bold">
                            <span className="text-rose-600 dark:text-rose-400 font-black">{transfer.fromMember}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-emerald-600 dark:text-emerald-400 font-black">{transfer.toMember}</span>
                          </div>
                          <p className="text-[10px] text-slate-400">
                            {isSettled ? 'Marked as Received & Reconciled' : 'Pending transfer / deposit payment'}
                          </p>
                        </div>
                      </div>

                      {/* Right: Amount & Actions */}
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p
                            className={`font-mono font-black text-sm sm:text-base ${
                              isSettled
                                ? 'text-slate-400 line-through'
                                : 'text-slate-900 dark:text-white'
                            }`}
                          >
                            ৳ {transfer.amount.toLocaleString()}
                          </p>
                          <span
                            className={`text-[9px] font-bold uppercase ${
                              isSettled ? 'text-emerald-500' : 'text-amber-500'
                            }`}
                          >
                            {isSettled ? 'Settled' : 'Action Required'}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleMarkSettled(transfer)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                            isSettled
                              ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                          }`}
                        >
                          {isSettled ? 'Undo' : 'Mark Paid'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Reconciled with live ledger net member balances.
          </div>
          <button
            onClick={() => setIsDebtSettlementModalOpen(false)}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-amber-600 hover:bg-slate-800 dark:hover:bg-amber-500 text-white font-bold text-xs transition cursor-pointer shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
