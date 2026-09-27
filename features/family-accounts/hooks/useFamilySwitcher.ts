'use client';

import { useMemo, useState } from 'react';
import type { FamilyMember } from '../types/familyAccount.types';

export const SELF_OPTION = 'self' as const;

// Tracks which profile — the primary account holder ("Me") or one of their
// family members — is currently selected for a supported action (e.g.
// booking an appointment). This intentionally holds no global/cross-page
// state: the selected family member is contextual to the flow it's used in,
// not a separate logged-in identity (see Family Profile Switcher spec).
export const useFamilySwitcher = (familyMembers: FamilyMember[]) => {
  const [selectedId, setSelectedId] = useState<string>(SELF_OPTION);

  const selectedFamilyMember = useMemo(() => {
    if (selectedId === SELF_OPTION) return null;
    return familyMembers.find((member) => member._id === selectedId) || null;
  }, [selectedId, familyMembers]);

  const isSelf = selectedId === SELF_OPTION;

  return { selectedId, setSelectedId, selectedFamilyMember, isSelf };
};
