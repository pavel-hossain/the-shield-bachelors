import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Member,
  DailyMealRecord,
  Expense,
  Deposit,
  MonthPeriod,
  MemberFinancialSummary,
  GlobalSearchResult,
} from '../types';
import {
  INITIAL_PERIODS,
  INITIAL_MEMBERS,
  INITIAL_MEALS,
  INITIAL_EXPENSES,
  INITIAL_DEPOSITS,
} from '../data/mockData';

interface MessContextType {
  // User Mode / Role Access
  userMode: 'Manager' | 'Member';
  setUserMode: (mode: 'Manager' | 'Member') => void;
  isManagerMode: boolean;

  // Admin Authentication
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;
  adminPin: string;
  loginAsAdmin: (inputPin: string) => { success: boolean; error?: string };
  logoutAdmin: () => void;
  updateAdminPin: (newPin: string) => void;

  // State
  periods: MonthPeriod[];
  currentPeriod: MonthPeriod;
  setCurrentPeriod: (period: MonthPeriod) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  members: Member[];
  meals: DailyMealRecord[];
  expenses: Expense[];
  deposits: Deposit[];

  // Global UI Modals
  selectedMemberForStatement: Member | null;
  setSelectedMemberForStatement: (m: Member | null) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
  isExcelModalOpen: boolean;
  setIsExcelModalOpen: (open: boolean) => void;
  isBackupModalOpen: boolean;
  setIsBackupModalOpen: (open: boolean) => void;
  isExportSummaryModalOpen: boolean;
  setIsExportSummaryModalOpen: (open: boolean) => void;

  // Calculated Totals
  totalMarketExpense: number;
  totalUtilityExpense: number;
  totalOverallExpense: number;
  totalMessMeals: number;
  totalEffectiveMeals: number;
  actualMealRate: number;
  effectiveMealRate: number;
  totalDepositsAmount: number;
  managerCashBalance: number;
  activeMembersCount: number;
  utilityPerMember: number;

  // Member Summaries
  memberSummaries: MemberFinancialSummary[];
  highestSpender: MemberFinancialSummary | null;
  lowestSpender: MemberFinancialSummary | null;
  overdueMembers: { member: Member; dueAmount: number; phone: string }[];
  lowBalanceMembers: {
    member: Member;
    totalDeposits: number;
    projectedMealCost: number;
    depositShortfall: number;
    projectedMeals: number;
  }[];

  // Handlers
  addMember: (m: Omit<Member, 'id'>) => void;
  updateMember: (m: Member) => void;
  toggleMemberStatus: (id: string) => void;

  upsertMealRecord: (date: string, memberId: string, b: number, l: number, d: number) => void;
  setAllMealsForDate: (date: string, b: number, l: number, d: number) => void;
  copyPreviousDayMeals: (targetDate: string) => {
    success: boolean;
    count?: number;
    sourceDate?: string;
    isFallback?: boolean;
    error?: string;
  };
  clearMealsForDate: (date: string) => void;

