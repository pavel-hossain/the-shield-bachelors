import React, { useState } from 'react';
import { useMess } from '../../context/MessContext';
import * as XLSX from 'xlsx';
import { FileSpreadsheet, Upload, Check, AlertCircle, Download, X } from 'lucide-react';

export const ExcelParserModal: React.FC = () => {
  const { isExcelModalOpen, setIsExcelModalOpen, importExcelData } = useMess();

  const [fileName, setFileName] = useState('');
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [importType, setImportType] = useState<'deposits' | 'expenses' | 'members'>('deposits');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  if (!isExcelModalOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setStatusMessage(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);
        setParsedRows(data);
      } catch (err: any) {
        setStatusMessage({ type: 'error', text: 'Failed to parse Excel file. Please ensure valid format.' });
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleImportSubmit = () => {
    if (parsedRows.length === 0) return;

    if (importType === 'deposits') {
      const depositsToImport = parsedRows.map((row) => {
        // Auto-map column headers ("Name"/"Member", "Date", "Amount"/"Taka", "Method")
        const nameVal = row['Name'] || row['Member'] || row['member'] || 'Aktar Hossain';
        const amountVal = Number(row['Amount'] || row['Deposit'] || row['Taka'] || row['taka'] || 1000);
        const dateVal = row['Date'] || row['date'] || '2026-08-09';
        const methodVal = row['Method'] || row['method'] || 'bKash';

        return {
          date: dateVal,
          memberId: 'm1', // Default or matched by name
          amount: amountVal,
          method: methodVal as any,
          notes: `Imported via ${fileName}`,
        };
      });

      const res = importExcelData({ deposits: depositsToImport });
      setStatusMessage({ type: 'success', text: res.message });
    } else if (importType === 'expenses') {
      const expensesToImport = parsedRows.map((row) => {
        const titleVal = row['Title'] || row['Item'] || row['Expense'] || 'Market Expense';
        const amountVal = Number(row['Amount'] || row['Cost'] || row['Taka'] || 1200);
        const dateVal = row['Date'] || row['date'] || '2026-08-09';
        const categoryVal = row['Category'] || 'Market Shopping';

        return {
          date: dateVal,
          title: titleVal,
          category: categoryVal as any,
          amount: amountVal,
          paidByMemberId: 'm1',
          notes: `Imported from ${fileName}`,
        };
      });

      const res = importExcelData({ expenses: expensesToImport });
      setStatusMessage({ type: 'success', text: res.message });
    }

    setParsedRows([]);
  };

  const downloadSampleTemplate = () => {
    const sampleData = [
      { Date: '2026-08-09', Member: 'Aktar Hossain', Amount: 3000, Method: 'bKash' },
      { Date: '2026-08-09', Member: 'Kamrul Islam', Amount: 2500, Method: 'Cash' },
      { Date: '2026-08-09', Member: 'Sumon Ahmed', Amount: 2000, Method: 'Nagad' },
    ];

    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SampleData');
    XLSX.writeFile(wb, 'Shield_Mess_Import_Template.xlsx');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-xl rounded-2xl p-5 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Smart Excel / CSV Parser
            </h3>
          </div>
          <button
            onClick={() => setIsExcelModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 font-bold text-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options & Template Download */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>Data Type:</span>
            <select
              value={importType}
              onChange={(e) => setImportType(e.target.value as any)}
              className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-900 dark:text-white"
            >
              <option value="deposits">Member Deposits</option>
              <option value="expenses">Expenses & Market</option>
            </select>
          </div>

          <button
            onClick={downloadSampleTemplate}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Sample Template</span>
          </button>
        </div>

        {/* Upload Box */}
        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 p-6 rounded-xl flex flex-col items-center justify-center cursor-pointer transition bg-slate-50 dark:bg-slate-800/40">
          <Upload className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mb-2" />
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            {fileName ? fileName : 'Click or Drag Excel (.xlsx, .csv) file here'}
          </span>
          <span className="text-[10px] text-slate-400 mt-1">
            Auto-maps headers like "Name", "Date", "Amount", "Deposit", "Taka"
          </span>
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <Check className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Preview Parsed Table */}
        {parsedRows.length > 0 && (
          <div className="flex-1 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 border-b">
              Parsed Preview ({parsedRows.length} Rows Ready)
            </div>
            <table className="w-full text-left text-[11px]">
              <thead className="bg-slate-50 dark:bg-slate-800/60 font-semibold text-slate-500 border-b">
                <tr>
                  {Object.keys(parsedRows[0]).map((k) => (
                    <th key={k} className="p-2 whitespace-nowrap">
                      {k}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {parsedRows.slice(0, 5).map((row, idx) => (
                  <tr key={idx}>
                    {Object.values(row).map((val: any, vIdx) => (
                      <td key={vIdx} className="p-2 font-medium text-slate-800 dark:text-slate-200">
                        {String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
          <button
            onClick={() => setIsExcelModalOpen(false)}
            className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Close
          </button>
          <button
            onClick={handleImportSubmit}
            disabled={parsedRows.length === 0}
            className="px-5 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white transition shadow-sm"
          >
            Apply Import Data ({parsedRows.length} rows)
          </button>
        </div>
      </div>
    </div>
  );
};
