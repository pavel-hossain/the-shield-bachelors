import React, { useRef, useState } from 'react';
import { useMess } from '../../context/MessContext';
import { generatePdfFromElement } from '../../utils/pdfHelper';
import { Shield, Printer, Download, X } from 'lucide-react';

interface DailyMealMatrixPDFModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyMealMatrixPDFModal: React.FC<DailyMealMatrixPDFModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentPeriod, members, meals, totalMessMeals, totalEffectiveMeals, effectiveMealRate } = useMess();
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const activeMembers = members.filter((m) => m.status === 'Active');
  const daysInMonth = new Date(currentPeriod.year, currentPeriod.month, 0).getDate();
  const dayNumbers = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setIsGenerating(true);

    try {
      await generatePdfFromElement(
        reportRef.current,
        `Shield_Bachelors_Daily_Meals_Matrix_${currentPeriod.label.replace(/\s+/g, '_')}.pdf`,
        'l'
      );
    } catch (err) {
      console.error('Meal Matrix PDF Generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Modal Controls Bar */}
        <div className="bg-slate-900 text-white p-3 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm sm:text-base">Daily Meal Matrix Statement PDF</span>
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

        {/* Printable Report Preview Container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <div
            ref={reportRef}
            className="bg-white text-slate-900 p-6 shadow-md rounded-xl max-w-4xl mx-auto space-y-5 font-sans"
            style={{ width: '100%', minWidth: '700px' }}
          >
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4">
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                  THE SHIELD BACHELORS MESS
                </h1>
                <p className="text-xs font-semibold text-slate-600">Police Line, Magura, Bangladesh</p>
                <p className="text-xs font-bold text-emerald-700 mt-1 uppercase tracking-wider">
                  MONTHLY DAILY MEAL MATRIX VOUCHER
                </p>
              </div>
              <div className="text-right">
                <div className="inline-block bg-slate-900 text-white px-3 py-1 rounded text-xs font-bold mb-1">
                  PERIOD: {currentPeriod.label.toUpperCase()}
                </div>
                <p className="text-[10px] text-slate-500">Generated: {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            {/* Quick Summary Cards */}
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Actual Mess Meals</span>
                <strong className="text-sm font-black text-slate-900">{totalMessMeals}</strong>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Effective Billed Meals</span>
                <strong className="text-sm font-black text-indigo-700">{totalEffectiveMeals}</strong>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Effective Meal Rate</span>
                <strong className="text-sm font-black text-emerald-700">৳ {effectiveMealRate.toFixed(2)}</strong>
              </div>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto border border-slate-300 rounded-lg">
              <table className="w-full text-left text-[10px] border-collapse">
                <thead className="bg-slate-800 text-white font-bold">
                  <tr>
                    <th className="py-2 px-2 border-b border-slate-700 min-w-[110px]">Member</th>
                    {dayNumbers.map((d) => (
                      <th key={d} className="py-2 px-1 text-center border-b border-slate-700 min-w-[20px]">
                        {d}
                      </th>
                    ))}
                    <th className="py-2 px-2 text-center border-b border-slate-700 bg-emerald-900 min-w-[45px]">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {activeMembers.map((member) => {
                    let memberTotal = 0;
                    return (
                      <tr key={member.id} className="hover:bg-slate-50">
                        <td className="py-1.5 px-2 font-bold text-slate-800 whitespace-nowrap">
                          {member.name}
                        </td>
                        {dayNumbers.map((day) => {
                          const dateStr = `${currentPeriod.year}-${
                            currentPeriod.month < 10 ? '0' + currentPeriod.month : currentPeriod.month
                          }-${day < 10 ? '0' + day : day}`;
                          const record = meals.find((m) => m.date === dateStr && m.memberId === member.id);
                          const dayTotal = record
                            ? (Number(record.breakfast) || 0) + (Number(record.lunch) || 0) + (Number(record.dinner) || 0)
                            : 0;
                          memberTotal += dayTotal;

                          return (
                            <td key={day} className="py-1.5 px-0.5 text-center text-[9px] font-medium text-slate-600">
                              {dayTotal > 0 ? dayTotal : '-'}
                            </td>
                          );
                        })}
                        <td className="py-1.5 px-2 text-center font-black text-emerald-800 bg-emerald-50">
                          {memberTotal}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-800">
                  <tr>
                    <td className="py-2 px-2 text-slate-900">DAILY TOTALS</td>
                    {dayNumbers.map((day) => {
                      const dateStr = `${currentPeriod.year}-${
                        currentPeriod.month < 10 ? '0' + currentPeriod.month : currentPeriod.month
                      }-${day < 10 ? '0' + day : day}`;
                      const dayMessMeals = meals
                        .filter((m) => m.date === dateStr)
                        .reduce(
                          (sum, rec) =>
                            sum + (Number(rec.breakfast) || 0) + (Number(rec.lunch) || 0) + (Number(rec.dinner) || 0),
                          0
                        );
                      return (
                        <td key={day} className="py-2 px-0.5 text-center text-[9px] font-bold text-slate-800">
                          {dayMessMeals > 0 ? dayMessMeals : '-'}
                        </td>
                      );
                    })}
                    <td className="py-2 px-2 text-center font-black text-emerald-900 bg-emerald-100">
                      {totalMessMeals}
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
