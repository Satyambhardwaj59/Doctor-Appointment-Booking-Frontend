import React from 'react';
import { formatWait } from '../../utils/queue.utils';

interface EstimatedWaitProps {
  minutes: number;
  isPaused: boolean;
}

const EstimatedWait: React.FC<EstimatedWaitProps> = ({ minutes, isPaused }) => (
  <div className="rounded-xl bg-indigo-50 px-4 py-3">
    <p className="text-xs text-indigo-500 font-medium">Estimated wait</p>
    <p className="text-lg font-bold text-indigo-900">{formatWait(minutes)}</p>
    <p className="text-[11px] text-indigo-400 mt-0.5">
      {isPaused
        ? 'The queue is paused, so this may take longer than shown.'
        : 'An approximate estimate, not an exact time. It updates as the queue moves.'}
    </p>
  </div>
);

export default EstimatedWait;
