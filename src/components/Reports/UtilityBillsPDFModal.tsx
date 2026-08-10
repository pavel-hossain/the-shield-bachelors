import React, { useRef, useState } from 'react';
import { useMess } from '../../context/MessContext';
import { generatePdfFromElement } from '../../utils/pdfHelper';
import { Shield, Printer, Download, X } from 'lucide-react';

interface UtilityBillsPDFModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UtilityBillsPDFModal: React.FC<UtilityBillsPDFModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentPeriod, expenses, members, totalUtilityExpense, activeMembersCount, utilityPerMember } = useMess();
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const currentMonthPrefix = `${currentPeriod.year}-${
    currentPeriod.month < 10 ? '0' + currentPeriod.month : currentPeriod.month
  }`;

  const utilityExpenses = expenses.filter(
    (e) =>
      e.date.startsWith(currentMonthPrefix) &&
      e.category !== 'Market Shopping' &&
      (e.category as string) !== 'Miscellaneous Market'
  );

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setIsGenerating(true);

    try {
      await generatePdfFromElement(
        reportRef.current,
        `Shield_Bachelors_Utility_Bills_Summary_${currentPeriod.label.replace(/\s+/g, '_')}.pdf`
      );
    } catch (err) {
      console.error('Utility Bills PDF Generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Modal Controls Bar */}
        <div className="bg-slate-900 text-white p-3 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-sm sm:text-base">Utility Bills Summary Statement PDF</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition shadow-sm whitespace-nowrap disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Generating...' : 'Download PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <div
            ref={reportRef}
            className="bg-white text-slate-900 p-6 shadow-md rounded-xl max-w-3xl mx-auto space-y-5 font-sans"
          >
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4">
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                  THE SHIELD BACHELORS MESS
                </h1>
                <p className="text-xs font-semibold text-slate-600">Police Line, Magura, Bangladesh</p>
                <p className="text-xs font-bold text-indigo-700 mt-1 uppercase tracking-wider">
                  STANDALONE UTILITY & FIXED BILLS SUMMARY STATEMENT
                </p>
              </div>
              <div className="text-right">
                <div className="inline-block bg-slate-900 text-white px-3 py-1 rounded text-xs font-bold mb-1">
                  PERIOD: {currentPeriod.label.toUpperCase()}
                </div>
                <p className="text-[10px] text-slate-500">Generated: {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="bg-indigo-50 border border-indigo-200 p-2.5 rounded-lg">
                <span className="text-[10px] text-indigo-700 font-bold block uppercase">Total Utility Bills</span>
                <strong className="text-sm font-black text-indigo-900">৳ {totalUtilityExpense.toLocaleString()}</strong>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Active Members</span>
                <strong className="text-sm font-black text-slate-800">{activeMembersCount} Members</strong>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Share Per Active Member</span>
                <strong className="text-sm font-black text-slate-800">৳ {utilityPerMember.toLocaleString()}</strong>
              </div>
            </div>

            {/* Utility Receipts Table */}
            <div className="border border-slate-300 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-800 text-white font-bold">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Bill Title / Description</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Paid By</th>
                    <th className="py-2.5 px-3 text-right">Amount (৳)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {utilityExpenses.map((u) => {
                    const member = members.find((m) => m.id === u.paidByMemberId);
                    return (
                      <tr key={u.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-medium text-slate-700 whitespace-nowrap">{u.date}</td>
                        <td className="py-2 px-3">
                          <span className="font-bold text-slate-900 block">{u.title}</span>
                          {u.notes && <span className="text-[10px] text-slate-500 italic">{u.notes}</span>}
                        </td>
                        <td className="py-2 px-3 font-semibold text-indigo-700 whitespace-nowrap">{u.category}</td>
                        <td className="py-2 px-3 text-slate-700 whitespace-nowrap">{member?.name || 'Manager Fund'}</td>
                        <td className="py-2 px-3 text-right font-bold text-slate-900 whitespace-nowrap">
                          ৳ {u.amount.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                  {utilityExpenses.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400 italic">
                        No utility or fixed bills recorded for this month.
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-800">
                  <tr>
                    <td colSpan={4} className="py-2.5 px-3 text-slate-900 uppercase">
                      TOTAL UTILITY & FIXED EXPENSES
                    </td>
                    <td className="py-2.5 px-3 text-right text-indigo-900 font-black text-sm whitespace-nowrap">
                      ৳ {totalUtilityExpense.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Signature Area */}
            <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs text-slate-600 font-medium">
              <div>
                <div className="border-b border-slate-400 w-36 mx-auto mb-1"></div>
                <span>Mess Manager Signature</span>
              </div>
              <div>
                <div className="border-b border-slate-400 w-36 mx-auto mb-1"></div>
                <span>Auditor / Authorized Signature</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
