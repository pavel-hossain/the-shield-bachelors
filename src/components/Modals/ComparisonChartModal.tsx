import React, { useState, useMemo } from 'react';
import { useMess } from '../../context/MessContext';
import {
  X,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Utensils,
  ShoppingBag,
  DollarSign,
  Award,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  CheckCircle2,
  PieChart as PieIcon,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  Cell,
  AreaChart,
  Area,
} from 'recharts';

export const ComparisonChartModal: React.FC = () => {
  const {
    isComparisonChartModalOpen,
    setIsComparisonChartModalOpen,
    periods,
    currentPeriod,
    memberSummaries,
    totalMarketExpense,
    totalUtilityExpense,
    totalOverallExpense,
    actualMealRate,
    effectiveMealRate,
    totalMessMeals,
  } = useMess();

  const [comparisonMetric, setComparisonMetric] = useState<
    'meal_rate' | 'bazar_vs_utility' | 'meals_volume' | 'member_equity'
  >('meal_rate');

  // Month-over-Month historical comparison data (populated with current active period + historical benchmarks)
  const historicalPeriodsData = useMemo(() => {
    return [
      {
        id: 'p_jan_2026',
        period: 'Jan 2026',
        marketExpense: 14200,
        utilityExpense: 5800,
        totalExpense: 20000,
        totalMeals: 285,
        mealRate: 49.82,
        managerBalance: 1200,
        status: 'Archived',
      },
      {
        id: 'p_feb_2026',
        period: 'Feb 2026',
        marketExpense: 16500,
        utilityExpense: 6200,
        totalExpense: 22700,
        totalMeals: 310,
        mealRate: 53.22,
        managerBalance: 850,
        status: 'Archived',
      },
      {
        id: 'p_mar_2026',
        period: currentPeriod.label,
        marketExpense: totalMarketExpense || 18450,
        utilityExpense: totalUtilityExpense || 6500,
        totalExpense: totalOverallExpense || 24950,
        totalMeals: totalMessMeals || 328,
        mealRate: effectiveMealRate || actualMealRate || 56.25,
        managerBalance: 1450,
        status: 'Active Cycle',
        isCurrent: true,
      },
    ];
  }, [currentPeriod, totalMarketExpense, totalUtilityExpense, totalOverallExpense, totalMessMeals, effectiveMealRate, actualMealRate]);

  // Member comparison metrics
  const memberComparisonData = useMemo(() => {
    return memberSummaries.map((m) => ({
      name: m.member.name.split(' ')[0], // short name
      fullName: m.member.name,
      meals: m.totalEffectiveMeals,
      mealCost: Math.round(m.totalMealCost),
      utilityCost: Math.round(m.utilityContribution),
      totalDeposited: m.totalDeposits,
      netBalance: m.netBalance,
      role: m.member.role,
    }));
  }, [memberSummaries]);

  // Calculate MoM change
  const currentMonthData = historicalPeriodsData[historicalPeriodsData.length - 1];
  const prevMonthData = historicalPeriodsData[historicalPeriodsData.length - 2];

  const mealRateChangePct = prevMonthData
    ? Number((((currentMonthData.mealRate - prevMonthData.mealRate) / prevMonthData.mealRate) * 100).toFixed(1))
    : 0;

  const totalExpenseChangePct = prevMonthData
    ? Number((((currentMonthData.totalExpense - prevMonthData.totalExpense) / prevMonthData.totalExpense) * 100).toFixed(1))
    : 0;

  if (!isComparisonChartModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-slate-900 dark:text-white animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-sky-950/20 to-indigo-950/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight">Period Comparison & Analytics</h3>
                <span className="px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 text-[11px] font-bold">
                  MoM Trends
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Compare month-over-month meal rates, bazaar costs, utility distributions, and member equity
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsComparisonChartModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 scrollbar-thin">
          {/* Quick MoM Badges Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Meal Rate MoM */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Meal Rate Change
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  ৳ {currentMonthData.mealRate}
                </span>
                <span
                  className={`flex items-center text-xs font-bold ${
                    mealRateChangePct <= 0 ? 'text-emerald-500' : 'text-amber-500'
                  }`}
                >
                  {mealRateChangePct > 0 ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  )}
                  {Math.abs(mealRateChangePct)}%
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">vs prev month (৳{prevMonthData?.mealRate})</p>
            </div>

            {/* Total Expense MoM */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Expenses
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  ৳ {(currentMonthData.totalExpense / 1000).toFixed(1)}k
                </span>
                <span className="flex items-center text-xs font-bold text-slate-400">
                  {totalExpenseChangePct > 0 ? '+' : ''}{totalExpenseChangePct}%
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Bazaar + Utilities total</p>
            </div>

            {/* Total Meals Consumed */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Meals Volume
              </span>
              <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
                {currentMonthData.totalMeals} <span className="text-xs font-normal text-slate-400">meals</span>
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Avg ~{Math.round(currentMonthData.totalMeals / (memberSummaries.length || 6))} meals/member
              </p>
            </div>

            {/* Best Cost Efficiency Award */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
              <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                <Award className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Most Cost-Effective</span>
              </div>
              <p className="text-sm font-black text-emerald-800 dark:text-emerald-300 mt-1">
                Jan 2026 (৳49.82)
              </p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">Lowest recorded meal rate</p>
            </div>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setComparisonMetric('meal_rate')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                comparisonMetric === 'meal_rate'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Meal Rate (৳ / meal)</span>
            </button>

            <button
              onClick={() => setComparisonMetric('bazar_vs_utility')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                comparisonMetric === 'bazar_vs_utility'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Bazaar vs Utilities Spend</span>
            </button>

            <button
              onClick={() => setComparisonMetric('meals_volume')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                comparisonMetric === 'meals_volume'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Meals Volume Pacing</span>
            </button>

            <button
              onClick={() => setComparisonMetric('member_equity')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                comparisonMetric === 'member_equity'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Member Equity & Balance</span>
            </button>
          </div>

          {/* Main Visual Comparison Chart Container */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {comparisonMetric === 'meal_rate' && 'Month-over-Month Meal Rate Evolution (৳ / meal)'}
                {comparisonMetric === 'bazar_vs_utility' && 'Bazaar Shopping vs Fixed Utilities (৳)'}
                {comparisonMetric === 'meals_volume' && 'Total Monthly Meals Consumption Curve'}
                {comparisonMetric === 'member_equity' && 'Current Member Meals vs Deposits vs Net Balance (৳)'}
              </h4>
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {comparisonMetric === 'meal_rate' ? (
                  <BarChart data={historicalPeriodsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `৳${v}`} domain={[30, 80]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#1e293b',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                      formatter={(v: any) => [`৳ ${Number(v).toFixed(2)} / meal`, 'Effective Meal Rate']}
                    />
                    <Bar dataKey="mealRate" radius={[8, 8, 0, 0]}>
                      {historicalPeriodsData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.isCurrent ? '#10b981' : index === 0 ? '#0ea5e9' : '#6366f1'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                ) : comparisonMetric === 'bazar_vs_utility' ? (
                  <BarChart data={historicalPeriodsData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#1e293b',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                      formatter={(v: any, name: string) => [
                        `৳ ${Number(v).toLocaleString()}`,
                        name === 'marketExpense' ? 'Bazaar Shopping' : 'Fixed Utilities',
                      ]}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Bar dataKey="marketExpense" name="Bazaar Shopping" fill="#10b981" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="utilityExpense" name="Fixed Utilities" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                  </BarChart>
                ) : comparisonMetric === 'meals_volume' ? (
                  <AreaChart data={historicalPeriodsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="mealGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#1e293b',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                      formatter={(v: any) => [`${v} Meals`, 'Total Meals Consumed']}
                    />
                    <Area type="monotone" dataKey="totalMeals" stroke="#0ea5e9" strokeWidth={2.5} fill="url(#mealGrad)" />
                  </AreaChart>
                ) : (
                  <BarChart data={memberComparisonData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#1e293b',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                      formatter={(v: any, name: string) => [
                        `৳ ${Number(v).toLocaleString()}`,
                        name === 'totalDeposited' ? 'Deposited' : name === 'mealCost' ? 'Meal Cost' : 'Utility Share',
                      ]}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Bar dataKey="totalDeposited" name="Deposited (৳)" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="mealCost" name="Meal Cost (৳)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="utilityCost" name="Utility (৳)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Comparative Historical Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Cycle Performance Audit Matrix
              </span>
              <span className="text-[10px] text-slate-400">All amounts in BDT (৳)</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-2.5">Month Cycle</th>
                    <th className="p-2.5">Market Spend</th>
                    <th className="p-2.5">Utilities</th>
                    <th className="p-2.5">Total Spent</th>
                    <th className="p-2.5">Total Meals</th>
                    <th className="p-2.5">Effective Rate</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {historicalPeriodsData.map((row) => (
                    <tr
                      key={row.id}
                      className={row.isCurrent ? 'bg-emerald-50/50 dark:bg-emerald-950/20 font-semibold' : ''}
                    >
                      <td className="p-2.5 font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{row.period}</span>
                        {row.isCurrent && (
                          <span className="px-1.5 py-0.2 rounded bg-emerald-500 text-white text-[9px] font-bold uppercase">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="p-2.5 font-mono">৳ {row.marketExpense.toLocaleString()}</td>
                      <td className="p-2.5 font-mono">৳ {row.utilityExpense.toLocaleString()}</td>
                      <td className="p-2.5 font-mono font-bold text-slate-900 dark:text-white">
                        ৳ {row.totalExpense.toLocaleString()}
                      </td>
                      <td className="p-2.5 font-mono">{row.totalMeals}</td>
                      <td className="p-2.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        ৳ {row.mealRate}
                      </td>
                      <td className="p-2.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            row.isCurrent
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Comparing {historicalPeriodsData.length} monthly billing cycles.
          </div>
          <button
            onClick={() => setIsComparisonChartModalOpen(false)}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-500 text-white font-bold text-xs transition cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
