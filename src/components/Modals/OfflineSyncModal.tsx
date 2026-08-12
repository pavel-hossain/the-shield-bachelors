import React from 'react';
import { useMess } from '../../context/MessContext';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  Trash2,
  X,
  CheckCircle2,
  Clock,
  Layers,
  Receipt,
  Utensils,
  Wallet,
} from 'lucide-react';

interface OfflineSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfflineSyncModal: React.FC<OfflineSyncModalProps> = ({ isOpen, onClose }) => {
  const {
    isOnline,
    pendingSyncQueue,
    syncOfflineQueueNow,
    clearPendingOfflineQueue,
    lastSyncTime,
  } = useMess();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl text-white flex items-center justify-center shadow-md ${
                isOnline ? 'bg-emerald-600 shadow-emerald-500/20' : 'bg-amber-600 shadow-amber-500/20'
              }`}
            >
              {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <span>Offline Sync Manager</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isOnline
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                  }`}
                >
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isOnline
                  ? 'Connected to Mess server. Auto-syncing active.'
                  : 'Operating in local offline mode. Changes queued locally.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sync Status Banner */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              Pending Queue: {pendingSyncQueue.length} Record(s)
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>
                Last synced:{' '}
                {lastSyncTime
                  ? new Date(lastSyncTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : 'Never'}
              </span>
            </span>
          </div>

          <button
            onClick={syncOfflineQueueNow}
            disabled={pendingSyncQueue.length === 0}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer ${
              pendingSyncQueue.length > 0
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Now</span>
          </button>
        </div>

        {/* Queued Actions List */}
        <div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-500" />
            <span>Queued Offline Operations</span>
          </span>

          {pendingSyncQueue.length === 0 ? (
            <div className="p-6 text-center bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-700/80 space-y-1.5">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">All data fully synced!</p>
              <p className="text-[11px] text-slate-400">No pending offline expenses or meal records in queue.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {pendingSyncQueue.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    {item.type.includes('EXPENSE') && <Receipt className="w-4 h-4 text-amber-500" />}
                    {item.type.includes('MEAL') && <Utensils className="w-4 h-4 text-emerald-500" />}
                    {item.type.includes('DEPOSIT') && <Wallet className="w-4 h-4 text-indigo-500" />}
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">
                        {item.description}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Queued at {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Clear Queue Option */}
        {pendingSyncQueue.length > 0 && (
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={clearPendingOfflineQueue}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Discard Queued Items</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
