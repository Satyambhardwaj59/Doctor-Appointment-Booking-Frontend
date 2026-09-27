'use client';

import React from 'react';

interface FamilyEmptyStateProps {
  onAddClick: () => void;
}

const FamilyEmptyState: React.FC<FamilyEmptyStateProps> = ({ onAddClick }) => (
  <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300 mt-6">
    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 100-8 4 4 0 000 8zm6 3.13a4 4 0 00-3-3.87"
        />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-gray-800">No family members yet</h3>
    <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
      Add your family members to book appointments and manage their care right alongside your
      own.
    </p>
    <button
      onClick={onAddClick}
      className="mt-4 inline-block px-5 py-2.5 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors"
    >
      + Add Family Member
    </button>
  </div>
);

export default FamilyEmptyState;
