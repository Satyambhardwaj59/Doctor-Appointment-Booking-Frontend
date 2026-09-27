'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getConsultationById } from '../../../../features/video-consultation/services/videoConsultation.service';
import WaitingRoom from '../../../../features/video-consultation/components/WaitingRoom';
import { useMediaDevices } from '../../../../features/video-consultation/hooks/useMediaDevices';
import type { VideoConsultation, UserRole } from '../../../../features/video-consultation/types/videoConsultation.types';

export default function WaitingRoomPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const {
    mediaState,
    mediaError,
    initializeMedia,
    toggleCamera,
    toggleMic,
  } = useMediaDevices();

  const [consultation, setConsultation] = useState<VideoConsultation | null>(null);
  const [role, setRole] = useState<UserRole>('patient');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeMedia();
  }, [initializeMedia]);

  useEffect(() => {
    // Detect user role from query parameters and localStorage tokens
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

          // If consultation is already completed/cancelled, redirect to history
          if (res.consultation.status === 'COMPLETED' || res.consultation.status === 'CANCELLED') {
            router.push(`/video-consultation/history`);
          }
        } else {
          setError(res.message || 'Failed to load consultation session');
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to load consultation session');
      } finally {
        setLoading(false);
      }
    };

    fetchConsultation();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600 font-medium">Preparing waiting room...</p>
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
        <h2 className="text-xl font-bold text-gray-900 mb-2">Session Not Found</h2>
        <p className="text-sm text-gray-600 mb-6">{error || 'This consultation does not exist or has expired.'}</p>
        <button
          onClick={() => router.push('/my-appointments')}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition"
        >
          Return to My Appointments
        </button>
      </div>
    );
  }

  return (
    <div className="w-full py-6">
      <WaitingRoom
        consultation={consultation}
        role={role}
        mediaState={mediaState}
        mediaError={mediaError}
        peerJoined={false}
        socketConnected={true}
        onJoin={() => {
          let query = '';
          if (typeof window !== 'undefined') {
            const dtoken = localStorage.getItem('dToken') || localStorage.getItem('dtoken');
            if (dtoken) query = `?dtoken=${encodeURIComponent(dtoken)}`;
          }
          router.push(`/video-consultation/${id}/room${query}`);
        }}
        onToggleCamera={toggleCamera}
        onToggleMic={toggleMic}
      />
    </div>
  );
}
