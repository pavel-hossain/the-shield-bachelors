import React, { useState, useEffect } from 'react';
import { useMess } from '../../context/MessContext';
import {
  Clock,
  Bell,
  AlertCircle,
  CheckCircle2,
  Share2,
  Send,
  MessageSquare,
  Users,
  Calendar,
  Sparkles,
  Utensils,
  ChevronRight,
  UserCheck,
  Zap,
} from 'lucide-react';

interface MealCountRemindersProps {
  compact?: boolean;
}

export const MealCountReminders: React.FC<MealCountRemindersProps> = ({ compact = false }) => {
  const {
    members,
    meals,
    currentPeriod,
    messProfile,
    upsertMealRecord,
    isManagerMode,
    setIsMealReminderModalOpen,
  } = useMess();

  const todayStr = `${currentPeriod.year}-${currentPeriod.month < 10 ? '0' + currentPeriod.month : currentPeriod.month}-09`;
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedMealTarget, setSelectedMealTarget] = useState<'All' | 'Lunch' | 'Dinner' | 'Breakfast'>('Dinner');
  const [language, setLanguage] = useState<'bn' | 'banglish' | 'en'>('banglish');
  const [copiedText, setCopiedText] = useState(false);
  const [customNotice, setCustomNotice] = useState('');

  // Active members
  const activeMembers = members.filter((m) => m.status === 'Active');

  // Find members who have missing or 0 meals for the selected date
  const dateMeals = meals.filter((m) => m.date === selectedDate);
  const unrecordedMembers = activeMembers.filter((m) => {
    const record = dateMeals.find((rec) => rec.memberId === m.id);
    if (!record) return true;
    if (selectedMealTarget === 'Breakfast') return (record.breakfast || 0) === 0;
    if (selectedMealTarget === 'Lunch') return (record.lunch || 0) === 0;
    if (selectedMealTarget === 'Dinner') return (record.dinner || 0) === 0;
    return (record.breakfast || 0) + (record.lunch || 0) + (record.dinner || 0) === 0;
  });

  const recordedCount = activeMembers.length - unrecordedMembers.length;

  // Cut-off rules definition
  const cutoffs = [
    {
      meal: 'Breakfast',
      serving: messProfile.breakfastTime || '08:00 AM - 09:30 AM',
      cutoff: '10:00 PM (Previous Night)',
      status: 'Closed',
      statusColor: 'rose',
    },
    {
      meal: 'Lunch',
      serving: messProfile.lunchTime || '01:30 PM - 03:00 PM',
      cutoff: '09:00 AM (Morning)',
      status: 'Closed',
      statusColor: 'amber',
    },
    {
      meal: 'Dinner',
      serving: messProfile.dinnerTime || '09:00 PM - 10:30 PM',
      cutoff: '05:00 PM (Evening)',
      status: 'Open Now (Urgent)',
      statusColor: 'emerald',
    },
  ];

  // Message template generator
  const getReminderMessage = () => {
    const unrecordedNames = unrecordedMembers.map((m) => m.name).join(', ') || 'None (All logged!)';

    if (language === 'bn') {
      return `📢 *জরুরি মিল রিমাইন্ডার — ${messProfile.name || 'দি শিল্ড মেস'}*\n📅 তারিখ: *${selectedDate}* (${selectedMealTarget} মিল)\n\nঅনুগ্রহ করে কাট-অফ সময় (বিকাল ৫:০০ টা) এর মধ্যে আপনার মিল নিশ্চিত করুন। খালা রান্না শুরু করবেন।\n\n⚠️ *যাদের এন্ট্রি বাকি (${unrecordedMembers.length} জন):*\n${unrecordedNames}\n\nধন্যবাদ,\n— ম্যানেজার (${messProfile.managerPhone || '01712345678'})`;
    }

    if (language === 'banglish') {
      return `📢 *Urgent Meal Confirmation Notice — ${messProfile.name || 'The Shield Mess'}*\n📅 Date: *${selectedDate}* (${selectedMealTarget} Meal)\n\nBhai shobai cut-off time (5:00 PM) er moddhe meal count update korun. Cook khala cooking start korben.\n\n⚠️ *Pending Entries (${unrecordedMembers.length} members):*\n${unrecordedNames}\n\nThanks,\n— Manager (${messProfile.managerPhone || '01712345678'})`;
    }

    return `📢 *Meal Entry Reminder — ${messProfile.name || 'The Shield Mess'}*\n📅 Date: *${selectedDate}* (${selectedMealTarget} Meal)\n\nPlease submit or verify your meal count before the 5:00 PM cut-off time to prevent food wastage.\n\n⚠️ *Pending Members (${unrecordedMembers.length}):*\n${unrecordedNames}\n\nRegards,\n— Manager (${messProfile.managerPhone || '01712345678'})`;
  };

  const handleBroadcastWhatsApp = () => {
    const text = getReminderMessage() + (customNotice ? `\n\n📌 Note: ${customNotice}` : '');
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);

    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleQuickLogDefault = (memberId: string) => {
    upsertMealRecord(selectedDate, memberId, 0.5, 1, 1);
  };

  const handleLogZero = (memberId: string) => {
    upsertMealRecord(selectedDate, memberId, 0, 0, 0);
  };

  if (compact) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 text-white p-3.5 rounded-xl border border-indigo-900/40 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">Meal Reminders</div>
              <div className="text-[10px] text-amber-300">
                {unrecordedMembers.length} member(s) pending for today
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsMealReminderModalOpen(true)}
            className="text-[11px] font-semibold text-indigo-300 hover:text-white flex items-center gap-1 transition cursor-pointer"
          >
            <span>Notify</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Live Cut-Off Ticker */}
        <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Dinner Cut-off: <strong>5:00 PM</strong></span>
          </div>
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
            Active Now
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-5 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center shadow-md">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Meal Count Cut-Off & Reminder Dispatcher</span>
              <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                1-Click Dispatch
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enforce breakfast, lunch, and dinner cut-offs and notify pending boarders before cooking begins
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleBroadcastWhatsApp}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{copiedText ? 'Copied & Opened!' : 'Broadcast to WhatsApp Group'}</span>
          </button>
        </div>
      </div>

      {/* Official Cut-Off Schedule Cards */}
      <div>
        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-indigo-500" />
          <span>Official Mess Dining & Cut-Off Schedule</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {cutoffs.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-50 dark:bg-slate-800/70 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{item.meal}</span>
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.statusColor === 'emerald'
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      : item.statusColor === 'amber'
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                Cut-off: <strong>{item.cutoff}</strong>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Serving Time: {item.serving}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls & Unrecorded Scanner */}
      <div className="bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Target Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Meal Filter</label>
              <select
                value={selectedMealTarget}
                onChange={(e) => setSelectedMealTarget(e.target.value as any)}
                className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 dark:text-white"
              >
                <option value="All">Full Day (All 3 Meals)</option>
                <option value="Dinner">Dinner</option>
                <option value="Lunch">Lunch</option>
                <option value="Breakfast">Breakfast</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Message Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 dark:text-white"
              >
                <option value="banglish">Banglish (বাংলা + English)</option>
                <option value="bn">Bangla (বাংলা)</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              Status: <span className="text-emerald-600 dark:text-emerald-400">{recordedCount}</span> / {activeMembers.length} logged
            </div>
            <div className="text-[11px] text-rose-500 font-semibold">
              {unrecordedMembers.length} pending entries
            </div>
          </div>
        </div>

        {/* Unrecorded Members List with 1-Click Action */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>Pending Members for {selectedDate} ({unrecordedMembers.length})</span>
            </h5>
            {unrecordedMembers.length === 0 && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>All active members logged!</span>
              </span>
            )}
          </div>

          {unrecordedMembers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {unrecordedMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2 shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700 font-bold text-xs flex items-center justify-center text-slate-700 dark:text-slate-300">
                      {member.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {member.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {member.roomNo ? `Room ${member.roomNo}` : member.role} • {member.phone}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleQuickLogDefault(member.id)}
                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[10px] font-bold px-2 py-1 rounded-md transition cursor-pointer"
                      title="Quick mark 0.5 - 1 - 1"
                    >
                      + Standard
                    </button>
                    <button
                      onClick={() => handleLogZero(member.id)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 text-[10px] font-semibold px-2 py-1 rounded-md transition cursor-pointer"
                      title="Mark OFF (0 meals)"
                    >
                      OFF (0)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-center text-xs text-emerald-800 dark:text-emerald-300 font-bold">
              🎉 Great job! All active boarders have registered their meal count for this date.
            </div>
          )}
        </div>
      </div>

      {/* Message Preview Box */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
          <span>Live Generated Notification Bulletin (Preview)</span>
          <span className="text-[10px] text-slate-400 font-normal">Ready to send via WhatsApp / SMS</span>
        </label>
        <div className="bg-slate-900 text-slate-100 p-3.5 rounded-xl font-mono text-xs whitespace-pre-wrap leading-relaxed border border-slate-800 shadow-inner">
          {getReminderMessage()}
        </div>
      </div>
    </div>
  );
};
