import React, { useState } from 'react';
import { MessProvider } from './context/MessContext';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { ExecutiveDashboard } from './components/Dashboard/ExecutiveDashboard';
import { DailyMealsModule } from './components/DailyMeals/DailyMealsModule';
import { ExpensesModule } from './components/Expenses/ExpensesModule';
import { UtilitiesModule } from './components/Utilities/UtilitiesModule';
import { DepositsModule } from './components/Deposits/DepositsModule';
import { MembersModule } from './components/Members/MembersModule';

import { MemberStatementModal } from './components/Modals/MemberStatementModal';
import { GlobalSearchModal } from './components/Modals/GlobalSearchModal';
import { ExcelParserModal } from './components/Modals/ExcelParserModal';
import { BackupModal } from './components/Modals/BackupModal';
import { ExportSummaryModal } from './components/Modals/ExportSummaryModal';
import { A4PDFReportModal } from './components/Reports/A4PDFReportModal';

function MainLayout() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [isAddDepositModalOpen, setIsAddDepositModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors antialiased">
      {/* Brand Top Header */}
      <Header />

      {/* Main Container Viewport */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 pt-4">
        {activeTab === 'dashboard' && (
          <ExecutiveDashboard
            setActiveTab={setActiveTab}
            openAddExpenseModal={() => {
              setActiveTab('expenses');
              setIsAddExpenseModalOpen(true);
            }}
            openAddDepositModal={() => {
              setActiveTab('deposits');
              setIsAddDepositModalOpen(true);
            }}
          />
        )}

        {activeTab === 'meals' && <DailyMealsModule />}

        {activeTab === 'expenses' && (
          <ExpensesModule
            isAddModalOpen={isAddExpenseModalOpen}
            setIsAddModalOpen={setIsAddExpenseModalOpen}
          />
        )}

        {activeTab === 'utilities' && <UtilitiesModule />}

        {activeTab === 'deposits' && (
          <DepositsModule
            isAddModalOpen={isAddDepositModalOpen}
            setIsAddModalOpen={setIsAddDepositModalOpen}
          />
        )}

        {activeTab === 'members' && <MembersModule />}
      </main>

      {/* Fixed Sleek Bottom Mobile Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Global Application Modals */}
      <MemberStatementModal />
      <GlobalSearchModal />
      <ExcelParserModal />
      <BackupModal />
      <ExportSummaryModal />
      <A4PDFReportModal />
    </div>
  );
}

export default function App() {
  return (
    <MessProvider>
      <MainLayout />
    </MessProvider>
  );
}
