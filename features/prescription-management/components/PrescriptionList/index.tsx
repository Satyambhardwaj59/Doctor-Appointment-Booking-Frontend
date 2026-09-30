import React from 'react';
import type { Prescription, PrescriptionStatusFilter } from '../../types/prescription.types';
import { STATUS_FILTERS } from '../../utils/prescription.utils';
import PrescriptionCard from '../PrescriptionCard';
import PrescriptionSkeleton from '../PrescriptionSkeleton';

interface PrescriptionListProps {
  prescriptions: Prescription[];
  status: PrescriptionStatusFilter;
  onStatusChange: (status: PrescriptionStatusFilter) => void;
  loading: boolean;
  error: string | null;
  resolveDoctorName: (doctorId: string) => string;
  onSelect: (prescription: Prescription) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PrescriptionList: React.FC<PrescriptionListProps> = ({
  prescriptions,
  status,
  onStatusChange,
  loading,
  error,
  resolveDoctorName,
  onSelect,
  page,
  totalPages,
  onPageChange,
}) => (
  <div>
    <div className="flex flex-wrap gap-2 mb-4">
      {STATUS_FILTERS.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onStatusChange(filter.value)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            status === filter.value
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'border-gray-300 text-gray-600 hover:bg-gray-50'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>

    {loading ? (
      <PrescriptionSkeleton />
    ) : error ? (
      <p className="text-sm text-red-500 text-center py-8">{error}</p>
    ) : prescriptions.length === 0 ? (
      <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
        <div className="text-3xl mb-2">💊</div>
        <h3 className="text-base font-semibold text-gray-800">No prescriptions found</h3>
        <p className="text-sm text-gray-500 mt-1">Prescriptions from your doctors will appear here.</p>
      </div>
    ) : (
      <div className="space-y-3">
        {prescriptions.map((prescription) => (
          <PrescriptionCard
            key={prescription._id}
            prescription={prescription}
            doctorName={resolveDoctorName(prescription.doctorId)}
            onClick={() => onSelect(prescription)}
          />
        ))}
      </div>
    )}

    {totalPages > 1 && (
      <div className="flex items-center justify-center gap-3 mt-4">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1.5 text-sm rounded-full border border-gray-300 disabled:opacity-40"
        >
          Previous
        </button>
        <span className="text-xs text-gray-500">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1.5 text-sm rounded-full border border-gray-300 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    )}
  </div>
);

export default PrescriptionList;
