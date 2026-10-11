import React from 'react';

const Block: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-white border border-gray-200 rounded-2xl p-5 space-y-3 ${className}`}>
    <div className="h-3 bg-gray-200 rounded w-1/3" />
    <div className="h-3 bg-gray-100 rounded w-2/3" />
    <div className="h-16 bg-gray-100 rounded-xl" />
  </div>
);

const DashboardSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" aria-busy="true" aria-label="Loading dashboard">
    <Block />
    <Block />
    <Block className="lg:col-span-2" />
    <Block />
    <Block />
    <Block />
    <Block />
  </div>
);

export default DashboardSkeleton;
