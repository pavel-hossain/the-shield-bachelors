import React, { useRef, useState } from 'react';
import { useMess } from '../../context/MessContext';
import { generatePdfFromElement } from '../../utils/pdfHelper';
import {
  FileText,
  FileSpreadsheet,
  Download,
  X,
  Shield,
  Check,
  AlertTriangle,
  Database,
  Printer,
} from 'lucide-react';

export const ExportSummaryModal: React.FC = () => {
  const {
    isExportSummaryModalOpen,
    setIsExportSummaryModalOpen,
    currentPeriod,
    totalMarketExpense,
    totalUtilityExpense,
    totalOverallExpense,
    totalMessMeals,
    effectiveMealRate,
    actualMealRate,
    totalDepositsAmount,
    managerCashBalance,
    memberSummaries,
    lowBalanceMembers,
    overdueMembers,
    exportBackupData,
  } = useMess();

  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  if (!isExportSummaryModalOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  // CSV Export Generator
  const handleExportCSV = () => {
    const csvRows: string[] = [];

    // Title & Metadata
    csvRows.push(`"The Shield Bachelors Mess System - Financial Summary"`);
    csvRows.push(`"Cycle Period:","${currentPeriod.label}"`);
    csvRows.push(`"Export Date:","${todayStr}"`);
    csvRows.push(`"Total Market Expenses (৳):",${totalMarketExpense}`);
    csvRows.push(`"Total Utility Expenses (৳):",${totalUtilityExpense}`);
    csvRows.push(`"Total Overall Expenses (৳):",${totalOverallExpense}`);
    csvRows.push(`"Total Mess Meals:",${totalMessMeals}`);
    csvRows.push(`"Effective Meal Rate (৳):",${effectiveMealRate}`);
    csvRows.push(`"Total Deposits Received (৳):",${totalDepositsAmount}`);
    csvRows.push(`"Manager Cash Balance (৳):",${managerCashBalance}`);
    csvRows.push(`"Low Balance Members Count:",${lowBalanceMembers.length}`);
    csvRows.push(''); // blank row

    // Table Header
    csvRows.push(
      [
        '"Member Name"',
        '"Room"',
        '"Status"',
        '"Actual Meals"',
        '"Effective Meals"',
        '"Effective Rate (৳)"',
        '"Meal Cost Payable (৳)"',
        '"Total Deposits (৳)"',
        '"Net Balance (৳)"',
        '"Status Label"',
        '"Projected Meals"',
        '"Projected Meal Cost (৳)"',
        '"Deposit Shortfall (৳)"',
        '"Low Balance Warning"',
      ].join(',')
    );

    // Table Rows
    memberSummaries.forEach((s) => {
      csvRows.push(
        [
          `"${s.member.name.replace(/"/g, '""')}"`,
          `"${s.member.roomNo || '-'}"`,
          `"${s.member.status}"`,
          s.actualMeals,
          s.effectiveMeals,
          effectiveMealRate,
          s.mealCost,
          s.totalDeposits,
          s.netBalance,
          `"${s.statusLabel}"`,
          s.projectedMeals || 0,
          s.projectedMealCost || 0,
          s.depositShortfall || 0,
          `"${s.isLowBalance ? 'YES - LOW DEPOSIT' : 'NO'}"`,
        ].join(',')
      );
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `Shield_Bachelors_Financial_Summary_${currentPeriod.label.replace(/\s+/g, '_')}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess('CSV Summary downloaded successfully!');
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  // PDF Export Generator
  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setIsDownloadingPdf(true);

    try {
      await generatePdfFromElement(
        reportRef.current,
        `Shield_Bachelors_Summary_${currentPeriod.label.replace(/\s+/g, '_')}.pdf`,
        'p'
      );
      setDownloadSuccess('PDF Executive Summary downloaded successfully!');
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-2xl p-4 sm:p-6 shadow-2xl space-y-5 my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Export Financial & Member Summary
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentPeriod.label} — Police Line, Magura Sadar
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsExportSummaryModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {downloadSuccess && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-2 text-emerald-800 dark:text-emerald-200 text-xs font-semibold">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* Quick Summary Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Market Cost</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              ৳ {totalMarketExpense.toLocaleString()}
            </span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Meal Rate</span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              ৳ {effectiveMealRate.toFixed(2)}
            </span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Deposits</span>
            <span className="text-sm font-bold text-teal-600 dark:text-teal-400">
              ৳ {totalDepositsAmount.toLocaleString()}
            </span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Low Balance Risk</span>
            <span
              className={`text-sm font-bold ${
                lowBalanceMembers.length > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600'
              }`}
            >
              {lowBalanceMembers.length} Members
            </span>
          </div>
        </div>

        {/* Export Buttons Grid */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Select Export Format:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* CSV Option */}
            <button
              onClick={handleExportCSV}
              className="flex flex-col items-center justify-center p-4 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border-2 border-emerald-500/30 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 rounded-xl transition text-center space-y-1.5 group cursor-pointer"
            >
              <FileSpreadsheet className="w-6 h-6 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition" />
              <span className="text-xs font-bold block">Export CSV / Excel</span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-300 leading-tight">
                Download spreadsheet with full member ledger & projections
              </span>
            </button>

            {/* PDF Option */}
            <button
              onClick={handleExportPDF}
              disabled={isDownloadingPdf}
              className="flex flex-col items-center justify-center p-4 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border-2 border-indigo-500/30 dark:border-indigo-800 text-indigo-900 dark:text-indigo-100 rounded-xl transition text-center space-y-1.5 group cursor-pointer disabled:opacity-50"
            >
              <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition" />
              <span className="text-xs font-bold block">
                {isDownloadingPdf ? 'Generating PDF...' : 'Export A4 Summary PDF'}
              </span>
              <span className="text-[10px] text-indigo-700 dark:text-indigo-300 leading-tight">
                Download printable executive summary sheet
              </span>
            </button>

            {/* JSON Backup Option */}
            <button
              onClick={() => {
                exportBackupData();
                setDownloadSuccess('Full JSON Backup exported successfully!');
                setTimeout(() => setDownloadSuccess(null), 4000);
              }}
              className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl transition text-center space-y-1.5 group cursor-pointer"
            >
              <Database className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:scale-110 transition" />
              <span className="text-xs font-bold block">Export JSON Database</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                Complete raw system backup file for restore
              </span>
            </button>
          </div>
        </div>

        {/* Hidden Printable A4 Report Canvas for PDF Export */}
        <div className="overflow-hidden h-0 w-0 opacity-0 pointer-events-none">
          <div
            id="export-summary-pdf-canvas"
            ref={reportRef}
            className="w-[800px] bg-white text-slate-900 p-8 font-sans space-y-6"
          >
            {/* PDF Header */}
            <div className="flex items-center justify-between border-b border-slate-300 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Shield className="w-6 h-6 text-emerald-600" />
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">
                    THE SHIELD BACHELORS MESS
                  </h1>
                </div>
                <p className="text-xs text-slate-500 font-medium">Police Line, Magura Sadar</p>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full">
                  MONTHLY EXECUTIVE SUMMARY
                </span>
                <p className="text-xs font-bold text-slate-700 mt-1">{currentPeriod.label}</p>
              </div>
            </div>

            {/* Financial Overview Cards */}
            <div className="grid grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Market Cost</span>
                <span className="text-base font-extrabold text-slate-900">৳ {totalMarketExpense.toLocaleString()}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Effective Rate</span>
                <span className="text-base font-extrabold text-emerald-600">৳ {effectiveMealRate.toFixed(2)}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Deposits</span>
                <span className="text-base font-extrabold text-teal-600">৳ {totalDepositsAmount.toLocaleString()}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Manager Cash</span>
                <span className="text-base font-extrabold text-slate-900">৳ {managerCashBalance.toLocaleString()}</span>
              </div>
            </div>

            {/* Member Ledger Table */}
            <div>
              <h2 className="text-xs font-bold uppercase text-slate-700 tracking-wider mb-2">
                Member Financial & Deposit Projection Summary
              </h2>
              <table className="w-full text-left text-[11px] border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                    <th className="p-2 border-r border-slate-300">Member</th>
                    <th className="p-2 text-center border-r border-slate-300">Actual Meals</th>
                    <th className="p-2 text-center border-r border-slate-300">Effective</th>
                    <th className="p-2 text-right border-r border-slate-300">Meal Cost</th>
                    <th className="p-2 text-right border-r border-slate-300">Deposits</th>
                    <th className="p-2 text-right border-r border-slate-300">Net Status</th>
                    <th className="p-2 text-right border-r border-slate-300">Projected Cost</th>
                    <th className="p-2 text-center">Low Deposit Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {memberSummaries.map((s) => (
                    <tr key={s.member.id}>
                      <td className="p-2 font-bold border-r border-slate-300">{s.member.name}</td>
                      <td className="p-2 text-center border-r border-slate-300">{s.actualMeals}</td>
                      <td className="p-2 text-center border-r border-slate-300">{s.effectiveMeals}</td>
                      <td className="p-2 text-right border-r border-slate-300">৳ {s.mealCost.toLocaleString()}</td>
                      <td className="p-2 text-right font-bold text-emerald-700 border-r border-slate-300">
                        ৳ {s.totalDeposits.toLocaleString()}
                      </td>
                      <td className="p-2 text-right font-bold border-r border-slate-300">
                        {s.netBalance >= 0 ? `+ ৳ ${s.netBalance}` : `- ৳ ${Math.abs(s.netBalance)}`}
                      </td>
                      <td className="p-2 text-right border-r border-slate-300">
                        ৳ {(s.projectedMealCost || 0).toLocaleString()}
                      </td>
                      <td className="p-2 text-center font-bold">
                        {s.isLowBalance ? (
                          <span className="text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded text-[10px]">
                            ⚠️ LOW (Shortfall: ৳{s.depositShortfall})
                          </span>
                        ) : (
                          <span className="text-emerald-700 text-[10px]">OK</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer stamp */}
            <div className="pt-4 border-t border-slate-300 text-[10px] text-slate-500 flex justify-between">
              <span>System Generated Official Report — The Shield Bachelors Mess</span>
              <span>Page 1 of 1</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end border-t border-slate-200 dark:border-slate-800 pt-3">
          <button
            onClick={() => setIsExportSummaryModalOpen(false)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