  addExpense: (exp: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;

  addDeposit: (dep: Omit<Deposit, 'id'>) => void;
  deleteDeposit: (id: string) => void;

  closeMonthAndStartNewCycle: () => void;

  importExcelData: (data: {
    members?: Omit<Member, 'id'>[];
    expenses?: Omit<Expense, 'id'>[];
    deposits?: Omit<Deposit, 'id'>[];
    meals?: { date: string; memberName: string; b: number; l: number; d: number }[];
  }) => { success: boolean; message: string };

  globalSearchResults: (query: string) => GlobalSearchResult[];
  exportBackupData: () => void;
  restoreBackupData: (backupObj: any) => { success: boolean; message: string };
}

const MessContext = createContext<MessContextType | undefined>(undefined);

export const MessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userMode, setUserMode] = useState<'Manager' | 'Member'>(() => {
    return localStorage.getItem('shield_mess_admin_auth') === 'true' ? 'Manager' : 'Member';
  });
  const isManagerMode = userMode === 'Manager';

  const [adminPin, setAdminPin] = useState<string>(() => {
    return localStorage.getItem('shield_mess_admin_pin') || '2026';
  });

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const loginAsAdmin = (inputPin: string) => {
    if (inputPin.trim() === adminPin) {
      setUserMode('Manager');
      localStorage.setItem('shield_mess_admin_auth', 'true');
      setIsAdminModalOpen(false);
      return { success: true };
    }
    return { success: false, error: 'Incorrect Passcode / PIN. Default PIN is 2026.' };
  };

  const logoutAdmin = () => {
    setUserMode('Member');
    localStorage.removeItem('shield_mess_admin_auth');
  };

  const updateAdminPin = (newPin: string) => {
    setAdminPin(newPin);
    localStorage.setItem('shield_mess_admin_pin', newPin);
  };

  const [periods, setPeriods] = useState<MonthPeriod[]>(INITIAL_PERIODS);
  const [currentPeriod, setCurrentPeriod] = useState<MonthPeriod>(INITIAL_PERIODS[0]);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [meals, setMeals] = useState<DailyMealRecord[]>(INITIAL_MEALS);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [deposits, setDeposits] = useState<Deposit[]>(INITIAL_DEPOSITS);

  // Modals
  const [selectedMemberForStatement, setSelectedMemberForStatement] = useState<Member | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isExportSummaryModalOpen, setIsExportSummaryModalOpen] = useState(false);

  // Apply dark class to HTML body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Calculations
  const activeMembers = members.filter((m) => m.status === 'Active');
  const activeMembersCount = activeMembers.length || 1;

  // Filter expenses for current month
  const currentMonthPrefix = `${currentPeriod.year}-${currentPeriod.month < 10 ? '0' + currentPeriod.month : currentPeriod.month}`;

  const monthExpenses = expenses.filter((e) => e.date.startsWith(currentMonthPrefix));
  const monthDeposits = deposits.filter((d) => d.date.startsWith(currentMonthPrefix));
  const monthMeals = meals.filter((m) => m.date.startsWith(currentMonthPrefix));

  // Market expenses vs Utility expenses
  const totalMarketExpense = monthExpenses
    .filter((e) => e.category === 'Market Shopping' || e.category === 'Miscellaneous' || e.category === ('Miscellaneous Market' as any))
    .reduce((sum, e) => sum + e.amount, 0);

  const totalUtilityExpense = monthExpenses
    .filter((e) => e.category !== 'Market Shopping' && e.category !== 'Miscellaneous' && e.category !== ('Miscellaneous Market' as any))
    .reduce((sum, e) => sum + e.amount, 0);

  const totalOverallExpense = totalMarketExpense + totalUtilityExpense;

  // Actual total mess meals
  const totalMessMeals = monthMeals.reduce(
    (sum, m) => sum + (Number(m.breakfast) || 0) + (Number(m.lunch) || 0) + (Number(m.dinner) || 0),
    0
  );

  // Effective meals engine (Benchmark rule: active members with < 45 meals pay for 45 benchmark meals)
  const benchmarkLimit = currentPeriod.benchmarkMeals || 45;

  let totalEffectiveMeals = 0;
  members.forEach((m) => {
    const memberMealsList = monthMeals.filter((rec) => rec.memberId === m.id);
    const actual = memberMealsList.reduce(
      (sum, rec) => sum + (Number(rec.breakfast) || 0) + (Number(rec.lunch) || 0) + (Number(rec.dinner) || 0),
      0
    );
    const appliesBenchmark = m.applyBenchmark !== false;
    if (m.status === 'Active' && appliesBenchmark) {
      const eff = actual < benchmarkLimit && actual > 0 ? benchmarkLimit : actual;
      totalEffectiveMeals += eff;
    } else {
      totalEffectiveMeals += actual;
    }
  });

  if (totalEffectiveMeals === 0) totalEffectiveMeals = totalMessMeals || 1;

  // Rates
  const actualMealRate = totalMessMeals > 0 ? Number((totalMarketExpense / totalMessMeals).toFixed(2)) : 0;
  const effectiveMealRate = totalEffectiveMeals > 0 ? Number((totalMarketExpense / totalEffectiveMeals).toFixed(2)) : 0;

  // Utility cost per active member = total utility / active members count
  const utilityPerMember = Math.round(totalUtilityExpense / activeMembersCount);

  // Total deposits amount
  const totalDepositsAmount = monthDeposits.reduce((sum, d) => sum + d.amount, 0);

  // Manager Cash Balance = Total Deposits - Total Pure Market Expenses
  const managerCashBalance = totalDepositsAmount - totalMarketExpense;

  // Member summaries
  const totalDaysInMonth = new Date(currentPeriod.year, currentPeriod.month, 0).getDate() || 30;
  const distinctMealDates = new Set(monthMeals.map((m) => m.date)).size;
  const loggedDays = Math.max(1, distinctMealDates);

  const memberSummaries: MemberFinancialSummary[] = members.map((member) => {
    const memberMealsList = monthMeals.filter((m) => m.memberId === member.id);
    const actualMeals = memberMealsList.reduce(
      (sum, m) => sum + (Number(m.breakfast) || 0) + (Number(m.lunch) || 0) + (Number(m.dinner) || 0),
      0
    );

    const appliesBenchmark = member.applyBenchmark !== false;
    const effectiveMeals =
      member.status === 'Active' && appliesBenchmark && actualMeals < benchmarkLimit && actualMeals > 0
        ? benchmarkLimit
        : actualMeals;

    const mealCost = Math.round(effectiveMeals * effectiveMealRate);
    const utilityCostShare =
      member.fixedUtilityShare !== undefined
        ? member.fixedUtilityShare
        : member.status === 'Active'
        ? utilityPerMember
        : 0;

    const carriedBalance = member.openingBalance || 0;
    // Pure Meal Bill Calculation: Utilities are completely excluded from totalPayable
    const totalPayable = mealCost - carriedBalance;

    const memberDepositsList = monthDeposits.filter((d) => d.memberId === member.id);
    const totalDeposits = memberDepositsList.reduce((sum, d) => sum + d.amount, 0);

    const netBalance = totalDeposits - totalPayable;
    let statusLabel: 'Credit' | 'Due' | 'Settled' = 'Settled';
    if (netBalance > 50) statusLabel = 'Credit';
    else if (netBalance < -50) statusLabel = 'Due';

    // Projected Meal Cost for current cycle
    let projectedMeals = 0;
    if (member.status === 'Active') {
      if (actualMeals > 0) {
        const dailyAvg = actualMeals / loggedDays;
        projectedMeals = Math.round(dailyAvg * totalDaysInMonth);
        if (appliesBenchmark && projectedMeals < benchmarkLimit) {
          projectedMeals = benchmarkLimit;
        }
      } else {
        projectedMeals = appliesBenchmark ? benchmarkLimit : 0;
      }
    } else {
      projectedMeals = actualMeals;
    }

    const currentRate = effectiveMealRate > 0 ? effectiveMealRate : (actualMealRate > 0 ? actualMealRate : 45);
    const projectedMealCost = Math.max(mealCost, Math.round(projectedMeals * currentRate));
    const isLowBalance = member.status === 'Active' && totalDeposits < projectedMealCost;
    const depositShortfall = isLowBalance ? projectedMealCost - totalDeposits : 0;

    return {
      member,
      actualMeals,
      effectiveMeals,
      totalMeals: actualMeals,
      mealCost,
      utilityCostShare,
      carriedBalance,
      totalPayable,
      totalDeposits,
      netBalance,
      statusLabel,
      projectedMeals,
      projectedMealCost,
      isLowBalance,
      depositShortfall,
    };
  });

  // Highest and Lowest spenders (active members with > 0 meals)
  const activeSummaries = memberSummaries.filter((s) => s.member.status === 'Active');
  const sortedByTotalPayable = [...activeSummaries].sort((a, b) => b.totalPayable - a.totalPayable);

  const highestSpender = sortedByTotalPayable.length > 0 ? sortedByTotalPayable[0] : null;
  const lowestSpender = sortedByTotalPayable.length > 1 ? sortedByTotalPayable[sortedByTotalPayable.length - 1] : null;

  // Overdue members (due amount > 200)
  const overdueMembers = memberSummaries
    .filter((s) => s.netBalance < -200)
    .map((s) => ({
      member: s.member,
      dueAmount: Math.abs(s.netBalance),
      phone: s.member.phone,
    }));

  // Low Balance Members (deposits < projected meal cost)
  const lowBalanceMembers = memberSummaries
    .filter((s) => s.isLowBalance)
    .map((s) => ({
      member: s.member,
      totalDeposits: s.totalDeposits,
      projectedMealCost: s.projectedMealCost || 0,
      depositShortfall: s.depositShortfall || 0,
      projectedMeals: s.projectedMeals || 0,
    }));

  // Handlers
  const addMember = (newM: Omit<Member, 'id'>) => {
    const created: Member = {
      ...newM,
      id: `m-${Date.now()}`,
    };
    setMembers((prev) => [...prev, created]);
  };

  const updateMember = (updated: Member) => {
    setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  };

  const toggleMemberStatus = (id: string) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, status: m.status === 'Active' ? 'Inactive' : 'Active' } : m
      )
    );
  };

  const upsertMealRecord = (
    date: string,
    memberId: string,
    breakfast: number,
    lunch: number,
    dinner: number
  ) => {
    setMeals((prev) => {
      const idx = prev.findIndex((m) => m.date === date && m.memberId === memberId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], breakfast, lunch, dinner };
        return copy;
      } else {
        return [
          ...prev,
          {
            id: `meal-${date}-${memberId}`,
            date,
            memberId,
            breakfast,
            lunch,
            dinner,
          },
        ];
      }
    });
  };

  const setAllMealsForDate = (
    date: string,
    breakfast: number,
    lunch: number,
    dinner: number
  ) => {
    activeMembers.forEach((m) => {
      upsertMealRecord(date, m.id, breakfast, lunch, dinner);
    });
  };

  const copyPreviousDayMeals = (targetDate: string) => {
    const parts = targetDate.split('-').map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) {
      return { success: false, error: 'Invalid target date format.' };
    }
    const [y, m, d] = parts;
    const target = new Date(y, m - 1, d);
    target.setDate(target.getDate() - 1);
    const prevY = target.getFullYear();
    const prevM = String(target.getMonth() + 1).padStart(2, '0');
    const prevD = String(target.getDate()).padStart(2, '0');
    const prevDateStr = `${prevY}-${prevM}-${prevD}`;

    const prevMeals = meals.filter((m) => m.date === prevDateStr);

    if (prevMeals.length > 0) {
      prevMeals.forEach((pm) => {
        upsertMealRecord(targetDate, pm.memberId, pm.breakfast, pm.lunch, pm.dinner);
      });
      return { success: true, count: prevMeals.length, sourceDate: prevDateStr, isFallback: false };
    }

    // Find the most recent date prior to targetDate with recorded meals
    const priorDates = Array.from(new Set(meals.filter((m) => m.date < targetDate).map((m) => m.date)))
      .sort()
      .reverse();

    if (priorDates.length > 0) {
      const fallbackDate = priorDates[0];
      const fallbackMeals = meals.filter((m) => m.date === fallbackDate);
      fallbackMeals.forEach((pm) => {
        upsertMealRecord(targetDate, pm.memberId, pm.breakfast, pm.lunch, pm.dinner);
      });
      return { success: true, count: fallbackMeals.length, sourceDate: fallbackDate, isFallback: true };
    }

    return { success: false, error: `No previous meal records found before ${targetDate}.` };
  };

  const clearMealsForDate = (date: string) => {
    setMeals((prev) => prev.filter((m) => m.date !== date));
  };

  const addExpense = (exp: Omit<Expense, 'id'>) => {
    const created: Expense = {
      ...exp,
      id: `exp-${Date.now()}`,
    };
    setExpenses((prev) => [created, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const addDeposit = (dep: Omit<Deposit, 'id'>) => {
    const created: Deposit = {
      ...dep,
      id: `dep-${Date.now()}`,
    };
    setDeposits((prev) => [created, ...prev]);
  };

  const deleteDeposit = (id: string) => {
    setDeposits((prev) => prev.filter((d) => d.id !== id));
  };

  const closeMonthAndStartNewCycle = () => {
    // 1. Mark current period as closed
    const updatedPeriods = periods.map((p) =>
      p.year === currentPeriod.year && p.month === currentPeriod.month
        ? { ...p, isClosed: true }
        : p
    );

    // 2. Carry forward member balances to openingBalance
    setMembers((prevMembers) =>
      prevMembers.map((m) => {
        const summary = memberSummaries.find((s) => s.member.id === m.id);
        const net = summary ? summary.netBalance : 0;
        return {
          ...m,
          openingBalance: net,
        };
      })
    );

    // 3. Create next month period
    let nextMonth = currentPeriod.month + 1;
    let nextYear = currentPeriod.year;
    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear += 1;
    }

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const newPeriodLabel = `${monthNames[nextMonth - 1]} ${nextYear}`;

    const newPeriod: MonthPeriod = {
      year: nextYear,
      month: nextMonth,
      label: newPeriodLabel,
      targetBudget: currentPeriod.targetBudget,
      benchmarkMeals: currentPeriod.benchmarkMeals || 45,
      isClosed: false,
    };

    setPeriods([newPeriod, ...updatedPeriods]);
    setCurrentPeriod(newPeriod);
  };

  const importExcelData = (data: {
    members?: Omit<Member, 'id'>[];
    expenses?: Omit<Expense, 'id'>[];
    deposits?: Omit<Deposit, 'id'>[];
    meals?: { date: string; memberName: string; b: number; l: number; d: number }[];
  }) => {
    let importedCount = 0;

    if (data.members && data.members.length > 0) {
      data.members.forEach((m) => addMember(m));
      importedCount += data.members.length;
    }

    if (data.expenses && data.expenses.length > 0) {
      data.expenses.forEach((e) => addExpense(e));
      importedCount += data.expenses.length;
    }

    if (data.deposits && data.deposits.length > 0) {
      data.deposits.forEach((d) => addDeposit(d));
      importedCount += data.deposits.length;
    }

    if (data.meals && data.meals.length > 0) {
      data.meals.forEach((m) => {
        const foundMember = members.find(
          (mem) => mem.name.toLowerCase().includes(m.memberName.toLowerCase())
        );
        if (foundMember) {
          upsertMealRecord(m.date, foundMember.id, m.b, m.l, m.d);
          importedCount++;
        }
      });
    }

    return {
      success: true,
      message: `Successfully processed and imported ${importedCount} records into Mess System!`,
    };
  };

  // Global search implementation
  const globalSearchResults = (query: string): GlobalSearchResult[] => {
    if (!query || query.trim().length < 2) return [];
    const q = query.toLowerCase().trim();
    const results: GlobalSearchResult[] = [];

    // Search Members
    members.forEach((mem) => {
      if (
        mem.name.toLowerCase().includes(q) ||
        mem.phone.includes(q) ||
        (mem.roomNo && mem.roomNo.toLowerCase().includes(q)) ||
        mem.role.toLowerCase().includes(q)
      ) {
        results.push({
          id: mem.id,
          type: 'Member',
          date: mem.joiningDate || currentMonthPrefix,
          title: mem.name,
          memberName: `Room ${mem.roomNo || 'N/A'} • ${mem.role}`,
          amountOrCount: mem.status,
          details: `Phone: ${mem.phone}`,
        });
      }
    });

    // Search Deposits
    deposits.forEach((dep) => {
      const member = members.find((m) => m.id === dep.memberId);
      const memberName = member ? member.name : 'Unknown';
      if (
        memberName.toLowerCase().includes(q) ||
        dep.date.includes(q) ||
        dep.amount.toString().includes(q) ||
        dep.method.toLowerCase().includes(q) ||
        (dep.transactionId && dep.transactionId.toLowerCase().includes(q))
      ) {
        results.push({
          id: dep.id,
          type: 'Deposit',
          date: dep.date,
          title: `Deposit via ${dep.method}`,
          memberName,
          amountOrCount: `৳ ${dep.amount.toLocaleString()}`,
          details: `TRX: ${dep.transactionId || 'N/A'} - ${dep.notes || ''}`,
        });
      }
    });

    // Search Expenses
    expenses.forEach((exp) => {
      const shopper = members.find((m) => m.id === exp.paidByMemberId);
      const shopperName = shopper ? shopper.name : 'Mess Fund';
      if (
        exp.title.toLowerCase().includes(q) ||
        exp.date.includes(q) ||
        exp.amount.toString().includes(q) ||
        exp.category.toLowerCase().includes(q) ||
        shopperName.toLowerCase().includes(q)
      ) {
        results.push({
          id: exp.id,
          type: exp.category === 'Market Shopping' ? 'Market Expense' : 'Utility Expense',
          date: exp.date,
          title: exp.title,
          memberName: shopperName,
          amountOrCount: `৳ ${exp.amount.toLocaleString()}`,
          details: `Category: ${exp.category} ${exp.notes ? '- ' + exp.notes : ''}`,
        });
      }
    });

    // Search Meal Records
    meals.forEach((m) => {
      const member = members.find((mem) => mem.id === m.memberId);
      const memberName = member ? member.name : 'Unknown';
      const total = (Number(m.breakfast) || 0) + (Number(m.lunch) || 0) + (Number(m.dinner) || 0);

      if (
        memberName.toLowerCase().includes(q) ||
        m.date.includes(q) ||
        total.toString() === q
      ) {
        results.push({
          id: m.id,
          type: 'Meal Record',
          date: m.date,
          title: `Daily Meals (${total} meals)`,
          memberName,
          amountOrCount: `${total} Meals (B:${m.breakfast}, L:${m.lunch}, D:${m.dinner})`,
          details: `Member meal record on ${m.date}`,
        });
      }
    });

    return results.sort((a, b) => b.date.localeCompare(a.date));
  };

  const exportBackupData = () => {
    const backupObj = {
      appName: 'The Shield Bachelors Mess System',
      version: '2.5',
      exportedAt: new Date().toISOString(),
      periods,
      currentPeriod,
      members,
      meals,
      expenses,
      deposits,
    };

    const jsonString = JSON.stringify(backupObj, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const cleanLabel = currentPeriod.label.toLowerCase().replace(/[^a-z0-9]/g, '_');
    a.download = `shield_mess_backup_${cleanLabel}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const restoreBackupData = (backupObj: any) => {
    try {
      if (!backupObj || typeof backupObj !== 'object') {
        return { success: false, message: 'Invalid backup file format.' };
      }

      if (backupObj.members && Array.isArray(backupObj.members)) {
        setMembers(backupObj.members);
      }
      if (backupObj.meals && Array.isArray(backupObj.meals)) {
        setMeals(backupObj.meals);
      }
      if (backupObj.expenses && Array.isArray(backupObj.expenses)) {
        setExpenses(backupObj.expenses);
      }
      if (backupObj.deposits && Array.isArray(backupObj.deposits)) {
        setDeposits(backupObj.deposits);
      }
      if (backupObj.periods && Array.isArray(backupObj.periods)) {
        setPeriods(backupObj.periods);
      }
      if (backupObj.currentPeriod && typeof backupObj.currentPeriod === 'object') {
        setCurrentPeriod(backupObj.currentPeriod);
      }

      return {
        success: true,
        message: 'Database state successfully restored from backup!',
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Failed to restore backup: ${err.message || 'Unknown error'}`,
      };
    }
  };

  return (
    <MessContext.Provider
      value={{
        userMode,
        setUserMode,
        isManagerMode,

        isAdminModalOpen,
        setIsAdminModalOpen,
        adminPin,
        loginAsAdmin,
        logoutAdmin,
        updateAdminPin,
        periods,
        currentPeriod,
        setCurrentPeriod,
        darkMode,
        setDarkMode,
        members,
        meals,
        expenses,
        deposits,

        selectedMemberForStatement,
        setSelectedMemberForStatement,
        isSearchModalOpen,
        setIsSearchModalOpen,
        isReportModalOpen,
        setIsReportModalOpen,
        isExcelModalOpen,
        setIsExcelModalOpen,
        isBackupModalOpen,
        setIsBackupModalOpen,
        isExportSummaryModalOpen,
        setIsExportSummaryModalOpen,

        totalMarketExpense,
        totalUtilityExpense,
        totalOverallExpense,
        totalMessMeals,
        totalEffectiveMeals,
        actualMealRate,
        effectiveMealRate,
        totalDepositsAmount,
        managerCashBalance,
        activeMembersCount,
        utilityPerMember,

        memberSummaries,
        highestSpender,
        lowestSpender,
        overdueMembers,
        lowBalanceMembers,

        addMember,
        updateMember,
        toggleMemberStatus,

        upsertMealRecord,
        setAllMealsForDate,
        copyPreviousDayMeals,
        clearMealsForDate,

        addExpense,
        deleteExpense,

        addDeposit,
        deleteDeposit,

        closeMonthAndStartNewCycle,

        importExcelData,
        globalSearchResults,
        exportBackupData,
        restoreBackupData,
      }}
    >
      {children}
    </MessContext.Provider>
  );
};

export const useMess = () => {
  const context = useContext(MessContext);
  if (!context) {
    throw new Error('useMess must be used within a MessProvider');
  }
  return context;
};
