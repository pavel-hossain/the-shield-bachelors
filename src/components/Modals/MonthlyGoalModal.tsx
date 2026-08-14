import React, { useState } from 'react';
import { useMess } from '../../context/MessContext';
import {
  X,
  Target,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Zap,
  TrendingDown,
  PiggyBank,
  ShieldAlert,
  Sparkles,
  Save,
  Sliders,
  DollarSign,
  Scale,
  Award,
} from 'lucide-react';

export const MonthlyGoalModal: React.FC = () => {
  const {
    isGoalModalOpen,
    setIsGoalModalOpen,
    monthlyGoals,
    updateMonthlyGoals,
    currentPeriod,
    totalOverallExpense,
    totalMarketExpense,
    totalUtilityExpense,
    totalMessMeals,
    effectiveMealRate,
    actualMealRate,
    totalDepositsAmount,
    activeMembersCount,
    isManagerMode,
  } = useMess();

  const [targetMealRate, setTargetMealRate] = useState(monthlyGoals.targetMealRate || 50);
  const [monthlyBudgetCeiling, setMonthlyBudgetCeiling] = useState(monthlyGoals.monthlyBudgetCeiling || 32000);
  const [savingsTargetAmount, setSavingsTargetAmount] = useState(monthlyGoals.savingsTargetAmount || 2500);
  const [maxDailySpendLimit, setMaxDailySpendLimit] = useState(monthlyGoals.maxDailySpendLimit || 1100);
  const [mealPacingTarget, setMealPacingTarget] = useState(monthlyGoals.mealPacingTarget || 480);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isGoalModalOpen) return null;

  const totalDaysInMonth = new Date(currentPeriod.year, currentPeriod.month, 0).getDate();
  const today = new Date();
  const currentDay = Math.min(
    totalDaysInMonth,
    currentPeriod.year === today.getFullYear() && currentPeriod.month === today.getMonth() + 1
      ? today.getDate()
      : 9
  );
  const daysRemaining = Math.max(1, totalDaysInMonth - currentDay);

  const currentRate = effectiveMealRate > 0 ? effectiveMealRate : (actualMealRate > 0 ? actualMealRate : 45);
  const rateDiff = currentRate - targetMealRate;
  const isRateHealthy = currentRate <= targetMealRate;

  const remainingBudget = Math.max(0, monthlyBudgetCeiling - totalOverallExpense);
  const safeDailySpend = Math.round(remainingBudget / daysRemaining);
  const currentDailySpend = currentDay > 0 ? Math.round(totalOverallExpense / currentDay) : 0;
  const projectedTotalExpense = currentDay > 0 ? Math.round((totalOverallExpense / currentDay) * totalDaysInMonth) : totalOverallExpense;
  const projectedSavings = Math.max(0, monthlyBudgetCeiling - projectedTotalExpense);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMonthlyGoals({
      targetMealRate,
      monthlyBudgetCeiling,
      savingsTargetAmount,
      maxDailySpendLimit,
      mealPacingTarget,
      enableAlerts: true,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsGoalModalOpen(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden shadow-2xl my-8">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Monthly Goal & Budget Strategy
              </h3>
              <p className="text-xs text-indigo-200">
                Track financial benchmarks, meal rate ceilings, and burn rate limits
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsGoalModalOpen(false)}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Quick Status Pill Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Current Rate</div>
              <div className={`text-base font-black ${isRateHealthy ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                ৳{currentRate.toFixed(2)}
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Target: ৳{targetMealRate.toFixed(2)}</div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Daily Burn Rate</div>
              <div className={`text-base font-black ${currentDailySpend <= maxDailySpendLimit ? 'text-indigo-600 dark:text-indigo-400' : 'text-amber-600 dark:text-amber-400'}`}>
                ৳{currentDailySpend}
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Max Limit: ৳{maxDailySpendLimit}</div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Budget Spent</div>
              <div className="text-base font-black text-slate-900 dark:text-white">
                {Math.round((totalOverallExpense / monthlyBudgetCeiling) * 100)}%
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Rem: ৳{remainingBudget.toLocaleString()}</div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Forecast Savings</div>
              <div className="text-base font-black text-emerald-600 dark:text-emerald-400">
                ৳{projectedSavings.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Goal: ৳{savingsTargetAmount.toLocaleString()}</div>
            </div>
          </div>

          {/* Form to update targets */}
          <form onSubmit={handleSave} className="space-y-4 bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                <span>Configure Target Parameters</span>
              </h4>
              {!isManagerMode && (
                <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                  (Manager PIN required to permanently apply changes)
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Target Meal Rate */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Meal Rate (৳ / Meal)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    value={targetMealRate}
                    onChange={(e) => setTargetMealRate(parseFloat(e.target.value) || 0)}
                    disabled={!isManagerMode}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="absolute right-3 top-2 text-xs text-slate-400 font-bold">BDT</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  Optimal bachelor mess standard: ৳45 - ৳55 per meal
                </p>
              </div>

              {/* Monthly Budget Ceiling */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Monthly Total Budget Ceiling (৳)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="500"
                    value={monthlyBudgetCeiling}
                    onChange={(e) => setMonthlyBudgetCeiling(parseFloat(e.target.value) || 0)}
                    disabled={!isManagerMode}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="absolute right-3 top-2 text-xs text-slate-400 font-bold">BDT</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  Combines market groceries, LPG, utilities and fixed bills
                </p>
              </div>

              {/* Safe Daily Spend Limit */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Safe Daily Spend Limit (৳ / Day)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="50"
                    value={maxDailySpendLimit}
                    onChange={(e) => setMaxDailySpendLimit(parseFloat(e.target.value) || 0)}
                    disabled={!isManagerMode}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="absolute right-3 top-2 text-xs text-slate-400 font-bold">BDT</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  Alerts if daily market bazaar exceeds this threshold
                </p>
              </div>

              {/* Target Savings Amount */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Savings Buffer (৳)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="100"
                    value={savingsTargetAmount}
                    onChange={(e) => setSavingsTargetAmount(parseFloat(e.target.value) || 0)}
                    disabled={!isManagerMode}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="absolute right-3 top-2 text-xs text-slate-400 font-bold">BDT</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  Emergency fund preserved for next month's opening advance
                </p>
              </div>
            </div>

            {isManagerMode && (
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition shadow-xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Goal Targets</span>
                </button>
              </div>
            )}

            {savedSuccess && (
              <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Monthly goals updated successfully!</span>
              </div>
            )}
          </form>

          {/* Strategic Advice Card */}
          <div className="bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 dark:text-indigo-200">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Smart Meal Rate Optimization Strategy</span>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
              <li>
                <strong>Bulk Grains Buying:</strong> Purchase 50kg rice and 5L cooking oil in first week of the month to lock in lower unit prices.
              </li>
              <li>
                <strong>Rotating Bazaar Duty:</strong> Encourage member pairs to visit wholesale vegetable markets (Kacha Bazar) in early morning (6:30 AM).
              </li>
              <li>
                <strong>Accurate Meal Cut-offs:</strong> Enforce strict cut-off times (Lunch 9 AM, Dinner 5 PM) to minimize excess cooked food waste.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100/70 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={() => setIsGoalModalOpen(false)}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
