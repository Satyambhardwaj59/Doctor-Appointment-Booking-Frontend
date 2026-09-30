import React from 'react';
import type { MedicationEntry, MedicationStatus } from '../../types/prescription.types';
import { formatDateTime, medicationStatusStyle, titleCase } from '../../utils/prescription.utils';

interface MedicationHistoryProps {
  entries: MedicationEntry[];
  loading: boolean;
  error: string | null;
  status: MedicationStatus | '';
  onStatusChange: (status: MedicationStatus | '') => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const STATUS_OPTIONS: (MedicationStatus | '')[] = ['', 'TAKEN', 'SKIPPED', 'MISSED', 'PENDING'];

const MedicationHistory: React.FC<MedicationHistoryProps> = ({
  entries,
  loading,
  error,
  status,
  onStatusChange,
  page,
  totalPages,
  onPageChange,
}) => (
  <div>
    <div className="flex flex-wrap gap-2 mb-4">
      {STATUS_OPTIONS.map((option) => (
        <button
          key={option || 'ALL'}
          onClick={() => onStatusChange(option)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            status === option
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'border-gray-300 text-gray-600 hover:bg-gray-50'
          }`}
        >
          {option ? titleCase(option) : 'All'}
        </button>
      ))}
    </div>

    {loading ? (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    ) : error ? (
      <p className="text-sm text-red-500 text-center py-8">{error}</p>
    ) : entries.length === 0 ? (
      <div className="text-center py-14 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
        <h3 className="text-base font-semibold text-gray-800">No medication history yet</h3>
      </div>
    ) : (
      <div className="space-y-2">
        {entries.map((entry) => (
          <div
            key={entry._id}
            className="flex items-center justify-between gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{entry.medicineName}</p>
              <p className="text-xs text-gray-500">
                {entry.dosage} · scheduled {formatDateTime(entry.scheduledTime)}
              </p>
              {entry.takenAt && (
                <p className="text-[11px] text-gray-400">Taken {formatDateTime(entry.takenAt)}</p>
              )}
            </div>
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${medicationStatusStyle(
                entry.status
              )}`}
            >
              {titleCase(entry.status)}
            </span>
          </div>
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

export default MedicationHistory;
