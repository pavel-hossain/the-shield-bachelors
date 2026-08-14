import React, { useState } from 'react';
import { useMess } from '../../context/MessContext';
import {
  Target,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Edit3,
  Flame,
  ShieldCheck,
  Zap,
  DollarSign,
  ChevronRight,
  PiggyBank,
  Sparkles,
} from 'lucide-react';
import { MonthlyGoalConfig } from '../../types';

interface MonthlyGoalProgressProps {
  onOpenSettings?: () => void;
  compact?: boolean;
}

export const MonthlyGoalProgress: React.FC<MonthlyGoalProgressProps> = ({
  onOpenSettings,
  compact = false,
}) => {
  const {
    currentPeriod,
    monthlyGoals,
    updateMonthlyGoals,
    totalOverallExpense,
    totalMarketExpense,
    totalUtilityExpense,
    totalMessMeals,
    totalEffectiveMeals,
    effectiveMealRate,
    actualMealRate,
    totalDepositsAmount,
    activeMembersCount,
    isManagerMode,
    setIsGoalModalOpen,
  } = useMess();

  // Days calculations
  const totalDaysInMonth = new Date(currentPeriod.year, currentPeriod.month, 0).getDate();
  // Simulated or current day (defaulting to 9 or real day)
  const today = new Date();
  const currentDay = Math.min(
    totalDaysInMonth,
    currentPeriod.year === today.getFullYear() && currentPeriod.month === today.getMonth() + 1
      ? today.getDate()
      : 9
  );
  const daysRemaining = Math.max(1, totalDaysInMonth - currentDay);

  // Meal Rate Target Metrics
  const targetMealRate = monthlyGoals.targetMealRate || 50;
  const currentRate = effectiveMealRate > 0 ? effectiveMealRate : (actualMealRate > 0 ? actualMealRate : 45);
  const rateDifference = currentRate - targetMealRate;
  const isRateOnTrack = currentRate <= targetMealRate;
  const rateProgressPct = Math.min(150, Math.max(10, Math.round((currentRate / targetMealRate) * 100)));

  // Monthly Budget Metrics
  const budgetCeiling = monthlyGoals.monthlyBudgetCeiling || currentPeriod.targetBudget || 32000;
  const budgetSpentPct = Math.min(100, Math.round((totalOverallExpense / budgetCeiling) * 100));
  const remainingBudget = Math.max(0, budgetCeiling - totalOverallExpense);
  const safeDailySpend = Math.round(remainingBudget / daysRemaining);
  const actualAvgDailySpend = currentDay > 0 ? Math.round(totalOverallExpense / currentDay) : 0;
  const isDailySpendSafe = actualAvgDailySpend <= safeDailySpend;

  // Month-End Projection
  const projectedMonthEndExpense = currentDay > 0 ? Math.round((totalOverallExpense / currentDay) * totalDaysInMonth) : totalOverallExpense;
  const projectedSavings = Math.max(0, budgetCeiling - projectedMonthEndExpense);
  const isProjectedOverBudget = projectedMonthEndExpense > budgetCeiling;

  // Meal pacing
  const targetMealCount = monthlyGoals.mealPacingTarget || (activeMembersCount * 45);
  const mealPacingPct = Math.min(100, Math.round((totalMessMeals / targetMealCount) * 100));

  // Quick edit state if inline
  const [isEditingInline, setIsEditingInline] = useState(false);
  const [editTargetRate, setEditTargetRate] = useState(targetMealRate.toString());
  const [editBudgetCeiling, setEditBudgetCeiling] = useState(budgetCeiling.toString());
  const [editDailyLimit, setEditDailyLimit] = useState((monthlyGoals.maxDailySpendLimit || 1100).toString());

  const handleSaveInline = (e: React.FormEvent) => {
    e.preventDefault();
    updateMonthlyGoals({
      targetMealRate: parseFloat(editTargetRate) || 50,
      monthlyBudgetCeiling: parseFloat(editBudgetCeiling) || 32000,
      maxDailySpendLimit: parseFloat(editDailyLimit) || 1100,
    });
    setIsEditingInline(false);
  };

  if (compact) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-3.5 rounded-xl border border-indigo-900/40 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">Monthly Goal Tracker</div>
              <div className="text-[10px] text-slate-400">Target Meal Rate: ৳{targetMealRate.toFixed(2)}</div>
            </div>
          </div>
          <button
            onClick={() => setIsGoalModalOpen(true)}
            className="text-[11px] font-semibold text-indigo-300 hover:text-white flex items-center gap-1 transition"
          >
            <span>Details</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Mini Rate & Budget Bars */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/60">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span>Meal Rate</span>
              <span className={isRateOnTrack ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                ৳{currentRate.toFixed(2)}
              </span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  isRateOnTrack ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, rateProgressPct)}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/60">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span>Budget Cap</span>
              <span className="text-amber-300 font-bold">{budgetSpentPct}%</span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  budgetSpentPct > 85 ? 'bg-rose-500' : budgetSpentPct > 65 ? 'bg-amber-500' : 'bg-indigo-500'
                }`}
                style={{ width: `${budgetSpentPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition">
      {/* Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shadow-inner">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">Monthly Goal & Budget Pacing</h3>
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {currentPeriod.label}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Active financial targets, meal rate ceiling, and expenditure burn-rate velocity
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isManagerMode && (
            <button
              onClick={() => setIsEditingInline(!isEditingInline)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
            >
              <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isEditingInline ? 'Cancel' : 'Edit Targets'}</span>
            </button>
          )}
          <button
            onClick={() => setIsGoalModalOpen(true)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Goal Insights</span>
          </button>
        </div>
      </div>

      {/* Inline Goal Editor */}
      {isEditingInline && (
        <form onSubmit={handleSaveInline} className="p-4 bg-indigo-50/50 dark:bg-indigo-950/30 border-b border-indigo-100 dark:border-indigo-900/50 flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[140px]">
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              Target Meal Rate (৳)
            </label>
            <input
              type="number"
              step="0.5"
              value={editTargetRate}
              onChange={(e) => setEditTargetRate(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white font-bold"
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              Monthly Budget Ceiling (৳)
            </label>
            <input
              type="number"
              step="500"
              value={editBudgetCeiling}
              onChange={(e) => setEditBudgetCeiling(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white font-bold"
            />
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              Daily Safe Spend Limit (৳)
            </label>
            <input
              type="number"
              step="50"
              value={editDailyLimit}
              onChange={(e) => setEditDailyLimit(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white font-bold"
            />
          </div>
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition shadow-xs"
          >
            Update Goals
          </button>
        </form>
      )}

      {/* Main Goal Grid */}
      <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Meal Rate Target Meter */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Meal Rate Target</span>
            </div>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                isRateOnTrack
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
              }`}
            >
              {isRateOnTrack ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span>On Target (-৳{Math.abs(rateDifference).toFixed(2)})</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3 text-rose-500" />
                  <span>Over by +৳{rateDifference.toFixed(2)}</span>
                </>
              )}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              ৳{currentRate.toFixed(2)}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              / meal (Target: ৳{targetMealRate.toFixed(2)})
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  isRateOnTrack ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-amber-500 to-rose-500'
                }`}
                style={{ width: `${Math.min(100, (currentRate / (targetMealRate * 1.25)) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
              <span>Floor ৳35.00</span>
              <span className="font-bold text-indigo-500">Target ৳{targetMealRate.toFixed(2)}</span>
              <span>Max ৳{(targetMealRate * 1.25).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Monthly Budget Burn Rate */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
              <Flame className="w-4 h-4 text-rose-500" />
              <span>Budget Cap & Burn Rate</span>
            </div>
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
              Day {currentDay} of {totalDaysInMonth}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              ৳{totalOverallExpense.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              / ৳{budgetCeiling.toLocaleString()} ({budgetSpentPct}%)
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  budgetSpentPct > 85
                    ? 'bg-rose-500'
                    : budgetSpentPct > 60
                    ? 'bg-amber-500'
                    : 'bg-indigo-500'
                }`}
                style={{ width: `${budgetSpentPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
              <span>Remaining: ৳{remainingBudget.toLocaleString()}</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                Safe Daily: ৳{safeDailySpend}/day
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Forecasted Savings / Surplus */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
              <PiggyBank className="w-4 h-4 text-emerald-500" />
              <span>Month-End Projection</span>
            </div>
            <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
              Run-Rate Model
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span
              className={`text-2xl font-black ${
                isProjectedOverBudget ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {isProjectedOverBudget ? `+৳${(projectedMonthEndExpense - budgetCeiling).toLocaleString()}` : `৳${projectedSavings.toLocaleString()}`}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {isProjectedOverBudget ? 'projected deficit' : 'projected savings'}
            </span>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
            {isProjectedOverBudget
              ? `Spending velocity is high (৳${actualAvgDailySpend}/day). Reduce market expenses to safe limit ৳${safeDailySpend}/day.`
              : `At current pace (৳${actualAvgDailySpend}/day), mess fund is projected to finish cycle with positive surplus.`}
          </p>
        </div>
      </div>

      {/* Footer Milestones Bar */}
      <div className="px-4 sm:px-5 py-3 bg-slate-100/70 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
            <span>Deposit Security:</span>
            <strong className="font-bold text-slate-900 dark:text-white">
              ৳{totalDepositsAmount.toLocaleString()} collected
            </strong>
          </div>

          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
            <Target className="w-4 h-4 text-teal-500" />
            <span>Meal Pacing:</span>
            <strong className="font-bold text-slate-900 dark:text-white">
              {totalMessMeals} / {targetMealCount} meals ({mealPacingPct}%)
            </strong>
          </div>
        </div>

        <button
          onClick={() => setIsGoalModalOpen(true)}
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center gap-1 transition cursor-pointer"
        >
          <span>Open Full Goal Dashboard</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
