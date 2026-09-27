'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitConsultationNotes } from '../../services/videoConsultation.service';
import type { VideoConsultation, UserRole } from '../../types/videoConsultation.types';

interface CallEndedProps {
  consultation: VideoConsultation;
  role: UserRole;
  durationSeconds?: number;
}

const formatDuration = (minutes: number | null): string => {
  if (!minutes) return '—';
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
};

const formatDateTime = (isoString: string | null): string => {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const formatDate = (isoString: string | null): string => {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const CallEnded: React.FC<CallEndedProps> = ({ consultation, role, durationSeconds }) => {
  const router = useRouter();
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [notesSubmitted, setNotesSubmitted] = useState(consultation.notesSubmitted);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const doctorName = consultation.appointment?.docData?.name || 'Doctor';
  const patientName = consultation.appointment?.userData?.name || 'Patient';

  const handleSubmitNotes = async () => {
    if (!notes.trim()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await submitConsultationNotes(consultation._id, notes);
      setNotesSubmitted(true);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit notes');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-indigo-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">

        {/* Success Icon */}
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="text-white text-2xl font-bold">Consultation Completed</h1>
          <p className="text-white/50 text-sm mt-1">Your video consultation has ended</p>
        </div>

        {/* Consultation Summary */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 space-y-4">
          <h2 className="text-white font-semibold text-base border-b border-white/10 pb-3">
            Session Summary
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-white/40 text-xs mb-0.5">Doctor</p>
              <p className="text-white text-sm font-medium">{doctorName}</p>
            </div>
            <div>
              <p className="text-white/40 text-xs mb-0.5">Patient</p>
              <p className="text-white text-sm font-medium">{patientName}</p>
            </div>
            <div>
              <p className="text-white/40 text-xs mb-0.5">Date</p>
              <p className="text-white text-sm font-medium">{formatDate(consultation.startedAt)}</p>
            </div>
            <div>
              <p className="text-white text-sm font-medium">
                {typeof durationSeconds === 'number'
                  ? `${Math.floor(durationSeconds / 60)}m ${durationSeconds % 60}s`
                  : formatDuration(consultation.duration)}
              </p>
            </div>
            <div>
              <p className="text-white/40 text-xs mb-0.5">Started</p>
              <p className="text-white text-sm font-medium">{formatDateTime(consultation.startedAt)}</p>
            </div>
            <div>
              <p className="text-white/40 text-xs mb-0.5">Ended</p>
              <p className="text-white text-sm font-medium">{formatDateTime(consultation.endedAt)}</p>
            </div>
          </div>
        </div>

        {/* Doctor Notes Section */}
        {role === 'doctor' && !notesSubmitted && (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 space-y-3">
            <h2 className="text-white font-semibold text-base">Consultation Notes</h2>
            <p className="text-white/40 text-xs">Add your post-consultation notes for the patient.</p>
            <textarea
              id="consultation-notes-input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter consultation notes, diagnosis, prescriptions, follow-up instructions..."
              maxLength={5000}
              rows={5}
              className="w-full bg-zinc-800 text-white text-sm rounded-xl p-3 border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none resize-none placeholder-white/30"
            />
            <div className="flex items-center justify-between">
              <span className="text-white/30 text-xs">{notes.length}/5000</span>
              {submitError && <p className="text-red-400 text-xs">{submitError}</p>}
            </div>
            <button
              id="submit-notes-btn"
              onClick={handleSubmitNotes}
              disabled={submitting || !notes.trim()}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 active:scale-95"
            >
              {submitting ? 'Submitting...' : 'Submit Notes'}
            </button>
          </div>
        )}

        {/* Submitted notes confirmation */}
        {role === 'doctor' && notesSubmitted && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <p className="text-sm font-medium">Consultation notes submitted</p>
            </div>
          </div>
        )}

        {/* Patient: view notes if submitted */}
        {role === 'patient' && consultation.notesSubmitted && consultation.consultationNotes && (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 space-y-2">
            <h2 className="text-white font-semibold text-base">Doctor&apos;s Notes</h2>
            <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
              {consultation.consultationNotes}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            id="view-history-btn"
            onClick={() => router.push('/video-consultation/history')}
            className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/15 text-white text-sm font-medium rounded-xl transition-all duration-200 active:scale-95"
          >
            View History
          </button>
          <button
            id="go-home-btn"
            onClick={() => router.push('/my-appointments')}
            className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 active:scale-95"
          >
            My Appointments
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallEnded;
