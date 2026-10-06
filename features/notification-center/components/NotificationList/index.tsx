import React from 'react';
import type { AppNotification } from '../../types/notification.types';
import { notificationTarget } from '../../utils/notification.utils';
import NotificationItem from '../NotificationItem';
import NotificationSkeleton from '../NotificationSkeleton';

interface NotificationListProps {
  notifications: AppNotification[];
  loading: boolean;
  error: string | null;
  onNavigate: (path: string) => void;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  loading,
  error,
  onNavigate,
  onMarkRead,
  onDelete,
  page,
  totalPages,
  onPageChange,
}) => {
  const handleClick = (notification: AppNotification) => {
    if (!notification.isRead) onMarkRead(notification._id);
    const target = notificationTarget(notification);
    if (target) onNavigate(target);
  };

  if (loading) return <NotificationSkeleton />;

  if (error) {
    return <p className="text-sm text-red-500 text-center py-8">{error}</p>;
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-14">
        <div className="text-3xl mb-2">🔔</div>
        <h3 className="text-sm font-semibold text-gray-700">No notifications</h3>
        <p className="text-xs text-gray-400 mt-1">You&apos;re all caught up.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-1">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification._id}
            notification={notification}
            onClick={handleClick}
            onDelete={onDelete}
          />
        ))}
      </div>

      {onPageChange && totalPages && totalPages > 1 && page && (
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="px-3 py-1.5 text-sm rounded-full border border-gray-300 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs text-gray-500">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-1.5 text-sm rounded-full border border-gray-300 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationList;
