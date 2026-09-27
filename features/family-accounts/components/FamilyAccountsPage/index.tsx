'use client';

import React, { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppContext } from '../../../../context/AppContext';
import { useFamilyMembers } from '../../hooks/useFamilyMembers';
import FamilyList from '../FamilyList';
import AddFamilyMember from '../AddFamilyMember';
import EditFamilyMember from '../EditFamilyMember';
import RemoveFamilyMember from '../RemoveFamilyMember';
import FamilyProfile from '../FamilyProfile';
import type { FamilyMember } from '../../types/familyAccount.types';

const FamilyAccountsPage: React.FC = () => {
  const { token } = useContext(AppContext);
  const router = useRouter();

  const { familyMembers, loading, addFamilyMember, editFamilyMember, removeFamilyMember } =
    useFamilyMembers({ enabled: !!token });

  const [showAddModal, setShowAddModal] = useState(false);
  const [viewingMember, setViewingMember] = useState<FamilyMember | null>(null);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [removingMember, setRemovingMember] = useState<FamilyMember | null>(null);

  if (!token) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Please login to manage your family account.</p>
        <button
          onClick={() => router.push('/login')}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Family</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your family members and book appointments on their behalf.
          </p>
        </div>
        {familyMembers.length > 0 && (
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            + Add Family Member
          </button>
        )}
      </div>

      <FamilyList
        familyMembers={familyMembers}
        loading={loading}
        onAddClick={() => setShowAddModal(true)}
        onView={setViewingMember}
        onEdit={setEditingMember}
        onRemove={setRemovingMember}
      />

      <AddFamilyMember
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addFamilyMember}
      />

      <FamilyProfile familyMember={viewingMember} onClose={() => setViewingMember(null)} />

      <EditFamilyMember
        familyMember={editingMember}
        onClose={() => setEditingMember(null)}
        onSave={editFamilyMember}
      />

      <RemoveFamilyMember
        familyMember={removingMember}
        onClose={() => setRemovingMember(null)}
        onConfirm={removeFamilyMember}
      />
    </div>
  );
};

export default FamilyAccountsPage;
