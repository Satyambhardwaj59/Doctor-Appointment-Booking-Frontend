'use client';

import React from 'react';
import type { FamilyMember } from '../../types/familyAccount.types';
import { calculateAge, initials, relationshipLabel } from '../../utils/familyAccount.utils';

interface FamilyMemberCardProps {
  familyMember: FamilyMember;
  onView: (member: FamilyMember) => void;
  onEdit: (member: FamilyMember) => void;
  onRemove: (member: FamilyMember) => void;
}

const FamilyMemberCard: React.FC<FamilyMemberCardProps> = ({
  familyMember,
  onView,
  onEdit,
  onRemove,
}) => {
  const age = calculateAge(familyMember.dateOfBirth);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div className="flex items-center gap-3">
        {familyMember.profileImage ? (
          <img
            src={familyMember.profileImage}
            alt={familyMember.name}
            className="w-14 h-14 rounded-full object-cover bg-indigo-50"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
            {initials(familyMember.name)}
          </div>
        )}
        <div>
          <h4 className="font-semibold text-gray-900 text-base">{familyMember.name}</h4>
          <p className="text-xs text-gray-500">
            {relationshipLabel(familyMember.relationship)}
            {age !== null ? ` · Age ${age}` : ''}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-4 mt-2 border-t border-gray-100">
        <button
          onClick={() => onView(familyMember)}
          className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition"
        >
          View Profile
        </button>
        <button
          onClick={() => onEdit(familyMember)}
          className="flex-1 py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-xl transition"
        >
          Edit
        </button>
        <button
          onClick={() => onRemove(familyMember)}
          className="flex-1 py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-xl transition"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default FamilyMemberCard;
