'use client';

import React, { useState } from 'react';
import type { FamilyMember } from '../../types/familyAccount.types';

interface RemoveFamilyMemberProps {
  familyMember: FamilyMember | null;
  onClose: () => void;
  onConfirm: (id: string) => Promise<boolean>;
}

const RemoveFamilyMember: React.FC<RemoveFamilyMemberProps> = ({
  familyMember,
  onClose,
  onConfirm,
}) => {
  const [removing, setRemoving] = useState(false);

  if (!familyMember) return null;

  const handleConfirm = async () => {
    setRemoving(true);
    const success = await onConfirm(familyMember._id);
    setRemoving(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Remove Family Member?</h3>
        <p className="text-sm text-gray-600">
          Are you sure you want to remove <span className="font-medium">{familyMember.name}</span>{' '}
          from your family account? Their past appointment history will be kept.
        </p>
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full text-sm border border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={removing}
            className="px-5 py-2 rounded-full text-sm bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
          >
            {removing ? 'Removing...' : 'Remove'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveFamilyMember;
