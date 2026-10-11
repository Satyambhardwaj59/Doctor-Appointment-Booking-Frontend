'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQueueSocket } from '../../smart-live-queue';
import type { PatientQueueView, DoctorQueueView } from '../../smart-live-queue';
import { useNotificationSocket } from '../../notification-center';
import type { AppNotification } from '../../notification-center';
import { getDashboard } from '../services/patientDashboard.service';
import { extractErrorMessage } from '../utils/patientDashboard.utils';
import type { PatientDashboardData, DashboardNotification } from '../types/patientDashboard.types';

// Notification types that mean some other dashboard card is probably stale.
const REFRESH_ON_TYPES = ['APPOINTMENT', 'CONSULTATION', 'PRESCRIPTION', 'MEDICATION', 'MEDICAL_RECORD'];
const RESYNC_DELAY_MS = 1500;
const MAX_NOTIFICATIONS = 5;

const toSummary = (n: AppNotification): DashboardNotification => ({
  _id: n._id,
  type: n.type,
  title: n.title,
  message: n.message,
  createdAt: n.createdAt,
  data: (n.data || {}) as Record<string, string>,
});

// `familyMemberId` is the selected profile ('' = the account holder).
export const usePatientDashboard = (token: string | null, familyMemberId: string) => {
  const credentials = useMemo(() => (token ? { token } : null), [token]);
  // The existing sockets' own credential shape (patient role).
  const socketCredentials = useMemo(() => (token ? { token, role: 'patient' as const } : null), [token]);

  const { socket: queueSocket } = useQueueSocket(socketCredentials);
  const { socket: notificationSocket } = useNotificationSocket(socketCredentials);

  const [data, setData] = useState<PatientDashboardData | null>(null);
  const [loading, setLoading] = useState(!!token);
  const [error, setError] = useState<string | null>(null);

  const requestId = useRef(0);
  const resyncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Mirrors of what is on screen, so socket handlers can decide without
  // reading state inside an updater.
  const shownQueueEntryId = useRef<string | null>(null);
  const shownUnreadCount = useRef(0);

  const refresh = useCallback(
    async (silent = false) => {
      if (!credentials) return;

      // Only the newest request may update the screen, so a slow response
      // for the previously selected profile can never overwrite the current one.
      const current = ++requestId.current;
      if (!silent) setLoading(true);

      try {
        const response = await getDashboard(credentials, familyMemberId || undefined);
        if (current !== requestId.current) return;

        if (response.success) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { success, message, ...rest } = response;
          setData(rest as PatientDashboardData);
          setError(null);
        } else if (!silent) {
          setError(response.message || 'Could not load the dashboard');
        }
      } catch (err: unknown) {
        if (current === requestId.current && !silent) {
          setError(extractErrorMessage(err, 'Could not load the dashboard'));
        }
      } finally {
        if (current === requestId.current) setLoading(false);
      }
    },
    [credentials, familyMemberId]
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    shownQueueEntryId.current = data?.queueStatus?.entry._id ?? null;
    shownUnreadCount.current = data?.unreadNotifications.unreadCount ?? 0;
  }, [data]);

  // Coalesces a burst of events into one background refetch.
  const resyncSoon = useCallback(() => {
    if (resyncTimer.current) clearTimeout(resyncTimer.current);
    resyncTimer.current = setTimeout(() => refresh(true), RESYNC_DELAY_MS);
  }, [refresh]);

  useEffect(
    () => () => {
      if (resyncTimer.current) clearTimeout(resyncTimer.current);
    },
    []
  );

  // ─── Live queue (existing /queue socket) ───────────────────────────
  useEffect(() => {
    if (!queueSocket) return;

    const handleUpdated = (view: PatientQueueView | DoctorQueueView) => {
      if (view.view !== 'patient') return;

      if (view.entry._id === shownQueueEntryId.current) {
        setData((prev) => {
          if (!prev?.queueStatus) return prev;
          // Older than what's already shown: ignore (stale / duplicate).
          if (view.version < prev.queueStatus.version) return prev;
          if (view.entry.status === 'CANCELLED') return { ...prev, queueStatus: null };
          return { ...prev, queueStatus: { ...view, doctor: prev.queueStatus.doctor } };
        });
      } else {
        // Not the card on screen (e.g. just joined a queue): resync quietly.
        resyncSoon();
      }
    };

    const handleConnect = () => refresh(true);

    queueSocket.on('queue:updated', handleUpdated);
    queueSocket.on('connect', handleConnect);
    return () => {
      queueSocket.off('queue:updated', handleUpdated);
      queueSocket.off('connect', handleConnect);
    };
  }, [queueSocket, refresh, resyncSoon]);

  // ─── Notifications (existing /notifications socket) ─────────────────
  useEffect(() => {
    if (!notificationSocket) return;

    const handleNew = (notification: AppNotification) => {
      setData((prev) =>
        prev
          ? {
              ...prev,
              unreadNotifications: {
                unreadCount: prev.unreadNotifications.unreadCount + 1,
                items: [toSummary(notification), ...prev.unreadNotifications.items].slice(0, MAX_NOTIFICATIONS),
              },
            }
          : prev
      );
      if (REFRESH_ON_TYPES.includes(notification.type)) resyncSoon();
    };

    const handleCount = ({ unreadCount }: { unreadCount: number }) => {
      const dropped = unreadCount < shownUnreadCount.current;
      setData((prev) => (prev ? { ...prev, unreadNotifications: { ...prev.unreadNotifications, unreadCount } } : prev));
      // Something was read elsewhere: the listed items may be stale.
      if (dropped) resyncSoon();
    };

    const handleConnect = () => refresh(true);

    notificationSocket.on('notification:new', handleNew);
    notificationSocket.on('notification:unread-count', handleCount);
    notificationSocket.on('connect', handleConnect);
    return () => {
      notificationSocket.off('notification:new', handleNew);
      notificationSocket.off('notification:unread-count', handleCount);
      notificationSocket.off('connect', handleConnect);
    };
  }, [notificationSocket, refresh, resyncSoon]);

  // Data for a profile that is no longer selected is never shown: the
  // switch immediately falls back to the loading state instead of briefly
  // displaying the previous person's information.
  const visibleData = data && (data.profile.familyMemberId ?? '') === familyMemberId ? data : null;

  return { data: visibleData, loading: loading || (!!token && !visibleData && !error), error, refresh };
};
