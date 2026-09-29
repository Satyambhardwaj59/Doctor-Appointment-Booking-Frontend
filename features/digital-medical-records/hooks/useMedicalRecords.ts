'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { listRecords, restoreRecord } from '../services/medicalRecords.service';
import { extractErrorMessage } from '../utils/medicalRecords.utils';
import type { MedicalRecord, RecordCredentials, RecordFiltersState } from '../types/medicalRecords.types';

const EMPTY_FILTERS: RecordFiltersState = {
  type: '',
  doctor: '',
  familyMember: '',
  dateFrom: '',
  dateTo: '',
  search: '',
};

const PAGE_SIZE = 12;

export const useMedicalRecords = (credentials: RecordCredentials | null, archived = false) => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [filters, setFilters] = useState<RecordFiltersState>(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!credentials) return;

    setLoading(true);
    setError(null);
    try {
      const data = await listRecords(credentials, { ...filters, archived, page, limit: PAGE_SIZE });
      if (data.success) {
        setRecords(data.records || []);
        setTotal(data.total || 0);
      } else {
        setError(data.message || 'Could not load records');
      }
    } catch (err: unknown) {
      setError(extractErrorMessage(err, 'Could not load records'));
    } finally {
      setLoading(false);
    }
  }, [credentials, filters, page, archived]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Any filter change resets back to page 1, since the previous page
  // number may no longer be valid for a narrower result set.
  const updateFilters = useCallback((next: Partial<RecordFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...next }));
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    setPage(1);
  }, []);

  const restore = useCallback(
    async (recordId: string) => {
      if (!credentials) return false;
      try {
        const data = await restoreRecord(credentials, recordId);
        if (!data.success) {
          toast.error(data.message || 'Could not restore record');
          return false;
        }

        toast.success('Record restored');
        await refresh();
        return true;
      } catch (err: unknown) {
        toast.error(extractErrorMessage(err, 'Could not restore record'));
        return false;
      }
    },
    [credentials, refresh]
  );

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return {
    records,
    filters,
    updateFilters,
    clearFilters,
    restore,
    page,
    setPage,
    totalPages,
    total,
    loading,
    error,
    refresh,
  };
};
