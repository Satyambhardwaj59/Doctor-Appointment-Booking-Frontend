'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useQueueSocket } from './useQueueSocket';
import { doctorAction, getDoctorQueue, getMyPositions, leaveQueue } from '../services/queue.service';
import { extractErrorMessage, getUserIdFromToken } from '../utils/queue.utils';
import type {
  DoctorAction,
  DoctorQueueView,
  PatientQueueView,
  QueueCredentials,
} from '../types/queue.types';

export const useLiveQueue = (credentials: QueueCredentials | null) => {
  const { socket, connectionState } = useQueueSocket(credentials);

  const [positions, setPositions] = useState<PatientQueueView[]>([]); // patient
  const [doctorQueue, setDoctorQueue] = useState<DoctorQueueView | null>(null); // doctor
  const [loading, setLoading] = useState(!!credentials);
  const [error, setError] = useState<string | null>(null);
  const [acting, setActing] = useState(false);

  // Event toasts fire once per (event, entry, version), so an update that
  // arrives twice (e.g. a socket event and a reconnect refetch) never
  // shows the same message again.
  const toasted = useRef<Set<string>>(new Set());

  const refresh = useCallback(
    async (silent = false) => {
      if (!credentials) return;

      if (!silent) setLoading(true);
      setError(null);
      try {
        if (credentials.role === 'doctor') {
          const doctorId = getUserIdFromToken(credentials.token);
          if (!doctorId) {
            setError('Could not identify the doctor account');
            return;
          }
          const data = await getDoctorQueue(credentials, doctorId);
          if (data.success) setDoctorQueue(data.queue ?? null);
          else setError(data.message || 'Could not load the queue');
        } else {
          const data = await getMyPositions(credentials);
          if (data.success) setPositions(data.positions || []);
          else setError(data.message || 'Could not load your queue position');
        }
      } catch (err: unknown) {
        setError(extractErrorMessage(err, 'Could not load the queue'));
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [credentials]
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  // ─── Live updates ──────────────────────────────────────────────────
  useEffect(() => {
    if (!socket || !credentials) return;

    // An update older than what is already on screen is dropped.
    const applyPatient = (view: PatientQueueView) =>
      setPositions((prev) => {
        const index = prev.findIndex((p) => p.entry._id === view.entry._id);
        if (view.entry.status === 'CANCELLED') {
          return index === -1 ? prev : prev.filter((_, i) => i !== index);
        }
        if (index === -1) return [...prev, view];
        if (view.version < prev[index].version) return prev;
        const next = [...prev];
        next[index] = view;
        return next;
      });

    const applyDoctor = (view: DoctorQueueView) =>
      setDoctorQueue((prev) => (prev && view.version < prev.version ? prev : view));

    const handleUpdated = (view: PatientQueueView | DoctorQueueView) => {
      if (view.view === 'doctor') applyDoctor(view);
      else applyPatient(view);
    };

    const toastOnce = (key: string, show: () => void) => {
      if (toasted.current.has(key)) return;
      toasted.current.add(key);
      show();
    };

    const patientEvent =
      (event: string, show: (view: PatientQueueView) => void) => (view: PatientQueueView | DoctorQueueView) => {
        if (view.view !== 'patient') return;
        toastOnce(`${event}:${view.entry._id}:${view.version}`, () => show(view));
      };

    const handleCalled = patientEvent('called', (v) =>
      toast.info(`You've been called — token #${v.entry.queueNumber}. Please proceed to your doctor.`)
    );
    const handleStarted = patientEvent('started', () => toast.success('Your consultation has started'));
    const handlePaused = patientEvent('paused', () =>
      toast.warn('The doctor paused the queue. Your wait may be longer.')
    );
    const handleResumed = patientEvent('resumed', () => toast.info('The queue has resumed'));

    // Re-sync after a dropped connection so no change is silently missed.
    const handleConnect = () => refresh(true);

    socket.on('queue:updated', handleUpdated);
    socket.on('queue:called', handleCalled);
    socket.on('queue:started', handleStarted);
    socket.on('queue:paused', handlePaused);
    socket.on('queue:resumed', handleResumed);
    socket.on('connect', handleConnect);

    return () => {
      socket.off('queue:updated', handleUpdated);
      socket.off('queue:called', handleCalled);
      socket.off('queue:started', handleStarted);
      socket.off('queue:paused', handlePaused);
      socket.off('queue:resumed', handleResumed);
      socket.off('connect', handleConnect);
    };
  }, [socket, credentials, refresh]);

  // ─── Actions ───────────────────────────────────────────────────────

  const leave = useCallback(
    async (queueId: string, appointmentId?: string) => {
      if (!credentials) return false;
      try {
        const data = await leaveQueue(credentials, queueId, appointmentId);
        if (data.success) {
          toast.success('You left the queue');
          await refresh(true);
          return true;
        }
        toast.error(data.message || 'Could not leave the queue');
        return false;
      } catch (err: unknown) {
        toast.error(extractErrorMessage(err, 'Could not leave the queue'));
        return false;
      }
    },
    [credentials, refresh]
  );

  const act = useCallback(
    async (action: DoctorAction, entryId?: string) => {
      if (!credentials || !doctorQueue) return false;

      setActing(true);
      try {
        const data = await doctorAction(credentials, doctorQueue.queueId, action, entryId ? { entryId } : undefined);
        if (!data.success) {
          toast.error(data.message || 'That action could not be completed');
          // The queue may have changed under us (e.g. another tab) — resync.
          await refresh(true);
          return false;
        }
        return true;
      } catch (err: unknown) {
        toast.error(extractErrorMessage(err, 'That action could not be completed'));
        return false;
      } finally {
        setActing(false);
      }
    },
    [credentials, doctorQueue, refresh]
  );

  return { positions, doctorQueue, loading, error, connectionState, acting, refresh, leave, act };
};
