export type OfflineActionType =
  | 'ADD_EXPENSE'
  | 'DELETE_EXPENSE'
  | 'ADD_DEPOSIT'
  | 'DELETE_DEPOSIT'
  | 'UPSERT_MEAL';

export interface OfflineAction {
  id: string;
  timestamp: string; // ISO string
  type: OfflineActionType;
  payload: any;
  description: string;
}

const STORAGE_KEY = 'shield_mess_offline_queue';
const LAST_SYNC_KEY = 'shield_mess_last_sync_time';

/**
 * Get all queued offline actions from LocalStorage
 */
export function getOfflineQueue(): OfflineAction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to parse offline queue:', err);
    return [];
  }
}

/**
 * Save offline queue to LocalStorage
 */
export function saveOfflineQueue(queue: OfflineAction[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  } catch (err) {
    console.error('Failed to save offline queue:', err);
  }
}

/**
 * Add a new action to the offline queue
 */
export function enqueueOfflineAction(type: OfflineActionType, payload: any, description: string): OfflineAction[] {
  const queue = getOfflineQueue();
  const newAction: OfflineAction = {
    id: `offline_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    type,
    payload,
    description,
  };

  const updatedQueue = [...queue, newAction];
  saveOfflineQueue(updatedQueue);
  return updatedQueue;
}

/**
 * Clear offline queue
 */
export function clearOfflineQueue(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Get / Set Last Sync Time
 */
export function getLastSyncTime(): string | null {
  return localStorage.getItem(LAST_SYNC_KEY);
}

export function updateLastSyncTime(): string {
  const now = new Date().toISOString();
  localStorage.setItem(LAST_SYNC_KEY, now);
  return now;
}
