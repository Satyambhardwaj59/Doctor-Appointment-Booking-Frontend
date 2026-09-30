import React from 'react';
import type { MedicationEntry, MedicationStatus } from '../../types/prescription.types';
import { formatTime, medicationStatusStyle, titleCase } from '../../utils/prescription.utils';

interface MedicationScheduleProps {
  entries: MedicationEntry[];
  nextDose: MedicationEntry | null;
  loading: boolean;
  error: string | null;
  updatingId: string | null;
  onMark: (id: string, status: Extract<MedicationStatus, 'TAKEN' | 'SKIPPED'>) => void;
}

const MedicationSchedule: React.FC<MedicationScheduleProps> = ({
  entries,
  nextDose,
  loading,
  error,
  updatingId,
  onMark,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-red-500 text-center py-8">{error}</p>;
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-14 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
        <div className="text-3xl mb-2">✅</div>
        <h3 className="text-base font-semibold text-gray-800">No medications scheduled today</h3>
      </div>
    );
  }

  return (
    <div>
      {nextDose && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-4 py-3 mb-4">
          <p className="text-xs text-indigo-500 font-medium">Next dose</p>
          <p className="text-sm text-indigo-900 font-semibold">
            {nextDose.medicineName} · {nextDose.dosage} at {formatTime(nextDose.scheduledTime)}
          </p>
        </div>
      )}

      <div className="space-y-2">
        {entries.map((entry) => {
          const actionable = entry.status === 'PENDING' || entry.status === 'MISSED';
          const busy = updatingId === entry._id;
          return (
            <div
              key={entry._id}
              className="flex items-center justify-between gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {formatTime(entry.scheduledTime)} · {entry.medicineName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {entry.dosage}
                  {entry.timing ? ` · ${entry.timing}` : ''}
                </p>
              </div>

              {actionable ? (
                <div className="flex gap-2 shrink-0">
                  <button
                    disabled={busy}
                    onClick={() => onMark(entry._id, 'TAKEN')}
                    className="px-3 py-1.5 text-xs font-semibold rounded-full bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    Taken
                  </button>
                  <button
                    disabled={busy}
                    onClick={() => onMark(entry._id, 'SKIPPED')}
                    className="px-3 py-1.5 text-xs font-semibold rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Skip
                  </button>
                </div>
              ) : (
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${medicationStatusStyle(
                    entry.status
                  )}`}
                >
                  {titleCase(entry.status)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MedicationSchedule;
