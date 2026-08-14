import React, { useState, useRef } from 'react';
import { useMess } from '../../context/MessContext';
import { ExpenseCategory } from '../../types';
import {
  X,
  Camera,
  Upload,
  FileText,
  Sparkles,
  Check,
  Trash2,
  Plus,
  AlertCircle,
  ShoppingBag,
  Zap,
  DollarSign,
  Calendar,
  User,
  ArrowRight,
  Receipt,
  Scan,
} from 'lucide-react';

const SAMPLE_MEMOS = [
  {
    title: 'Magura Kacha Bazar Slip',
    text: `Magura Town Bazar Slip
Date: 2026-03-09
1. Broiler Chicken 2.5kg - 520 tk
2. Rui Fish 1.8kg - 620 tk
3. Alu (Potato) 5kg - 180 tk
4. Peyaj (Onion) 2kg - 150 tk
5. Dim (Eggs) 1 crate - 410 tk
6. Lebu & Kacha Morich - 70 tk
7. Mustard Oil (Teer) 1L - 210 tk`,
  },
  {
    title: 'Daily Grocery & Spices',
    text: `Babul General Store - Police Line
Date: 2026-03-10
Miniket Rice 25kg bag - 1850 tk
Mosur Dal 2kg - 260 tk
Soyabean Oil 5L - 920 tk
Lobon (Salt) 1kg - 40 tk
Holud & Dhonia Gura - 120 tk
Ginger & Garlic paste - 160 tk`,
  },
  {
    title: 'Cook & Gas Utility Bill',
    text: `Monthly Mess Utilities
Date: 2026-03-11
Cook Khala Monthly Bill - 3500 tk
LP Gas Cylinder 12kg Refill - 1450 tk
Internet Broadband Fee - 800 tk
Drinking Water Jar 10pcs - 300 tk`,
  },
];

interface ParsedExpenseItem {
  id: string;
  item: string;
  amount: number;
  category: ExpenseCategory;
  shopper: string;
  date: string;
  notes?: string;
}

