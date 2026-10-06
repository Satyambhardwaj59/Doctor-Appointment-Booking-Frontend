import React from 'react';
import type { DoctorEntry } from '../../types/queue.types';
import { formatTime, statusLabel, statusStyle } from '../../utils/queue.utils';

interface CurrentPatientProps {
  entry: DoctorEntry | null;
  busy: boolean;
  onStart: () => void;
  onComplete: () => void;
  onSkip: () => void;
}

const CurrentPatient: React.FC<CurrentPatientProps> = ({ entry, busy, onStart, onComplete, onSkip }) => {
  if (!entry) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-5 py-8 text-center">
        <p className="text-sm font-semibold text-gray-700">No patient in consultation</p>
        <p className="text-xs text-gray-400 mt-1">Use &quot;Call next&quot; to bring in the next patient.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-lg font-bold shrink-0">
            #{entry.queueNumber}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">{entry.patientName || 'Patient'}</p>
            {entry.familyMemberName && (
              <p className="text-xs text-gray-500 truncate">For: {entry.familyMemberName}</p>
            )}
            <p className="text-[11px] text-gray-400">
              {entry.status === 'IN_CONSULTATION'
                ? `Started ${formatTime(entry.startedAt)}`
                : `Called ${formatTime(entry.calledAt)}`}
            </p>
          </div>
        </div>
        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${statusStyle(entry.status)}`}>
          {statusLabel(entry.status)}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {entry.status === 'CALLED' && (
          <>
            <button
              disabled={busy}
              onClick={onStart}
              className="px-4 py-2 rounded-full text-sm bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
            >
              Start consultation
            </button>
            <button
              disabled={busy}
              onClick={onSkip}
              className="px-4 py-2 rounded-full text-sm border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              Skip (no-show)
            </button>
          </>
        )}
        {entry.status === 'IN_CONSULTATION' && (
          <button
            disabled={busy}
            onClick={onComplete}
            className="px-4 py-2 rounded-full text-sm bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50"
          >
            Complete consultation
          </button>
        )}
      </div>
    </div>
  );
};

export default CurrentPatient;
