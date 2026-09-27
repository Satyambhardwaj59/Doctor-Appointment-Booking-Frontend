'use client';

import React from 'react';
import type { FamilyMember } from '../../types/familyAccount.types';
import { relationshipLabel } from '../../utils/familyAccount.utils';
import { SELF_OPTION } from '../../hooks/useFamilySwitcher';

interface FamilySwitcherProps {
  familyMembers: FamilyMember[];
  selectedId: string;
  onChange: (id: string) => void;
  label?: string;
  selfLabel?: string;
}

const FamilySwitcher: React.FC<FamilySwitcherProps> = ({
  familyMembers,
  selectedId,
  onChange,
  label = 'Who is this appointment for?',
  selfLabel = 'Me',
}) => {
  return (
    <div className="mb-4">
      <p className="text-sm font-medium text-neutral-700 mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(SELF_OPTION)}
          className={`px-4 py-2 rounded-full text-sm border transition-colors ${
            selectedId === SELF_OPTION
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'border-gray-300 text-gray-600 hover:bg-gray-50'
          }`}
        >
          {selfLabel}
        </button>
        {familyMembers.map((member) => (
          <button
            key={member._id}
            type="button"
            onClick={() => onChange(member._id)}
            className={`px-4 py-2 rounded-full text-sm border transition-colors ${
              selectedId === member._id
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {member.name}
            <span className="opacity-70"> · {relationshipLabel(member.relationship)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FamilySwitcher;
