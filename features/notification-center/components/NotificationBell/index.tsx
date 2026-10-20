'use client';

import React, { useContext, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppContext } from '../../../../context/AppContext';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationList from '../NotificationList';
import type { NotificationCredentials } from '../../types/notification.types';

interface NotificationBellProps {
  credentials?: NotificationCredentials | null;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ credentials: customCredentials }) => {
  const { token } = useContext(AppContext);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const credentials: NotificationCredentials | null = useMemo(() => {
    if (customCredentials !== undefined) return customCredentials;
    return token ? { token, role: 'patient' } : null;
  }, [customCredentials, token]);

  const { notifications, unreadCount, loading, error, markRead, markAllRead, remove } =
    useNotifications(credentials);

  if (!credentials) return null;

  const handleNavigate = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 text-gray-600 hover:text-gray-900"
        aria-label="Notifications"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            ref={panelRef}
            className="absolute right-0 mt-2 w-80 max-h-[70vh] overflow-y-auto bg-white border border-gray-200 rounded-2xl shadow-xl z-50 p-2"
          >
            <div className="flex items-center justify-between px-2 py-1.5">
              <p className="text-sm font-semibold text-gray-900">Notifications</p>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs text-indigo-600 hover:underline">
                  Mark all read
                </button>
              )}
            </div>

            <NotificationList
              notifications={notifications.slice(0, 8)}
              loading={loading}
              error={error}
              onNavigate={handleNavigate}
              onMarkRead={markRead}
              onDelete={remove}
            />

            <button
              onClick={() => handleNavigate('/notifications')}
              className="w-full text-center text-xs text-indigo-600 hover:underline py-2"
            >
              View all notifications
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
