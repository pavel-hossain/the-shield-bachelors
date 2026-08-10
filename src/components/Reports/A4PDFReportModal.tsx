import React, { useRef, useState } from 'react';
import { useMess } from '../../context/MessContext';
import { generatePdfFromElement } from '../../utils/pdfHelper';
import { Shield, Printer, Download, X, CheckCircle } from 'lucide-react';

export const A4PDFReportModal: React.FC = () => {
  const {
    isReportModalOpen,
    setIsReportModalOpen,
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
    memberSummaries,
  } = useMess();

  const reportRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isReportModalOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setIsGenerating(true);

    try {
      await generatePdfFromElement(
        reportRef.current,
        `Shield_Bachelors_Mess_Statement_${currentPeriod.label.replace(/\s+/g, '_')}.pdf`
      );
    } catch (err) {
      console.error('PDF Generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:static print:bg-white">
      <div className="bg-white text-slate-900 border border-slate-300 w-full max-w-4xl rounded-2xl shadow-2xl space-y-4 max-h-[92vh] flex flex-col my-auto print:max-h-none print:shadow-none print:border-none print:w-full">
        {/* Modal Toolbar (Hidden during browser print) */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50 rounded-t-2xl print:hidden">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Executive A4 Monthly Financial Statement
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap"
            >
              <Printer className="w-4 h-4" />
              <span>Print Statement</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition shadow-xs whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'Generating PDF...' : 'Download PDF'}</span>
            </button>

            <button
              onClick={() => setIsReportModalOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable A4 PDF Report Canvas Container */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1 bg-white" ref={reportRef}>
          <div className="max-w-3xl mx-auto space-y-6 text-slate-900 font-sans">
            {/* Header: Mess Title, Address, Billing Cycle, Generated Date */}
            <div className="w-full flex items-start justify-between pb-4 border-b-2 border-slate-200 mb-6">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-base shadow-sm">
                    S
                  </div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">
                    THE SHIELD BACHELORS MESS
                  </h1>
                </div>
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1">
                  📍 Police Line, Magura Sadar, Magura, Bangladesh
                </p>
                <p className="text-[10px] tracking-wider text-slate-400 font-semibold mt-0.5 uppercase">
                  Official Monthly Financial Ledger & Audit Statement
                </p>
              </div>

              <div className="text-right flex flex-col items-end">
                <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase mb-1.5 border border-emerald-200">
                  CYCLE: {currentPeriod.label.toUpperCase()}
                </span>
                <p className="text-[11px] text-slate-400 font-medium">
                  Generated Date: {todayStr}
                </p>
              </div>
            </div>

            {/* Side-by-Side Summary Boxes (2x2 Grids) */}
            <div className="grid grid-cols-2 gap-4 my-6">
              {/* Box 1: Financial Overview */}
              <div className="border border-slate-200 p-4 rounded-lg bg-slate-50">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-2 mb-3">
                  Financial Overview
                </h3>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                  <div>
                    <span className="text-xs text-slate-500 font-medium block mb-1">Pure Market Shopping</span>
                    <span className="text-sm font-bold text-slate-900 block">৳ {totalMarketExpense.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium block mb-1">Total Utility Bills (Isolated)</span>
                    <span className="text-sm font-bold text-slate-900 block">৳ {totalUtilityExpense.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium block mb-1">Total Member Deposits</span>
                    <span className="text-sm font-bold text-emerald-700 block">৳ {totalDepositsAmount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium block mb-1">Manager Cash Balance</span>
                    <span className={`text-sm font-bold block ${managerCashBalance >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                      ৳ {managerCashBalance.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Box 2: Meal Engine Statistics */}
              <div className="border border-slate-200 p-4 rounded-lg bg-slate-50">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-2 mb-3">
                  Meal Engine Statistics
                </h3>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                  <div>
                    <span className="text-xs text-slate-500 font-medium block mb-1">Total Actual Meals</span>
                    <span className="text-sm font-bold text-slate-900 block">{totalMessMeals} Meals</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium block mb-1">Total Effective Meals</span>
                    <span className="text-sm font-bold text-indigo-700 block">{totalEffectiveMeals} Meals</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium block mb-1">Effective Meal Rate</span>
                    <span className="text-sm font-bold text-emerald-700 block">৳ {effectiveMealRate.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium block mb-1">Actual Meal Rate</span>
                    <span className="text-sm font-bold text-slate-700 block">৳ {actualMealRate.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Member Ledger Table (Clean 6 Columns Only) */}
            <div className="border border-slate-300 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs table-fixed">
                <thead className="bg-slate-800 text-white font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3 text-left w-[25%]">MEMBER NAME</th>
                    <th className="py-2.5 px-2 text-center w-[15%]">ACTUAL MEALS</th>
                    <th className="py-2.5 px-2 text-center w-[15%]">EFFECTIVE MEALS</th>
                    <th className="py-2.5 px-3 text-right w-[15%]">PURE MEAL BILL</th>
                    <th className="py-2.5 px-3 text-right w-[15%]">DEPOSITS</th>
                    <th className="py-2.5 px-3 text-right w-[15%]">NET STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {memberSummaries.map((s) => (
                    <tr key={s.member.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-slate-900 w-[25%] truncate">
                        {s.member.name}
                        {s.member.role === 'Manager' && (
                          <span className="ml-1.5 text-[9px] text-emerald-700 font-bold uppercase">(Manager)</span>
                        )}
                      </td>
                      <td className="py-2.5 px-2 text-center font-bold text-slate-700 w-[15%]">{s.actualMeals}</td>
                      <td className="py-2.5 px-2 text-center font-bold text-indigo-700 w-[15%]">
                        {s.effectiveMeals}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900 w-[15%]">
                        ৳ {s.totalPayable.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-700 w-[15%]">
                        ৳ {s.totalDeposits.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold whitespace-nowrap w-[15%]">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] ${
                            s.netBalance > 0
                              ? 'bg-emerald-100 text-emerald-800'
                              : s.netBalance < 0
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {s.netBalance > 0
                            ? `+৳ ${s.netBalance.toLocaleString()}`
                            : s.netBalance < 0
                            ? `-৳ ${Math.abs(s.netBalance).toLocaleString()}`
                            : 'Settled'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {/* Totals Summary Row */}
                <tfoot className="bg-slate-100 border-t-2 border-slate-400 font-black text-xs text-slate-900">
                  <tr>
                    <td className="py-2.5 px-3 text-left w-[25%]">TOTALS SUMMARY</td>
                    <td className="py-2.5 px-2 text-center w-[15%]">{totalMessMeals}</td>
                    <td className="py-2.5 px-2 text-center text-indigo-900 w-[15%]">{totalEffectiveMeals}</td>
                    <td className="py-2.5 px-3 text-right w-[15%]">৳ {totalMarketExpense.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right text-emerald-800 w-[15%]">৳ {totalDepositsAmount.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right text-slate-900 w-[15%]">
                      ৳ {managerCashBalance.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Signature Footer Positioning */}
            <div className="mt-12 flex justify-between items-end px-8">
              <div className="text-center">
                <div className="border-t-2 border-slate-400 pt-1.5 w-48 mx-auto font-bold text-xs">
                  Mess Manager Signature
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">Aktar Hossain (Police Line, Magura)</p>
              </div>

              <div className="text-center">
                <div className="border-t-2 border-slate-400 pt-1.5 w-48 mx-auto font-bold text-xs">
                  Auditor / Representative
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">Kamrul Islam (Audit Committee)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
