'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getConsultationById } from '../../../../features/video-consultation/services/videoConsultation.service';
import VideoCall from '../../../../features/video-consultation/components/VideoCall';
import type { VideoConsultation, UserRole } from '../../../../features/video-consultation/types/videoConsultation.types';

export default function VideoCallRoomPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [consultation, setConsultation] = useState<VideoConsultation | null>(null);
  const [role, setRole] = useState<UserRole>('patient');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Detect role from query parameters and localStorage tokens
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const dtokenParam = urlParams.get('dtoken');
      if (dtokenParam) {
        localStorage.setItem('dToken', dtokenParam);
        localStorage.setItem('dtoken', dtokenParam);
      }

      const dtoken = dtokenParam || localStorage.getItem('dToken') || localStorage.getItem('dtoken');
      const atoken = localStorage.getItem('atoken') || localStorage.getItem('aToken');
      if (dtoken) setRole('doctor');
      else if (atoken) setRole('admin');
      else setRole('patient');
    }
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchConsultation = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getConsultationById(id);
        if (res.success && res.consultation) {
          setConsultation(res.consultation);
        } else {
          setError(res.message || 'Unable to join consultation');
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Unable to join consultation');
      } finally {
        setLoading(false);
      }
    };

    fetchConsultation();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gray-950 text-white rounded-2xl my-4 space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 font-medium">Entering secure consultation room...</p>
      </div>
    );
  }

  if (error || !consultation) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border border-gray-200 rounded-2xl shadow-sm text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center text-red-600">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Room Error</h2>
        <p className="text-sm text-gray-600 mb-6">{error || 'Consultation session could not be established.'}</p>
        <button
          onClick={() => router.push(`/video-consultation/${id}/waiting-room`)}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition"
        >
          Return to Waiting Room
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-gray-950">
      <VideoCall
        consultation={consultation}
        role={role}
        onCallEnded={() => {
          router.push('/video-consultation/history');
        }}
      />
    </div>
  );
}
