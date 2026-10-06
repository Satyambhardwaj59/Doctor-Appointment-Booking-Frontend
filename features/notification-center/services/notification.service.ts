import axios from 'axios';
import type {
  NotificationCredentials,
  NotificationsListResponse,
  UnreadCountResponse,
  NotificationActionResponse,
  PreferencesResponse,
  NotificationPreferences,
} from '../types/notification.types';

const getBackendUrl = () =>
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'https://doctor-appointment-booking-backend-92ui.onrender.com';

const headersFor = ({ token, role }: NotificationCredentials) =>
  role === 'doctor' ? { dtoken: token } : { token };

export interface NotificationQuery {
  type?: string;
  isRead?: boolean;
  page?: number;
  limit?: number;
}

export const listNotifications = async (
  credentials: NotificationCredentials,
  query: NotificationQuery
): Promise<NotificationsListResponse> => {
  const { data } = await axios.get(`${getBackendUrl()}/api/notifications`, {
    params: { ...query, isRead: query.isRead === undefined ? undefined : String(query.isRead) },
    headers: headersFor(credentials),
  });
  return data;
};

export const getUnreadCount = async (credentials: NotificationCredentials): Promise<UnreadCountResponse> => {
  const { data } = await axios.get(`${getBackendUrl()}/api/notifications/unread-count`, {
    headers: headersFor(credentials),
  });
  return data;
};

export const markNotificationRead = async (
  credentials: NotificationCredentials,
  id: string
): Promise<NotificationActionResponse> => {
  const { data } = await axios.patch(`${getBackendUrl()}/api/notifications/${id}/read`, {}, {
    headers: headersFor(credentials),
  });
  return data;
};

export const markAllNotificationsRead = async (
  credentials: NotificationCredentials
): Promise<{ success: boolean; message?: string; updatedCount?: number }> => {
  const { data } = await axios.patch(`${getBackendUrl()}/api/notifications/read-all`, {}, {
    headers: headersFor(credentials),
  });
  return data;
};

export const deleteNotification = async (
  credentials: NotificationCredentials,
  id: string
): Promise<{ success: boolean; message?: string }> => {
  const { data } = await axios.delete(`${getBackendUrl()}/api/notifications/${id}`, {
    headers: headersFor(credentials),
  });
  return data;
};

export const getPreferences = async (credentials: NotificationCredentials): Promise<PreferencesResponse> => {
  const { data } = await axios.get(`${getBackendUrl()}/api/notifications/preferences`, {
    headers: headersFor(credentials),
  });
  return data;
};

export const updatePreferences = async (
  credentials: NotificationCredentials,
  updates: Partial<NotificationPreferences>
): Promise<PreferencesResponse> => {
  const { data } = await axios.patch(`${getBackendUrl()}/api/notifications/preferences`, updates, {
    headers: headersFor(credentials),
  });
  return data;
};
