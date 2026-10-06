import type { AppNotification, NotificationType } from '../types/notification.types';

const TYPE_ICONS: Record<NotificationType, string> = {
  APPOINTMENT: '📅',
  CONSULTATION: '🩺',
  PRESCRIPTION: '💊',
  MEDICATION: '⏰',
  CHAT: '💬',
  MEDICAL_RECORD: '📄',
  FAMILY: '👨‍👩‍👧',
  SYSTEM: '🔔',
};

const TYPE_LABELS: Record<NotificationType, string> = {
  APPOINTMENT: 'Appointment',
  CONSULTATION: 'Consultation',
  PRESCRIPTION: 'Prescription',
  MEDICATION: 'Medication',
  CHAT: 'Chat',
  MEDICAL_RECORD: 'Medical Record',
  FAMILY: 'Family',
  SYSTEM: 'System',
};

export const notificationIcon = (type: NotificationType): string => TYPE_ICONS[type] || '🔔';
export const notificationTypeLabel = (type: NotificationType): string => TYPE_LABELS[type] || type;

// Where clicking a notification should navigate to, per the feature's
// "click notification -> open related feature" requirement. Kept here
// (not baked into components) so it's a single, testable mapping.
export const notificationTarget = (notification: AppNotification): string | null => {
  const { type, data } = notification;
  switch (type) {
    case 'APPOINTMENT':
      return data.appointmentId ? '/my-appointments' : null;
    case 'CONSULTATION':
      if (data.queueId) return '/queue';
      return data.appointmentId ? '/my-appointments' : null;
    case 'PRESCRIPTION':
      return data.prescriptionId ? `/prescriptions/${data.prescriptionId}` : '/prescriptions';
    case 'MEDICATION':
      return '/prescriptions';
    case 'CHAT':
      return data.conversationId ? '/messages' : null;
    case 'MEDICAL_RECORD':
      return data.recordId ? `/medical-records/${data.recordId}` : '/medical-records';
    case 'FAMILY':
      return '/my-family';
    default:
      return null;
  }
};

export const formatRelativeTime = (isoDate: string): string => {
  const date = new Date(isoDate);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

export const extractErrorMessage = (error: unknown, fallback: string): string => {
  if (error && typeof error === 'object') {
    const maybeAxiosError = error as { response?: { data?: { message?: unknown } }; message?: unknown };
    const responseMessage = maybeAxiosError.response?.data?.message;
    if (typeof responseMessage === 'string' && responseMessage) return responseMessage;
    if (typeof maybeAxiosError.message === 'string' && maybeAxiosError.message) return maybeAxiosError.message;
  }
  return fallback;
};
