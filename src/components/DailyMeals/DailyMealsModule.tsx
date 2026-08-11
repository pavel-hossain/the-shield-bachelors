import React, { useState } from 'react';
import { useMess } from '../../context/MessContext';
import {
  Utensils,
  Calendar,
  Plus,
  Minus,
  Copy,
  Trash2,
  CheckCircle2,
  History,
  Search,
  FileText,
  AlertCircle,
  UserX,
  UserCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { DailyMealMatrixPDFModal } from '../Reports/DailyMealMatrixPDFModal';

export const DailyMealsModule: React.FC = () => {
  const {
    currentPeriod,
    members,
    meals,
    upsertMealRecord,
    setAllMealsForDate,
    copyPreviousDayMeals,
    clearMealsForDate,
    effectiveMealRate,
    isManagerMode,
  } = useMess();

  const [activeSubTab, setActiveSubTab] = useState<'grid' | 'logs'>('grid');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Selected date defaults to today or 2026-08-09
  const todayStr = `${currentPeriod.year}-${currentPeriod.month < 10 ? '0' + currentPeriod.month : currentPeriod.month}-09`;
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Search filter for logs sub-tab
  const [logSearch, setLogSearch] = useState('');

  // Action feedback alert
  const [actionFeedback, setActionFeedback] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const activeMembers = members.filter((m) => m.status === 'Active');

  // Days in selected month
  const daysInMonth = new Date(currentPeriod.year, currentPeriod.month, 0).getDate();
  const dayNumbers = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Quick meal increment helper
  const handleMealChange = (
    memberId: string,
    type: 'breakfast' | 'lunch' | 'dinner',
    val: number
  ) => {
    const existing = meals.find((m) => m.date === selectedDate && m.memberId === memberId);
    let b = existing ? Number(existing.breakfast) || 0 : 0;
    let l = existing ? Number(existing.lunch) || 0 : 0;
    let d = existing ? Number(existing.dinner) || 0 : 0;

    if (type === 'breakfast') b = Math.max(0, val);
    if (type === 'lunch') l = Math.max(0, val);
    if (type === 'dinner') d = Math.max(0, val);

    upsertMealRecord(selectedDate, memberId, b, l, d);
  };

  // Auto-populate meals from previous day
  const handleAutoPopulate = () => {
    const res = copyPreviousDayMeals(selectedDate);
    if (res.success) {
      setActionFeedback({
        type: 'success',
        message: `Successfully auto-populated daily meal counts for ${res.count} members from ${
          res.isFallback ? 'latest recorded date (' + res.sourceDate + ')' : 'previous day (' + res.sourceDate + ')'
        }. You can now adjust exceptions for any absent members below.`,
      });
    } else {
      setActionFeedback({
        type: 'error',
        message: res.error || 'No previous meal records available to auto-populate from.',
      });
    }
    setTimeout(() => setActionFeedback(null), 6000);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header & Sub-Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Utensils className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Daily Meal Entry & Management</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Record breakfast, lunch, and dinner count for Police Line bachelors
          </p>
        </div>

        {/* Sub-Tabs Selector & Section PDF Download Button */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsPdfModalOpen(true)}
            className="flex items-center gap-1.5 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-xs whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export Meal Matrix PDF</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveSubTab('grid')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition whitespace-nowrap ${
                activeSubTab === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Daily Input Grid
            </button>
            <button
              onClick={() => setActiveSubTab('logs')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition whitespace-nowrap ${
                activeSubTab === 'logs'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>History & Logs</span>
            </button>
          </div>
        </div>
      </div>

      {activeSubTab === 'grid' ? (
        <>
          {/* Action Feedback Banner */}
          {actionFeedback && (
            <div
              className={`p-3.5 rounded-xl border flex items-center justify-between gap-2 text-xs font-semibold shadow-xs animate-fade-in ${
                actionFeedback.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : actionFeedback.type === 'error'
                  ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                  : 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {actionFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                )}
                <span>{actionFeedback.message}</span>
              </div>
              <button
                onClick={() => setActionFeedback(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                ✕
              </button>
            </div>
          )}

          {/* Manager Auto-Populate Smart Feature Banner */}
          {isManagerMode && (
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 dark:from-emerald-950/50 dark:via-teal-950/40 dark:to-indigo-950/40 border border-emerald-200/80 dark:border-emerald-800/80 p-3.5 sm:p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-600 text-white shrink-0 shadow-xs">
                  <Copy className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Auto-Populate From Previous Day</span>
                    <span className="text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      ⚡ Quick Manager Helper
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                    Automatically copy all member meal counts from yesterday into {selectedDate}. You only need to adjust exceptions below for absent members.
                  </p>
                </div>
              </div>
              <button
                onClick={handleAutoPopulate}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm shrink-0 active:scale-95"
              >
                <Zap className="w-3.5 h-3.5 fill-current text-amber-300" />
                <span>Auto-Populate From Prev Day</span>
              </button>
            </div>
          )}

          {/* Date Selector & Quick Action Bar */}
          <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                  Target Date:
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-3 py-1.5 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Quick Batch Actions */}
              {isManagerMode ? (
                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                  <button
                    onClick={handleAutoPopulate}
                    className="flex items-center gap-1 bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-500 hover:to-teal-500 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold transition shadow-xs whitespace-nowrap"
                    title="Copy meal counts from previous day"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Auto-Populate Prev Day</span>
                  </button>
                  <button
                    onClick={() => {
                      setAllMealsForDate(selectedDate, 0.5, 1, 1);
                      setActionFeedback({
                        type: 'info',
                        message: `Set default 2.5 meals (0.5 B, 1 L, 1 D) for all ${activeMembers.length} active members on ${selectedDate}.`,
                      });
                      setTimeout(() => setActionFeedback(null), 5000);
                    }}
                    className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Set All Default (2.5)</span>
                  </button>
                  <button
                    onClick={() => {
                      clearMealsForDate(selectedDate);
                      setActionFeedback({
                        type: 'info',
                        message: `Cleared all meal records for ${selectedDate}.`,
                      });
                      setTimeout(() => setActionFeedback(null), 4000);
                    }}
                    className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Date</span>
                  </button>
                </div>
              ) : (
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                  🔒 Member Read-Only View
                </div>
              )}
            </div>

            {/* Daily Summary Bar */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
              <span>
                Total Active Members: <strong className="text-slate-900 dark:text-white">{activeMembers.length}</strong>
              </span>
              <span>
                Total Meals on {selectedDate}:{' '}
                <strong className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {meals
                    .filter((m) => m.date === selectedDate)
                    .reduce(
                      (sum, m) =>
                        sum +
                        (Number(m.breakfast) || 0) +
                        (Number(m.lunch) || 0) +
                        (Number(m.dinner) || 0),
                      0
                    )}{' '}
                  Meals
                </strong>
              </span>
            </div>
          </div>

          {/* Individual Member Meal Input Grid */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Meal Input Grid ({selectedDate})
              </h3>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {isManagerMode
                  ? 'Auto-populate previous day or adjust exceptions below'
                  : 'View member daily meal counts'}
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {activeMembers.map((member) => {
                const record = meals.find((m) => m.date === selectedDate && m.memberId === member.id);
                const b = record ? Number(record.breakfast) || 0 : 0;
                const l = record ? Number(record.lunch) || 0 : 0;
                const d = record ? Number(record.dinner) || 0 : 0;
                const memberDayTotal = b + l + d;
                const isAbsent = memberDayTotal === 0;

                return (
                  <div
                    key={member.id}
                    className={`p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition ${
                      isAbsent
                        ? 'bg-amber-50/30 dark:bg-amber-950/10 hover:bg-amber-50/60 dark:hover:bg-amber-950/20'
                        : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/30'
                    }`}
                  >
                    {/* Member Details */}
                    <div className="flex items-center justify-between sm:justify-start gap-2.5 min-w-[200px]">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-9 h-9 rounded-full ${member.avatarColor} font-bold text-xs flex items-center justify-center shrink-0`}
                        >
                          {member.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                              {member.name}
                            </h4>
                            {isAbsent && (
                              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800 shrink-0">
                                Absent
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                            Room {member.roomNo}
                          </span>
                        </div>
                      </div>

                      {/* Quick Exception Adjustment Button for Manager */}
                      {isManagerMode && (
                        <div className="sm:hidden">
                          {isAbsent ? (
                            <button
                              onClick={() => upsertMealRecord(selectedDate, member.id, 0.5, 1, 1)}
                              className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 px-2 py-1 rounded border border-emerald-200 dark:border-emerald-800"
                            >
                              <UserCheck className="w-3 h-3" />
                              <span>Present (2.5)</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => upsertMealRecord(selectedDate, member.id, 0, 0, 0)}
                              className="flex items-center gap-1 text-[10px] font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/80 hover:bg-rose-100 px-2 py-1 rounded border border-rose-200 dark:border-rose-900"
                            >
                              <UserX className="w-3 h-3" />
                              <span>Mark Absent</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Meal Inputs (Breakfast, Lunch, Dinner) */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 flex-1">
                      {/* Breakfast */}
                      <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col items-center">
                        <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                          Breakfast
                        </span>
                        <div className="flex items-center gap-1 w-full justify-center">
                          {isManagerMode && (
                            <button
                              onClick={() => handleMealChange(member.id, 'breakfast', Math.max(0, b - 0.5))}
                              className="p-1 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                          )}
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            value={b}
                            disabled={!isManagerMode}
                            onChange={(e) =>
                              handleMealChange(
                                member.id,
                                'breakfast',
                                Math.max(0, parseFloat(e.target.value) || 0)
                              )
                            }
                            className={`w-12 text-center font-bold text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded py-0.5 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                              !isManagerMode ? 'opacity-80 cursor-not-allowed' : ''
                            }`}
                          />
                          {isManagerMode && (
                            <button
                              onClick={() => handleMealChange(member.id, 'breakfast', b + 0.5)}
                              className="p-1 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Lunch */}
                      <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col items-center">
                        <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                          Lunch
                        </span>
                        <div className="flex items-center gap-1 w-full justify-center">
                          {isManagerMode && (
                            <button
                              onClick={() => handleMealChange(member.id, 'lunch', Math.max(0, l - 1))}
                              className="p-1 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                          )}
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            value={l}
                            disabled={!isManagerMode}
                            onChange={(e) =>
                              handleMealChange(
                                member.id,
                                'lunch',
                                Math.max(0, parseFloat(e.target.value) || 0)
                              )
                            }
                            className={`w-12 text-center font-bold text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded py-0.5 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                              !isManagerMode ? 'opacity-80 cursor-not-allowed' : ''
                            }`}
                          />
                          {isManagerMode && (
                            <button
                              onClick={() => handleMealChange(member.id, 'lunch', l + 1)}
                              className="p-1 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Dinner */}
                      <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col items-center">
                        <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                          Dinner
                        </span>
                        <div className="flex items-center gap-1 w-full justify-center">
                          {isManagerMode && (
                            <button
                              onClick={() => handleMealChange(member.id, 'dinner', Math.max(0, d - 1))}
                              className="p-1 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                          )}
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            value={d}
                            disabled={!isManagerMode}
                            onChange={(e) =>
                              handleMealChange(
                                member.id,
                                'dinner',
                                Math.max(0, parseFloat(e.target.value) || 0)
                              )
                            }
                            className={`w-12 text-center font-bold text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded py-0.5 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                              !isManagerMode ? 'opacity-80 cursor-not-allowed' : ''
                            }`}
                          />
                          {isManagerMode && (
                            <button
                              onClick={() => handleMealChange(member.id, 'dinner', d + 1)}
                              className="p-1 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quick Exception Adjustment Button (Desktop) & Day Total Badge */}
                    <div className="flex items-center gap-2 justify-between sm:justify-end border-t sm:border-t-0 border-slate-100 dark:border-slate-800 pt-2 sm:pt-0 shrink-0">
                      {isManagerMode && (
                        <div className="hidden sm:block">
                          {isAbsent ? (
                            <button
                              onClick={() => upsertMealRecord(selectedDate, member.id, 0.5, 1, 1)}
                              className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 transition whitespace-nowrap"
                              title="Quickly set standard 2.5 meals"
                            >
                              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Set Present (2.5)</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => upsertMealRecord(selectedDate, member.id, 0, 0, 0)}
                              className="flex items-center gap-1 text-[11px] font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/80 hover:bg-rose-100 dark:hover:bg-rose-900/60 px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-900 transition whitespace-nowrap"
                              title="Mark member absent (sets breakfast, lunch & dinner to 0)"
                            >
                              <UserX className="w-3.5 h-3.5 text-rose-500" />
                              <span>Mark Absent</span>
                            </button>
                          )}
                        </div>
                      )}

                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-black whitespace-nowrap ${
                          isAbsent
                            ? 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {memberDayTotal} Meals
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Full Month Matrix View (Scrollable Grid) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Monthly Meal Matrix ({currentPeriod.label})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-2 text-left sticky left-0 bg-slate-100 dark:bg-slate-800 z-10 whitespace-nowrap min-w-[120px]">
                      Member
                    </th>
                    {dayNumbers.map((d) => (
                      <th
                        key={d}
                        onClick={() =>
                          setSelectedDate(
                            `${currentPeriod.year}-${currentPeriod.month < 10 ? '0' + currentPeriod.month : currentPeriod.month}-${d < 10 ? '0' + d : d}`
                          )
                        }
                        className="p-1.5 cursor-pointer hover:bg-emerald-200 dark:hover:bg-emerald-900 transition whitespace-nowrap min-w-[32px]"
                        title={`Click to edit Day ${d}`}
                      >
                        {d}
                      </th>
                    ))}
                    <th className="p-2 bg-emerald-600 text-white font-bold sticky right-0 z-10 whitespace-nowrap">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {activeMembers.map((member) => {
                    let memberMonthTotal = 0;
                    return (
                      <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="p-2 text-left font-bold text-slate-900 dark:text-white sticky left-0 bg-white dark:bg-slate-900 shadow-sm whitespace-nowrap">
                          {member.name.split(' ')[0]}
                        </td>
                        {dayNumbers.map((d) => {
                          const dateStr = `${currentPeriod.year}-${currentPeriod.month < 10 ? '0' + currentPeriod.month : currentPeriod.month}-${d < 10 ? '0' + d : d}`;
                          const record = meals.find(
                            (m) => m.date === dateStr && m.memberId === member.id
                          );
                          const dayTotal = record
                            ? (Number(record.breakfast) || 0) +
                              (Number(record.lunch) || 0) +
                              (Number(record.dinner) || 0)
                            : 0;
                          memberMonthTotal += dayTotal;

                          return (
                            <td
                              key={d}
                              className={`p-1.5 font-semibold text-[11px] ${
                                dayTotal > 0
                                  ? 'text-slate-900 dark:text-slate-100'
                                  : 'text-slate-300 dark:text-slate-700'
                              }`}
                            >
                              {dayTotal > 0 ? dayTotal : '-'}
                            </td>
                          );
                        })}
                        <td className="p-2 font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 sticky right-0 z-10 whitespace-nowrap">
                          {memberMonthTotal}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Daily Meals History & Logs Sub-Tab */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs p-4 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search meal logs by member or date..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg pl-9 pr-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Showing date-wise chronological meal logs
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-2.5 px-3 whitespace-nowrap">Date</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Member</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap">Breakfast</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap">Lunch</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap">Dinner</th>
                  <th className="py-2.5 px-3 text-right whitespace-nowrap">Total Meals</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {meals
                  .filter((m) => {
                    const mem = members.find((x) => x.id === m.memberId);
                    const name = mem ? mem.name.toLowerCase() : '';
                    return name.includes(logSearch.toLowerCase()) || m.date.includes(logSearch);
                  })
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((m) => {
                    const mem = members.find((x) => x.id === m.memberId);
                    const total =
                      (Number(m.breakfast) || 0) + (Number(m.lunch) || 0) + (Number(m.dinner) || 0);

                    return (
                      <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                          {m.date}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                          {mem ? mem.name : 'Unknown'}
                        </td>
                        <td className="py-2.5 px-3 text-center text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {m.breakfast}
                        </td>
                        <td className="py-2.5 px-3 text-center text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {m.lunch}
                        </td>
                        <td className="py-2.5 px-3 text-center text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {m.dinner}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                          {total} Meals
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Daily Meal Matrix PDF Report Modal */}
      <DailyMealMatrixPDFModal isOpen={isPdfModalOpen} onClose={() => setIsPdfModalOpen(false)} />
    </div>
  );
};
