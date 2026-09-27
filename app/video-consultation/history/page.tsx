'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getConsultationHistory } from '../../../features/video-consultation/services/videoConsultation.service';
import type { VideoConsultation, UserRole } from '../../../features/video-consultation/types/videoConsultation.types';

export default function ConsultationHistoryPage() {
  const router = useRouter();
  const [consultations, setConsultations] = useState<VideoConsultation[]>([]);
  const [role, setRole] = useState<UserRole>('patient');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'COMPLETED' | 'UPCOMING'>('ALL');
  const [selectedNotes, setSelectedNotes] = useState<VideoConsultation | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dtoken = localStorage.getItem('dtoken') || localStorage.getItem('dToken');
      const atoken = localStorage.getItem('atoken') || localStorage.getItem('aToken');
      if (dtoken) setRole('doctor');
      else if (atoken) setRole('admin');
      else setRole('patient');
    }
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await getConsultationHistory();
        if (res.success && res.consultations) {
          setConsultations(res.consultations);
        }
      } catch (err) {
        console.error('Failed to fetch consultation history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filteredConsultations = consultations.filter((c) => {
    if (filter === 'ALL') return true;
    if (filter === 'COMPLETED') return c.status === 'COMPLETED';
    if (filter === 'UPCOMING') return c.status === 'UPCOMING' || c.status === 'WAITING' || c.status === 'ACTIVE';
    return true;
  });

  const formatDuration = (seconds?: number | null) => {
    if (!seconds) return '—';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="px-2.5 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">Completed</span>;
      case 'ACTIVE':
        return <span className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full animate-pulse">In Progress</span>;
      case 'UPCOMING':
      case 'WAITING':
        return <span className="px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-100 rounded-full">Upcoming</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 sm:px-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Video Consultations</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review past consultation sessions, summaries, and medical doctor notes.
          </p>
        </div>
        <Link
          href="/my-appointments"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-sm font-medium transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          My Appointments
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mt-6">
        {(['ALL', 'COMPLETED', 'UPCOMING'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              filter === tab
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab === 'ALL' ? 'All Sessions' : tab === 'UPCOMING' ? 'Upcoming' : 'Completed'}
          </button>
        ))}
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading consultations...</p>
        </div>
      ) : filteredConsultations.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300 mt-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">No consultation records found</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
            Book an appointment with a doctor to begin your first secure video consultation.
          </p>
          <Link
            href="/doctors"
            className="mt-4 inline-block px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition"
          >
            Find a Doctor
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {filteredConsultations.map((c) => {
            const doctor = (c.doctorId as any) || c.appointment?.docData;
            const patient = (c.patientId as any) || c.appointment?.userData;
            const appointment = (c.appointmentId as any) || c.appointment;
            const doctorName = doctor?.name || 'Doctor';
            const doctorImage = doctor?.image;
            const doctorSpeciality = doctor?.speciality || 'Specialist';
            const patientName = patient?.name || 'Patient';
            const notesText = c.consultationNotes || c.notes;

            return (
              <div
                key={c._id}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {doctorImage ? (
                        <img
                          src={doctorImage}
                          alt={doctorName}
                          className="w-12 h-12 rounded-xl object-cover bg-blue-50"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                          {doctorName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-gray-900 text-base">
                          {doctorName.startsWith('Dr.') ? doctorName : `Dr. ${doctorName}`}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {doctorSpeciality}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(c.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs py-3 border-y border-gray-100 my-3">
                    <div>
                      <span className="text-gray-400 block">Date & Time</span>
                      <span className="font-medium text-gray-800">
                        {appointment?.slotDate || new Date(c.createdAt).toLocaleDateString()}{' '}
                        {appointment?.slotTime ? `at ${appointment.slotTime}` : ''}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Duration</span>
                      <span className="font-medium text-gray-800">
                        {formatDuration(c.duration)}
                      </span>
                    </div>
                    <div className="col-span-2 mt-1">
                      <span className="text-gray-400 block">Patient</span>
                      <span className="font-medium text-gray-800">{patientName}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  {c.status === 'UPCOMING' || c.status === 'ACTIVE' || c.status === 'WAITING' ? (
                    <button
                      onClick={() => router.push(`/video-consultation/${c._id}/waiting-room`)}
                      className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Join Consultation
                    </button>
                  ) : null}

                  {notesText ? (
                    <button
                      onClick={() => setSelectedNotes(c)}
                      className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      View Notes
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Doctor Notes Modal */}
      {selectedNotes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-gray-900">Doctor Consultation Notes</h3>
              <button
                onClick={() => setSelectedNotes(null)}
                className="text-gray-400 hover:text-gray-600 rounded-lg p-1"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="bg-blue-50/60 rounded-xl p-4 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
              {selectedNotes.consultationNotes || selectedNotes.notes}
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedNotes(null)}
                className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
