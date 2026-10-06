import React from 'react';
import type { DoctorEntry } from '../../types/queue.types';
import { formatTime } from '../../utils/queue.utils';

interface WaitingPatientsProps {
  waiting: DoctorEntry[];
  skipped: DoctorEntry[];
  busy: boolean;
  onSkip: (entryId: string) => void;
  onRecall: (entryId: string) => void;
}

const Row: React.FC<{
  entry: DoctorEntry;
  action: { label: string; className: string; onClick: () => void };
  busy: boolean;
}> = ({ entry, action, busy }) => (
  <div className="flex items-center justify-between gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3">
    <div className="flex items-center gap-3 min-w-0">
      <div className="w-9 h-9 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center text-sm font-bold shrink-0">
        #{entry.queueNumber}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{entry.patientName || 'Patient'}</p>
        <p className="text-[11px] text-gray-400 truncate">
          {entry.familyMemberName ? `For ${entry.familyMemberName} · ` : ''}joined {formatTime(entry.joinedAt)}
          {entry.status === 'WAITING' && entry.estimatedWaitTime > 0 ? ` · ~${entry.estimatedWaitTime} min` : ''}
        </p>
      </div>
    </div>
    <button disabled={busy} onClick={action.onClick} className={`text-xs px-3 py-1.5 rounded-full disabled:opacity-50 ${action.className}`}>
      {action.label}
    </button>
  </div>
);

const WaitingPatients: React.FC<WaitingPatientsProps> = ({ waiting, skipped, busy, onSkip, onRecall }) => (
  <div className="space-y-5">
    <div>
      <h3 className="text-sm font-semibold text-gray-800 mb-2">Waiting ({waiting.length})</h3>
      {waiting.length === 0 ? (
        <p className="text-xs text-gray-400 bg-gray-50 rounded-xl px-4 py-5 text-center">
          No patients are waiting right now.
        </p>
      ) : (
        <div className="space-y-2">
          {waiting.map((entry) => (
            <Row
              key={entry._id}
              entry={entry}
              busy={busy}
              action={{
                label: 'Skip',
                className: 'border border-gray-300 text-gray-600 hover:bg-gray-50',
                onClick: () => onSkip(entry._id),
              }}
            />
          ))}
        </div>
      )}
    </div>

    {skipped.length > 0 && (
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Skipped ({skipped.length})</h3>
        <div className="space-y-2">
          {skipped.map((entry) => (
            <Row
              key={entry._id}
              entry={entry}
              busy={busy}
              action={{
                label: 'Recall',
                className: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100',
                onClick: () => onRecall(entry._id),
              }}
            />
          ))}
        </div>
      </div>
    )}
  </div>
);

export default WaitingPatients;
