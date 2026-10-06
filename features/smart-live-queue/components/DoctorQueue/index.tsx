'use client';

import React from 'react';
import { useLiveQueue } from '../../hooks/useLiveQueue';
import CurrentPatient from '../CurrentPatient';
import WaitingPatients from '../WaitingPatients';
import QueueSkeleton from '../QueueSkeleton';
import type { QueueCredentials } from '../../types/queue.types';

interface DoctorQueueProps {
  credentials: QueueCredentials | null;
}

const DoctorQueue: React.FC<DoctorQueueProps> = ({ credentials }) => {
  const { doctorQueue, loading, error, connectionState, acting, refresh, act } = useLiveQueue(credentials);

  if (loading) return <QueueSkeleton />;

  if (error || !doctorQueue) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-red-500">{error || 'Could not load the queue'}</p>
        <button onClick={() => refresh()} className="mt-3 text-sm text-indigo-600 hover:underline">
          Try again
        </button>
      </div>
    );
  }

  const canCallNext = !doctorQueue.isPaused && !doctorQueue.active && doctorQueue.waitingCount > 0;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Today&apos;s Queue</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {doctorQueue.waitingCount} waiting · {doctorQueue.completedCount} completed · avg consultation ~
            {doctorQueue.avgConsultationMinutes} min (estimate)
          </p>
        </div>
        <span
          className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${
            doctorQueue.isPaused ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'
          }`}
        >
          {doctorQueue.isPaused ? 'Paused' : 'Active'}
        </span>
      </div>

      {connectionState !== 'connected' && (
        <div
          className={`text-xs text-center py-1.5 rounded-lg ${
            connectionState === 'disconnected' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'
          }`}
        >
          {connectionState === 'disconnected'
            ? '🔴 Connection lost — the queue will re-sync when you reconnect.'
            : '🟡 Connecting to live updates...'}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          disabled={acting || !canCallNext}
          onClick={() => act('call-next')}
          className="px-5 py-2.5 rounded-full text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40"
        >
          Call next
        </button>
        {doctorQueue.isPaused ? (
          <button
            disabled={acting}
            onClick={() => act('resume')}
            className="px-5 py-2.5 rounded-full text-sm font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
          >
            Resume queue
          </button>
        ) : (
          <button
            disabled={acting}
            onClick={() => act('pause')}
            className="px-5 py-2.5 rounded-full text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Pause queue
          </button>
        )}
      </div>

      <CurrentPatient
        entry={doctorQueue.active}
        busy={acting}
        onStart={() => act('start')}
        onComplete={() => act('complete')}
        onSkip={() => act('skip')}
      />

      <WaitingPatients
        waiting={doctorQueue.waiting}
        skipped={doctorQueue.skipped}
        busy={acting}
        onSkip={(entryId) => act('skip', entryId)}
        onRecall={(entryId) => act('recall', entryId)}
      />
    </div>
  );
};

export default DoctorQueue;
