import React from 'react';
import type { QueueEntryStatus } from '../../types/queue.types';

const STAGES: { key: QueueEntryStatus; label: string }[] = [
  { key: 'WAITING', label: 'Waiting' },
  { key: 'CALLED', label: 'Called' },
  { key: 'IN_CONSULTATION', label: 'In consultation' },
  { key: 'COMPLETED', label: 'Done' },
];

const QueueProgress: React.FC<{ status: QueueEntryStatus }> = ({ status }) => {
  // A skipped patient is back at the start of the journey visually.
  const current = Math.max(0, STAGES.findIndex((s) => s.key === status));

  return (
    <div className="flex items-center">
      {STAGES.map((stage, index) => {
        const reached = index <= current;
        return (
          <React.Fragment key={stage.key}>
            <div className="flex flex-col items-center w-16 shrink-0">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  reached ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index < current ? '✓' : index + 1}
              </div>
              <span className={`text-[10px] mt-1 text-center ${reached ? 'text-indigo-700' : 'text-gray-400'}`}>
                {stage.label}
              </span>
            </div>
            {index < STAGES.length - 1 && (
              <div className={`flex-1 h-0.5 -mt-4 ${index < current ? 'bg-indigo-600' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default QueueProgress;
