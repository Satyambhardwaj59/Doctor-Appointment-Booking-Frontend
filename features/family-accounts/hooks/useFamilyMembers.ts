'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  listFamilyMembers,
  createFamilyMember,
  updateFamilyMember,
  deleteFamilyMember,
} from '../services/familyAccount.service';
import { extractErrorMessage } from '../utils/familyAccount.utils';
import type { FamilyMember, FamilyMemberFormValues } from '../types/familyAccount.types';

interface UseFamilyMembersOptions {
  // Skip the initial fetch (e.g. when the user isn't logged in yet).
  enabled?: boolean;
}

export const useFamilyMembers = ({ enabled = true }: UseFamilyMembersOptions = {}) => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listFamilyMembers();
      if (data.success) {
        setFamilyMembers(data.familyMembers || []);
      } else {
        setError(data.message || 'Could not load family members');
      }
    } catch (err: unknown) {
      setError(extractErrorMessage(err, 'Could not load family members'));
    } finally {
      setLoading(false);
    }
  }, []);

  const addFamilyMember = useCallback(
    async (values: FamilyMemberFormValues) => {
      try {
        const data = await createFamilyMember(values);
        if (data.success) {
          toast.success(data.message || 'Family member added');
          await refresh();
          return true;
        }
        toast.error(data.message || 'Could not add family member');
        return false;
      } catch (err: unknown) {
        toast.error(extractErrorMessage(err, 'Could not add family member'));
        return false;
      }
    },
    [refresh]
  );

  const editFamilyMember = useCallback(
    async (id: string, values: Partial<FamilyMemberFormValues>) => {
      try {
        const data = await updateFamilyMember(id, values);
        if (data.success) {
          toast.success(data.message || 'Family member updated');
          await refresh();
          return true;
        }
        toast.error(data.message || 'Could not update family member');
        return false;
      } catch (err: unknown) {
        toast.error(extractErrorMessage(err, 'Could not update family member'));
        return false;
      }
    },
    [refresh]
  );

  const removeFamilyMember = useCallback(
    async (id: string) => {
      try {
        const data = await deleteFamilyMember(id);
        if (data.success) {
          toast.success(data.message || 'Family member removed');
          await refresh();
          return true;
        }
        toast.error(data.message || 'Could not remove family member');
        return false;
      } catch (err: unknown) {
        toast.error(extractErrorMessage(err, 'Could not remove family member'));
        return false;
      }
    },
    [refresh]
  );

  useEffect(() => {
    if (enabled) {
      refresh();
    }
  }, [enabled, refresh]);

  return {
    familyMembers,
    loading,
    error,
    refresh,
    addFamilyMember,
    editFamilyMember,
    removeFamilyMember,
  };
};
