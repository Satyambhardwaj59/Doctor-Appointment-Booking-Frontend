/**
 * Notification Center Feature Module
 * Role-agnostic credentials (same pattern as the other feature modules).
 */

// Components
export { default as NotificationCenter } from './components/NotificationCenter';
export { default as NotificationBell } from './components/NotificationBell';
export { default as NotificationList } from './components/NotificationList';
export { default as NotificationItem } from './components/NotificationItem';
export { default as NotificationFilters } from './components/NotificationFilters';
export { default as NotificationPreferences } from './components/NotificationPreferences';
export { default as NotificationSkeleton } from './components/NotificationSkeleton';

// Hooks
export { useNotifications } from './hooks/useNotifications';
export { useNotificationSocket } from './hooks/useNotificationSocket';

// Services
export * as notificationService from './services/notification.service';
export { getNotificationSocket, disconnectNotificationSocket } from './services/notificationSocket.service';

// Utils
export * from './utils/notification.utils';

// Types
export * from './types/notification.types';
