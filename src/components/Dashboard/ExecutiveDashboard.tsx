import React from 'react';
import { useMess } from '../../context/MessContext';
import {
  Wallet,
  Receipt,
  PiggyBank,
  TrendingUp,
  AlertTriangle,
  Send,
  Award,
  Zap,
  PlusCircle,
  FileText,
  Utensils,
  ChevronRight,
  ShieldAlert,
  BarChart3,
  Download,
  Calculator,
} from 'lucide-react';
import { TabType } from '../BottomNav';
import { BudgetAlertBanner } from './BudgetAlertBanner';

interface ExecutiveDashboardProps {
  setActiveTab: (tab: TabType) => void;
  openAddExpenseModal: () => void;
  openAddDepositModal: () => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  setActiveTab,
  openAddExpenseModal,
  openAddDepositModal,
}) => {
  const {
    currentPeriod,
    totalMarketExpense,
    totalUtilityExpense,
    totalOverallExpense,
    totalMessMeals,
    totalEffectiveMeals,
    actualMealRate,
    effectiveMealRate,
    totalDepositsAmount,
    managerCashBalance,
    highestSpender,
    lowestSpender,
    overdueMembers,
    lowBalanceMembers,
    setSelectedMemberForStatement,
    setIsReportModalOpen,
    setIsExportSummaryModalOpen,
    closeMonthAndStartNewCycle,
    isManagerMode,
    setIsAdminModalOpen,
  } = useMess();

  const [isCloseMonthConfirmOpen, setIsCloseMonthConfirmOpen] = React.useState(false);

  // Budget progress calculation
  const targetBudget = currentPeriod.targetBudget || 28000;
  const budgetPercentage = Math.min(Math.round((totalOverallExpense / targetBudget) * 100), 100);

  // Send WhatsApp Reminder function
  const sendWhatsAppReminder = (memberName: string, phone: string, dueAmount: number) => {
    const text = encodeURIComponent(
      `Hello ${memberName},\nThis is a polite reminder from The Shield Bachelors Mess (${currentPeriod.label}). Your current mess due balance is ৳ ${dueAmount.toLocaleString()}. Kindly clear your deposit with the Mess Manager.\nThank you!`
    );
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const fullPhone = cleanPhone.startsWith('88') ? cleanPhone : `88${cleanPhone}`;
    window.open(`https://wa.me/${fullPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Quick Actions Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 text-white p-3 sm:p-4 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
            Mess Overview — {currentPeriod.label}
          </h2>
          <p className="text-xs text-slate-400 font-medium">Police Line, Magura Sadar</p>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('summary')}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap shadow-xs"
            title="Open Monthly Financial Summary & Balance Sheets"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Financial Summary</span>
          </button>
          <button
            onClick={() => setIsExportSummaryModalOpen(true)}
            className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap shadow-xs"
            title="Export CSV, PDF Summary & Backups"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Summary</span>
          </button>
          <button
            onClick={() => setActiveTab('meals')}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap"
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Meals</span>
          </button>
          {isManagerMode && (
            <>
              <button
                onClick={openAddExpenseModal}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold transition border border-slate-700 whitespace-nowrap"
              >
                <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Expense</span>
              </button>
              <button
                onClick={openAddDepositModal}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold transition border border-slate-700 whitespace-nowrap"
              >
                <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Deposit</span>
              </button>
              <button
                onClick={() => setIsCloseMonthConfirmOpen(true)}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Close Month</span>
              </button>
            </>
          )}
          {!isManagerMode && (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-700/60 px-2.5 py-1 rounded-lg whitespace-nowrap">
                👁️ Member View (Read-Only)
              </span>
              <button
                onClick={() => setIsAdminModalOpen(true)}
                className="text-[11px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded-lg transition whitespace-nowrap"
              >
                Manager Login
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Budget Alert Banner */}
      <BudgetAlertBanner />

      {/* Financial Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
        {/* Effective Meal Rate Card */}
        <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-3.5 rounded-xl shadow-xs relative overflow-hidden hover-shine hover-lift hover-glow">
          <div className="absolute right-2 top-2 opacity-10">
            <TrendingUp className="w-16 h-16" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-emerald-100 uppercase tracking-wider block">
              Effective Meal Rate
            </span>
            <span className="text-[10px] bg-emerald-800/80 text-emerald-200 px-1.5 py-0.5 rounded font-bold">
              Min 45 benchmark
            </span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-black tracking-tight">
              ৳ {effectiveMealRate.toFixed(2)}
            </span>
            <span className="text-xs text-emerald-200 font-medium">/ meal</span>
          </div>
          <div className="mt-2 text-[10px] text-emerald-100/90 font-medium flex items-center justify-between border-t border-emerald-500/40 pt-1.5">
            <span>Actual Rate: ৳ {actualMealRate.toFixed(2)}</span>
            <span>{totalMessMeals} Meals</span>
          </div>
        </div>

        {/* Manager Cash Balance */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl shadow-xs hover-shine hover-lift hover-border-glow">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Manager Cash</span>
            <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-1">
            <span
              className={`text-xl font-bold tracking-tight ${
                managerCashBalance >= 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              ৳ {managerCashBalance.toLocaleString()}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 truncate">
            In Hand / Bank
          </p>
        </div>

        {/* Total Expenses (Pure Market Shopping Only) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl shadow-xs hover-shine hover-lift hover-border-glow">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Expense</span>
            <Receipt className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-1">
            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              ৳ {totalMarketExpense.toLocaleString()}
            </span>
          </div>
          <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-1 truncate">
            Pure Market Shopping Only (বাজার খরচ)
          </p>
        </div>

        {/* Total Utility Costs */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl shadow-xs hover-shine hover-lift hover-border-glow">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Utilities & Maid</span>
            <Zap className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-1">
            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              ৳ {totalUtilityExpense.toLocaleString()}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 truncate">
            Fixed bill share
          </p>
        </div>

        {/* Total Deposits */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Deposits</span>
            <PiggyBank className="w-4 h-4 text-teal-500" />
          </div>
          <div className="mt-1">
            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              ৳ {totalDepositsAmount.toLocaleString()}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 truncate">
            Received from members
          </p>
        </div>
      </div>

      {/* Budget Progress Bar Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl shadow-xs">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Target Monthly Expense Budget
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            ৳ {totalOverallExpense.toLocaleString()} / ৳ {targetBudget.toLocaleString()} ({budgetPercentage}%)
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              budgetPercentage > 90
                ? 'bg-rose-500'
                : budgetPercentage > 75
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${budgetPercentage}%` }}
          />
        </div>
      </div>

      {/* Overdue Payment Alert Banner */}
      {overdueMembers.length > 0 && (
        <div className="border-l-4 border-red-500 bg-red-50 dark:bg-red-950/40 p-3 rounded-r-xl border border-red-200 dark:border-red-900/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400" />
              <h3 className="text-xs font-bold text-red-900 dark:text-red-200 tracking-tight">
                Overdue Deposit Alert ({overdueMembers.length} Members)
              </h3>
            </div>
            <span className="text-[10px] font-bold uppercase bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200 px-1.5 py-0.5 rounded whitespace-nowrap">
              Action Needed
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {overdueMembers.map(({ member, dueAmount, phone }) => (
              <div
                key={member.id}
                className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/60 p-2 rounded-lg flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                    {member.name}
                  </span>
                  <span className="text-[11px] font-bold text-red-600 dark:text-red-400">
                    ৳ {dueAmount.toLocaleString()} Due
                  </span>
                </div>
                <button
                  onClick={() => sendWhatsAppReminder(member.name, phone, dueAmount)}
                  className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-1 rounded text-[11px] font-semibold transition whitespace-nowrap"
                  title="Send WhatsApp Reminder"
                >
                  <Send className="w-3 h-3" />
                  <span>Remind</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Low Deposit Balance Warning Section */}
      {lowBalanceMembers.length > 0 && (
        <div className="border-l-4 border-amber-500 bg-amber-50/90 dark:bg-amber-950/40 p-3.5 rounded-r-xl border border-amber-200 dark:border-amber-900/50 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <div>
                <h3 className="text-xs font-bold text-amber-900 dark:text-amber-200 tracking-tight flex items-center gap-1.5">
                  <span>Low Deposit Balance Warning</span>
                  <span className="bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">
                    {lowBalanceMembers.length} Members At Risk
                  </span>
                </h3>
                <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 font-medium">
                  Total deposit is less than projected meal cost for {currentPeriod.label}
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-block text-[10px] font-bold uppercase bg-amber-200 text-amber-900 dark:bg-amber-900/80 dark:text-amber-200 px-2 py-0.5 rounded-full whitespace-nowrap">
              ⚠️ Projected Deficit
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {lowBalanceMembers.map(
              ({ member, totalDeposits, projectedMealCost, depositShortfall, projectedMeals }) => (
                <div
                  key={member.id}
                  className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 p-2.5 rounded-xl shadow-2xs flex flex-col justify-between space-y-2"
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      {member.avatarUrl ? (
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                        />
                      ) : (
                        <div
                          className={`w-7 h-7 rounded-full ${member.avatarColor} text-[10px] font-bold flex items-center justify-center shrink-0`}
                        >
                          {member.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                      )}
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                          {member.name}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                          Room {member.roomNo || '-'}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-1.5 py-0.5 rounded-md shrink-0">
                      Shortfall ৳{depositShortfall.toLocaleString()}
                    </span>
                  </div>

                  <div className="text-[11px] bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-1 text-slate-600 dark:text-slate-300">
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase font-bold">Total Deposit</span>
                      <span className="font-bold text-teal-600 dark:text-teal-400">৳ {totalDeposits.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase font-bold">Projected Cost</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        ৳ {projectedMealCost.toLocaleString()}{' '}
                        <span className="text-[9px] font-normal text-slate-400">({projectedMeals}m)</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-1.5 pt-0.5">
                    <button
                      onClick={() => {
                        const text = encodeURIComponent(
                          `Hello ${member.name},\nFriendly low balance alert from The Shield Bachelors Mess (${currentPeriod.label}). Your total deposit so far is ৳ ${totalDeposits.toLocaleString()}, which is lower than your projected meal cost of ৳ ${projectedMealCost.toLocaleString()} (Shortfall: ৳ ${depositShortfall.toLocaleString()}). Please top up your deposit with the Mess Manager.\nThank you!`
                        );
                        const cleanPhone = member.phone.replace(/[^0-9]/g, '');
                        const fullPhone = cleanPhone.startsWith('88') ? cleanPhone : `88${cleanPhone}`;
                        window.open(`https://wa.me/${fullPhone}?text=${text}`, '_blank');
                      }}
                      className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-1 rounded-lg text-[11px] font-semibold transition whitespace-nowrap shadow-2xs"
                      title="Send WhatsApp Low Balance Alert"
                    >
                      <Send className="w-3 h-3" />
                      <span>Remind</span>
                    </button>
                    {isManagerMode && (
                      <button
                        onClick={openAddDepositModal}
                        className="flex items-center gap-1 bg-amber-600 hover:bg-amber-500 text-white px-2 py-1 rounded-lg text-[11px] font-semibold transition whitespace-nowrap shadow-2xs"
                      >
                        <PlusCircle className="w-3 h-3" />
                        <span>+ Deposit</span>
                      </button>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Period Spender Highlights (Highest & Lowest Spenders) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Highest Spender Card */}
        {highestSpender && (
          <div
            onClick={() => setSelectedMemberForStatement(highestSpender.member)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl shadow-xs hover:border-emerald-500 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                Highest Meal Consumer
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition" />
            </div>
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full ${highestSpender.member.avatarColor} font-bold text-sm flex items-center justify-center shrink-0`}
              >
                {highestSpender.member.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {highestSpender.member.name}
                </h4>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  <span>{highestSpender.totalMeals} Meals</span>
                  <span>•</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200">
                    ৳ {highestSpender.totalPayable.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lowest Spender Card */}
        {lowestSpender && (
          <div
            onClick={() => setSelectedMemberForStatement(lowestSpender.member)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl shadow-xs hover:border-emerald-500 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-indigo-500" />
                Lowest Meal Consumer
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition" />
            </div>
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full ${lowestSpender.member.avatarColor} font-bold text-sm flex items-center justify-center shrink-0`}
              >
                {lowestSpender.member.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {lowestSpender.member.name}
                </h4>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  <span>{lowestSpender.totalMeals} Meals</span>
                  <span>•</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200">
                    ৳ {lowestSpender.totalPayable.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Member Financial Status Preview Card Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
        <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Member Ledger Summary
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click any member to open full transaction statement modal
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExportSummaryModalOpen(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-900 transition whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Summary</span>
            </button>
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-900 transition whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Full A4 Report</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3 whitespace-nowrap">Member</th>
                <th className="py-2.5 px-3 text-center whitespace-nowrap">Actual Meals</th>
                <th className="py-2.5 px-3 text-center whitespace-nowrap">Effective Meals</th>
                <th className="py-2.5 px-3 text-right whitespace-nowrap">Effective Meal Rate</th>
                <th className="py-2.5 px-3 text-right whitespace-nowrap">Meal Cost (Payable)</th>
                <th className="py-2.5 px-3 text-right whitespace-nowrap">Deposits</th>
                <th className="py-2.5 px-3 text-right whitespace-nowrap">Projected Cost</th>
                <th className="py-2.5 px-3 text-right whitespace-nowrap">Net Status & Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {useMess().memberSummaries.map((s) => (
                <tr
                  key={s.member.id}
                  onClick={() => setSelectedMemberForStatement(s.member)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition"
                >
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {s.member.avatarUrl ? (
                        <img
                          src={s.member.avatarUrl}
                          alt={s.member.name}
                          className="w-6 h-6 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                        />
                      ) : (
                        <div
                          className={`w-6 h-6 rounded-full ${s.member.avatarColor} text-[10px] font-bold flex items-center justify-center shrink-0`}
                        >
                          {s.member.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                      )}
                      <span className="truncate">{s.member.name}</span>
                      {s.member.role === 'Manager' && (
                        <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded text-[9px] font-bold whitespace-nowrap">
                          Manager
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-center font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    {s.actualMeals}
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                    <span>{s.effectiveMeals}</span>
                    {s.effectiveMeals > s.actualMeals && (
                      <span className="ml-1.5 inline-block text-[9px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-1 py-0.2 rounded font-semibold whitespace-nowrap">
                        45 Min
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    ৳ {effectiveMealRate.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    ৳ {s.mealCost.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                    ৳ {s.totalDeposits.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    ৳ {(s.projectedMealCost || 0).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {s.isLowBalance && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800">
                          ⚠️ Low Deposit
                        </span>
                      )}
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap ${
                          s.statusLabel === 'Credit'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : s.statusLabel === 'Due'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {s.netBalance > 0
                          ? `+ ৳ ${s.netBalance.toLocaleString()}`
                          : s.netBalance < 0
                          ? `- ৳ ${Math.abs(s.netBalance).toLocaleString()}`
                          : 'Settled'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Close Month / Start New Cycle Modal */}
      {isCloseMonthConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-indigo-500" />
                <span>Close Month & Start New Cycle</span>
              </h3>
              <button
                onClick={() => setIsCloseMonthConfirmOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <p className="font-semibold text-slate-900 dark:text-white">
                Are you sure you want to close financial period for <span className="underline">{currentPeriod.label}</span>?
              </p>
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="flex justify-between">
                  <span>Total Market Expenses:</span>
                  <span className="font-bold text-slate-900 dark:text-white">৳ {totalMarketExpense.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Utility Costs:</span>
                  <span className="font-bold text-slate-900 dark:text-white">৳ {totalUtilityExpense.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Manager Cash In Hand:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">৳ {managerCashBalance.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 rounded-lg text-indigo-900 dark:text-indigo-200 text-[11px] leading-relaxed">
                <strong>What happens when you close the month:</strong>
                <ul className="list-disc pl-4 mt-1 space-y-0.5">
                  <li>{currentPeriod.label} will be archived in read-only mode.</li>
                  <li>Members' net balances (Credit or Due) will carry forward into their opening balance for the next month.</li>
                  <li>Daily meal counts reset to 0 for the new month cycle.</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setIsCloseMonthConfirmOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  closeMonthAndStartNewCycle();
                  setIsCloseMonthConfirmOpen(false);
                }}
                className="px-5 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm"
              >
                Confirm & Start New Cycle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
