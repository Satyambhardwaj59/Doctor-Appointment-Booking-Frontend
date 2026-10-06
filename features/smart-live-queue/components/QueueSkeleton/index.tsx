import React from 'react';

const QueueSkeleton: React.FC = () => (
  <div className="animate-pulse bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
    <div className="h-4 bg-gray-200 rounded w-1/3" />
    <div className="grid grid-cols-2 gap-4">
      <div className="h-20 bg-gray-100 rounded-xl" />
      <div className="h-20 bg-gray-100 rounded-xl" />
    </div>
    <div className="h-3 bg-gray-100 rounded w-1/2" />
    <div className="h-2 bg-gray-100 rounded w-full" />
  </div>
);

export default QueueSkeleton;
