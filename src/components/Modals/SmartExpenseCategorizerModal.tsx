import React from 'react';
import { useMess } from '../../context/MessContext';
import { X, Sparkles } from 'lucide-react';
import { SmartExpenseCategorizer } from '../Expenses/SmartExpenseCategorizer';

export const SmartExpenseCategorizerModal: React.FC = () => {
  const { isCategorizerModalOpen, setIsCategorizerModalOpen } = useMess();

  if (!isCategorizerModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl overflow-hidden shadow-2xl my-8">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Smart Expense Categorizer & Bazar Parser
              </h3>
              <p className="text-xs text-amber-200">
                Natural language receipt parsing, automatic item taxonomy, and bulk import
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCategorizerModalOpen(false)}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[80vh] overflow-y-auto">
          <SmartExpenseCategorizer
            onBatchApply={() => {
              setTimeout(() => {
                setIsCategorizerModalOpen(false);
              }, 1200);
            }}
          />
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100/70 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={() => setIsCategorizerModalOpen(false)}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
