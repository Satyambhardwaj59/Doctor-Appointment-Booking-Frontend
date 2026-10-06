'use client';

import React, { useContext, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AppContext } from '../../../../context/AppContext';
import { useLiveQueue } from '../../hooks/useLiveQueue';
import QueuePosition from '../QueuePosition';
import QueueProgress from '../QueueProgress';
import EstimatedWait from '../EstimatedWait';
import QueueSkeleton from '../QueueSkeleton';
import { statusLabel, statusStyle } from '../../utils/queue.utils';
import type { QueueCredentials } from '../../types/queue.types';

const QueueStatus: React.FC = () => {
  const { token, doctors } = useContext(AppContext);
  const router = useRouter();

  const credentials: QueueCredentials | null = useMemo(
    () => (token ? { token, role: 'patient' } : null),
    [token]
  );

  const { positions, loading, error, connectionState, leave, refresh } = useLiveQueue(credentials);

  if (!token) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Please login to view your live queue.</p>
        <button
          onClick={() => router.push('/login')}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700"
        >
          Login
        </button>
      </div>
    );
  }

  const doctorName = (doctorId: string) => doctors.find((d) => d._id === doctorId)?.name || 'Your doctor';

  return (
    <div className="max-w-xl mx-auto py-6">
      <h1 className="text-2xl font-bold text-gray-900">Live Queue</h1>
      <p className="text-sm text-gray-500 mt-1 mb-4">Track your place in line in real time.</p>

      {connectionState !== 'connected' && (
        <div
          className={`text-xs text-center py-1.5 rounded-lg mb-4 ${
            connectionState === 'disconnected' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'
          }`}
        >
          {connectionState === 'disconnected'
            ? '🔴 Connection lost — updates will resume when you reconnect.'
            : '🟡 Connecting to live updates...'}
        </div>
      )}

      {loading ? (
        <QueueSkeleton />
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-sm text-red-500">{error}</p>
          <button onClick={() => refresh()} className="mt-3 text-sm text-indigo-600 hover:underline">
            Try again
          </button>
        </div>
      ) : positions.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <div className="text-3xl mb-2">🕐</div>
          <h3 className="text-base font-semibold text-gray-800">You&apos;re not in a live queue</h3>
          <p className="text-sm text-gray-500 mt-1 px-6">
            On the day of your appointment, open My Appointments and choose Join Live Queue.
          </p>
          <button
            onClick={() => router.push('/my-appointments')}
            className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700"
          >
            My Appointments
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {positions.map((view) => {
            const { entry } = view;
            const canLeave = entry.status === 'WAITING' || entry.status === 'SKIPPED';

            return (
              <div key={entry._id} className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-semibold text-gray-900">{doctorName(view.doctorId)}</h2>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusStyle(entry.status)}`}>
                    {statusLabel(entry.status)}
                  </span>
                </div>

                {view.isPaused && entry.status === 'WAITING' && (
                  <div className="text-xs bg-yellow-50 text-yellow-800 rounded-lg px-3 py-2">
                    ⏸ The doctor has paused the queue. We&apos;ll notify you when it resumes.
                  </div>
                )}

                {entry.status === 'CALLED' && (
                  <div className="text-sm bg-indigo-600 text-white rounded-xl px-4 py-3 text-center font-medium">
                    It&apos;s your turn — please proceed to your doctor.
                  </div>
                )}

                {entry.status === 'SKIPPED' && (
                  <div className="text-xs bg-red-50 text-red-700 rounded-lg px-3 py-2">
                    You were skipped. Check with the clinic desk if you&apos;re still here.
                  </div>
                )}

                <QueuePosition view={view} />

                {entry.status === 'WAITING' && (
                  <EstimatedWait minutes={entry.estimatedWaitMinutes} isPaused={view.isPaused} />
                )}

                <QueueProgress status={entry.status} />

                {canLeave && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => leave(view.queueId, entry.appointmentId)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Leave queue
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QueueStatus;
