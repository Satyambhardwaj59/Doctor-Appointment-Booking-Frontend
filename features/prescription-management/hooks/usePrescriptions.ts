'use client';

import { useCallback, useEffect, useState } from 'react';
import { listPrescriptions } from '../services/prescription.service';
import { extractErrorMessage } from '../utils/prescription.utils';
import type {
  Prescription,
  PrescriptionCredentials,
  PrescriptionStatusFilter,
} from '../types/prescription.types';

const PAGE_SIZE = 10;

// `familyMember` is the selected profile's id ('' means the account holder).
export const usePrescriptions = (credentials: PrescriptionCredentials | null, familyMember: string) => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [status, setStatusState] = useState<PrescriptionStatusFilter>('ALL');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resets the page whenever a different profile is selected, without an
  // effect (see EditFamilyMember in features/family-accounts for the same
  // pattern) — React allows adjusting state during render when it's a
  // direct response to a changed prop.
  const [lastFamilyMember, setLastFamilyMember] = useState(familyMember);
  if (familyMember !== lastFamilyMember) {
    setLastFamilyMember(familyMember);
    setPage(1);
  }

  const refresh = useCallback(async () => {
    if (!credentials) return;

    setLoading(true);
    setError(null);
    try {
      const data = await listPrescriptions(credentials, {
        status: status === 'ALL' ? undefined : status,
        familyMember: familyMember || undefined,
        page,
        limit: PAGE_SIZE,
      });
      if (data.success) {
        setPrescriptions(data.prescriptions || []);
        setTotal(data.total || 0);
      } else {
        setError(data.message || 'Could not load prescriptions');
      }
    } catch (err: unknown) {
      setError(extractErrorMessage(err, 'Could not load prescriptions'));
    } finally {
      setLoading(false);
    }
  }, [credentials, status, familyMember, page]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // A different filter or profile invalidates the current page number.
  const setStatus = useCallback((next: PrescriptionStatusFilter) => {
    setStatusState(next);
    setPage(1);
  }, []);

  return {
    prescriptions,
    status,
    setStatus,
    page,
    setPage,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    total,
    loading,
    error,
    refresh,
  };
};
