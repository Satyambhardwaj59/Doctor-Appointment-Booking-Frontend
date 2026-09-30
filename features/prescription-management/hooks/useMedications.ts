'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  getTodayMedications,
  listMedications,
  updateMedicationStatus,
} from '../services/prescription.service';
import { extractErrorMessage } from '../utils/prescription.utils';
import type { MedicationEntry, MedicationStatus, PrescriptionCredentials } from '../types/prescription.types';

const HISTORY_PAGE_SIZE = 15;

// `familyMember` is the selected profile's id ('' means the account holder).
export const useMedications = (credentials: PrescriptionCredentials | null, familyMember: string) => {
  const [today, setToday] = useState<MedicationEntry[]>([]);
  const [nextDose, setNextDose] = useState<MedicationEntry | null>(null);
  const [todayLoading, setTodayLoading] = useState(false);
  const [todayError, setTodayError] = useState<string | null>(null);

  const [history, setHistory] = useState<MedicationEntry[]>([]);
  const [historyStatus, setHistoryStatusState] = useState<MedicationStatus | ''>('');
  const [historyPage, setHistoryPage] = useState(1);
  const [historyTotal, setHistoryTotal] = useState(0);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Resets the history page whenever a different profile is selected,
  // without an effect — see usePrescriptions/EditFamilyMember for the same
  // render-time-adjustment pattern.
  const [lastFamilyMember, setLastFamilyMember] = useState(familyMember);
  if (familyMember !== lastFamilyMember) {
    setLastFamilyMember(familyMember);
    setHistoryPage(1);
  }

  const refreshToday = useCallback(async () => {
    if (!credentials) return;

    setTodayLoading(true);
    setTodayError(null);
    try {
      const data = await getTodayMedications(credentials, familyMember || undefined);
      if (data.success) {
        setToday(data.medications || []);
        setNextDose(data.nextDose || null);
      } else {
        setTodayError(data.message || 'Could not load today\'s medications');
      }
    } catch (err: unknown) {
      setTodayError(extractErrorMessage(err, 'Could not load today\'s medications'));
    } finally {
      setTodayLoading(false);
    }
  }, [credentials, familyMember]);

  const refreshHistory = useCallback(async () => {
    if (!credentials) return;

    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const data = await listMedications(credentials, {
        familyMember: familyMember || undefined,
        status: historyStatus || undefined,
        page: historyPage,
        limit: HISTORY_PAGE_SIZE,
      });
      if (data.success) {
        setHistory(data.medications || []);
        setHistoryTotal(data.total || 0);
      } else {
        setHistoryError(data.message || 'Could not load medication history');
      }
    } catch (err: unknown) {
      setHistoryError(extractErrorMessage(err, 'Could not load medication history'));
    } finally {
      setHistoryLoading(false);
    }
  }, [credentials, familyMember, historyStatus, historyPage]);

  useEffect(() => {
    refreshToday();
  }, [refreshToday]);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  const setHistoryStatus = useCallback((next: MedicationStatus | '') => {
    setHistoryStatusState(next);
    setHistoryPage(1);
  }, []);

  const markStatus = useCallback(
    async (id: string, status: Extract<MedicationStatus, 'TAKEN' | 'SKIPPED'>) => {
      if (!credentials) return false;

      setUpdatingId(id);
      try {
        const data = await updateMedicationStatus(credentials, id, status);
        if (data.success) {
          toast.success(status === 'TAKEN' ? 'Marked as taken' : 'Marked as skipped');
          await Promise.all([refreshToday(), refreshHistory()]);
          return true;
        }
        toast.error(data.message || 'Could not update medication');
        return false;
      } catch (err: unknown) {
        toast.error(extractErrorMessage(err, 'Could not update medication'));
        return false;
      } finally {
        setUpdatingId(null);
      }
    },
    [credentials, refreshToday, refreshHistory]
  );

  return {
    today,
    nextDose,
    todayLoading,
    todayError,
    history,
    historyStatus,
    setHistoryStatus,
    historyPage,
    setHistoryPage,
    historyTotalPages: Math.max(1, Math.ceil(historyTotal / HISTORY_PAGE_SIZE)),
    historyLoading,
    historyError,
    updatingId,
    markStatus,
  };
};
