'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getPrescription, updatePrescription } from '../services/prescription.service';
import { extractErrorMessage } from '../utils/prescription.utils';
import type { Prescription, PrescriptionCredentials, PrescriptionFormValues } from '../types/prescription.types';

export const usePrescription = (credentials: PrescriptionCredentials | null, prescriptionId: string | null) => {
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!credentials || !prescriptionId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await getPrescription(credentials, prescriptionId);
      if (data.success) {
        setPrescription(data.prescription || null);
      } else {
        setError(data.message || 'Prescription not found');
      }
    } catch (err: unknown) {
      setError(extractErrorMessage(err, 'Could not load prescription'));
    } finally {
      setLoading(false);
    }
  }, [credentials, prescriptionId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Doctor-side: the backend rejects this for any other role.
  const update = useCallback(
    async (values: Partial<PrescriptionFormValues> & { status?: string }) => {
      if (!credentials || !prescriptionId) return false;
      try {
        const data = await updatePrescription(credentials, prescriptionId, values);
        if (data.success) {
          toast.success('Prescription updated');
          setPrescription(data.prescription || null);
          return true;
        }
        toast.error(data.message || 'Could not update prescription');
        return false;
      } catch (err: unknown) {
        toast.error(extractErrorMessage(err, 'Could not update prescription'));
        return false;
      }
    },
    [credentials, prescriptionId]
  );

  return { prescription, loading, error, refresh, update };
};
