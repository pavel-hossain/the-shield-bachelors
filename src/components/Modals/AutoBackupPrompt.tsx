import React, { useState } from 'react';
import { useMess } from '../../context/MessContext';
import {
  ShieldAlert,
  Download,
  RotateCcw,
  Trash2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X,
  History,
  HardDrive,
  Save,
  Calendar,
  Settings,
  Database,
  ArrowDownToLine,
  FileCheck,
} from 'lucide-react';
import { DataSnapshot } from '../../types';

export const AutoBackupPrompt: React.FC = () => {
  const {
    isBackupPromptVisible,
    dismissBackupPrompt,
    exportBackupData,
    snapshots,
    createSnapshot,
    restoreSnapshot,
    deleteSnapshot,
    autoBackupSchedule,
    setAutoBackupSchedule,
    isBackupModalOpen,
    setIsBackupModalOpen,
    currentPeriod,
    members,
    meals,
    expenses,
    deposits,
    restoreBackupData,
  } = useMess();

  const [snapshotLabel, setSnapshotLabel] = useState('');
  const [restoreConfirmId, setRestoreConfirmId] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'snapshots' | 'json' | 'schedule'>('snapshots');

  const handleCreateSnapshot = () => {
    createSnapshot(snapshotLabel.trim() || undefined);
    setSnapshotLabel('');
    setActionSuccessMsg('New point-in-time snapshot created successfully!');
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  const handleRestore = (id: string) => {
    const res = restoreSnapshot(id);
    setRestoreConfirmId(null);
    if (res.success) {
      setActionSuccessMsg(res.message);
      setTimeout(() => setActionSuccessMsg(null), 4000);
    }
  };

  const handleJSONFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const res = restoreBackupData(parsed);
        if (res.success) {
          setActionSuccessMsg('JSON Backup restored successfully!');
          setTimeout(() => setActionSuccessMsg(null), 4000);
        } else {
          alert(`Failed to restore: ${res.message}`);
        }
      } catch (err: any) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      {/* 1. Floating Prompt Notification Banner (Visible when scheduled interval passed) */}
      {isBackupPromptVisible && !isBackupModalOpen && (
        <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 max-w-md w-[calc(100vw-2rem)] bg-slate-900 text-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-amber-500/40 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                  <span>Data Safety Checkpoint</span>
                </h4>
                <button
                  onClick={dismissBackupPrompt}
                  className="text-slate-400 hover:text-white p-1 rounded-lg transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                It has been a while since your last database backup for <strong>{currentPeriod.label}</strong>. We recommend downloading a backup or creating a snapshot.
              </p>

              <div className="flex items-center gap-2 mt-3.5 flex-wrap">
                <button
                  onClick={() => {
                    exportBackupData();
                    dismissBackupPrompt();
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .JSON</span>
                </button>

                <button
                  onClick={() => {
                    dismissBackupPrompt();
                    setIsBackupModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Snapshots Hub</span>
                </button>

                <button
                  onClick={dismissBackupPrompt}
                  className="px-2 py-1.5 text-slate-400 hover:text-slate-200 text-xs transition"
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Comprehensive Snapshots & Backup Hub Modal */}
      {isBackupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                    Backup, Snapshots & Disaster Recovery
                  </h2>
                  <p className="text-xs text-indigo-200 font-medium">
                    Point-in-time state restore & full JSON data archive
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsBackupModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-2 bg-slate-50 dark:bg-slate-900/50 shrink-0">
              <button
                onClick={() => setActiveTab('snapshots')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeTab === 'snapshots'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Snapshots History ({snapshots.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('json')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeTab === 'json'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>JSON Export & Import</span>
              </button>

              <button
                onClick={() => setActiveTab('schedule')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeTab === 'schedule'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Auto-Prompt Schedule</span>
              </button>
            </div>

            {/* Content Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
              {actionSuccessMsg && (
                <div className="p-3 bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{actionSuccessMsg}</span>
                </div>
              )}

              {/* TAB 1: SNAPSHOTS */}
              {activeTab === 'snapshots' && (
                <div className="space-y-5">
                  {/* Create Snapshot Form */}
                  <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Create Point-in-Time Snapshot
                      </label>
                      <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                        Instant 1-Click Rollback Point
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={snapshotLabel}
                        onChange={(e) => setSnapshotLabel(e.target.value)}
                        placeholder="Snapshot name (e.g. Before month-end calculation)"
                        className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                      <button
                        onClick={handleCreateSnapshot}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Snapshot</span>
                      </button>
                    </div>
                  </div>

                  {/* Current Active Database Stat */}
                  <div className="grid grid-cols-4 gap-2 text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs">
                    <div>
                      <p className="text-slate-500 text-[10px] uppercase font-bold">Members</p>
                      <p className="font-black text-slate-900 dark:text-white mt-0.5">{members.length}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-[10px] uppercase font-bold">Meals</p>
                      <p className="font-black text-slate-900 dark:text-white mt-0.5">{meals.length}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-[10px] uppercase font-bold">Expenses</p>
                      <p className="font-black text-slate-900 dark:text-white mt-0.5">{expenses.length}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-[10px] uppercase font-bold">Deposits</p>
                      <p className="font-black text-slate-900 dark:text-white mt-0.5">{deposits.length}</p>
                    </div>
                  </div>

                  {/* Snapshots List */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider">
                      Saved Snapshots ({snapshots.length}/10)
                    </h3>

                    {snapshots.length === 0 ? (
                      <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/20 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl">
                        <History className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
                        <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                          No snapshot checkpoints saved yet.
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Click "Save Snapshot" above to create an instant rollback state.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {snapshots.map((snap) => (
                          <div
                            key={snap.id}
                            className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-900 dark:text-white">
                                  {snap.label}
                                </span>
                                <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                                  <Clock className="w-3 h-3" />
                                  {new Date(snap.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })},{' '}
                                  {new Date(snap.timestamp).toLocaleDateString()}
                                </span>
                              </div>

                              <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                                <span>{snap.membersCount} Members</span>
                                <span>•</span>
                                <span>{snap.mealsCount} Meals</span>
                                <span>•</span>
                                <span>৳ {snap.totalExpenseAmount.toLocaleString()} Exp</span>
                                <span>•</span>
                                <span>৳ {snap.totalDepositsAmount.toLocaleString()} Dep</span>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 self-end sm:self-center">
                              {restoreConfirmId === snap.id ? (
                                <div className="flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/60 p-1 rounded-xl border border-rose-200 dark:border-rose-800">
                                  <span className="text-[11px] font-bold text-rose-600 px-1.5">Sure?</span>
                                  <button
                                    onClick={() => handleRestore(snap.id)}
                                    className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 cursor-pointer"
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    onClick={() => setRestoreConfirmId(null)}
                                    className="px-2 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setRestoreConfirmId(snap.id)}
                                  className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold hover:bg-indigo-100 transition flex items-center gap-1 cursor-pointer"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  <span>Rollback</span>
                                </button>
                              )}

                              <button
                                onClick={() => deleteSnapshot(snap.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition"
                                title="Delete Snapshot"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: JSON EXPORT & IMPORT */}
              {activeTab === 'json' && (
                <div className="space-y-5">
                  <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Download className="w-4 h-4 text-emerald-600" />
                        <span>Export Full Database Backup (.JSON)</span>
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Download a complete, offline-compatible JSON file containing all periods, meals, expenses & deposits.
                      </p>
                    </div>
                    <button
                      onClick={exportBackupData}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
                    >
                      <ArrowDownToLine className="w-4 h-4" />
                      <span>Download File</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-3">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-indigo-600" />
                      <span>Restore from JSON File</span>
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Upload any previously exported `.json` file to restore the entire mess database.
                    </p>

                    <label className="flex items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl hover:border-indigo-500 transition cursor-pointer bg-white dark:bg-slate-800">
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleJSONFileUpload}
                        className="hidden"
                      />
                      <div className="text-center">
                        <Database className="w-8 h-8 text-indigo-500 mx-auto mb-1.5" />
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          Click to select JSON backup file
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Supported format: .json</p>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 3: SCHEDULE CONFIG */}
              {activeTab === 'schedule' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                      Automated Safety Reminder Schedule
                    </label>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                      How frequently would you like the system to remind you to download or create a backup checkpoint?
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { id: 'daily', label: 'Every 24 Hours (Daily)', desc: 'High frequency, ideal for active daily mess operations' },
                        { id: '3days', label: 'Every 3 Days (Recommended)', desc: 'Balanced interval for standard bachelors mess management' },
                        { id: 'weekly', label: 'Every 7 Days (Weekly)', desc: 'Low frequency checkpoint reminder' },
                        { id: 'off', label: 'Disabled', desc: 'Do not show automated reminder banners' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setAutoBackupSchedule(item.id as any)}
                          className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                            autoBackupSchedule === item.id
                              ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 ring-1 ring-indigo-500'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{item.label}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between shrink-0">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Snapshots are securely stored in browser local state.
              </div>
              <button
                onClick={() => setIsBackupModalOpen(false)}
                className="px-5 py-2 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
