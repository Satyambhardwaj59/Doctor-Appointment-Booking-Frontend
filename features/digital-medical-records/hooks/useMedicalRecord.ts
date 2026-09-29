'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getRecord, updateRecord, deleteRecord } from '../services/medicalRecords.service';
import { extractErrorMessage } from '../utils/medicalRecords.utils';
import type { MedicalRecord, RecordCredentials } from '../types/medicalRecords.types';

export const useMedicalRecord = (credentials: RecordCredentials | null, recordId: string | null) => {
  const [record, setRecord] = useState<MedicalRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!credentials || !recordId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await getRecord(credentials, recordId);
      if (data.success) {
        setRecord(data.record || null);
      } else {
        setError(data.message || 'Record not found');
      }
    } catch (err: unknown) {
      setError(extractErrorMessage(err, 'Could not load record'));
    } finally {
      setLoading(false);
    }
  }, [credentials, recordId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const save = useCallback(
    async (values: Parameters<typeof updateRecord>[2]) => {
      if (!credentials || !recordId) return false;
      try {
        const data = await updateRecord(credentials, recordId, values);
        if (data.success) {
          toast.success('Record updated');
          setRecord(data.record || null);
          return true;
        }
        toast.error(data.message || 'Could not update record');
        return false;
      } catch (err: unknown) {
        toast.error(extractErrorMessage(err, 'Could not update record'));
        return false;
      }
    },
    [credentials, recordId]
  );

  const remove = useCallback(async () => {
    if (!credentials || !recordId) return false;
    try {
      const data = await deleteRecord(credentials, recordId);
      if (data.success) {
        toast.success('Record archived');
        return true;
      }
      toast.error(data.message || 'Could not delete record');
      return false;
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err, 'Could not delete record'));
      return false;
    }
  }, [credentials, recordId]);

  return { record, loading, error, refresh, save, remove, setRecord };
};
