import React, { useState, useMemo } from 'react';
import { useMess } from '../../context/MessContext';
import {
  X,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  DollarSign,
  Utensils,
  Calendar,
  Zap,
  Target,
  Sparkles,
  ArrowRight,
  Info,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';

export const MonthlyBudgetForecastModal: React.FC = () => {
  const {
    isBudgetForecastModalOpen,
    setIsBudgetForecastModalOpen,
    currentPeriod,
    totalMarketExpense,
    totalUtilityExpense,
    totalOverallExpense,
    totalMessMeals,
    totalEffectiveMeals,
    actualMealRate,
    effectiveMealRate,
    expenses,
    meals,
    members,
    updatePeriodBudget,
    isManagerMode,
  } = useMess();

  const [simulatedDailyBazar, setSimulatedDailyBazar] = useState<number | null>(null);
  const [simulatedMealMultiplier, setSimulatedMealMultiplier] = useState<number>(1.0);
  const [editableBudget, setEditableBudget] = useState<string>(
    String(currentPeriod.targetBudget || 28000)
  );
  const [isEditingBudget, setIsEditingBudget] = useState(false);

  // Month progress calculation
  const { year, month } = currentPeriod;
  const totalDaysInMonth = useMemo(() => new Date(year, month, 0).getDate(), [year, month]);

  // Current day calculation
  const distinctDaysRecorded = useMemo(() => {
    const dates = new Set<string>();
    meals.forEach((m) => dates.add(m.date));
    expenses.forEach((e) => dates.add(e.date));
    return dates.size;
  }, [meals, expenses]);

  const daysElapsed = Math.max(1, Math.min(distinctDaysRecorded, totalDaysInMonth));
  const remainingDays = Math.max(0, totalDaysInMonth - daysElapsed);

  // Daily burn rate
  const dailyMarketBurnRate = daysElapsed > 0 ? Math.round(totalMarketExpense / daysElapsed) : 0;
  const targetBudget = currentPeriod.targetBudget || 28000;

  // Recommended daily bazaar cap to stay strictly within target budget
  const remainingBudgetForMarket = Math.max(0, targetBudget - totalUtilityExpense - totalMarketExpense);
  const recommendedDailyBazarCap = remainingDays > 0 ? Math.round(remainingBudgetForMarket / remainingDays) : 0;

  // Effective simulated daily bazaar spend
  const activeDailyBazar = simulatedDailyBazar !== null ? simulatedDailyBazar : dailyMarketBurnRate;

  // Forecast projections
  const projectedMarketSpend = Math.round(totalMarketExpense + activeDailyBazar * remainingDays);
  const projectedTotalSpend = projectedMarketSpend + totalUtilityExpense;
  const budgetVariance = targetBudget - projectedTotalSpend; // positive = surplus, negative = deficit

  // Meals projection
  const avgMealsPerDay = daysElapsed > 0 ? totalMessMeals / daysElapsed : members.length * 2.5;
  const projectedRemainingMeals = Math.round(avgMealsPerDay * remainingDays * simulatedMealMultiplier);
  const projectedTotalMeals = totalMessMeals + projectedRemainingMeals;

  const projectedMealRate =
    projectedTotalMeals > 0 ? Number((projectedMarketSpend / projectedTotalMeals).toFixed(2)) : 0;

  // Target comparison
  const isOverBudget = projectedTotalSpend > targetBudget;
  const isMealRateHigh = projectedMealRate > 65;

  // Trajectory Chart Data
  const trajectoryChartData = useMemo(() => {
    const data: { day: number; actual?: number; forecast?: number; budgetPacing: number }[] = [];
    const dailyBudgetPacing = targetBudget / totalDaysInMonth;

    let runningActual = 0;
    // Map existing days
    for (let day = 1; day <= totalDaysInMonth; day++) {
      const dayStr = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
      const dayExpenses = expenses
        .filter((e) => e.date === dayStr)
        .reduce((sum, e) => sum + e.amount, 0);

      const pacing = Math.round(dailyBudgetPacing * day);

      if (day <= daysElapsed) {
        runningActual += dayExpenses;
        data.push({
          day,
          actual: runningActual,
          forecast: runningActual,
          budgetPacing: pacing,
        });
      } else {
        // Future forecast line
        const futureRunning = runningActual + activeDailyBazar * (day - daysElapsed);
        data.push({
          day,
          forecast: futureRunning,
          budgetPacing: pacing,
        });
      }
    }
    return data;
  }, [totalDaysInMonth, year, month, expenses, daysElapsed, targetBudget, activeDailyBazar]);

  const handleSaveBudget = () => {
    const val = Number(editableBudget);
    if (!isNaN(val) && val > 0) {
      updatePeriodBudget(currentPeriod.label, val);
      setIsEditingBudget(false);
    }
  };

  if (!isBudgetForecastModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-slate-900 dark:text-white animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-950/20 to-teal-950/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight">Monthly Budget Forecast & Pacing</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                  {currentPeriod.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Predictive run-rate, surplus/deficit forecasting & what-if simulator
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsBudgetForecastModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 scrollbar-thin">
          {/* Top KPI Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Days Elapsed Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">Month Progress</span>
                <Calendar className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Day {daysElapsed} <span className="text-xs font-normal text-slate-400">/ {totalDaysInMonth}</span>
              </p>
              <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                {remainingDays} days remaining
              </p>
            </div>

            {/* Daily Burn Rate Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">Bazaar Burn Rate</span>
                <Zap className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                ৳ {dailyMarketBurnRate.toLocaleString()}
                <span className="text-xs font-normal text-slate-400"> / day</span>
              </p>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                Recommended cap: ৳ {recommendedDailyBazarCap}
              </p>
            </div>

            {/* Forecasted Total Spend Card */}
            <div
              className={`p-3.5 rounded-2xl border ${
                isOverBudget
                  ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/60'
                  : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider ${
                    isOverBudget ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  Forecasted Total
                </span>
                {isOverBudget ? (
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                )}
              </div>
              <p
                className={`text-xl sm:text-2xl font-black ${
                  isOverBudget ? 'text-rose-700 dark:text-rose-300' : 'text-emerald-700 dark:text-emerald-300'
                }`}
              >
                ৳ {projectedTotalSpend.toLocaleString()}
              </p>
              <p
                className={`text-[11px] font-semibold mt-1 ${
                  isOverBudget ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {budgetVariance >= 0
                  ? `৳ ${budgetVariance.toLocaleString()} Surplus (Under Budget)`
                  : `৳ ${Math.abs(budgetVariance).toLocaleString()} Deficit (Over Budget)`}
              </p>
            </div>

            {/* Projected Meal Rate Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">Projected Meal Rate</span>
                <Utensils className="w-4 h-4 text-indigo-500" />
              </div>
              <p
                className={`text-xl sm:text-2xl font-black ${
                  isMealRateHigh ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                ৳ {projectedMealRate}
                <span className="text-xs font-normal text-slate-400"> / meal</span>
              </p>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                Current rate: ৳ {effectiveMealRate || actualMealRate}
              </p>
            </div>
          </div>

          {/* Budget Pacing Target Bar */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Target Monthly Budget
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  ৳ {targetBudget.toLocaleString()}
                </span>
              </div>

              {isManagerMode && (
                <div>
                  {isEditingBudget ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        value={editableBudget}
                        onChange={(e) => setEditableBudget(e.target.value)}
                        className="w-24 px-2 py-1 text-xs font-bold rounded-lg border border-emerald-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
                      />
                      <button
                        onClick={handleSaveBudget}
                        className="px-2.5 py-1 text-xs font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition cursor-pointer"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditingBudget(false)}
                        className="px-2 py-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsEditingBudget(true)}
                      className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                    >
                      Edit Budget Goal
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Pacing progress bar */}
            <div className="space-y-1">
              <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${Math.min(100, (totalOverallExpense / targetBudget) * 100)}%` }}
                  className={`h-full ${
                    totalOverallExpense > targetBudget
                      ? 'bg-rose-500'
                      : totalOverallExpense / targetBudget > (daysElapsed / totalDaysInMonth) * 1.15
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  title={`Spent so far: ৳ ${totalOverallExpense.toLocaleString()}`}
                />
              </div>
              <div className="flex justify-between text-[10px] font-medium text-slate-400">
                <span>Spent: ৳ {totalOverallExpense.toLocaleString()} ({Math.round((totalOverallExpense / targetBudget) * 100)}%)</span>
                <span>Expected for Day {daysElapsed}: ~{Math.round((daysElapsed / totalDaysInMonth) * 100)}%</span>
                <span>Target: ৳ {targetBudget.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Interactive Trajectory Chart */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <span>Cumulative Spending Trajectory vs Linear Budget</span>
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Solid green = recorded days | Dashed = projected future trajectory based on current burn rate
                </p>
              </div>
            </div>

            <div className="h-56 sm:h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trajectoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis
                    dataKey="day"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickFormatter={(v) => `D${v}`}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#1e293b',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                    formatter={(value: any, name: string) => [
                      `৳ ${Number(value).toLocaleString()}`,
                      name === 'actual' ? 'Actual Spent' : name === 'forecast' ? 'Projected Trajectory' : 'Target Linear Pacing',
                    ]}
                    labelFormatter={(label) => `Day ${label} of ${totalDaysInMonth}`}
                  />
                  <ReferenceLine y={targetBudget} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Budget Limit', fill: '#ef4444', fontSize: 10, position: 'top' }} />
                  <Area
                    type="monotone"
                    dataKey="budgetPacing"
                    stroke="#64748b"
                    strokeDasharray="4 4"
                    fill="none"
                    strokeWidth={1.5}
                  />
                  <Area
                    type="monotone"
                    dataKey="forecast"
                    stroke="#3b82f6"
                    strokeDasharray="5 5"
                    fill="url(#forecastGrad)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    stroke="#10b981"
                    fill="url(#actualGrad)"
                    strokeWidth={2.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Interactive What-If Scenario Planner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-950/20 via-slate-900/40 to-slate-900/80 border border-indigo-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  Interactive What-If Scenario Simulator
                </h4>
              </div>
              <button
                onClick={() => {
                  setSimulatedDailyBazar(null);
                  setSimulatedMealMultiplier(1.0);
                }}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-bold underline cursor-pointer"
              >
                Reset to Current Run-Rate
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Slider 1: Adjusted Daily Bazaar Spend */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Simulate Daily Bazaar Spend:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    ৳ {activeDailyBazar.toLocaleString()} / day
                  </span>
                </div>
                <input
                  type="range"
                  min={300}
                  max={2000}
                  step={25}
                  value={activeDailyBazar}
                  onChange={(e) => setSimulatedDailyBazar(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>৳300 (Frugal)</span>
                  <span>৳{dailyMarketBurnRate} (Current)</span>
                  <span>৳2,000 (Feast)</span>
                </div>
              </div>

              {/* Slider 2: Meal Volume Multiplier */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Simulate Meal Volume:</span>
                  <span className="font-mono text-indigo-400 font-bold">
                    {Math.round(simulatedMealMultiplier * 100)}% ({projectedRemainingMeals} remaining meals)
                  </span>
                </div>
                <input
                  type="range"
                  min={0.7}
                  max={1.3}
                  step={0.05}
                  value={simulatedMealMultiplier}
                  onChange={(e) => setSimulatedMealMultiplier(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>-30% (Vacation)</span>
                  <span>100% (Normal)</span>
                  <span>+30% (Guest Surge)</span>
                </div>
              </div>
            </div>

            {/* Simulation Outcome Strip */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-slate-400">Simulated Month-End Spend:</span>
                <p className="font-mono font-black text-white text-sm">৳ {projectedTotalSpend.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-slate-400">Simulated Meal Rate:</span>
                <p className="font-mono font-black text-emerald-400 text-sm">৳ {projectedMealRate} / meal</p>
              </div>
              <div>
                <span className="text-slate-400">Estimated Surplus / Deficit:</span>
                <p
                  className={`font-mono font-black text-sm ${
                    budgetVariance >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {budgetVariance >= 0 ? `+৳ ${budgetVariance.toLocaleString()}` : `-৳ ${Math.abs(budgetVariance).toLocaleString()}`}
                </p>
              </div>
            </div>
          </div>

          {/* Actionable Manager Recommendations */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Smart Executive Recommendation</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {budgetVariance >= 0 ? (
                <>
                  ✅ The mess is currently operating smoothly within the target budget. Maintaining a daily market
                  average below <strong>৳ {recommendedDailyBazarCap}</strong> over the remaining {remainingDays} days will
                  leave a comfortable fund buffer of <strong>৳ {budgetVariance.toLocaleString()}</strong>.
                </>
              ) : (
                <>
                  ⚠️ At the current run-rate of <strong>৳ {dailyMarketBurnRate}/day</strong>, the mess will exceed its
                  budget by <strong>৳ {Math.abs(budgetVariance).toLocaleString()}</strong>. To prevent deficit, consider
                  adjusting daily bazaar purchases to <strong>৳ {recommendedDailyBazarCap}/day</strong> or collecting an
                  additional deposit call.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Updated live with recorded bazaar entries and meal logs.
          </div>
          <button
            onClick={() => setIsBudgetForecastModalOpen(false)}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
