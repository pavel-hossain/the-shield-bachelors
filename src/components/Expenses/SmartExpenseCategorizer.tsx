import React, { useState } from 'react';
import { useMess } from '../../context/MessContext';
import {
  Sparkles,
  Zap,
  ShoppingBag,
  Tag,
  CheckCircle2,
  Trash2,
  Plus,
  ArrowRight,
  ListPlus,
  Flame,
  Info,
  Layers,
  Copy,
} from 'lucide-react';
import { parseSmartExpenseText, SMART_CATEGORY_RULES, generateSmartExpenseInsights } from '../../utils/smartExpenseParser';
import { ExpenseCategory, SmartCategoryItem } from '../../types';

interface SmartExpenseCategorizerProps {
  onBatchApply?: (items: { title: string; category: ExpenseCategory; amount: number; notes: string }[]) => void;
  compact?: boolean;
}

export const SmartExpenseCategorizer: React.FC<SmartExpenseCategorizerProps> = ({
  onBatchApply,
  compact = false,
}) => {
  const {
    members,
    expenses,
    currentPeriod,
    addExpense,
    bulkAddExpenses,
    isManagerMode,
    setIsCategorizerModalOpen,
  } = useMess();

  const [rawInput, setRawInput] = useState(
    'Murgi 2kg 520, Rui mach 1.5kg 680, Miniket chal 25kg 1650, Soyabean tel 5L 920, Piaj 3kg 210, Alu 5kg 180, Bua salary 1500, LPG Cylinder gas 1450'
  );
  const [parsedItems, setParsedItems] = useState<SmartCategoryItem[]>(() =>
    parseSmartExpenseText(
      'Murgi 2kg 520, Rui mach 1.5kg 680, Miniket chal 25kg 1650, Soyabean tel 5L 920, Piaj 3kg 210, Alu 5kg 180, Bua salary 1500, LPG Cylinder gas 1450'
    )
  );
  const [selectedShopperId, setSelectedShopperId] = useState(members[0]?.id || 'm1');
  const [appliedCount, setAppliedCount] = useState<number | null>(null);

  const handleParse = () => {
    const items = parseSmartExpenseText(rawInput);
    setParsedItems(items);
  };

  const handleRemoveItem = (id: string) => {
    setParsedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof SmartCategoryItem, value: any) => {
    setParsedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleApplyAll = () => {
    if (parsedItems.length === 0) return;

    const todayStr = `${currentPeriod.year}-${currentPeriod.month < 10 ? '0' + currentPeriod.month : currentPeriod.month}-09`;

    const mapped = parsedItems.map((item) => ({
      date: todayStr,
      title: item.item + (item.quantity ? ` (${item.quantity})` : ''),
      category: item.category,
      amount: item.estimatedPrice,
      paidByMemberId: selectedShopperId,
      notes: `Smart Auto-Categorized: ${item.subCategory} [${item.tags.join(', ')}]`,
    }));

    if (onBatchApply) {
      onBatchApply(mapped);
    } else {
      bulkAddExpenses(mapped);
    }

    setAppliedCount(mapped.length);
    setTimeout(() => {
      setAppliedCount(null);
      setParsedItems([]);
      setRawInput('');
    }, 2000);
  };

  const totalCalculated = parsedItems.reduce((sum, item) => sum + (Number(item.estimatedPrice) || 0), 0);

  // Quick preset sample text
  const loadPreset = (type: 'bazar' | 'monthly' | 'utilities') => {
    if (type === 'bazar') {
      const text = 'Beef 2kg 1600, Rui mach 750, Murgi 540, Dim 2 hali 280, Potol 1kg 50, Tomato 80, Kacha morich 40';
      setRawInput(text);
      setParsedItems(parseSmartExpenseText(text));
    } else if (type === 'monthly') {
      const text = 'Chal 50kg 3300, Tel 5L 950, Dal 3kg 420, Lobon 2 packet 80, Mosla gura 320, Harpic & Vim 260';
      setRawInput(text);
      setParsedItems(parseSmartExpenseText(text));
    } else if (type === 'utilities') {
      const text = 'Bua khala salary 2000, LPG Gas Cylinder 1450, WiFi Internet Bill 800, DESCO Current Bill 1850, Moila bill 100';
      setRawInput(text);
      setParsedItems(parseSmartExpenseText(text));
    }
  };

  if (compact) {
    return (
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Smart Expense Categorizer
            </h4>
          </div>
          <button
            onClick={() => setIsCategorizerModalOpen(true)}
            className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Open Wizard
          </button>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
          Paste any bazaar list in Bengali or English; our engine auto-classifies items, extracts prices, and generates tags.
        </p>
        <button
          onClick={() => setIsCategorizerModalOpen(true)}
          className="w-full bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-bold py-2 rounded-lg transition flex items-center justify-center gap-1.5"
        >
          <ListPlus className="w-3.5 h-3.5 text-amber-400" />
          <span>Launch AI Auto-Categorizer</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-4 p-4 sm:p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-500">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Smart Expense Categorizer & Receipt NLP</span>
              <span className="text-[10px] bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full">
                Auto-Tagging
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Paste multi-item market slips or daily expense messages — auto-extracts item, quantity, category, and price
            </p>
          </div>
        </div>

        {/* Preset Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] uppercase font-bold text-slate-400">Presets:</span>
          <button
            onClick={() => loadPreset('bazar')}
            className="text-[11px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg font-medium transition cursor-pointer"
          >
            Fresh Bazar
          </button>
          <button
            onClick={() => loadPreset('monthly')}
            className="text-[11px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg font-medium transition cursor-pointer"
          >
            Monthly Grocery
          </button>
          <button
            onClick={() => loadPreset('utilities')}
            className="text-[11px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg font-medium transition cursor-pointer"
          >
            Fixed Bills
          </button>
        </div>
      </div>

      {/* Input Area */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          Paste Raw Expense Text or Bazar Notes (Separate items with commas or newlines)
        </label>
        <div className="relative">
          <textarea
            rows={3}
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            placeholder="e.g. Miniket chal 25kg 1650, Broiler chicken 2kg 460, Dim 1 dozen 150, Alu 5kg 175, Tel 2L 380..."
            className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 font-mono leading-relaxed"
          />
        </div>
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={handleParse}
            className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Process & Auto-Categorize</span>
          </button>
          <span className="text-[11px] text-slate-400">
            Detected <strong>{parsedItems.length}</strong> items • Total: <strong>৳{totalCalculated.toLocaleString()}</strong>
          </span>
        </div>
      </div>

      {/* Parsed Items List / Table */}
      {parsedItems.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-500" />
              <span>Extracted & Categorized Item Matrix</span>
            </h4>

            {/* Shopper Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">Shopper / Paid By:</span>
              <select
                value={selectedShopperId}
                onChange={(e) => setSelectedShopperId(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-900 dark:text-white"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.roomNo ? `Room ${m.roomNo}` : m.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-2.5">Item Name & Qty</th>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5">Sub-Category & Tags</th>
                  <th className="p-2.5 text-right">Price (৳)</th>
                  <th className="p-2.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {parsedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={item.item}
                        onChange={(e) => handleUpdateItem(item.id, 'item', e.target.value)}
                        className="bg-transparent font-semibold text-slate-900 dark:text-white w-full border-b border-transparent focus:border-amber-500 focus:outline-hidden"
                      />
                      {item.quantity && (
                        <span className="text-[10px] text-slate-400 font-normal block">
                          Qty: {item.quantity}
                        </span>
                      )}
                    </td>
                    <td className="p-2.5">
                      <select
                        value={item.category}
                        onChange={(e) => handleUpdateItem(item.id, 'category', e.target.value as ExpenseCategory)}
                        className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-2 py-1 text-[11px] font-bold text-slate-800 dark:text-slate-200"
                      >
                        <option value="Market Shopping">Market Shopping</option>
                        <option value="Gas">Gas</option>
                        <option value="Maid / Cook">Maid / Cook</option>
                        <option value="Utility">Utility</option>
                        <option value="Internet">Internet</option>
                        <option value="Rent">Rent</option>
                        <option value="Miscellaneous">Miscellaneous</option>
                      </select>
                    </td>
                    <td className="p-2.5">
                      <div className="text-[11px] font-medium text-slate-800 dark:text-slate-200">
                        {item.subCategory}
                      </div>
                      <div className="flex items-center gap-1 flex-wrap mt-0.5">
                        {item.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[9px] font-semibold px-1.5 py-0.5 rounded-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-2.5 text-right font-mono">
                      <input
                        type="number"
                        value={item.estimatedPrice}
                        onChange={(e) => handleUpdateItem(item.id, 'estimatedPrice', parseFloat(e.target.value) || 0)}
                        className="bg-transparent text-right font-bold text-slate-900 dark:text-white w-20 border-b border-transparent focus:border-amber-500 focus:outline-hidden"
                      />
                    </td>
                    <td className="p-2.5 text-center">
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-slate-400 hover:text-rose-500 p-1 rounded-md transition cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Batch Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/50">
            <div className="text-xs text-amber-900 dark:text-amber-200">
              Ready to import <strong>{parsedItems.length} expenses</strong> totalling{' '}
              <strong className="text-base font-black">৳{totalCalculated.toLocaleString()}</strong>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleApplyAll}
                className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Bulk Import All to Expenses</span>
              </button>
            </div>
          </div>

          {appliedCount !== null && (
            <div className="p-3 bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Successfully imported {appliedCount} categorized expenses into the active mess ledger!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
