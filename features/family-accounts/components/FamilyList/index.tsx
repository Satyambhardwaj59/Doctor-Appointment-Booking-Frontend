'use client';

import React from 'react';
import FamilyMemberCard from '../FamilyMemberCard';
import FamilyEmptyState from '../FamilyEmptyState';
import type { FamilyMember } from '../../types/familyAccount.types';

interface FamilyListProps {
  familyMembers: FamilyMember[];
  loading: boolean;
  onAddClick: () => void;
  onView: (member: FamilyMember) => void;
  onEdit: (member: FamilyMember) => void;
  onRemove: (member: FamilyMember) => void;
}

const FamilyList: React.FC<FamilyListProps> = ({
  familyMembers,
  loading,
  onAddClick,
  onView,
  onEdit,
  onRemove,
}) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Loading your family...</p>
      </div>
    );
  }

  if (familyMembers.length === 0) {
    return <FamilyEmptyState onAddClick={onAddClick} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {familyMembers.map((member) => (
        <FamilyMemberCard
          key={member._id}
          familyMember={member}
          onView={onView}
          onEdit={onEdit}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default FamilyList;