export const QuickExpenseScannerModal: React.FC = () => {
  const {
    isExpenseScannerModalOpen,
    setIsExpenseScannerModalOpen,
    currentPeriod,
    members,
    bulkAddExpenses,
    isManagerMode,
  } = useMess();

  const todayStr = `${currentPeriod.year}-${currentPeriod.month < 10 ? '0' + currentPeriod.month : currentPeriod.month}-09`;

  const [rawText, setRawText] = useState<string>('');
  const [selectedShopper, setSelectedShopper] = useState<string>(
    members.length > 0 ? members[0].name : 'Aktar Hossain'
  );
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [defaultCategory, setDefaultCategory] = useState<ExpenseCategory>('Market Shopping');
  const [parsedItems, setParsedItems] = useState<ParsedExpenseItem[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse text into expense items
  const parseExpenseText = (text: string) => {
    setIsScanning(true);
    setTimeout(() => {
      const lines = text.split('\n').filter((l) => l.trim().length > 0);
      const items: ParsedExpenseItem[] = [];

      lines.forEach((line, index) => {
        // Skip header lines that don't contain prices
        const cleanLine = line.trim().replace(/^[\d+.)\-\*•]+\s*/, '');
        if (cleanLine.toLowerCase().includes('date:') || cleanLine.toLowerCase().includes('slip') || cleanLine.toLowerCase().includes('store')) {
          return;
        }

        // Try extracting amount from line
        // Match numbers like 520, 1850, 410 tk, 520tk, ৳ 500
        const priceMatch = cleanLine.match(/(\d+[\d,]*)\s*(?:tk|taka|bdt|৳|\/-)?$/i) ||
          cleanLine.match(/(?:tk|taka|bdt|৳|\/-)?\s*(\d+[\d,]*)$/i) ||
          cleanLine.match(/[-:]\s*(\d+[\d,]*)/);

        if (priceMatch) {
          const rawAmount = priceMatch[1].replace(/,/g, '');
          const amount = parseInt(rawAmount, 10);

          if (!isNaN(amount) && amount > 0) {
            // Item name is everything before price
            let itemName = cleanLine
              .replace(priceMatch[0], '')
              .replace(/[-:]\s*$/, '')
              .trim();

            if (!itemName) {
              itemName = `Bazaar Item #${index + 1}`;
            }

            // Auto-detect category
            let category: ExpenseCategory = defaultCategory;
            const lower = itemName.toLowerCase();
            if (lower.includes('gas') || lower.includes('cylinder')) {
              category = 'Gas';
            } else if (lower.includes('cook') || lower.includes('khala') || lower.includes('maid')) {
              category = 'Maid / Cook';
            } else if (lower.includes('net') || lower.includes('wifi') || lower.includes('internet')) {
              category = 'Internet';
            } else if (lower.includes('current') || lower.includes('electric') || lower.includes('water')) {
              category = 'Utility';
            } else if (lower.includes('rent') || lower.includes('house')) {
              category = 'Rent';
            } else {
              category = 'Market Shopping';
            }

            items.push({
              id: `scan_${Date.now()}_${index}`,
              item: itemName,
              amount,
              category,
              shopper: selectedShopper,
              date: selectedDate,
              notes: 'Imported via Quick Scanner',
            });
          }
        }
      });

      setParsedItems(items);
      setIsScanning(false);
    }, 400);
  };

  const handleApplySample = (sampleText: string) => {
    setRawText(sampleText);
    parseExpenseText(sampleText);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate OCR parsing from image file
    setIsScanning(true);
    setTimeout(() => {
      const simulatedText = SAMPLE_MEMOS[0].text;
      setRawText(simulatedText);
      parseExpenseText(simulatedText);
      setIsScanning(false);
    }, 800);
  };

  const handleCommitAll = () => {
    if (parsedItems.length === 0) return;

    const toImport = parsedItems.map((item) => ({
      date: item.date,
      item: item.item,
      amount: item.amount,
      category: item.category,
      shopper: item.shopper,
      notes: item.notes || 'Imported from Quick Scanner',
    }));

    const result = bulkAddExpenses(toImport);
    if (result.success) {
      setSuccessMessage(`Successfully added ${result.count} expenses totalling ৳ ${totalParsedAmount.toLocaleString()} to ledger!`);
      setTimeout(() => {
        setSuccessMessage(null);
        setParsedItems([]);
        setRawText('');
        setIsExpenseScannerModalOpen(false);
      }, 1800);
    }
  };

  const updateItemField = (id: string, field: keyof ParsedExpenseItem, value: any) => {
    setParsedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const removeItem = (id: string) => {
    setParsedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalParsedAmount = parsedItems.reduce((sum, item) => sum + item.amount, 0);

  if (!isExpenseScannerModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-slate-900 dark:text-white animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-950/20 to-indigo-950/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight">Quick Expense & Receipt Scanner</h3>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 text-[11px] font-bold">
                  OCR & Fast Entry
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Scan handwritten bazaar memos, paste raw receipts, and batch-import line items
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsExpenseScannerModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 scrollbar-thin">
          {/* Success Banner */}
          {successMessage && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 flex items-center gap-3 animate-in zoom-in-95">
              <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-xs sm:text-sm font-bold">{successMessage}</span>
            </div>
          )}

          {/* Quick Defaults Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
            {/* Shopper Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Default Shopper / Bazar Duty
              </label>
              <select
                value={selectedShopper}
                onChange={(e) => setSelectedShopper(e.target.value)}
                className="w-full text-xs font-semibold p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.name}>
                    👤 {m.name} ({m.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Date Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Expense Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full text-xs font-semibold p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            {/* Category Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Default Category
              </label>
              <select
                value={defaultCategory}
                onChange={(e) => setDefaultCategory(e.target.value as ExpenseCategory)}
                className="w-full text-xs font-semibold p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="Market Shopping">🛒 Market Shopping (Bazaar)</option>
                <option value="Utility">💡 Utility Bills</option>
                <option value="Maid / Cook">👩‍🍳 Maid / Cook Salary</option>
                <option value="Gas">🔥 LP Gas Cylinder</option>
                <option value="Internet">🌐 Internet / Wi-Fi</option>
                <option value="Rent">🏠 House Rent</option>
                <option value="Miscellaneous">📦 Miscellaneous</option>
              </select>
            </div>
          </div>

          {/* Scanner / Upload / Paste Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: Input / Scanner Area (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-purple-500" />
                  <span>Paste Receipt / Cash Memo Text</span>
                </span>
                <span className="text-[10px] text-slate-400">Auto-parses prices & names</span>
              </div>

              <textarea
                value={rawText}
                onChange={(e) => {
                  setRawText(e.target.value);
                  parseExpenseText(e.target.value);
                }}
                placeholder="Example:&#10;Broiler Chicken 2kg 460&#10;Alu 5kg 180&#10;Dim 1 dery 420&#10;Soyabean Oil 2L 380"
                rows={7}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 scrollbar-thin"
              />

              {/* Upload Image & Sample Presets */}
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border-2 border-dashed border-purple-400 dark:border-purple-600/50 hover:bg-purple-50 dark:hover:bg-purple-950/30 text-purple-700 dark:text-purple-300 text-xs font-bold transition cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Receipt Photo / Memo Image</span>
                </button>

                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Try Demo Presets:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {SAMPLE_MEMOS.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleApplySample(sample.text)}
                        className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-950 text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-300 text-[10px] font-semibold transition cursor-pointer border border-slate-200 dark:border-slate-700"
                      >
                        {sample.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Parsed Line Items Table (7 cols) */}
            <div className="lg:col-span-7 space-y-3 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <span>Extracted Items Preview ({parsedItems.length})</span>
                </span>
                <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                  Total: ৳ {totalParsedAmount.toLocaleString()}
                </span>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden flex-1 max-h-80 overflow-y-auto scrollbar-thin">
                {parsedItems.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 space-y-2">
                    <Scan className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 animate-pulse" />
                    <p className="text-xs font-medium">No items detected yet.</p>
                    <p className="text-[11px] text-slate-500">
                      Paste memo lines on the left or click a demo preset to auto-parse.
                    </p>
                  </div>
                ) : (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="p-2.5">Item Description</th>
                        <th className="p-2.5 w-24">Amount</th>
                        <th className="p-2.5 w-28">Category</th>
                        <th className="p-2.5 w-10 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                      {parsedItems.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.item}
                              onChange={(e) => updateItemField(item.id, 'item', e.target.value)}
                              className="w-full p-1 rounded bg-transparent font-medium text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 border-b border-transparent focus:border-purple-500 focus:outline-none"
                            />
                          </td>
                          <td className="p-2">
                            <div className="flex items-center gap-1 font-mono font-bold">
                              <span>৳</span>
                              <input
                                type="number"
                                value={item.amount}
                                onChange={(e) => updateItemField(item.id, 'amount', Number(e.target.value))}
                                className="w-16 p-1 rounded bg-transparent font-mono text-emerald-600 dark:text-emerald-400 focus:bg-white dark:focus:bg-slate-900 border-b border-transparent focus:border-purple-500 focus:outline-none"
                              />
                            </div>
                          </td>
                          <td className="p-2">
                            <select
                              value={item.category}
                              onChange={(e) => updateItemField(item.id, 'category', e.target.value)}
                              className="text-[11px] p-1 rounded bg-transparent border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                            >
                              <option value="Market Shopping">Market</option>
                              <option value="Utility">Utility</option>
                              <option value="Maid / Cook">Cook</option>
                              <option value="Gas">Gas</option>
                              <option value="Internet">Internet</option>
                              <option value="Rent">Rent</option>
                              <option value="Miscellaneous">Misc</option>
                            </select>
                          </td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition cursor-pointer"
                              title="Delete Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {parsedItems.length > 0 ? (
              <span>
                Ready to commit <strong>{parsedItems.length} items</strong> (৳ {totalParsedAmount.toLocaleString()})
              </span>
            ) : (
              <span>Paste receipt text or upload memo</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpenseScannerModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleCommitAll}
              disabled={parsedItems.length === 0}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white transition shadow-xs cursor-pointer ${
                parsedItems.length === 0
                  ? 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed opacity-60'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>Import All to Expense Ledger</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
