import type { QueueEntryStatus } from '../types/queue.types';

// Same "D_M_YYYY" format the appointment system stores in slotDate.
export const todaySlotDate = (date: Date = new Date()): string =>
  `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;

// Wording is deliberately approximate ("~") — it is an estimate.
export const formatWait = (minutes: number): string => {
  if (minutes <= 0) return 'Almost your turn';
  if (minutes < 60) return `~${minutes} minute${minutes === 1 ? '' : 's'}`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `~${hours} hr` : `~${hours} hr ${rest} min`;
};

const STATUS_LABELS: Record<QueueEntryStatus, string> = {
  WAITING: 'Waiting',
  CALLED: 'Called — please proceed',
  IN_CONSULTATION: 'In consultation',
  COMPLETED: 'Completed',
  SKIPPED: 'Skipped',
  CANCELLED: 'Left the queue',
};

const STATUS_STYLES: Record<QueueEntryStatus, string> = {
  WAITING: 'bg-yellow-50 text-yellow-700',
  CALLED: 'bg-indigo-50 text-indigo-700',
  IN_CONSULTATION: 'bg-green-50 text-green-700',
  COMPLETED: 'bg-gray-100 text-gray-600',
  SKIPPED: 'bg-red-50 text-red-600',
  CANCELLED: 'bg-gray-100 text-gray-500',
};

export const statusLabel = (status: QueueEntryStatus): string => STATUS_LABELS[status] || status;
export const statusStyle = (status: QueueEntryStatus): string => STATUS_STYLES[status] || 'bg-gray-100 text-gray-500';

export const formatTime = (isoDate: string | null): string =>
  isoDate ? new Date(isoDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—';

// Display-only decode of our own JWT (the doctor's queue is looked up by
// their own id). Never a security boundary — the backend re-verifies.
export const getUserIdFromToken = (token: string): string | null => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return typeof decoded.id === 'string' ? decoded.id : null;
  } catch {
    return null;
  }
};

export const extractErrorMessage = (error: unknown, fallback: string): string => {
  if (error && typeof error === 'object') {
    const maybe = error as { response?: { data?: { message?: unknown } }; message?: unknown };
    const responseMessage = maybe.response?.data?.message;
    if (typeof responseMessage === 'string' && responseMessage) return responseMessage;
    if (typeof maybe.message === 'string' && maybe.message) return maybe.message;
  }
  return fallback;
};
