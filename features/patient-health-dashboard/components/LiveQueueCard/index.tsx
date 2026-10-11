import React from 'react';
import { QueuePosition, EstimatedWait, statusLabel, statusStyle } from '../../../smart-live-queue';
import SectionCard from '../SectionCard';
import type { DashboardQueueStatus } from '../../types/patientDashboard.types';

interface LiveQueueCardProps {
  queue: DashboardQueueStatus | null;
  error?: string;
  onOpen: () => void;
}

const LiveQueueCard: React.FC<LiveQueueCardProps> = ({ queue, error, onOpen }) => (
  <SectionCard
    title="Live Queue"
    icon="🕐"
    actionLabel="Open queue"
    onAction={queue ? onOpen : undefined}
    error={error}
  >
    {queue ? (
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-gray-900 truncate">{queue.doctor.name}</p>
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${statusStyle(queue.entry.status)}`}>
            {statusLabel(queue.entry.status)}
          </span>
        </div>

        {queue.isPaused && queue.entry.status === 'WAITING' && (
          <p className="text-xs bg-yellow-50 text-yellow-800 rounded-lg px-3 py-2">⏸ The doctor has paused the queue.</p>
        )}
        {queue.entry.status === 'CALLED' && (
          <p className="text-sm bg-indigo-600 text-white rounded-xl px-4 py-2.5 text-center font-medium">
            It&apos;s your turn — please proceed to your doctor.
          </p>
        )}

        <QueuePosition view={queue} />
        {queue.entry.status === 'WAITING' && (
          <EstimatedWait minutes={queue.entry.estimatedWaitMinutes} isPaused={queue.isPaused} />
        )}
      </div>
    ) : (
      <div className="text-center py-6">
        <p className="text-sm font-medium text-gray-700">You&apos;re not in a live queue</p>
        <p className="text-xs text-gray-400 mt-1">On the day of your appointment, you can join from My Appointments.</p>
      </div>
    )}
  </SectionCard>
);

export default LiveQueueCard;
