import React, { useState, useEffect } from 'react';
import { useMess } from '../../context/MessContext';
import { Search, X, Calendar, User, ShoppingBag, CreditCard, Utensils, Users } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchModalOpen,
    setIsSearchModalOpen,
    globalSearchResults,
    members,
    setSelectedMemberForStatement,
  } = useMess();
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Member' | 'Deposit' | 'Expense' | 'Meal Record'>('All');

  // Keyboard shortcut listener for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(!isSearchModalOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen, setIsSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  const rawResults = globalSearchResults(query);
  const results = rawResults.filter((item) => {
    if (typeFilter === 'All') return true;
    if (typeFilter === 'Member') return item.type === 'Member';
    if (typeFilter === 'Deposit') return item.type === 'Deposit';
    if (typeFilter === 'Expense') return item.type === 'Market Expense' || item.type === 'Utility Expense';
    if (typeFilter === 'Meal Record') return item.type === 'Meal Record';
    return true;
  });

  const handleResultClick = (item: any) => {
    if (item.type === 'Member') {
      const foundMember = members.find((m) => m.id === item.id);
      if (foundMember) {
        setSelectedMemberForStatement(foundMember);
      }
    }
    setIsSearchModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6 pt-12 sm:pt-20">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-xl rounded-2xl p-4 sm:p-5 shadow-2xl space-y-3.5 max-h-[85vh] flex flex-col">
        {/* Top Search Input Box */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <Search className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Quick Search (e.g. Member, bKash, Date, Amount)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 font-semibold text-sm focus:outline-none"
          />
          <kbd className="hidden sm:inline bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-1.5 py-0.5 text-[10px] text-slate-400 font-mono">
            ESC
          </kbd>
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'All', label: 'All Results' },
            { id: 'Member', label: 'Members', icon: Users },
            { id: 'Deposit', label: 'Deposits', icon: CreditCard },
            { id: 'Expense', label: 'Expenses', icon: ShoppingBag },
            { id: 'Meal Record', label: 'Meals', icon: Utensils },
          ].map((f) => {
            const Icon = f.icon;
            const isActive = typeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setTypeFilter(f.id as any)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {query.trim().length < 2 ? (
            <div className="text-center py-10 space-y-2 text-slate-400 text-xs">
              <Search className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
              <p>Type at least 2 characters to search Mess Database...</p>
              <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                <button
                  onClick={() => setQuery('Aktar')}
                  className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 transition"
                >
                  "Aktar"
                </button>
                <button
                  onClick={() => setQuery('bKash')}
                  className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 transition"
                >
                  "bKash"
                </button>
                <button
                  onClick={() => setQuery('3500')}
                  className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 transition"
                >
                  "3500"
                </button>
                <button
                  onClick={() => setQuery('Fish')}
                  className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 transition"
                >
                  "Fish"
                </button>
              </div>
            </div>
          ) : results.length === 0 ? (
            <p className="text-center py-10 text-xs text-slate-400">
              No records found matching "{query}"
            </p>
          ) : (
            results.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                onClick={() => handleResultClick(item)}
                className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50/60 dark:hover:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700/60 transition flex items-center justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        item.type === 'Member'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                          : item.type === 'Deposit'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : item.type === 'Market Expense'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                      }`}
                    >
                      {item.type}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition">
                      {item.title}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>{item.memberName}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{item.date}</span>
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-slate-900 dark:text-white block">
                    {item.amountOrCount}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[140px] block">
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
