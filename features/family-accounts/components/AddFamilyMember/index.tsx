'use client';

import React, { useState } from 'react';
import FamilyMemberForm from '../FamilyMemberForm';
import { validateFamilyMemberForm } from '../../validations/familyAccount.validation';
import { toast } from 'react-toastify';
import type { FamilyMemberFormValues } from '../../types/familyAccount.types';

const EMPTY_FORM: FamilyMemberFormValues = {
  name: '',
  relationship: '',
  dateOfBirth: '',
  gender: 'Not Selected',
  phone: '',
  email: '',
  profileImage: null,
};

interface AddFamilyMemberProps {
  open: boolean;
  onClose: () => void;
  onAdd: (values: FamilyMemberFormValues) => Promise<boolean>;
}

const AddFamilyMember: React.FC<AddFamilyMemberProps> = ({ open, onClose, onAdd }) => {
  const [values, setValues] = useState<FamilyMemberFormValues>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleClose = () => {
    setValues(EMPTY_FORM);
    onClose();
  };

  const handleSubmit = async () => {
    const validation = validateFamilyMemberForm(values);
    if (!validation.valid) {
      toast.warn(validation.message);
      return;
    }

    setSubmitting(true);
    const success = await onAdd(values);
    setSubmitting(false);

    if (success) {
      handleClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-lg font-bold text-gray-900">Add Family Member</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 rounded-lg p-1"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <FamilyMemberForm values={values} onChange={setValues} />

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-full text-sm border border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-5 py-2 rounded-full text-sm bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {submitting ? 'Adding...' : 'Add Family Member'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFamilyMember;
