import React from 'react';
import { LayoutDashboard, Utensils, Calculator, BarChart3, ShoppingBag, Zap, CreditCard, Users } from 'lucide-react';

export type TabType = 'dashboard' | 'meals' | 'summary' | 'analytics' | 'expenses' | 'utilities' | 'deposits' | 'members';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> },
    { id: 'meals', label: 'Meals', icon: <Utensils className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> },
    { id: 'summary', label: 'Summary', icon: <Calculator className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> },
    { id: 'expenses', label: 'Expenses', icon: <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> },
    { id: 'utilities', label: 'Utilities', icon: <Zap className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> },
    { id: 'deposits', label: 'Deposits', icon: <CreditCard className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> },
    { id: 'members', label: 'Members', icon: <Users className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-lg h-16 py-1 px-1 transition-colors">
      <div className="max-w-4xl mx-auto h-full grid grid-cols-8 items-center justify-items-center">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full rounded-xl transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-emerald-50 dark:bg-emerald-950/60' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[8px] sm:text-[10px] leading-none mt-0.5 sm:mt-1 tracking-tighter sm:tracking-tight whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

