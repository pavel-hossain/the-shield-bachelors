import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Member,
  DailyMealRecord,
  Expense,
  Deposit,
  MonthPeriod,
  MemberFinancialSummary,
  GlobalSearchResult,
  ColorTheme,
  NotificationSettings,
  MessProfile,
  DataSnapshot,
  MonthlyGoalConfig,
  LeaderboardEntry,
} from '../types';
import {
  INITIAL_PERIODS,
  INITIAL_MEMBERS,
  INITIAL_MEALS,
  INITIAL_EXPENSES,
  INITIAL_DEPOSITS,
  DEFAULT_NOTIFICATION_SETTINGS,
  DEFAULT_MESS_PROFILE,
  DEFAULT_MONTHLY_GOALS,
} from '../data/mockData';
import {
  getOfflineQueue,
  enqueueOfflineAction,
  clearOfflineQueue,
  getLastSyncTime,
  updateLastSyncTime,
} from '../utils/offlineSync';

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
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
  customCursorEnabled: boolean;
  setCustomCursorEnabled: (enabled: boolean) => void;
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
  isThemeModalOpen: boolean;
  setIsThemeModalOpen: (open: boolean) => void;
  isAPKModalOpen: boolean;
  setIsAPKModalOpen: (open: boolean) => void;
  isNotificationModalOpen: boolean;
  setIsNotificationModalOpen: (open: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  isBulkUploadModalOpen: boolean;
  setIsBulkUploadModalOpen: (open: boolean) => void;
  isAnalyticsModalOpen: boolean;
  setIsAnalyticsModalOpen: (open: boolean) => void;
  isGoalModalOpen: boolean;
  setIsGoalModalOpen: (open: boolean) => void;
  isLeaderboardModalOpen: boolean;
  setIsLeaderboardModalOpen: (open: boolean) => void;
  isMealReminderModalOpen: boolean;
  setIsMealReminderModalOpen: (open: boolean) => void;
  isCategorizerModalOpen: boolean;
  setIsCategorizerModalOpen: (open: boolean) => void;
  isBudgetForecastModalOpen: boolean;
  setIsBudgetForecastModalOpen: (open: boolean) => void;
  isExpenseScannerModalOpen: boolean;
  setIsExpenseScannerModalOpen: (open: boolean) => void;
  isComparisonChartModalOpen: boolean;
  setIsComparisonChartModalOpen: (open: boolean) => void;
  isDebtSettlementModalOpen: boolean;
  setIsDebtSettlementModalOpen: (open: boolean) => void;

  // Monthly Goals
  monthlyGoals: MonthlyGoalConfig;
  updateMonthlyGoals: (goals: Partial<MonthlyGoalConfig>) => void;

  // Leaderboard
  leaderboardEntries: LeaderboardEntry[];

  // Notification Settings
  notificationSettings: NotificationSettings;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;

  // Mess Profile
  messProfile: MessProfile;
  updateMessProfile: (profile: Partial<MessProfile>) => void;

  // Auto-backup & Snapshots
  snapshots: DataSnapshot[];
  createSnapshot: (label?: string) => void;
  restoreSnapshot: (id: string) => { success: boolean; message: string };
  deleteSnapshot: (id: string) => void;
  autoBackupSchedule: 'daily' | '3days' | 'weekly' | 'off';
  setAutoBackupSchedule: (sch: 'daily' | '3days' | 'weekly' | 'off') => void;
  lastBackupDownloadTime: string | null;
  isBackupPromptVisible: boolean;
  dismissBackupPrompt: () => void;

  // Offline & Voice State
  isOnline: boolean;
  pendingSyncQueue: any[];
  lastSyncTime: string | null;
  syncOfflineQueueNow: () => void;
  clearPendingOfflineQueue: () => void;
  isOfflineSyncModalOpen: boolean;
  setIsOfflineSyncModalOpen: (open: boolean) => void;
  isVoiceEntryModalOpen: boolean;
  setIsVoiceEntryModalOpen: (open: boolean) => void;
  updatePeriodBudget: (periodLabel: string, newBudget: number) => void;

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

  // Bulk Handlers
  bulkAddExpenses: (expenses: Omit<Expense, 'id'>[]) => { success: boolean; count: number };
  bulkAddDeposits: (deposits: Omit<Deposit, 'id'>[]) => { success: boolean; count: number };
  bulkAddMembers: (members: Omit<Member, 'id'>[]) => { success: boolean; count: number };
  bulkUpsertMeals: (mealRecords: { date: string; memberId: string; breakfast: number; lunch: number; dinner: number; note?: string }[]) => { success: boolean; count: number };

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
    const saved = localStorage.getItem('shield_mess_dark_mode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    return (localStorage.getItem('shield_mess_color_theme') as ColorTheme) || 'emerald';
  });

  const [customCursorEnabled, setCustomCursorEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('shield_mess_custom_cursor');
    if (saved !== null) return saved === 'true';
    // Default to enabled on non-coarse pointer devices
    return window.matchMedia('(pointer: fine)').matches;
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
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isAPKModalOpen, setIsAPKModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState(false);
  const [isMealReminderModalOpen, setIsMealReminderModalOpen] = useState(false);
  const [isCategorizerModalOpen, setIsCategorizerModalOpen] = useState(false);
  const [isBudgetForecastModalOpen, setIsBudgetForecastModalOpen] = useState(false);
  const [isExpenseScannerModalOpen, setIsExpenseScannerModalOpen] = useState(false);
  const [isComparisonChartModalOpen, setIsComparisonChartModalOpen] = useState(false);
  const [isDebtSettlementModalOpen, setIsDebtSettlementModalOpen] = useState(false);

  // Monthly Goals State
  const [monthlyGoals, setMonthlyGoals] = useState<MonthlyGoalConfig>(() => {
    const saved = localStorage.getItem('shield_mess_monthly_goals');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return DEFAULT_MONTHLY_GOALS as MonthlyGoalConfig;
  });

  const updateMonthlyGoals = (newGoals: Partial<MonthlyGoalConfig>) => {
    setMonthlyGoals((prev) => {
      const updated = { ...prev, ...newGoals };
      localStorage.setItem('shield_mess_monthly_goals', JSON.stringify(updated));
      return updated;
    });
  };

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('shield_mess_notification_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.bKashNumber === '01712-345678' || !parsed.bKashNumber) {
          parsed.bKashNumber = '01948545255';
        }
        if (parsed.nagadNumber === '01712-345678' || !parsed.nagadNumber) {
          parsed.nagadNumber = '01948545255';
        }
        if (parsed.rocketNumber === '01712-345678-9' || !parsed.rocketNumber) {
          parsed.rocketNumber = '018776890414';
        }
        if (!parsed.bankAccountDetails || parsed.bankAccountDetails.includes('154.120.98765')) {
          parsed.bankAccountDetails = 'Dutch Bangla Bank: 2281600015015';
        }
        return { ...DEFAULT_NOTIFICATION_SETTINGS, ...parsed } as NotificationSettings;
      } catch (e) {
        // fallback
      }
    }
    return DEFAULT_NOTIFICATION_SETTINGS as NotificationSettings;
  });

  const updateNotificationSettings = (newSettings: Partial<NotificationSettings>) => {
    setNotificationSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('shield_mess_notification_settings', JSON.stringify(updated));
      return updated;
    });
  };

  // Mess Profile
  const [messProfile, setMessProfile] = useState<MessProfile>(() => {
    const saved = localStorage.getItem('shield_mess_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.bKashNumber === '01712-345678' || !parsed.bKashNumber) {
          parsed.bKashNumber = '01948545255';
        }
        if (parsed.nagadNumber === '01712-345678' || !parsed.nagadNumber) {
          parsed.nagadNumber = '01948545255';
        }
        if (parsed.rocketNumber === '01712-345678-9' || !parsed.rocketNumber) {
          parsed.rocketNumber = '018776890414';
        }
        if (!parsed.bankAccountDetails || parsed.bankAccountDetails.includes('154.120.98765')) {
          parsed.bankAccountDetails = 'Dutch Bangla Bank: 2281600015015';
        }
        return { ...DEFAULT_MESS_PROFILE, ...parsed } as MessProfile;
      } catch (e) {
        // fallback
      }
    }
    return DEFAULT_MESS_PROFILE as MessProfile;
  });

  const updateMessProfile = (newProfile: Partial<MessProfile>) => {
    setMessProfile((prev) => {
      const updated = { ...prev, ...newProfile };
      localStorage.setItem('shield_mess_profile', JSON.stringify(updated));
      return updated;
    });
  };

  // Auto-backup & Snapshots
  const [snapshots, setSnapshots] = useState<DataSnapshot[]>(() => {
    const saved = localStorage.getItem('shield_mess_snapshots');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [];
  });

  const [autoBackupSchedule, setAutoBackupScheduleState] = useState<'daily' | '3days' | 'weekly' | 'off'>(() => {
    return (localStorage.getItem('shield_mess_backup_schedule') as any) || '3days';
  });

  const setAutoBackupSchedule = (sch: 'daily' | '3days' | 'weekly' | 'off') => {
    setAutoBackupScheduleState(sch);
    localStorage.setItem('shield_mess_backup_schedule', sch);
  };

  const [lastBackupDownloadTime, setLastBackupDownloadTime] = useState<string | null>(() => {
    return localStorage.getItem('shield_mess_last_backup_download');
  });

  const [isBackupPromptVisible, setIsBackupPromptVisible] = useState(false);

  // Check auto-backup schedule
  useEffect(() => {
    if (autoBackupSchedule === 'off') {
      setIsBackupPromptVisible(false);
      return;
    }

    const lastTime = lastBackupDownloadTime ? new Date(lastBackupDownloadTime).getTime() : 0;
    const now = Date.now();
    const daysSince = (now - lastTime) / (1000 * 60 * 60 * 24);

    let thresholdDays = 3;
    if (autoBackupSchedule === 'daily') thresholdDays = 1;
    if (autoBackupSchedule === 'weekly') thresholdDays = 7;

    if (daysSince >= thresholdDays) {
      setIsBackupPromptVisible(true);
    }
  }, [autoBackupSchedule, lastBackupDownloadTime]);

  const dismissBackupPrompt = () => {
    setIsBackupPromptVisible(false);
  };

  const createSnapshot = (label?: string) => {
    const newSnapshot: DataSnapshot = {
      id: 'snap-' + Date.now(),
      timestamp: new Date().toISOString(),
      label: label || `Snapshot ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}`,
      membersCount: members.length,
      mealsCount: meals.length,
      expensesCount: expenses.length,
      depositsCount: deposits.length,
      totalExpenseAmount: expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0),
      totalDepositsAmount: deposits.reduce((s, d) => s + (Number(d.amount) || 0), 0),
      data: {
        members: JSON.parse(JSON.stringify(members)),
        meals: JSON.parse(JSON.stringify(meals)),
        expenses: JSON.parse(JSON.stringify(expenses)),
        deposits: JSON.parse(JSON.stringify(deposits)),
        periods: JSON.parse(JSON.stringify(periods)),
      },
    };

    setSnapshots((prev) => {
      // Keep up to 10 snapshots max
      const updated = [newSnapshot, ...prev].slice(0, 10);
      localStorage.setItem('shield_mess_snapshots', JSON.stringify(updated));
      return updated;
    });
  };

  const restoreSnapshot = (snapshotId: string) => {
    const found = snapshots.find((s) => s.id === snapshotId);
    if (!found) {
      return { success: false, message: 'Snapshot not found.' };
    }
    // Create an auto recovery checkpoint before restoring
    createSnapshot(`Auto recovery prior to restoring "${found.label}"`);

    if (found.data.members) setMembers(found.data.members);
    if (found.data.meals) setMeals(found.data.meals);
    if (found.data.expenses) setExpenses(found.data.expenses);
    if (found.data.deposits) setDeposits(found.data.deposits);
    if (found.data.periods) setPeriods(found.data.periods);

    return {
      success: true,
      message: `System successfully restored to snapshot "${found.label}"!`,
    };
  };

  const deleteSnapshot = (snapshotId: string) => {
    setSnapshots((prev) => {
      const updated = prev.filter((s) => s.id !== snapshotId);
      localStorage.setItem('shield_mess_snapshots', JSON.stringify(updated));
      return updated;
    });
  };

  // Bulk Upload Operations
  const bulkAddExpenses = (expensesList: Omit<Expense, 'id'>[]) => {
    if (!expensesList || expensesList.length === 0) return { success: false, count: 0 };
    const newItems: Expense[] = expensesList.map((exp, idx) => ({
      ...exp,
      id: `exp-bulk-${Date.now()}-${idx}`,
    }));
    setExpenses((prev) => [...prev, ...newItems]);
    createSnapshot(`Bulk added ${newItems.length} expenses`);
    return { success: true, count: newItems.length };
  };

  const bulkAddDeposits = (depositsList: Omit<Deposit, 'id'>[]) => {
    if (!depositsList || depositsList.length === 0) return { success: false, count: 0 };
    const newItems: Deposit[] = depositsList.map((dep, idx) => ({
      ...dep,
      id: `dep-bulk-${Date.now()}-${idx}`,
    }));
    setDeposits((prev) => [...prev, ...newItems]);
    createSnapshot(`Bulk added ${newItems.length} deposits`);
    return { success: true, count: newItems.length };
  };

  const bulkAddMembers = (membersList: Omit<Member, 'id'>[]) => {
    if (!membersList || membersList.length === 0) return { success: false, count: 0 };
    const avatarColors = [
      'bg-emerald-600 text-white',
      'bg-indigo-600 text-white',
      'bg-amber-600 text-white',
      'bg-rose-600 text-white',
      'bg-teal-600 text-white',
      'bg-purple-600 text-white',
      'bg-cyan-600 text-white',
      'bg-blue-600 text-white',
    ];
    const newItems: Member[] = membersList.map((mem, idx) => ({
      ...mem,
      id: `m-bulk-${Date.now()}-${idx}`,
      avatarColor: mem.avatarColor || avatarColors[(members.length + idx) % avatarColors.length],
      applyBenchmark: mem.applyBenchmark !== undefined ? mem.applyBenchmark : true,
    }));
    setMembers((prev) => [...prev, ...newItems]);
    createSnapshot(`Bulk added ${newItems.length} members`);
    return { success: true, count: newItems.length };
  };

  const bulkUpsertMeals = (mealList: { date: string; memberId: string; breakfast: number; lunch: number; dinner: number; note?: string }[]) => {
    if (!mealList || mealList.length === 0) return { success: false, count: 0 };
    setMeals((prev) => {
      let updated = [...prev];
      mealList.forEach((item) => {
        const idx = updated.findIndex((r) => r.date === item.date && r.memberId === item.memberId);
        if (idx >= 0) {
          updated[idx] = {
            ...updated[idx],
            breakfast: item.breakfast,
            lunch: item.lunch,
            dinner: item.dinner,
            note: item.note || updated[idx].note,
          };
        } else {
          updated.push({
            id: `meal-bulk-${item.date}-${item.memberId}-${Date.now()}`,
            date: item.date,
            memberId: item.memberId,
            breakfast: item.breakfast,
            lunch: item.lunch,
            dinner: item.dinner,
            note: item.note,
          });
        }
      });
      return updated;
    });
    createSnapshot(`Bulk updated ${mealList.length} meal entries`);
    return { success: true, count: mealList.length };
  };


  // Offline & Voice Modals & Sync State
  const [isOfflineSyncModalOpen, setIsOfflineSyncModalOpen] = useState(false);
  const [isVoiceEntryModalOpen, setIsVoiceEntryModalOpen] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(() => typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [pendingSyncQueue, setPendingSyncQueue] = useState<any[]>(() => getOfflineQueue());
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(() => getLastSyncTime());

  // Listen for online / offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Automatically trigger sync on connection restore if queue is not empty
      if (getOfflineQueue().length > 0) {
        syncOfflineQueueNow();
      }
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncOfflineQueueNow = () => {
    // Process queue items
    const queue = getOfflineQueue();
    if (queue.length > 0) {
      clearOfflineQueue();
      setPendingSyncQueue([]);
    }
    const syncedAt = updateLastSyncTime();
    setLastSyncTime(syncedAt);
  };

  const clearPendingOfflineQueue = () => {
    clearOfflineQueue();
    setPendingSyncQueue([]);
  };

  const updatePeriodBudget = (periodLabel: string, newBudget: number) => {
    setPeriods((prev) =>
      prev.map((p) => (p.label === periodLabel ? { ...p, targetBudget: newBudget } : p))
    );
    setCurrentPeriod((prev) => (prev.label === periodLabel ? { ...prev, targetBudget: newBudget } : prev));
  };

  // Apply dark mode & color theme attribute to HTML root
  useEffect(() => {
    localStorage.setItem('shield_mess_dark_mode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('shield_mess_color_theme', colorTheme);
    document.documentElement.setAttribute('data-theme', colorTheme);
  }, [colorTheme]);

  useEffect(() => {
    localStorage.setItem('shield_mess_custom_cursor', String(customCursorEnabled));
  }, [customCursorEnabled]);

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

  // Dynamic Leaderboard Calculations
  const leaderboardEntries: LeaderboardEntry[] = memberSummaries
    .filter((s) => s.member.status === 'Active')
    .map((s) => {
      // Bazar shopping count this month
      const memberBazarRuns = monthExpenses.filter(
        (e) => e.paidByMemberId === s.member.id && (e.category === 'Market Shopping' || e.category === 'Miscellaneous')
      );
      const bazarCount = memberBazarRuns.length;

      // Punctuality score (0 - 100)
      let punctualityScore = 70;
      if (s.netBalance >= 500) punctualityScore = 100;
      else if (s.netBalance >= 0) punctualityScore = 90;
      else if (s.netBalance >= -300) punctualityScore = 60;
      else punctualityScore = 30;

      const isBenchmarkMet = s.actualMeals >= (currentPeriod.benchmarkMeals || 45);

      // Total Score Calculation
      const depositPoints = Math.round((s.totalDeposits / 100) * 1.5);
      const mealPoints = Math.round(s.actualMeals * 2.5);
      const bazarPoints = bazarCount * 35;
      const balanceBonus = s.netBalance > 0 ? 40 : s.netBalance >= -200 ? 10 : -25;
      const benchmarkBonus = isBenchmarkMet ? 50 : 0;

      const score = Math.max(10, depositPoints + mealPoints + bazarPoints + balanceBonus + benchmarkBonus);

      // Generate Badges
      const badges: { label: string; icon: string; desc: string; color: string }[] = [];
      if (s.totalDeposits >= 5000) {
        badges.push({ label: 'Top Depositor', icon: '💰', desc: 'Deposited ৳5,000+ this month', color: 'emerald' });
      }
      if (bazarCount >= 2) {
        badges.push({ label: 'Bazar Hero', icon: '🛒', desc: `${bazarCount} market shopping trips completed`, color: 'amber' });
      }
      if (s.netBalance >= 200) {
        badges.push({ label: 'Zero Dues Star', icon: '🛡️', desc: 'Maintains advance balance buffer', color: 'indigo' });
      }
      if (isBenchmarkMet) {
        badges.push({ label: 'Benchmark Pro', icon: '🎯', desc: 'Achieved 45+ effective meal quota', color: 'violet' });
      }
      if (s.actualMeals >= 30) {
        badges.push({ label: 'Regular Diner', icon: '🍽️', desc: 'High dining regularity and attendance', color: 'teal' });
      }

      return {
        member: s.member,
        rank: 0,
        score,
        badges,
        totalDeposited: s.totalDeposits,
        totalMeals: s.actualMeals,
        bazarCount,
        netBalance: s.netBalance,
        punctualityScore,
        isBenchmarkMet,
      };
    })
    .sort((a, b) => b.score - a.score)
    .map((entry, idx) => {
      const finalBadges = [...entry.badges];
      if (idx === 0) {
        finalBadges.unshift({ label: 'Mess Champion', icon: '👑', desc: 'Rank #1 overall contribution leader', color: 'amber' });
      } else if (idx === 1) {
        finalBadges.unshift({ label: 'Silver Ace', icon: '🥈', desc: 'Rank #2 leading contributor', color: 'slate' });
      } else if (idx === 2) {
        finalBadges.unshift({ label: 'Bronze Master', icon: '🥉', desc: 'Rank #3 leading contributor', color: 'orange' });
      }
      return {
        ...entry,
        rank: idx + 1,
        badges: finalBadges,
      };
    });

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
    if (!isOnline) {
      const q = enqueueOfflineAction(
        'UPSERT_MEAL',
        { date, memberId, breakfast, lunch, dinner },
        `Upsert Meal for Member ${memberId} on ${date}`
      );
      setPendingSyncQueue(q);
    }

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
    if (!isOnline) {
      const q = enqueueOfflineAction('ADD_EXPENSE', created, `Add ${created.category}: "${created.title}" (৳${created.amount})`);
      setPendingSyncQueue(q);
    }
    setExpenses((prev) => [created, ...prev]);
  };

  const deleteExpense = (id: string) => {
    if (!isOnline) {
      const q = enqueueOfflineAction('DELETE_EXPENSE', { id }, `Delete Expense ${id}`);
      setPendingSyncQueue(q);
    }
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const addDeposit = (dep: Omit<Deposit, 'id'>) => {
    const created: Deposit = {
      ...dep,
      id: `dep-${Date.now()}`,
    };
    if (!isOnline) {
      const q = enqueueOfflineAction('ADD_DEPOSIT', created, `Add Deposit (৳${created.amount})`);
      setPendingSyncQueue(q);
    }
    setDeposits((prev) => [created, ...prev]);
  };

  const deleteDeposit = (id: string) => {
    if (!isOnline) {
      const q = enqueueOfflineAction('DELETE_DEPOSIT', { id }, `Delete Deposit ${id}`);
      setPendingSyncQueue(q);
    }
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
        colorTheme,
        setColorTheme,
        customCursorEnabled,
        setCustomCursorEnabled,
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
        isThemeModalOpen,
        setIsThemeModalOpen,
        isAPKModalOpen,
        setIsAPKModalOpen,
        isNotificationModalOpen,
        setIsNotificationModalOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isBulkUploadModalOpen,
        setIsBulkUploadModalOpen,
        isAnalyticsModalOpen,
        setIsAnalyticsModalOpen,
        isGoalModalOpen,
        setIsGoalModalOpen,
        isLeaderboardModalOpen,
        setIsLeaderboardModalOpen,
        isMealReminderModalOpen,
        setIsMealReminderModalOpen,
        isCategorizerModalOpen,
        setIsCategorizerModalOpen,
        isBudgetForecastModalOpen,
        setIsBudgetForecastModalOpen,
        isExpenseScannerModalOpen,
        setIsExpenseScannerModalOpen,
        isComparisonChartModalOpen,
        setIsComparisonChartModalOpen,
        isDebtSettlementModalOpen,
        setIsDebtSettlementModalOpen,

        monthlyGoals,
        updateMonthlyGoals,
        leaderboardEntries,

        notificationSettings,
        updateNotificationSettings,

        messProfile,
        updateMessProfile,

        snapshots,
        createSnapshot,
        restoreSnapshot,
        deleteSnapshot,
        autoBackupSchedule,
        setAutoBackupSchedule,
        lastBackupDownloadTime,
        isBackupPromptVisible,
        dismissBackupPrompt,

        bulkAddExpenses,
        bulkAddDeposits,
        bulkAddMembers,
        bulkUpsertMeals,

        isOnline,
        pendingSyncQueue,
        lastSyncTime,
        syncOfflineQueueNow,
        clearPendingOfflineQueue,
        isOfflineSyncModalOpen,
        setIsOfflineSyncModalOpen,
        isVoiceEntryModalOpen,
        setIsVoiceEntryModalOpen,
        updatePeriodBudget,

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
