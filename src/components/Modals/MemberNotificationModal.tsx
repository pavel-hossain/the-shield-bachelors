import React, { useState } from 'react';
import { useMess } from '../../context/MessContext';
import {
  Bell,
  X,
  Send,
  MessageSquare,
  Smartphone,
  Mail,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Users,
  Settings,
  Flame,
  Check,
  Globe,
  DollarSign,
  Calendar,
  Sparkles,
  ShoppingBag,
  Info,
} from 'lucide-react';
import { Member } from '../../types';

export const MemberNotificationModal: React.FC = () => {
  const {
    isNotificationModalOpen,
    setIsNotificationModalOpen,
    notificationSettings,
    updateNotificationSettings,
    members,
    overdueMembers,
    lowBalanceMembers,
    currentPeriod,
    actualMealRate,
    memberSummaries,
    meals,
  } = useMess();

  const [activeTab, setActiveTab] = useState<'dispatch' | 'settings' | 'members'>('dispatch');
  const [selectedTemplate, setSelectedTemplate] = useState<'low_balance' | 'daily_meals' | 'monthly_bill' | 'market_duty' | 'custom'>('low_balance');
  const [selectedMemberId, setSelectedMemberId] = useState<string>(members[0]?.id || '');
  const [customMessage, setCustomMessage] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sendSuccessToast, setSendSuccessToast] = useState<string | null>(null);

  if (!isNotificationModalOpen) return null;

  const selectedMember = members.find((m) => m.id === selectedMemberId) || members[0];
  const memberSummary = memberSummaries.find((s) => s.member.id === selectedMember?.id);

  // Today's Date
  const todayStr = new Date().toISOString().split('T')[0];
  const todayMeals = meals.filter((m) => m.date === todayStr);

  // Generate Message Content based on template and language
  const generateMessage = (member: Member, templateKey: string) => {
    const pref = notificationSettings.memberPreferences?.[member.id] || {
      enabled: true,
      preferredLanguage: 'banglish',
    };
    const lang = pref.preferredLanguage || 'banglish';
    const sum = memberSummaries.find((s) => s.member.id === member.id);
    const dueAmount = sum && sum.netBalance < 0 ? Math.abs(sum.netBalance) : 0;
    const bKash = notificationSettings.bKashNumber || '01948545255';
    const nagad = notificationSettings.nagadNumber || '01948545255';
    const rocket = notificationSettings.rocketNumber || '018776890414';
    const dbbl = notificationSettings.bankAccountDetails || 'Dutch Bangla Bank: 2281600015015';

    if (templateKey === 'low_balance') {
      if (lang === 'bn') {
        return `আসসালামু আলাইকুম ${member.name},
দ্য শিল্ড ব্যাচেলরস মেস (${currentPeriod.label}) থেকে জানাচ্ছি:
আপনার বর্তমান বকেয়া: ৳ ${dueAmount.toLocaleString()}।
দয়া করে দ্রুত মেস ফান্ডে বিকাশ/নগদ (${bKash}), রকেট (${rocket}) অথবা ডাচ্-বাংলা ব্যাংক (${dbbl})-এ ডিপোজিট সম্পন্ন করুন।
ধন্যবাদ! - ${notificationSettings.managerContactName}`;
      } else if (lang === 'en') {
        return `Hello ${member.name},
Reminder from The Shield Bachelors Mess (${currentPeriod.label}):
Your current due balance is BDT ${dueAmount.toLocaleString()}.
Payment Methods:
• bKash / Nagad: ${bKash}
• Rocket: ${rocket}
• DBBL A/C: 2281600015015
Please clear your deposit at your earliest convenience.
Thank you! - ${notificationSettings.managerContactName}`;
      } else {
        return `Hello ${member.name} bhai,
The Shield Bachelors Mess (${currentPeriod.label}) reminder:
Apnar current due balance: ৳ ${dueAmount.toLocaleString()}.
Kindly deposit clear korun:
• bKash/Nagad: ${bKash}
• Rocket: ${rocket}
• Dutch Bangla Bank: 2281600015015
Dhonnobad! - ${notificationSettings.managerContactName}`;
      }
    }

    if (templateKey === 'daily_meals') {
      const todayRec = meals.find((m) => m.date === todayStr && m.memberId === member.id);
      const b = todayRec ? todayRec.breakfast : 0;
      const l = todayRec ? todayRec.lunch : 0;
      const d = todayRec ? todayRec.dinner : 0;
      const total = b + l + d;

      if (lang === 'bn') {
        return `প্রিয় ${member.name},
আজকের (${todayStr}) মেস মিল এন্ট্রি:
সকাল: ${b} | দুপুর: ${l} | রাত: ${d} | মোট: ${total} মিল।
কোনো সংশোধন থাকলে রাত ১০টার মধ্যে ম্যানেজারকে জানান।
- দ্য শিল্ড মেস`;
      } else {
        return `Hello ${member.name},
Today's (${todayStr}) Meal Record:
Breakfast: ${b} | Lunch: ${l} | Dinner: ${d} | Total: ${total} meals.
Let the manager know if any correction is needed.
- The Shield Mess`;
      }
    }

    if (templateKey === 'monthly_bill') {
      const actualMeals = sum ? sum.actualMeals : 0;
      const effectiveMeals = sum ? sum.effectiveMeals : 0;
      const payable = sum ? sum.totalPayable : 0;
      const deposited = sum ? sum.totalDeposits : 0;
      const net = sum ? sum.netBalance : 0;

      return `📄 The Shield Bachelors Mess — Final Statement (${currentPeriod.label})
Member: ${member.name} (Room ${member.roomNo})
-----------------------------------
Actual Meals: ${actualMeals}
Effective Meals: ${effectiveMeals}
Meal Rate: ৳ ${actualMealRate.toFixed(2)}
Total Payable: ৳ ${payable.toLocaleString()}
Total Deposits: ৳ ${deposited.toLocaleString()}
Status: ${net >= 0 ? `Credit (Refundable) ৳ ${net.toLocaleString()}` : `Due Payable ৳ ${Math.abs(net).toLocaleString()}`}
-----------------------------------
Pay to:
• bKash / Nagad: ${bKash}
• Rocket: ${rocket}
• Dutch Bangla Bank: 2281600015015
- Manager, The Shield Mess`;
    }

    if (templateKey === 'market_duty') {
      return `🛒 Bazar Duty Alert — The Shield Mess
Hello ${member.name},
You are scheduled for Mess Market Shopping on tomorrow morning.
Please collect the shopping budget & list from Manager (${notificationSettings.managerContactPhone}).
- The Shield Bachelors Mess`;
    }

    return customMessage || `Notice from The Shield Bachelors Mess: Please check the mess board.`;
  };

  const currentPreviewMessage = selectedMember
    ? generateMessage(selectedMember, selectedTemplate)
    : '';

  // Trigger WhatsApp Web / App
  const handleSendWhatsApp = (member: Member, customText?: string) => {
    const text = customText || generateMessage(member, selectedTemplate);
    const cleanPhone = member.phone.replace(/[^0-9]/g, '');
    const fullPhone = cleanPhone.startsWith('88') ? cleanPhone : `88${cleanPhone}`;
    window.open(`https://wa.me/${fullPhone}?text=${encodeURIComponent(text)}`, '_blank');
    setSendSuccessToast(`WhatsApp opened for ${member.name}`);
    setTimeout(() => setSendSuccessToast(null), 3000);
  };

  // Trigger SMS Link
  const handleSendSMS = (member: Member, customText?: string) => {
    const text = customText || generateMessage(member, selectedTemplate);
    const cleanPhone = member.phone.replace(/[^0-9]/g, '');
    window.open(`sms:${cleanPhone}?body=${encodeURIComponent(text)}`, '_blank');
    setSendSuccessToast(`SMS client opened for ${member.name}`);
    setTimeout(() => setSendSuccessToast(null), 3000);
  };

  // Copy to clipboard
  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xs shrink-0">
              <Bell className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                Member Notification & Alert Dispatcher
              </h2>
              <p className="text-xs text-emerald-100 font-medium">
                WhatsApp, SMS & Daily Alert Dispatch Hub • {currentPeriod.label}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsNotificationModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-2 bg-slate-50 dark:bg-slate-900/50 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dispatch')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'dispatch'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Alerts & Broadcasts</span>
          </button>

          <button
            onClick={() => setActiveTab('members')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'members'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Member Toggles & Language</span>
            <span className="px-1.5 py-0.2 bg-white/20 rounded-full text-[10px]">
              {members.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Channel & bKash Config</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {sendSuccessToast && (
            <div className="p-3 bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center justify-between shadow-md animate-in slide-in-from-top duration-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{sendSuccessToast}</span>
              </div>
              <button onClick={() => setSendSuccessToast(null)}>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* TAB 1: DISPATCHER */}
          {activeTab === 'dispatch' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Column: Template & Member Selection */}
              <div className="lg:col-span-5 space-y-4">
                {/* Template Selector */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
                    Choose Notification Event Template
                  </label>
                  <div className="grid grid-cols-1 gap-1.5">
                    {[
                      {
                        id: 'low_balance',
                        label: 'Due / Low Balance Reminder',
                        desc: 'Alerts member of negative balance with bKash/Nagad details',
                        icon: <DollarSign className="w-4 h-4 text-rose-500" />,
                      },
                      {
                        id: 'daily_meals',
                        label: 'Daily Meal Confirmation',
                        desc: "Summary of today's breakfast, lunch & dinner entries",
                        icon: <Calendar className="w-4 h-4 text-emerald-500" />,
                      },
                      {
                        id: 'monthly_bill',
                        label: 'Monthly Final Statement',
                        desc: 'Complete meal count, rate, utility share & net bill',
                        icon: <Sparkles className="w-4 h-4 text-indigo-500" />,
                      },
                      {
                        id: 'market_duty',
                        label: 'Bazar Shopping Duty Alert',
                        desc: 'Notifies member of tomorrow bazaar rotation',
                        icon: <ShoppingBag className="w-4 h-4 text-amber-500" />,
                      },
                      {
                        id: 'custom',
                        label: 'Custom Emergency / General Notice',
                        desc: 'Write custom message for quick dispatch',
                        icon: <MessageSquare className="w-4 h-4 text-teal-500" />,
                      },
                    ].map((tpl) => (
                      <button
                        key={tpl.id}
                        onClick={() => setSelectedTemplate(tpl.id as any)}
                        className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition cursor-pointer ${
                          selectedTemplate === tpl.id
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 ring-1 ring-emerald-500'
                            : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700/60 shrink-0">
                          {tpl.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                            {tpl.label}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                            {tpl.desc}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Member Dropdown */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
                    Target Member
                  </label>
                  <select
                    value={selectedMemberId}
                    onChange={(e) => setSelectedMemberId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {members.map((m) => {
                      const sum = memberSummaries.find((s) => s.member.id === m.id);
                      const isDue = sum && sum.netBalance < 0;
                      return (
                        <option key={m.id} value={m.id}>
                          {m.name} (Room {m.roomNo}) — {isDue ? `Due ৳${Math.abs(sum.netBalance)}` : `Credit ৳${sum?.netBalance || 0}`}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Custom Message input if custom template is chosen */}
                {selectedTemplate === 'custom' && (
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                      Custom Notice Text
                    </label>
                    <textarea
                      rows={3}
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="Type your notice or announcement here..."
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                )}
              </div>

              {/* Right Column: Live Message Preview & Direct Actions */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 shadow-md">
                  <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-slate-200">
                        Live Message Preview ({selectedMember?.name})
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopyText(currentPreviewMessage, 'preview')}
                      className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition"
                    >
                      {copiedId === 'preview' ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedId === 'preview' ? 'Copied' : 'Copy Text'}</span>
                    </button>
                  </div>

                  <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 leading-relaxed max-h-48 overflow-y-auto">
                    {currentPreviewMessage}
                  </pre>

                  {/* Quick Dispatch Buttons */}
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleSendWhatsApp(selectedMember)}
                      className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition shadow-md cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-100" />
                      <span>Send via WhatsApp</span>
                    </button>
                    <button
                      onClick={() => handleSendSMS(selectedMember)}
                      className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition shadow-md cursor-pointer"
                    >
                      <Smartphone className="w-4 h-4 text-indigo-100" />
                      <span>Send via SMS</span>
                    </button>
                  </div>
                </div>

                {/* Overdue Members Batch Dispatcher */}
                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
                      <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                        Overdue Members Deposit Reminders ({overdueMembers.length})
                      </h3>
                    </div>
                  </div>

                  {overdueMembers.length === 0 ? (
                    <div className="text-center py-4 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                      🎉 All members have cleared their deposits! No pending dues.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {overdueMembers.map((item) => (
                        <div
                          key={item.member.id}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900 dark:text-white">
                                {item.member.name}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 dark:bg-slate-700 rounded text-slate-500">
                                Room {item.member.roomNo}
                              </span>
                            </div>
                            <p className="text-xs font-black text-rose-600 dark:text-rose-400 mt-0.5">
                              Due: ৳ {item.dueAmount.toLocaleString()}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleSendWhatsApp(item.member, generateMessage(item.member, 'low_balance'))}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
                              title="Send WhatsApp Reminder"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </button>
                            <button
                              onClick={() => handleSendSMS(item.member, generateMessage(item.member, 'low_balance'))}
                              className="px-2 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px] font-medium transition"
                              title="Send SMS"
                            >
                              <Smartphone className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MEMBER PREFERENCES & TOGGLES */}
          {activeTab === 'members' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0" />
                <span>
                  Configure per-member notification language (Bangla, English, or Banglish) and opt-in settings.
                </span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-800/40">
                {members.map((member) => {
                  const pref = notificationSettings.memberPreferences?.[member.id] || {
                    enabled: true,
                    preferredLanguage: 'banglish',
                  };

                  return (
                    <div
                      key={member.id}
                      className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${member.avatarColor}`}>
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                              {member.name}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md font-medium">
                              Room {member.roomNo}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {member.phone}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            Role: {member.role} • Status: {member.status}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center flex-wrap">
                        {/* Language Selector */}
                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/60 p-1 rounded-xl">
                          <Globe className="w-3.5 h-3.5 text-slate-400 ml-1" />
                          <select
                            value={pref.preferredLanguage}
                            onChange={(e) => {
                              const updatedMap = {
                                ...notificationSettings.memberPreferences,
                                [member.id]: {
                                  ...pref,
                                  preferredLanguage: e.target.value as any,
                                },
                              };
                              updateNotificationSettings({ memberPreferences: updatedMap });
                            }}
                            className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none pr-1"
                          >
                            <option value="banglish">Banglish</option>
                            <option value="bn">বাংলা (Bengali)</option>
                            <option value="en">English</option>
                          </select>
                        </div>

                        {/* Opt-in Toggle */}
                        <button
                          onClick={() => {
                            const updatedMap = {
                              ...notificationSettings.memberPreferences,
                              [member.id]: {
                                ...pref,
                                enabled: !pref.enabled,
                              },
                            };
                            updateNotificationSettings({ memberPreferences: updatedMap });
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                            pref.enabled
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <CheckCircle2 className={`w-3.5 h-3.5 ${pref.enabled ? 'text-emerald-600' : 'text-slate-400'}`} />
                          <span>{pref.enabled ? 'Active' : 'Muted'}</span>
                        </button>

                        {/* Direct Test WhatsApp */}
                        <button
                          onClick={() => handleSendWhatsApp(member)}
                          className="p-1.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-xs"
                          title="Send quick WhatsApp message"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: CONFIGURATION & PAYMENT NUMBERS */}
          {activeTab === 'settings' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* bKash Number */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    bKash Deposit Number (Personal / Merchant)
                  </label>
                  <input
                    type="text"
                    value={notificationSettings.bKashNumber}
                    onChange={(e) => updateNotificationSettings({ bKashNumber: e.target.value })}
                    placeholder="01948545255"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Nagad Number */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Nagad Deposit Number
                  </label>
                  <input
                    type="text"
                    value={notificationSettings.nagadNumber}
                    onChange={(e) => updateNotificationSettings({ nagadNumber: e.target.value })}
                    placeholder="01948545255"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Rocket Number */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Rocket Deposit Number
                  </label>
                  <input
                    type="text"
                    value={notificationSettings.rocketNumber}
                    onChange={(e) => updateNotificationSettings({ rocketNumber: e.target.value })}
                    placeholder="018776890414"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Dutch Bangla Bank */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Dutch Bangla Bank (DBBL) Details
                  </label>
                  <input
                    type="text"
                    value={notificationSettings.bankAccountDetails || 'Dutch Bangla Bank: 2281600015015'}
                    onChange={(e) => updateNotificationSettings({ bankAccountDetails: e.target.value })}
                    placeholder="Dutch Bangla Bank: 2281600015015"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Manager Name */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Manager Display Name (for message signatures)
                  </label>
                  <input
                    type="text"
                    value={notificationSettings.managerContactName}
                    onChange={(e) => updateNotificationSettings({ managerContactName: e.target.value })}
                    placeholder="Aktar Hossain"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Manager Contact Phone */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Manager Contact Phone
                  </label>
                  <input
                    type="text"
                    value={notificationSettings.managerContactPhone}
                    onChange={(e) => updateNotificationSettings({ managerContactPhone: e.target.value })}
                    placeholder="01948545255"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Channels Toggles */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider">
                  Dispatch Channels & Gateways
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <MessageSquare className="w-4 h-4 text-emerald-600" />
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">WhatsApp Web / API</p>
                        <p className="text-[10px] text-slate-500">1-click direct link to member WhatsApp chat</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.whatsappEnabled}
                      onChange={(e) => updateNotificationSettings({ whatsappEnabled: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <Smartphone className="w-4 h-4 text-indigo-600" />
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">Device SMS Protocol</p>
                        <p className="text-[10px] text-slate-500">Opens default mobile SMS messenger app</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.smsEnabled}
                      onChange={(e) => updateNotificationSettings({ smsEnabled: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Active Mess Cycle: <span className="font-bold text-slate-900 dark:text-white">{currentPeriod.label}</span>
          </div>
          <button
            onClick={() => setIsNotificationModalOpen(false)}
            className="px-5 py-2 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
