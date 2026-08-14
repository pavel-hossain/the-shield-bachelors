import React, { useState, useMemo } from 'react';
import { useMess } from '../../context/MessContext';
import {
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  Activity,
  Calendar,
  DollarSign,
  Utensils,
  Award,
  AlertCircle,
  Download,
  Filter,
  Users,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Zap,
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
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';

export const AnalyticsModule: React.FC = () => {
  const {
    currentPeriod,
    members,
    meals,
    expenses,
    deposits,
    actualMealRate,
    effectiveMealRate,
    totalMessMeals,
    totalEffectiveMeals,
    totalOverallExpense,
    totalMarketExpense,
    totalUtilityExpense,
    totalDepositsAmount,
    managerCashBalance,
    memberSummaries,
  } = useMess();

  const [dateFilter, setDateFilter] = useState<'all' | '7days' | 'first_half' | 'second_half'>('all');

  // Days in current period
  const allDates = useMemo(() => {
    const datesSet = new Set<string>();
    meals.forEach((m) => datesSet.add(m.date));
    expenses.forEach((e) => datesSet.add(e.date));
    deposits.forEach((d) => datesSet.add(d.date));
    return Array.from(datesSet).sort();
  }, [meals, expenses, deposits]);

  // Filtered dates
  const filteredDates = useMemo(() => {
    if (allDates.length === 0) return [];
    if (dateFilter === '7days') {
      return allDates.slice(-7);
    }
    if (dateFilter === 'first_half') {
      return allDates.filter((d) => {
        const dayNum = parseInt(d.split('-')[2] || '1', 10);
        return dayNum <= 15;
      });
    }
    if (dateFilter === 'second_half') {
      return allDates.filter((d) => {
        const dayNum = parseInt(d.split('-')[2] || '1', 10);
        return dayNum > 15;
      });
    }
    return allDates;
  }, [allDates, dateFilter]);

  // 1. Daily Meal Breakdown Data (Breakfast, Lunch, Dinner, Total, Diners Count)
  const dailyMealTrendData = useMemo(() => {
    const datesToUse = filteredDates.length > 0 ? filteredDates : allDates;
    return datesToUse.map((dateStr) => {
      const dayMeals = meals.filter((m) => m.date === dateStr);
      let b = 0;
      let l = 0;
      let d = 0;
      let activeDiners = 0;

      dayMeals.forEach((m) => {
        const rowTotal = (Number(m.breakfast) || 0) + (Number(m.lunch) || 0) + (Number(m.dinner) || 0);
        b += Number(m.breakfast) || 0;
        l += Number(m.lunch) || 0;
        d += Number(m.dinner) || 0;
        if (rowTotal > 0) activeDiners++;
      });

      const dayExpenses = expenses
        .filter((e) => e.date === dateStr)
        .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

      const dayLabel = dateStr.slice(5); // e.g. "08-12"

      return {
        date: dateStr,
        dayLabel,
        breakfast: b,
        lunch: l,
        dinner: d,
        totalMeals: b + l + d,
        activeDiners,
        dayExpenses,
      };
    });
  }, [meals, expenses, filteredDates, allDates]);

  // 2. Cumulative Meal & Expense Trajectory (Calculates cumulative Meal Rate progression)
  const cumulativeTrajectoryData = useMemo(() => {
    let runningMeals = 0;
    let runningMarketExpense = 0;

    return allDates.map((dateStr) => {
      const dayMeals = meals
        .filter((m) => m.date === dateStr)
        .reduce((sum, m) => sum + (Number(m.breakfast) || 0) + (Number(m.lunch) || 0) + (Number(m.dinner) || 0), 0);

      const dayMarketExp = expenses
        .filter((e) => e.date === dateStr && e.category === 'Market')
        .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

      runningMeals += dayMeals;
      runningMarketExpense += dayMarketExp;

      const dynamicRate = runningMeals > 0 ? Number((runningMarketExpense / runningMeals).toFixed(2)) : 0;

      return {
        date: dateStr.slice(5),
        cumulativeMeals: runningMeals,
        cumulativeExpense: runningMarketExpense,
        mealRate: dynamicRate,
      };
    });
  }, [allDates, meals, expenses]);

  // 3. Expense Distribution by Category
  const expenseCategoryData = useMemo(() => {
    const catMap: Record<string, number> = {};
    expenses.forEach((e) => {
      const cat = e.category || 'Market';
      catMap[cat] = (catMap[cat] || 0) + (Number(e.amount) || 0);
    });

    const colors = ['#10b981', '#6366f1', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];
    return Object.keys(catMap).map((cat, idx) => ({
      name: cat,
      value: catMap[cat],
      color: colors[idx % colors.length],
    }));
  }, [expenses]);

  // 4. Member Consumption & Financial Leaderboard
  const memberComparisonData = useMemo(() => {
    return memberSummaries.map((s) => ({
      name: s.member.name.split(' ')[0], // First name
      fullName: s.member.name,
      meals: s.actualMeals,
      effectiveMeals: s.effectiveMeals,
      payable: s.totalPayable,
      deposited: s.totalDeposits,
      netBalance: s.netBalance,
      roomNo: s.member.roomNo,
    }));
  }, [memberSummaries]);

  // 5. High level forecasting
  const totalDaysRecorded = allDates.length || 1;
  const avgMealsPerDay = (totalMessMeals / totalDaysRecorded).toFixed(1);
  const avgDailyExpense = (totalOverallExpense / totalDaysRecorded).toFixed(0);
  const projectedMonthDays = 31;
  const projectedTotalExpense = Math.round(Number(avgDailyExpense) * projectedMonthDays);
  const projectedTotalMeals = Math.round(Number(avgMealsPerDay) * projectedMonthDays);
  const projectedEndMealRate = projectedTotalMeals > 0 ? (projectedTotalExpense / projectedTotalMeals).toFixed(2) : '0.00';

  // Day of Week Peak Analysis
  const dayOfWeekStats = useMemo(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const countMap = [0, 0, 0, 0, 0, 0, 0];
    const totalMealsMap = [0, 0, 0, 0, 0, 0, 0];

    meals.forEach((m) => {
      const d = new Date(m.date);
      const dayIdx = d.getDay();
      const rowTotal = (Number(m.breakfast) || 0) + (Number(m.lunch) || 0) + (Number(m.dinner) || 0);
      countMap[dayIdx]++;
      totalMealsMap[dayIdx] += rowTotal;
    });

    return days.map((dayName, idx) => ({
      day: dayName,
      avgMeals: countMap[idx] > 0 ? Math.round(totalMealsMap[idx] / (countMap[idx] / (members.length || 1))) : 0,
      totalMeals: totalMealsMap[idx],
    }));
  }, [meals, members]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                <BarChart3 className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Mess Analytics & Intelligence Hub
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              In-depth consumption analytics, financial velocity & trajectory modeling for {currentPeriod.label}
            </p>
          </div>

          {/* Time Filter Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl self-start sm:self-center">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            <button
              onClick={() => setDateFilter('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                dateFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All Month
            </button>
            <button
              onClick={() => setDateFilter('7days')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                dateFilter === '7days'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setDateFilter('first_half')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                dateFilter === 'first_half'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              1st - 15th
            </button>
            <button
              onClick={() => setDateFilter('second_half')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                dateFilter === 'second_half'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              16th - End
            </button>
          </div>
        </div>

        {/* Top KPI Metrics Banner */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
          {/* Metric 1 */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Actual Meal Rate
              </span>
              <span className="p-1.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-lg">
                <Utensils className="w-4 h-4" />
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1.5">
              ৳ {actualMealRate.toFixed(2)}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Effective: ৳ {effectiveMealRate.toFixed(2)} (with 45 min)
            </p>
          </div>

          {/* Metric 2 */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Daily Avg Consumption
              </span>
              <span className="p-1.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 rounded-lg">
                <Activity className="w-4 h-4" />
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1.5">
              {avgMealsPerDay} <span className="text-xs font-normal text-slate-500">meals/day</span>
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Recorded across {totalDaysRecorded} active days
            </p>
          </div>

          {/* Metric 3 */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Spending Velocity
              </span>
              <span className="p-1.5 bg-amber-100 dark:bg-amber-950 text-amber-600 rounded-lg">
                <TrendingUp className="w-4 h-4" />
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1.5">
              ৳ {Number(avgDailyExpense).toLocaleString()} <span className="text-xs font-normal text-slate-500">/day</span>
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Projected Month: ৳ {projectedTotalExpense.toLocaleString()}
            </p>
          </div>

          {/* Metric 4 */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Manager Cash Reserve
              </span>
              <span className={`p-1.5 rounded-lg ${managerCashBalance >= 0 ? 'bg-teal-100 dark:bg-teal-950 text-teal-600' : 'bg-rose-100 dark:bg-rose-950 text-rose-600'}`}>
                <DollarSign className="w-4 h-4" />
              </span>
            </div>
            <p className={`text-xl sm:text-2xl font-black mt-1.5 ${managerCashBalance >= 0 ? 'text-teal-600 dark:text-teal-400' : 'text-rose-600 dark:text-rose-400'}`}>
              ৳ {managerCashBalance.toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Deposits: ৳ {totalDepositsAmount.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Row 1: Daily Meal Trend Chart (Stacked Breakfast, Lunch, Dinner) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              <span>Daily Meal Breakdown & Headcount</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Stacked distribution of Breakfast, Lunch, and Dinner across recorded dates
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-amber-500" />
              <span className="text-slate-700 dark:text-slate-300">Breakfast</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-emerald-600" />
              <span className="text-slate-700 dark:text-slate-300">Lunch</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-indigo-600" />
              <span className="text-slate-700 dark:text-slate-300">Dinner</span>
            </div>
          </div>
        </div>

        <div className="h-72 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyMealTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} vertical={false} />
              <XAxis dataKey="dayLabel" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '16px',
                  color: '#fff',
                  fontSize: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                }}
              />
              <Bar dataKey="breakfast" name="Breakfast" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
              <Bar dataKey="lunch" name="Lunch" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
              <Bar dataKey="dinner" name="Dinner" stackId="a" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Two Columns: Cumulative Meal Rate Trajectory + Expense Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Meal Rate Trajectory Line */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <span>Meal Rate Evolution (৳ / Meal)</span>
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Shows how the average meal rate stabilized from day 1 to today
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cumulativeTrajectoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} unit="৳" />
                <Tooltip
                  formatter={(val: any) => [`৳ ${val}`, 'Meal Rate']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '16px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="mealRate" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#rateGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Expense Breakdown Donut */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 mb-1">
              <PieIcon className="w-5 h-5 text-emerald-600" />
              <span>Expense Categories</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Market (Bazar) vs Utilities vs Fixed Costs
            </p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {expenseCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`৳ ${Number(val).toLocaleString()}`, 'Amount']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '16px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Legend */}
          <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            {expenseCategoryData.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700 dark:text-slate-300 font-medium truncate">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">
                  ৳{Number(item.value).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Member Consumption Comparison Bar Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-500" />
              <span>Member Consumption & Financial Comparison</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Comparison of actual meals consumed vs total deposited per member
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-emerald-600" />
              <span className="text-slate-700 dark:text-slate-300">Actual Meals</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-indigo-600" />
              <span className="text-slate-700 dark:text-slate-300">Total Deposit (৳)</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={memberComparisonData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} unit="৳" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '16px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Bar yAxisId="left" dataKey="meals" name="Meals Consumed" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="deposited" name="Total Deposited" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 4: Day-of-Week Consumption Matrix & Month-End Forecasting Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Day of Week Peak Analysis */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-rose-500" />
            <span>Weekly Pattern & Peak Dining Days</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Aggregated meal consumption pattern by day of the week
          </p>

          <div className="space-y-2.5">
            {dayOfWeekStats.map((item) => {
              const maxVal = Math.max(...dayOfWeekStats.map((s) => s.totalMeals), 1);
              const pct = Math.round((item.totalMeals / maxVal) * 100);
              return (
                <div key={item.day} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-700 dark:text-slate-300">{item.day}</span>
                    <span className="text-slate-900 dark:text-white">{item.totalMeals} meals</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Month-End Intelligence & Forecast Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white rounded-3xl p-5 sm:p-6 border border-emerald-900/50 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5 border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Forecasting Engine</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">Cycle: {currentPeriod.label}</span>
            </div>

            <h3 className="text-lg font-black tracking-tight text-white mb-2">
              Month-End Expense & Meal Rate Projection
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Based on the average daily consumption velocity of{' '}
              <strong className="text-emerald-400">{avgMealsPerDay} meals/day</strong> and daily spending rate of{' '}
              <strong className="text-emerald-400">৳ {Number(avgDailyExpense).toLocaleString()}/day</strong>.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <p className="text-[11px] font-bold text-slate-400 uppercase">Projected Total Expense</p>
                <p className="text-lg font-black text-amber-300 mt-1">
                  ৳ {projectedTotalExpense.toLocaleString()}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <p className="text-[11px] font-bold text-slate-400 uppercase">Projected Meal Rate</p>
                <p className="text-lg font-black text-emerald-400 mt-1">
                  ৳ {projectedEndMealRate}
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-xs text-emerald-200 flex items-start gap-2">
            <Zap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              Recommendation: Keep daily market grocery spending under ৳ {Math.round(projectedTotalExpense / 31)} to maintain meal rate below ৳ 55.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
