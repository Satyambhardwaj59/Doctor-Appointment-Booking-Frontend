import React from 'react';
import type { PatientQueueView } from '../../types/queue.types';

const QueuePosition: React.FC<{ view: PatientQueueView }> = ({ view }) => {
  const { entry, nowServing } = view;
  const waiting = entry.status === 'WAITING';

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-gray-200 px-4 py-3 text-center">
          <p className="text-xs text-gray-400">Your token</p>
          <p className="text-3xl font-bold text-gray-900">#{entry.queueNumber}</p>
        </div>
        <div className="rounded-xl border border-gray-200 px-4 py-3 text-center">
          <p className="text-xs text-gray-400">Now serving</p>
          <p className="text-3xl font-bold text-gray-900">{nowServing === null ? '—' : `#${nowServing}`}</p>
        </div>
      </div>

      {waiting && (
        <p className="text-sm text-gray-600 text-center mt-3">
          {entry.patientsAhead === 0
            ? "You're next"
            : `${entry.patientsAhead} patient${entry.patientsAhead === 1 ? '' : 's'} ahead of you`}
          {entry.position !== null && <span className="text-gray-400"> · position {entry.position}</span>}
        </p>
      )}
    </div>
  );
};

export default QueuePosition;
