import React, { useState } from 'react';
import { useMess } from '../../context/MessContext';
import { MemberRole, MemberStatus } from '../../types';
import * as XLSX from 'xlsx';
import { FileSpreadsheet, Upload, Check, AlertCircle, Download, X } from 'lucide-react';

export const ExcelParserModal: React.FC = () => {
  const { isExcelModalOpen, setIsExcelModalOpen, importExcelData, members } = useMess();

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
        setStatusMessage({ type: 'error', text: 'Failed to parse file. Please ensure valid CSV or Excel format.' });
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleImportSubmit = () => {
    if (parsedRows.length === 0) return;

    if (importType === 'deposits') {
      const depositsToImport = parsedRows.map((row) => {
        const nameVal = String(row['Name'] || row['Member'] || row['member'] || 'Aktar Hossain').trim();
        const amountVal = Number(row['Amount'] || row['Deposit'] || row['Taka'] || row['taka'] || 1000);
        const dateVal = String(row['Date'] || row['date'] || new Date().toISOString().split('T')[0]);
        const methodVal = String(row['Method'] || row['method'] || 'bKash');

        const matchedMember = members.find((m) =>
          m.name.toLowerCase().includes(nameVal.toLowerCase()) ||
          nameVal.toLowerCase().includes(m.name.toLowerCase())
        );
        const memberId = matchedMember ? matchedMember.id : members[0]?.id || 'm1';

        return {
          date: dateVal,
          memberId,
          amount: amountVal,
          method: (methodVal as any) || 'bKash',
          notes: `CSV Import from ${fileName}`,
        };
      });

      const res = importExcelData({ deposits: depositsToImport });
      setStatusMessage({ type: 'success', text: res.message });
    } else if (importType === 'expenses') {
      const expensesToImport = parsedRows.map((row) => {
        const titleVal = String(row['Title'] || row['Item'] || row['Expense'] || 'Market Shopping');
        const amountVal = Number(row['Amount'] || row['Cost'] || row['Taka'] || 1200);
        const dateVal = String(row['Date'] || row['date'] || new Date().toISOString().split('T')[0]);
        const categoryVal = String(row['Category'] || 'Market Shopping');
        const shopperVal = String(row['Shopper'] || row['PaidBy'] || row['Member'] || '');

        const matchedMember = members.find((m) =>
          m.name.toLowerCase().includes(shopperVal.toLowerCase())
        );
        const shopperId = matchedMember ? matchedMember.id : members[0]?.id || 'm1';

        return {
          date: dateVal,
          title: titleVal,
          category: (categoryVal as any) || 'Market Shopping',
          amount: amountVal,
          paidByMemberId: shopperId,
          notes: `CSV Import from ${fileName}`,
        };
      });

      const res = importExcelData({ expenses: expensesToImport });
      setStatusMessage({ type: 'success', text: res.message });
    } else if (importType === 'members') {
      const membersToImport = parsedRows.map((row) => {
        const nameVal = String(row['Name'] || row['Member'] || 'New Member');
        const roomVal = String(row['Room'] || row['RoomNo'] || '101');
        const phoneVal = String(row['Phone'] || row['Mobile'] || '01700000000');
        const statusVal = String(row['Status'] || 'Active');
        const balanceVal = Number(row['OpeningBalance'] || row['Carried'] || 0);

        return {
          name: nameVal,
          phone: phoneVal,
          roomNo: roomVal,
          role: 'Member' as MemberRole,
          status: (statusVal === 'Inactive' ? 'Inactive' : 'Active') as MemberStatus,
          avatarColor: 'bg-emerald-600',
          openingBalance: balanceVal,
        };
      });

      const res = importExcelData({ members: membersToImport });
      setStatusMessage({ type: 'success', text: res.message });
    }

    setParsedRows([]);
  };

  const downloadSampleTemplate = (format: 'csv' | 'xlsx' = 'csv') => {
    let sampleData: any[] = [];
    let filename = 'Shield_Mess_Template';

    if (importType === 'deposits') {
      sampleData = [
        { Date: '2026-08-09', Member: 'Aktar Hossain', Amount: 3000, Method: 'bKash' },
        { Date: '2026-08-09', Member: 'Kamrul Islam', Amount: 2500, Method: 'Cash' },
        { Date: '2026-08-09', Member: 'Sumon Ahmed', Amount: 2000, Method: 'Nagad' },
      ];
      filename = 'Shield_Mess_Deposits_Template';
    } else if (importType === 'expenses') {
      sampleData = [
        { Date: '2026-08-09', Title: 'Fish & Chicken Market', Amount: 1850, Category: 'Market Shopping', Shopper: 'Aktar Hossain' },
        { Date: '2026-08-09', Title: 'Rice 50kg Bag', Amount: 3200, Category: 'Market Shopping', Shopper: 'Kamrul Islam' },
        { Date: '2026-08-10', Title: 'Cook Maid Salary', Amount: 4000, Category: 'Cook / Maid', Shopper: 'Mess Manager' },
      ];
      filename = 'Shield_Mess_Expenses_Template';
    } else {
      sampleData = [
        { Name: 'Tareq Rahman', RoomNo: '204', Phone: '01711223344', Status: 'Active', OpeningBalance: 0 },
        { Name: 'Jahid Hasan', RoomNo: '205', Phone: '01899887766', Status: 'Active', OpeningBalance: 150 },
      ];
      filename = 'Shield_Mess_Members_Template';
    }

    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sample');

    if (format === 'csv') {
      XLSX.writeFile(wb, `${filename}.csv`, { bookType: 'csv' });
    } else {
      XLSX.writeFile(wb, `${filename}.xlsx`, { bookType: 'xlsx' });
    }
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
