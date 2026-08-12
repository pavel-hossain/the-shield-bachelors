import React, { useState } from 'react';
import { useMess } from '../../context/MessContext';
import {
  AlertTriangle,
  TrendingUp,
  Target,
  Edit2,
  Check,
  X,
  Zap,
  DollarSign,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

export const BudgetAlertBanner: React.FC = () => {
  const { currentPeriod, totalMarketExpense, updatePeriodBudget, isManagerMode } = useMess();

  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [newBudgetValue, setNewBudgetValue] = useState<string>(
    (currentPeriod.targetBudget || 15000).toString()
  );

  const targetBudget = currentPeriod.targetBudget || 15000;
  const spentAmount = totalMarketExpense;
  const remainingBudget = targetBudget - spentAmount;
  const percentUsed = Math.min(Math.round((spentAmount / targetBudget) * 100), 200);

  // Remaining days calculation
  const now = new Date();
  const daysInMonth = new Date(currentPeriod.year, currentPeriod.month, 0).getDate();
  const currentDay = Math.min(now.getDate(), daysInMonth);
  const daysLeft = Math.max(daysInMonth - currentDay + 1, 1);
  const recommendedDailySpend = Math.max(Math.floor(remainingBudget / daysLeft), 0);

  // Alert level
  let alertLevel: 'safe' | 'warning' | 'exceeded' = 'safe';
  if (spentAmount >= targetBudget) {
    alertLevel = 'exceeded';
  } else if (percentUsed >= 75) {
    alertLevel = 'warning';
  }

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(newBudgetValue);
    if (val && val > 0) {
      updatePeriodBudget(currentPeriod.label, val);
      setIsEditingBudget(false);
    }
  };

  return (
    <div
      className={`rounded-2xl p-4 sm:p-5 border transition-all duration-300 shadow-sm relative overflow-hidden ${
        alertLevel === 'exceeded'
          ? 'bg-rose-50/90 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-100 hover-border-glow ring-2 ring-rose-500/20'
          : alertLevel === 'warning'
          ? 'bg-amber-50/90 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-100 hover-border-glow ring-2 ring-amber-500/20'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover-border-glow hover-lift'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Title & Warning Label */}
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white shadow-md ${
              alertLevel === 'exceeded'
                ? 'bg-rose-600 shadow-rose-500/30 animate-pulse'
                : alertLevel === 'warning'
                ? 'bg-amber-500 shadow-amber-500/30'
                : 'bg-emerald-600 shadow-emerald-500/20'
            }`}
          >
            {alertLevel === 'exceeded' ? (
              <ShieldAlert className="w-5 h-5" />
            ) : alertLevel === 'warning' ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <Target className="w-5 h-5" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Mess Market Budget Alert
              </h4>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                  alertLevel === 'exceeded'
                    ? 'bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-700 animate-pulse'
                    : alertLevel === 'warning'
                    ? 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700'
                    : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                }`}
              >
                {alertLevel === 'exceeded'
                  ? '🚨 Budget Exceeded'
                  : alertLevel === 'warning'
                  ? '⚠️ High Spending'
                  : '✅ On Track'}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {alertLevel === 'exceeded' ? (
                <span className="text-rose-600 dark:text-rose-400 font-bold">
                  Monthly market limit surpassed by BDT {Math.abs(remainingBudget).toLocaleString()}!
                </span>
              ) : alertLevel === 'warning' ? (
                <span className="text-amber-600 dark:text-amber-400 font-medium">
                  Approaching threshold! BDT {remainingBudget.toLocaleString()} remaining for {daysLeft} days.
                </span>
              ) : (
                <span>
                  BDT {remainingBudget.toLocaleString()} remaining in market budget. Rec. spend ~BDT{' '}
                  {recommendedDailySpend}/day.
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Edit Budget Button or Form */}
        {isManagerMode && (
          <div className="shrink-0 self-end sm:self-center">
            {isEditingBudget ? (
              <form onSubmit={handleSaveBudget} className="flex items-center gap-1.5">
                <input
                  type="number"
                  value={newBudgetValue}
                  onChange={(e) => setNewBudgetValue(e.target.value)}
                  className="w-24 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-2 py-1 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
                <button
                  type="submit"
                  className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                  title="Save New Target"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingBudget(false)}
                  className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
                  title="Cancel"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsEditingBudget(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                <Edit2 className="w-3 h-3 text-emerald-500" />
                <span>Target: ৳{targetBudget.toLocaleString()}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Progress Bar & Numeric Breakdown */}
      <div className="mt-3.5 space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
          <span>Market Spend Progress</span>
          <span
            className={
              percentUsed >= 100
                ? 'text-rose-600 dark:text-rose-400 font-extrabold'
                : percentUsed >= 75
                ? 'text-amber-600 dark:text-amber-400 font-extrabold'
                : 'text-emerald-600 dark:text-emerald-400 font-extrabold'
            }
          >
            ৳{spentAmount.toLocaleString()} / ৳{targetBudget.toLocaleString()} ({percentUsed}%)
          </span>
        </div>

        <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              alertLevel === 'exceeded'
                ? 'bg-gradient-to-r from-amber-500 to-rose-600 animate-pulse'
                : alertLevel === 'warning'
                ? 'bg-gradient-to-r from-emerald-500 to-amber-500'
                : 'bg-gradient-to-r from-emerald-600 to-teal-500'
            }`}
            style={{ width: `${Math.min(percentUsed, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
