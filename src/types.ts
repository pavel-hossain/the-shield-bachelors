export type MemberRole = 'Manager' | 'Auditor' | 'Member';
export type MemberStatus = 'Active' | 'Inactive';
export type PaymentMethod = 'Cash' | 'bKash' | 'Nagad' | 'Bank Transfer';
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
