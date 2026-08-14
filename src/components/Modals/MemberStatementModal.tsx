import React, { useRef, useState } from 'react';
import { useMess } from '../../context/MessContext';
import { generatePdfFromElement } from '../../utils/pdfHelper';
import {
  CreditCard,
  ShoppingBag,
  Utensils,
  Send,
  X,
  Phone,
  Building,
  Calendar,
  Shield,
  Download,
  UserCheck,
  CheckCircle2,
  FileText,
  PhoneCall,
  User,
} from 'lucide-react';

export const MemberStatementModal: React.FC = () => {
  const {
    selectedMemberForStatement,
    setSelectedMemberForStatement,
    currentPeriod,
    deposits,
    expenses,
    meals,
    effectiveMealRate,
    memberSummaries,
  } = useMess();

  const [activeTab, setActiveTab] = useState<'deposits' | 'expenses' | 'meals'>('deposits');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const pdfPrintRef = useRef<HTMLDivElement>(null);

  if (!selectedMemberForStatement) return null;

  const member = selectedMemberForStatement;
  const summary = memberSummaries.find((s) => s.member.id === member.id);

  // Filter member specific data for current month
  const currentMonthPrefix = `${currentPeriod.year}-${currentPeriod.month < 10 ? '0' + currentPeriod.month : currentPeriod.month}`;

  const memberDeposits = deposits.filter(
    (d) => d.memberId === member.id && d.date.startsWith(currentMonthPrefix)
  );
  const memberExpenses = expenses.filter(
    (e) => e.paidByMemberId === member.id && e.date.startsWith(currentMonthPrefix)
  );
  const memberMeals = meals.filter(
    (m) => m.memberId === member.id && m.date.startsWith(currentMonthPrefix)
  );

  // Download Dedicated Individual Member PDF Statement
  const handleDownloadMemberPDF = async () => {
    if (!pdfPrintRef.current) return;
    setIsGeneratingPDF(true);

    try {
      await generatePdfFromElement(
        pdfPrintRef.current,
        `Member_Statement_${member.name.replace(/\s+/g, '_')}_${currentPeriod.label.replace(/\s+/g, '_')}.pdf`
      );
    } catch (err) {
      console.error('Individual Member PDF generation failed:', err);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Generate WhatsApp summary text
  const handleWhatsAppSend = () => {
    if (!summary) return;
    const isDue = summary.netBalance < 0;
    const paymentFooter = isDue
      ? `\n\n💳 *Payment Numbers:*\n• bKash / Nagad: 01948545255\n• Rocket: 018776890414\n• DBBL A/C: 2281600015015`
      : '';

    const text = encodeURIComponent(
      `*The Shield Bachelors Mess — Member Statement*\n` +
        `📍 Police Line, Magura | Month: ${currentPeriod.label}\n\n` +
        `👤 Member: ${member.name} (Room ${member.roomNo})\n` +
        `📞 Phone: ${member.phone}\n` +
        `👨‍👩‍👦 Guardian: ${member.guardianName || 'N/A'} (${member.guardianRelation || 'N/A'})\n` +
        `🍽️ Actual Meals: ${summary.actualMeals} | Billed Effective: ${summary.effectiveMeals}\n` +
        `💸 Meal Cost (@৳${effectiveMealRate}/meal): ৳${summary.mealCost.toLocaleString()}\n` +
        `⚡ Utility Share: ৳${summary.utilityCostShare.toLocaleString()}\n` +
        `📊 Total Payable: ৳${summary.totalPayable.toLocaleString()}\n` +
        `💰 Total Deposits Paid: ৳${summary.totalDeposits.toLocaleString()}\n` +
        `----------------------------------------\n` +
        `📌 Net Status: *${
          summary.netBalance > 0
            ? `Credit (Refundable): +৳${summary.netBalance.toLocaleString()}`
            : summary.netBalance < 0
            ? `Due Payable: -৳${Math.abs(summary.netBalance).toLocaleString()}`
            : 'Settled (৳0)'
        }*` +
        paymentFooter +
        `\n\nThank you!\n— Mess Management (Aktar Hossain: 01948545255)`
    );

    const cleanPhone = member.phone.replace(/[^0-9]/g, '');
    const fullPhone = cleanPhone.startsWith('88') ? cleanPhone : `88${cleanPhone}`;
    window.open(`https://wa.me/${fullPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-3xl rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] flex flex-col my-auto">
        {/* Header Profile Section */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-start gap-3.5">
            {member.avatarUrl ? (
              <img
                src={member.avatarUrl}
                alt={member.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover shrink-0 border-2 border-indigo-500 shadow-md"
              />
            ) : (
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${member.avatarColor} font-black text-xl flex items-center justify-center shrink-0 shadow-md`}
              >
                {member.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-tight">
                  {member.name}
                </h2>
                <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 rounded-full text-[10px] font-bold uppercase">
                  {member.role}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    member.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {member.status}
                </span>
              </div>

              {/* Member Details Pills */}
              <div className="flex items-center gap-3 flex-wrap text-xs text-slate-600 dark:text-slate-400">
                <a
                  href={`tel:${member.phone}`}
                  className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                  title="Click to call member"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{member.phone}</span>
                </a>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>Room {member.roomNo}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Joined: {member.joiningDate || '2025-01-15'}</span>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setSelectedMemberForStatement(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guardian Contact Info Card */}
        <div className="bg-indigo-50/70 dark:bg-indigo-950/40 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600 text-white rounded-lg font-bold shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-indigo-950 dark:text-indigo-200">
                Guardian (অভিভাবক): {member.guardianName || 'Md. Delwar Hossain'}
              </div>
              <div className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">
                Relationship: <strong className="text-slate-700 dark:text-slate-300">{member.guardianRelation || 'Father'}</strong>
              </div>
            </div>
          </div>

          {member.guardianPhone && (
            <a
              href={`tel:${member.guardianPhone}`}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-xs whitespace-nowrap self-end sm:self-auto"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Guardian ({member.guardianPhone})</span>
            </a>
          )}
        </div>

        {/* Financial Summary Ledger Box */}
        {summary && (
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60 grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Actual Meals</span>
              <div className="text-base font-black text-slate-900 dark:text-white">
                {summary.actualMeals}
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Billed Meals</span>
              <div className="text-base font-black text-indigo-600 dark:text-indigo-400">
                {summary.effectiveMeals}
                {summary.effectiveMeals > summary.actualMeals && (
                  <span className="text-[9px] block text-amber-600 dark:text-amber-400 font-semibold">
                    (45 Min Rule)
                  </span>
                )}
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Meal Bill</span>
              <div className="text-base font-black text-slate-900 dark:text-white">
                ৳ {summary.totalPayable.toLocaleString()}
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Deposits Paid</span>
              <div className="text-base font-black text-emerald-600 dark:text-emerald-400">
                ৳ {summary.totalDeposits.toLocaleString()}
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Net Balance</span>
              <div
                className={`text-base font-black ${
                  summary.netBalance > 0
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : summary.netBalance < 0
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-slate-600'
                }`}
              >
                {summary.netBalance > 0
                  ? `+৳${summary.netBalance.toLocaleString()}`
                  : summary.netBalance < 0
                  ? `-৳${Math.abs(summary.netBalance).toLocaleString()}`
                  : 'Settled'}
              </div>
            </div>
          </div>
        )}

        {/* 3 Sub-Tabs Navigation */}
        <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('deposits')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'deposits'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Deposit History ({memberDeposits.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('expenses')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'expenses'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Market Shopping ({memberExpenses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('meals')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'meals'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Daily Meals Log ({memberMeals.length})</span>
          </button>
        </div>

        {/* Sub-Tab Content */}
        <div className="flex-1 overflow-y-auto space-y-2 min-h-[180px] max-h-[260px]">
          {activeTab === 'deposits' && (
            <div className="space-y-2">
              {memberDeposits.length === 0 ? (
                <p className="text-center py-8 text-xs text-slate-400">
                  No deposits recorded for this member in {currentPeriod.label}.
                </p>
              ) : (
                memberDeposits.map((d) => (
                  <div
                    key={d.id}
                    className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{d.date}</div>
                      <div className="text-slate-500 font-medium mt-0.5">
                        Method: <strong className="text-slate-700 dark:text-slate-300">{d.method}</strong> • TRX: {d.transactionId || 'N/A'} {d.notes ? `(${d.notes})` : ''}
                      </div>
                    </div>
                    <div className="text-right font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      + ৳ {d.amount.toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'expenses' && (
            <div className="space-y-2">
              {memberExpenses.length === 0 ? (
                <p className="text-center py-8 text-xs text-slate-400">
                  No market shopping or vouchers logged by this member in {currentPeriod.label}.
                </p>
              ) : (
                memberExpenses.map((e) => (
                  <div
                    key={e.id}
                    className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{e.title}</div>
                      <div className="text-slate-500 font-medium mt-0.5">
                        {e.date} • {e.category} {e.notes ? `- ${e.notes}` : ''}
                      </div>
                    </div>
                    <div className="text-right font-black text-amber-600 dark:text-amber-400 text-sm">
                      ৳ {e.amount.toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'meals' && (
            <div className="space-y-2">
              {memberMeals.length === 0 ? (
                <p className="text-center py-8 text-xs text-slate-400">
                  No daily meals logged for this member in {currentPeriod.label}.
                </p>
              ) : (
                memberMeals
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((m) => {
                    const total =
                      (Number(m.breakfast) || 0) +
                      (Number(m.lunch) || 0) +
                      (Number(m.dinner) || 0);

                    return (
                      <div
                        key={m.id}
                        className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex items-center justify-between text-xs"
                      >
                        <span className="font-bold text-slate-900 dark:text-white">{m.date}</span>
                        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-medium">
                          <span>Breakfast: <strong>{m.breakfast}</strong></span>
                          <span>Lunch: <strong>{m.lunch}</strong></span>
                          <span>Dinner: <strong>{m.dinner}</strong></span>
                        </div>
                        <span className="font-black text-indigo-600 dark:text-indigo-400">
                          {total} Meals
                        </span>
                      </div>
                    );
                  })
              )}
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
          <button
            onClick={handleDownloadMemberPDF}
            disabled={isGeneratingPDF}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm whitespace-nowrap disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isGeneratingPDF ? 'Generating A4 PDF...' : 'Download Member Statement PDF'}</span>
          </button>

          <button
            onClick={handleWhatsAppSend}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm whitespace-nowrap"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send WhatsApp Statement</span>
          </button>
        </div>
      </div>

      {/* Offscreen printable A4 container for dedicated member statement */}
      <div className="fixed -left-[9999px] top-0 pointer-events-none opacity-100 bg-white z-0">
        <div
          ref={pdfPrintRef}
          className="w-[210mm] min-h-[297mm] p-[15mm] bg-white text-slate-900 font-sans space-y-6"
        >
          {/* Header */}
          <div className="border-b-2 border-indigo-600 pb-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                THE SHIELD BACHELORS MESS
              </h1>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Police Line, Magura Sadar, Magura • Monthly Individual Member Ledger
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-black uppercase text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                {currentPeriod.label}
              </span>
              <p className="text-[10px] text-slate-400 mt-1">Generated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Member & Guardian Bio */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div className="space-y-1">
              <div className="font-bold text-slate-400 uppercase text-[10px]">Member Profile</div>
              <div className="text-sm font-black text-slate-900">{member.name}</div>
              <div>Phone: <strong className="text-slate-800">{member.phone}</strong></div>
              <div>Room No: <strong className="text-slate-800">{member.roomNo}</strong></div>
              <div>Role: <strong className="text-slate-800">{member.role}</strong></div>
            </div>

            <div className="space-y-1 border-l border-slate-200 pl-4">
              <div className="font-bold text-slate-400 uppercase text-[10px]">Guardian Information</div>
              <div className="text-sm font-bold text-slate-900">{member.guardianName || 'Md. Delwar Hossain'}</div>
              <div>Relationship: <strong className="text-slate-800">{member.guardianRelation || 'Father'}</strong></div>
              <div>Guardian Mobile: <strong className="text-slate-800">{member.guardianPhone || '01711002233'}</strong></div>
              <div>Joined: <strong className="text-slate-800">{member.joiningDate || '2025-01-15'}</strong></div>
            </div>
          </div>

          {/* Financial Summary Table */}
          {summary && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                Monthly Financial Summary ({currentPeriod.label})
              </h3>
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-y border-slate-300 text-left">
                    <th className="p-2">Actual Meals</th>
                    <th className="p-2">Billed Meals</th>
                    <th className="p-2">Effective Rate</th>
                    <th className="p-2">Meal Bill</th>
                    <th className="p-2">Utility Share</th>
                    <th className="p-2">Total Payable</th>
                    <th className="p-2">Deposits Paid</th>
                    <th className="p-2 text-right">Net Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-200 font-semibold text-slate-800">
                    <td className="p-2">{summary.actualMeals}</td>
                    <td className="p-2">{summary.effectiveMeals}</td>
                    <td className="p-2">৳{effectiveMealRate}</td>
                    <td className="p-2">৳{summary.mealCost.toLocaleString()}</td>
                    <td className="p-2">৳{summary.utilityCostShare.toLocaleString()}</td>
                    <td className="p-2 font-bold">৳{summary.totalPayable.toLocaleString()}</td>
                    <td className="p-2 text-emerald-700 font-bold">৳{summary.totalDeposits.toLocaleString()}</td>
                    <td
                      className={`p-2 text-right font-black ${
                        summary.netBalance > 0
                          ? 'text-emerald-700'
                          : summary.netBalance < 0
                          ? 'text-rose-700'
                          : 'text-slate-700'
                      }`}
                    >
                      {summary.netBalance > 0
                        ? `Credit (+৳${summary.netBalance.toLocaleString()})`
                        : summary.netBalance < 0
                        ? `Due (-৳${Math.abs(summary.netBalance).toLocaleString()})`
                        : 'Settled'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Deposits Log */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
              Deposit Log ({memberDeposits.length} Records)
            </h3>
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-y border-slate-300 text-left">
                  <th className="p-2">Date</th>
                  <th className="p-2">Payment Method</th>
                  <th className="p-2">Transaction ID</th>
                  <th className="p-2 text-right">Amount Paid</th>
                </tr>
              </thead>
              <tbody>
                {memberDeposits.map((d) => (
                  <tr key={d.id} className="border-b border-slate-200">
                    <td className="p-2">{d.date}</td>
                    <td className="p-2">{d.method}</td>
                    <td className="p-2 font-mono text-[11px]">{d.transactionId || 'N/A'}</td>
                    <td className="p-2 text-right font-bold text-emerald-700">+ ৳{d.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signatures */}
          <div className="pt-12 grid grid-cols-2 gap-8 text-center text-xs font-bold text-slate-600">
            <div>
              <div className="border-t border-slate-400 pt-1">Member Signature</div>
            </div>
            <div>
              <div className="border-t border-slate-400 pt-1">Mess Manager Signature</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
