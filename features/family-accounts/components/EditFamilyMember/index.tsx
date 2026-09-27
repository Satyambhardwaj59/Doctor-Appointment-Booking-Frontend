'use client';

import React, { useState } from 'react';
import FamilyMemberForm from '../FamilyMemberForm';
import { validateFamilyMemberForm } from '../../validations/familyAccount.validation';
import { toast } from 'react-toastify';
import type { FamilyMember, FamilyMemberFormValues } from '../../types/familyAccount.types';

interface EditFamilyMemberProps {
  familyMember: FamilyMember | null;
  onClose: () => void;
  onSave: (id: string, values: Partial<FamilyMemberFormValues>) => Promise<boolean>;
}

const toFormValues = (member: FamilyMember): FamilyMemberFormValues => ({
  name: member.name,
  relationship: member.relationship,
  dateOfBirth: member.dateOfBirth || '',
  gender: member.gender || 'Not Selected',
  phone: member.phone || '',
  email: member.email || '',
  profileImage: null,
});

const EditFamilyMember: React.FC<EditFamilyMemberProps> = ({ familyMember, onClose, onSave }) => {
  // Tracks which member's data is currently loaded into `values`, so we can
  // detect a switch to a different member and reset the form during render
  // (React's recommended alternative to syncing state from props via an
  // effect — see https://react.dev/learn/you-might-not-need-an-effect).
  const [loadedMemberId, setLoadedMemberId] = useState<string | null>(null);
  const [values, setValues] = useState<FamilyMemberFormValues | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (familyMember && familyMember._id !== loadedMemberId) {
    setLoadedMemberId(familyMember._id);
    setValues(toFormValues(familyMember));
  } else if (!familyMember && loadedMemberId !== null) {
    setLoadedMemberId(null);
    setValues(null);
  }

  if (!familyMember || !values) return null;

  const handleSubmit = async () => {
    const validation = validateFamilyMemberForm(values);
    if (!validation.valid) {
      toast.warn(validation.message);
      return;
    }

    setSubmitting(true);
    const success = await onSave(familyMember._id, values);
    setSubmitting(false);

    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-lg font-bold text-gray-900">Edit {familyMember.name}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 rounded-lg p-1"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <FamilyMemberForm
          values={values}
          onChange={setValues}
          existingImageUrl={familyMember.profileImage}
        />

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full text-sm border border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-5 py-2 rounded-full text-sm bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditFamilyMember;
