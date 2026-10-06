import React from 'react';
import type { AppNotification } from '../../types/notification.types';
import { notificationIcon, notificationTypeLabel, formatRelativeTime } from '../../utils/notification.utils';

interface NotificationItemProps {
  notification: AppNotification;
  onClick: (notification: AppNotification) => void;
  onDelete: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClick, onDelete }) => (
  <div
    onClick={() => onClick(notification)}
    className={`flex items-start gap-3 px-3 py-3 rounded-xl cursor-pointer transition-colors group ${
      notification.isRead ? 'hover:bg-gray-50' : 'bg-indigo-50/60 hover:bg-indigo-50'
    }`}
  >
    <div className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-base shrink-0">
      {notificationIcon(notification.type)}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <p className={`text-sm truncate ${notification.isRead ? 'text-gray-700' : 'font-semibold text-gray-900'}`}>
          {notification.title}
        </p>
        {!notification.isRead && <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />}
      </div>
      <p className="text-xs text-gray-500 truncate mt-0.5">{notification.message}</p>
      <p className="text-[11px] text-gray-400 mt-1">
        {notificationTypeLabel(notification.type)} · {formatRelativeTime(notification.createdAt)}
      </p>
    </div>
    <button
      onClick={(e) => {
        e.stopPropagation();
        onDelete(notification._id);
      }}
      className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 text-xs px-1 shrink-0"
      aria-label="Delete notification"
    >
      ✕
    </button>
  </div>
);

export default NotificationItem;
