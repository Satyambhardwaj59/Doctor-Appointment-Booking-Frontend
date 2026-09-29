import React from 'react';

const MedicalRecordSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="animate-pulse bg-white border border-gray-200 rounded-2xl p-4 flex gap-4">
        <div className="w-12 h-12 rounded-xl bg-gray-200 shrink-0" />
        <div className="flex-1 space-y-2 py-1">
          <div className="h-3 bg-gray-200 rounded w-1/3" />
          <div className="h-3 bg-gray-100 rounded w-2/3" />
        </div>
      </div>
    ))}
  </div>
);

export default MedicalRecordSkeleton;
