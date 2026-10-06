'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNotificationSocket } from './useNotificationSocket';
import {
  listNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from '../services/notification.service';
import { extractErrorMessage } from '../utils/notification.utils';
import type { AppNotification, NotificationCredentials, NotificationFilter } from '../types/notification.types';

const PAGE_SIZE = 20;

const filterToQuery = (filter: NotificationFilter) => {
  if (filter === 'ALL') return {};
  if (filter === 'UNREAD') return { isRead: false };
  return { type: filter };
};

export const useNotifications = (credentials: NotificationCredentials | null) => {
  const { socket, connectionState } = useNotificationSocket(credentials);

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilterState] = useState<NotificationFilter>('ALL');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resets the page whenever the filter changes, without an effect — see
  // features/family-accounts's EditFamilyMember for the same
  // render-time-adjustment pattern (React allows adjusting state during
  // render as a direct response to a changed value).
  const [lastFilter, setLastFilter] = useState(filter);
  if (filter !== lastFilter) {
    setLastFilter(filter);
    setPage(1);
  }

  const refresh = useCallback(async () => {
    if (!credentials) return;

    setLoading(true);
    setError(null);
    try {
      const data = await listNotifications(credentials, { ...filterToQuery(filter), page, limit: PAGE_SIZE });
      if (data.success) {
        setNotifications(data.notifications || []);
        setTotal(data.total || 0);
      } else {
        setError(data.message || 'Could not load notifications');
      }
    } catch (err: unknown) {
      setError(extractErrorMessage(err, 'Could not load notifications'));
    } finally {
      setLoading(false);
    }
  }, [credentials, filter, page]);

  const refreshUnreadCount = useCallback(async () => {
    if (!credentials) return;
    try {
      const data = await getUnreadCount(credentials);
      if (data.success) setUnreadCount(data.unreadCount || 0);
    } catch {
      // Non-critical — the bell just won't update this cycle.
    }
  }, [credentials]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    refreshUnreadCount();
  }, [refreshUnreadCount]);

  // Live updates: a new notification arrives, or the unread count changes
  // (read elsewhere, e.g. another tab). Also resyncs on every socket
  // 'connect' (including the first) so a dropped connection doesn't
  // silently miss anything — same pattern as the chat feature's useMessages.
  useEffect(() => {
    if (!socket) return;

    const handleNew = (notification: AppNotification) => {
      setUnreadCount((prev) => prev + 1);
      // Only splice into the visible list when it matches the current
      // filter/page-1 view; otherwise a background refresh on next visit
      // picks it up naturally.
      if (page === 1 && (filter === 'ALL' || filter === 'UNREAD' || filter === notification.type)) {
        setNotifications((prev) => [notification, ...prev]);
      }
    };

    const handleUnreadCount = ({ unreadCount: next }: { unreadCount: number }) => setUnreadCount(next);

    const handleReconnect = () => {
      refreshUnreadCount();
      if (page === 1) refresh();
    };

    socket.on('notification:new', handleNew);
    socket.on('notification:unread-count', handleUnreadCount);
    socket.on('connect', handleReconnect);

    return () => {
      socket.off('notification:new', handleNew);
      socket.off('notification:unread-count', handleUnreadCount);
      socket.off('connect', handleReconnect);
    };
  }, [socket, page, filter, refresh, refreshUnreadCount]);

  const setFilter = useCallback((next: NotificationFilter) => setFilterState(next), []);

  const markRead = useCallback(
    async (id: string) => {
      if (!credentials) return;
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
      try {
        const data = await markNotificationRead(credentials, id);
        if (!data.success) toast.error(data.message || 'Could not update notification');
      } catch (err: unknown) {
        toast.error(extractErrorMessage(err, 'Could not update notification'));
      }
    },
    [credentials]
  );

  const markAllRead = useCallback(async () => {
    if (!credentials) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    try {
      const data = await markAllNotificationsRead(credentials);
      if (!data.success) toast.error(data.message || 'Could not update notifications');
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err, 'Could not update notifications'));
    }
  }, [credentials]);

  const remove = useCallback(
    async (id: string) => {
      if (!credentials) return;
      const wasUnread = notifications.find((n) => n._id === id)?.isRead === false;
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      if (wasUnread) setUnreadCount((prev) => Math.max(0, prev - 1));
      try {
        const data = await deleteNotification(credentials, id);
        if (!data.success) toast.error(data.message || 'Could not delete notification');
      } catch (err: unknown) {
        toast.error(extractErrorMessage(err, 'Could not delete notification'));
      }
    },
    [credentials, notifications]
  );

  return {
    notifications,
    unreadCount,
    filter,
    setFilter,
    page,
    setPage,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    loading,
    error,
    connectionState,
    refresh,
    markRead,
    markAllRead,
    remove,
  };
};
