import React, { useState } from 'react';
import { useMess } from '../../context/MessContext';
import { Database, Download, Upload, X, ShieldAlert, CheckCircle2, FileJson, RefreshCw } from 'lucide-react';

export const BackupModal: React.FC = () => {
  const {
    isBackupModalOpen,
    setIsBackupModalOpen,
    exportBackupData,
    restoreBackupData,
    isManagerMode,
    currentPeriod,
    members,
    meals,
    expenses,
    deposits,
  } = useMess();

  const [restoreFile, setRestoreFile] = useState<File | null>(null);
  const [parsedPreview, setParsedPreview] = useState<any | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isBackupModalOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      setStatusMessage({ type: 'error', text: 'Please select a valid JSON backup file (.json).' });
      return;
    }

    setRestoreFile(file);
    setStatusMessage(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        setParsedPreview(json);
      } catch (err) {
        setStatusMessage({ type: 'error', text: 'Could not parse JSON file. File may be corrupted.' });
        setParsedPreview(null);
      }
    };
    reader.readAsText(file);
  };

  const handleRestoreSubmit = () => {
    if (!parsedPreview) return;
    setIsProcessing(true);

    setTimeout(() => {
      const res = restoreBackupData(parsedPreview);
      setIsProcessing(false);
      if (res.success) {
        setStatusMessage({ type: 'success', text: res.message });
        setRestoreFile(null);
        setParsedPreview(null);
      } else {
        setStatusMessage({ type: 'error', text: res.message });
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-xl rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 rounded-xl font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                Data Management & Backup
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Export JSON backup or restore local mess records safely
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsBackupModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Toast/Banner */}
        {statusMessage && (
          <div
            className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-semibold ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Section 1: Export Backup */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/70 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Export JSON Backup File</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Download current month & historical records as a timestamped JSON file.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Members</span>
              <span className="font-bold text-slate-900 dark:text-white">{members.length}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Meals</span>
              <span className="font-bold text-slate-900 dark:text-white">{meals.length}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Expenses</span>
              <span className="font-bold text-slate-900 dark:text-white">{expenses.length}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Deposits</span>
              <span className="font-bold text-slate-900 dark:text-white">{deposits.length}</span>
            </div>
          </div>

          <button
            onClick={exportBackupData}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download Backup JSON ({currentPeriod.label})</span>
          </button>
        </div>

        {/* Section 2: Restore Backup */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/70 space-y-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Restore Backup File</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Upload a previously exported JSON backup to restore mess database state.
            </p>
          </div>

          {!isManagerMode ? (
            <div className="p-3 bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 rounded-lg text-xs font-semibold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Restoring database requires Manager Access Mode. Please switch roles in the top bar.</span>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-white dark:bg-slate-900 transition">
                <FileJson className="w-8 h-8 text-indigo-500 mb-1" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {restoreFile ? restoreFile.name : 'Select or drag JSON backup file'}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">Only .json files are accepted</span>
                <input type="file" accept=".json" onChange={handleFileChange} className="hidden" />
              </label>

              {parsedPreview && (
                <div className="bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/60 p-3 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between text-indigo-900 dark:text-indigo-200 font-bold">
                    <span>Backup Preview:</span>
                    <span>{parsedPreview.appName || 'Shield Mess Backup'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300 text-[11px]">
                    <div>
                      • Members: <strong className="text-slate-900 dark:text-white">{parsedPreview.members?.length || 0}</strong>
                    </div>
                    <div>
                      • Meal Logs: <strong className="text-slate-900 dark:text-white">{parsedPreview.meals?.length || 0}</strong>
                    </div>
                    <div>
                      • Expenses: <strong className="text-slate-900 dark:text-white">{parsedPreview.expenses?.length || 0}</strong>
                    </div>
                    <div>
                      • Deposits: <strong className="text-slate-900 dark:text-white">{parsedPreview.deposits?.length || 0}</strong>
                    </div>
                  </div>
                  {parsedPreview.exportedAt && (
                    <div className="text-[10px] text-indigo-600 dark:text-indigo-400 pt-1 border-t border-indigo-200 dark:border-indigo-800/50">
                      Exported on: {new Date(parsedPreview.exportedAt).toLocaleString()}
                    </div>
                  )}
                </div>
              )}

              {parsedPreview && (
                <button
                  onClick={handleRestoreSubmit}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-xs disabled:opacity-50"
                >
                  {isProcessing ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  <span>{isProcessing ? 'Restoring Database...' : 'Confirm & Restore All Records'}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 text-center text-[11px] text-slate-400">
          The Shield Bachelors Mess System • Automatic Offline Persistence Enabled
        </div>
      </div>
    </div>
  );
};
