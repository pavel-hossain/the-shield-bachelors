export type MemberRole = 'Manager' | 'Auditor' | 'Member';
export type MemberStatus = 'Active' | 'Inactive';
export type PaymentMethod = 'Cash' | 'bKash' | 'Nagad' | 'Rocket' | 'Bank Transfer';
export type ExpenseCategory = 'Market Shopping' | 'Utility' | 'Maid / Cook' | 'Gas' | 'Internet' | 'Rent' | 'Miscellaneous';
export type UtilityCategory = 'Electricity' | 'Cook / Maid' | 'Internet' | 'Gas Cylinder' | 'House Rent' | 'Other Fixed Bills';
export type ColorTheme = 'emerald' | 'sapphire' | 'amber' | 'rose' | 'cyber' | 'obsidian';

export interface Member {
  id: string;
  name: string;
  phone: string;
  roomNo: string;
  role: MemberRole;
  status: MemberStatus;
  avatarColor: string;
  avatarUrl?: string;
  guardianName?: string;
  guardianRelation?: string;
  guardianPhone?: string;
  joiningDate?: string;
  openingBalance?: number;
  fixedUtilityShare?: number; // Optional custom fixed utility weight if needed
  applyBenchmark?: boolean; // If true (default), minimum 45 effective meals rule applies. If false, billed for actual meals only.
}

export interface DailyMealRecord {
  id: string;
  date: string; // YYYY-MM-DD
  memberId: string;
  breakfast: number; // e.g. 0.5, 1
  lunch: number;     // e.g. 1
  dinner: number;    // e.g. 1
  note?: string;
}

export interface Expense {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  category: ExpenseCategory;
  amount: number;
  paidByMemberId: string; // Member who went to market or paid
  receiptUrl?: string;
  notes?: string;
}

export interface Deposit {
  id: string;
  date: string; // YYYY-MM-DD
  memberId: string;
  amount: number;
  method: PaymentMethod;
  transactionId?: string;
  notes?: string;
}

export interface MonthPeriod {
  year: number;
  month: number; // 1-12
  label: string; // e.g., "August 2026"
  targetBudget: number; // Monthly target expense budget
  benchmarkMeals?: number; // Minimum meal threshold (e.g. 45)
  isClosed?: boolean;
}

export interface MemberFinancialSummary {
  member: Member;
  actualMeals: number;
  effectiveMeals: number;
  totalMeals?: number; // legacy alias for actualMeals
  mealCost: number;
  utilityCostShare: number;
  carriedBalance?: number;
  totalPayable: number;
  totalDeposits: number;
  netBalance: number; // positive = credit (refundable/advance), negative = due
  statusLabel: 'Credit' | 'Due' | 'Settled';
  projectedMeals?: number;
  projectedMealCost?: number;
  isLowBalance?: boolean;
  depositShortfall?: number;
}

export interface GlobalSearchResult {
  id: string;
  type: 'Deposit' | 'Market Expense' | 'Utility Expense' | 'Meal Record' | 'Member';
  date: string;
  title: string;
  memberName: string;
  amountOrCount: string;
  details: string;
}

export interface MemberNotificationPreference {
  enabled: boolean;
  preferredLanguage: 'bn' | 'en' | 'banglish';
  customPhone?: string;
}

export interface NotificationSettings {
  whatsappEnabled: boolean;
  smsEnabled: boolean;
  emailEnabled: boolean;
  inAppAlerts: boolean;
  bKashNumber: string;
  nagadNumber: string;
  rocketNumber: string;
  bankAccountDetails?: string;
  managerContactName: string;
  managerContactPhone: string;
  lowBalanceThreshold: number; // e.g. 300
  memberPreferences: Record<string, MemberNotificationPreference>;
}

export interface MessProfile {
  name: string;
  tagline: string;
  address: string;
  city: string;
  district: string;
  establishedYear: string;
  managerName: string;
  managerPhone: string;
  auditorName?: string;
  auditorPhone?: string;
  bKashNumber: string;
  nagadNumber: string;
  rocketNumber: string;
  bankAccountDetails?: string;
  wifiSSID: string;
  wifiPass: string;
  breakfastTime: string;
  lunchTime: string;
  dinnerTime: string;
  minimumMealPolicy: number;
  guestMealCharge: number;
  depositDeadline: string; // e.g. "5th of every month"
  rules: string[];
  emergencyPolice: string;
  emergencyHospital: string;
  emergencyFire: string;
  emergencyLandlord: string;
}

export interface MonthlyGoalConfig {
  targetMealRate: number; // e.g. 50.00
  monthlyBudgetCeiling: number; // e.g. 35000
  savingsTargetAmount: number; // e.g. 3000
  maxDailySpendLimit: number; // e.g. 1200
  mealPacingTarget: number; // e.g. 450 meals/month
  enableAlerts: boolean;
}

export interface SmartCategoryItem {
  id: string;
  rawText: string;
  item: string;
  quantity?: string;
  estimatedPrice: number;
  category: ExpenseCategory;
  subCategory: string;
  confidence: number;
  tags: string[];
}

export interface LeaderboardEntry {
  member: Member;
  rank: number;
  score: number;
  badges: { label: string; icon: string; desc: string; color: string }[];
  totalDeposited: number;
  totalMeals: number;
  bazarCount: number;
  netBalance: number;
  punctualityScore: number;
  isBenchmarkMet: boolean;
}

export interface MealReminderCutoff {
  mealType: 'Breakfast' | 'Lunch' | 'Dinner';
  cutoffTime: string; // e.g. "22:00" for Breakfast prev night, "09:00" for Lunch, "17:00" for Dinner
  servingTime: string;
  isOpen: boolean;
  timeRemainingMinutes: number;
}

export interface BudgetForecastData {
  daysElapsed: number;
  totalDaysInMonth: number;
  remainingDays: number;
  currentMarketSpend: number;
  currentUtilitySpend: number;
  currentTotalSpend: number;
  projectedMarketSpend: number;
  projectedTotalSpend: number;
  currentMealRate: number;
  projectedMealRate: number;
  targetBudget: number;
  projectedVariance: number; // positive = under budget, negative = over budget
  recommendedDailyBazarCap: number;
  dailyBurnRate: number;
}

export interface DebtSettlementItem {
  id: string;
  memberId: string;
  memberName: string;
  memberPhone: string;
  netBalance: number; // negative = owes, positive = credit
  type: 'debtor' | 'creditor' | 'settled';
  suggestedAction: string;
}

export interface DataSnapshot {
  id: string;
  timestamp: string;
  label: string;
  membersCount: number;
  mealsCount: number;
  expensesCount: number;
  depositsCount: number;
  totalExpenseAmount: number;
  totalDepositsAmount: number;
  data: {
    members?: Member[];
    meals?: DailyMealRecord[];
    expenses?: Expense[];
    deposits?: Deposit[];
    periods?: MonthPeriod[];
  };
}

