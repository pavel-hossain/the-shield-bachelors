import React, { useRef, useState } from 'react';
import { useMess } from '../../context/MessContext';
import { generatePdfFromElement } from '../../utils/pdfHelper';
import { Shield, Printer, Download, X } from 'lucide-react';

interface MarketShoppingPDFModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MarketShoppingPDFModal: React.FC<MarketShoppingPDFModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentPeriod, expenses, members, totalMarketExpense } = useMess();
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const currentMonthPrefix = `${currentPeriod.year}-${
    currentPeriod.month < 10 ? '0' + currentPeriod.month : currentPeriod.month
  }`;

  const marketExpenses = expenses.filter(
    (e) =>
      e.date.startsWith(currentMonthPrefix) &&
      (e.category === 'Market Shopping' || (e.category as string) === 'Miscellaneous Market')
  );

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setIsGenerating(true);

    try {
      await generatePdfFromElement(
        reportRef.current,
        `Shield_Bachelors_Market_Shopping_Voucher_${currentPeriod.label.replace(/\s+/g, '_')}.pdf`
      );
    } catch (err) {
      console.error('Market Shopping PDF Generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Modal Header Controls */}
        <div className="bg-slate-900 text-white p-3 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm sm:text-base">Market Shopping Voucher Report PDF</span>
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
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition shadow-sm whitespace-nowrap disabled:opacity-50"
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

        {/* Printable Content Container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <div
            ref={reportRef}
            className="bg-white text-slate-900 p-6 shadow-md rounded-xl max-w-3xl mx-auto space-y-5 font-sans"
          >
            {/* Report Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4">
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                  THE SHIELD BACHELORS MESS
                </h1>
                <p className="text-xs font-semibold text-slate-600">Police Line, Magura, Bangladesh</p>
                <p className="text-xs font-bold text-emerald-700 mt-1 uppercase tracking-wider">
                  MONTHLY MARKET SHOPPING VOUCHER STATEMENT
                </p>
              </div>
              <div className="text-right">
                <div className="inline-block bg-slate-900 text-white px-3 py-1 rounded text-xs font-bold mb-1">
                  PERIOD: {currentPeriod.label.toUpperCase()}
                </div>
                <p className="text-[10px] text-slate-500">Generated: {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            {/* Total Expense Box */}
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase block">Total Market Shopping Expenses</span>
                <span className="text-[10px] text-slate-500">Includes all Bazar & Miscellaneous Bazar logs</span>
              </div>
              <strong className="text-lg font-black text-emerald-900">৳ {totalMarketExpense.toLocaleString()}</strong>
            </div>

            {/* History Voucher Table */}
            <div className="border border-slate-300 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-800 text-white font-bold">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Shopping Details / Item</th>
                    <th className="py-2.5 px-3">Purchased By</th>
                    <th className="py-2.5 px-3 text-right">Amount (৳)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {marketExpenses.map((e) => {
                    const member = members.find((m) => m.id === e.paidByMemberId);
                    return (
                      <tr key={e.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-medium text-slate-700 whitespace-nowrap">{e.date}</td>
                        <td className="py-2 px-3">
                          <span className="font-bold text-slate-900 block">{e.title}</span>
                          {e.notes && <span className="text-[10px] text-slate-500 italic">{e.notes}</span>}
                        </td>
                        <td className="py-2 px-3 text-slate-700 whitespace-nowrap">{member?.name || 'Mess Fund'}</td>
                        <td className="py-2 px-3 text-right font-bold text-slate-900 whitespace-nowrap">
                          ৳ {e.amount.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                  {marketExpenses.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-slate-400 italic">
                        No market shopping expenses recorded for this month.
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-800">
                  <tr>
                    <td colSpan={3} className="py-2.5 px-3 text-slate-900 uppercase">
                      GRAND TOTAL MARKET SHOPPING
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-800 font-black text-sm whitespace-nowrap">
                      ৳ {totalMarketExpense.toLocaleString()}
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
