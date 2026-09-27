'use client';

import React from 'react';
import type { FamilyMember } from '../../types/familyAccount.types';
import { calculateAge, initials, relationshipLabel } from '../../utils/familyAccount.utils';

interface FamilyProfileProps {
  familyMember: FamilyMember | null;
  onClose: () => void;
}

const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="grid grid-cols-[1fr_2fr] gap-y-1 py-1.5 text-sm">
    <p className="font-medium text-neutral-700">{label}</p>
    <p className="text-neutral-600">{value || '—'}</p>
  </div>
);

const FamilyProfile: React.FC<FamilyProfileProps> = ({ familyMember, onClose }) => {
  if (!familyMember) return null;

  const age = calculateAge(familyMember.dateOfBirth);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-lg font-bold text-gray-900">Family Member Profile</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 rounded-lg p-1"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center gap-4">
          {familyMember.profileImage ? (
            <img
              src={familyMember.profileImage}
              alt={familyMember.name}
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-2xl">
              {initials(familyMember.name)}
            </div>
          )}
          <div>
            <h4 className="text-xl font-semibold text-gray-900">{familyMember.name}</h4>
            <p className="text-sm text-gray-500">{relationshipLabel(familyMember.relationship)}</p>
          </div>
        </div>

        <div className="divide-y divide-gray-100 pt-2">
          <Row label="Age" value={age !== null ? String(age) : '—'} />
          <Row label="Date of Birth" value={familyMember.dateOfBirth} />
          <Row label="Gender" value={familyMember.gender} />
          <Row label="Phone" value={familyMember.phone} />
          <Row label="Email" value={familyMember.email} />
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FamilyProfile;
