import React, { useState } from 'react';
import { useMess } from '../../context/MessContext';
import { Search, X, Calendar, User, Tag, ArrowRight } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchModalOpen, setIsSearchModalOpen, globalSearchResults } = useMess();
  const [query, setQuery] = useState('');

  if (!isSearchModalOpen) return null;

  const results = globalSearchResults(query);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6 pt-12 sm:pt-20">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-xl rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4 max-h-[80vh] flex flex-col">
        {/* Top Search Input Box */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <Search className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Global search by member name, date (2026-08-01), or amount..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 font-semibold text-sm focus:outline-none"
          />
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {query.trim().length < 2 ? (
            <div className="text-center py-10 space-y-2 text-slate-400 text-xs">
              <Search className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
              <p>Type at least 2 characters to search Mess History...</p>
              <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                <button
                  onClick={() => setQuery('Aktar')}
                  className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-[11px] hover:bg-slate-200"
                >
                  "Aktar"
                </button>
                <button
                  onClick={() => setQuery('2026-08-01')}
                  className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-[11px] hover:bg-slate-200"
                >
                  "2026-08-01"
                </button>
                <button
                  onClick={() => setQuery('3500')}
                  className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-[11px] hover:bg-slate-200"
                >
                  "3500"
                </button>
              </div>
            </div>
          ) : results.length === 0 ? (
            <p className="text-center py-10 text-xs text-slate-400">
              No results found matching "{query}"
            </p>
          ) : (
            results.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/60 transition flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        item.type === 'Deposit'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : item.type === 'Market Expense'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                      }`}
                    >
                      {item.type}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{item.memberName}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{item.date}</span>
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-slate-900 dark:text-white block">
                    {item.amountOrCount}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[120px] block">
                    {item.details}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
