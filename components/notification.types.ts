export type UserRole = 'doctor' | 'patient';

export interface NotificationCredentials {
  token: string;
  role: UserRole;
}

export type NotificationType =
  | 'APPOINTMENT'
  | 'CONSULTATION'
  | 'PRESCRIPTION'
  | 'MEDICATION'
  | 'CHAT'
  | 'MEDICAL_RECORD'
  | 'FAMILY'
  | 'SYSTEM';

export const NOTIFICATION_TYPES: NotificationType[] = [
  'APPOINTMENT',
  'CONSULTATION',
  'PRESCRIPTION',
  'MEDICATION',
  'CHAT',
  'MEDICAL_RECORD',
  'FAMILY',
  'SYSTEM',
];

// Only enough to navigate to the related feature — never clinical detail.
export interface NotificationData {
  appointmentId?: string;
  consultationId?: string;
  prescriptionId?: string;
  medicationId?: string;
  conversationId?: string;
  recordId?: string;
  familyMemberId?: string;
  queueId?: string;
  doctorId?: string;
  patientId?: string;
}

export interface AppNotification {
  _id: string;
  userId: string;
  recipientRole: UserRole;
  type: NotificationType;
  title: string;
  message: string;
  data: NotificationData;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  expiresAt: string | null;
}

export type NotificationFilter = 'ALL' | 'UNREAD' | NotificationType;

export interface NotificationPreferences {
  appointments: boolean;
  consultations: boolean;
  prescriptions: boolean;
  medications: boolean;
  chat: boolean;
  medicalRecords: boolean;
  family: boolean;
}

export const PREFERENCE_CATEGORIES: (keyof NotificationPreferences)[] = [
  'appointments',
  'consultations',
  'prescriptions',
  'medications',
  'chat',
  'medicalRecords',
  'family',
];

// ─── API response shapes (mirror the backend's {success, message, ...}) ──

export interface NotificationsListResponse {
  success: boolean;
  message?: string;
  notifications?: AppNotification[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface UnreadCountResponse {
  success: boolean;
  message?: string;
  unreadCount?: number;
}

export interface NotificationActionResponse {
  success: boolean;
  message?: string;
  notification?: AppNotification;
}

export interface PreferencesResponse {
  success: boolean;
  message?: string;
  preferences?: NotificationPreferences;
}
