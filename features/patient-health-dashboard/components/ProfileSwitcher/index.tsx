import React from 'react';
import { relationshipLabel } from '../../../family-accounts';
import type { FamilyMember } from '../../../family-accounts';

interface ProfileSwitcherProps {
  familyMembers: FamilyMember[];
  selectedId: string;
  onChange: (id: string) => void;
}

const pill = (active: boolean) =>
  `px-3.5 py-1.5 rounded-full text-sm border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
    active ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
  }`;

const ProfileSwitcher: React.FC<ProfileSwitcherProps> = ({ familyMembers, selectedId, onChange }) => (
  <div role="group" aria-label="Select profile" className="flex flex-wrap gap-2">
    <button aria-pressed={selectedId === ''} onClick={() => onChange('')} className={pill(selectedId === '')}>
      My Profile
    </button>
    {familyMembers.map((member) => (
      <button
        key={member._id}
        aria-pressed={selectedId === member._id}
        onClick={() => onChange(member._id)}
        className={pill(selectedId === member._id)}
      >
        {member.name}
        <span className="opacity-70"> · {relationshipLabel(member.relationship)}</span>
      </button>
    ))}
  </div>
);

export default ProfileSwitcher;
