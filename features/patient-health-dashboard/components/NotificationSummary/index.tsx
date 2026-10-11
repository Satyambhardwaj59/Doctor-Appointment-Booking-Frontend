import React from 'react';
import { notificationIcon, formatRelativeTime } from '../../../notification-center';
import type { NotificationType } from '../../../notification-center';
import SectionCard from '../SectionCard';
import type { DashboardNotification } from '../../types/patientDashboard.types';

interface NotificationSummaryProps {
  unreadCount: number;
  items: DashboardNotification[];
  error?: string;
  onOpen: (notification: DashboardNotification) => void;
  onViewAll: () => void;
}

const NotificationSummary: React.FC<NotificationSummaryProps> = ({ unreadCount, items, error, onOpen, onViewAll }) => (
  <SectionCard
    title="Notifications"
    icon="🔔"
    actionLabel="Open center"
    onAction={onViewAll}
    error={error}
    badge={
      unreadCount > 0 ? (
        <span className="text-[11px] font-bold text-white bg-red-500 rounded-full px-2 py-0.5" aria-label={`${unreadCount} unread`}>
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      ) : undefined
    }
  >
    {items.length === 0 ? (
      <p className="text-xs text-gray-400 bg-gray-50 rounded-xl px-3 py-6 text-center">You&apos;re all caught up.</p>
    ) : (
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item._id}>
            <button
              onClick={() => onOpen(item)}
              className="w-full flex items-start gap-3 text-left rounded-xl px-2 py-2 hover:bg-gray-50"
            >
              <span className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-sm shrink-0" aria-hidden="true">
                {notificationIcon(item.type as NotificationType)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-gray-900 truncate">{item.title}</span>
                <span className="block text-xs text-gray-500 truncate">{item.message}</span>
                <span className="block text-[10px] text-gray-400 mt-0.5">{formatRelativeTime(item.createdAt)}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    )}
  </SectionCard>
);

export default NotificationSummary;
