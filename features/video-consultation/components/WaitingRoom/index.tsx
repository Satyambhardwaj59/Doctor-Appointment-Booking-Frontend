'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { VideoConsultation, UserRole, MediaState } from '../../types/videoConsultation.types';

interface WaitingRoomProps {
  consultation: VideoConsultation;
  role: UserRole;
  mediaState: MediaState;
  mediaError: string | null;
  peerJoined: boolean;
  socketConnected: boolean;
  onJoin: () => void;
  onToggleCamera: () => void;
  onToggleMic: () => void;
  isJoining?: boolean;
}

const WaitingRoom: React.FC<WaitingRoomProps> = ({
  consultation,
  role,
  mediaState,
  mediaError,
  peerJoined,
  socketConnected,
  onJoin,
  onToggleCamera,
  onToggleMic,
  isJoining = false,
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Attach local stream to video preview
  useEffect(() => {
    if (localVideoRef.current && mediaState.localStream) {
      localVideoRef.current.srcObject = mediaState.localStream;
    }
  }, [mediaState.localStream]);

  // Microphone level visualizer
  useEffect(() => {
    if (!mediaState.localStream || !mediaState.micEnabled) {
      setAudioLevel(0);
      return;
    }

    try {
      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(mediaState.localStream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        setAudioLevel(Math.min(100, avg * 2));
        animFrameRef.current = requestAnimationFrame(tick);
      };
      animFrameRef.current = requestAnimationFrame(tick);

      return () => {
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        ctx.close();
      };
    } catch {
      // AudioContext not supported
    }
  }, [mediaState.localStream, mediaState.micEnabled]);

  const waitingMessage = () => {
    if (!socketConnected) return { text: 'Connecting to server...', color: 'text-amber-400' };
    if (peerJoined) return { text: role === 'patient' ? 'Doctor has joined. Ready to connect.' : 'Patient has joined. Ready to connect.', color: 'text-emerald-400' };
    return {
      text: role === 'patient' ? 'Waiting for doctor to join...' : 'Waiting for patient to join...',
      color: 'text-blue-300',
    };
  };

  const { text, color } = waitingMessage();

  const apptDate = consultation.appointment?.slotDate?.replace(/_/g, ' ') || 'Scheduled';
  const apptTime = consultation.appointment?.slotTime || '';
  const doctorName = consultation.appointment?.docData?.name || 'Your Doctor';
  const patientName = consultation.appointment?.userData?.name || 'Patient';

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-indigo-950 flex flex-col lg:flex-row items-center justify-center p-4 gap-6">

      {/* ── Left: Video Preview ─────────────────────────────────────── */}
      <div className="w-full max-w-sm lg:max-w-md">
        <div className="relative rounded-2xl overflow-hidden bg-zinc-900 shadow-2xl aspect-video">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              mediaState.cameraEnabled ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transform: 'scaleX(-1)' }}
          />

          {(!mediaState.cameraEnabled || !mediaState.localStream) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {role === 'doctor'
                  ? doctorName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)
                  : patientName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
              </div>
              <p className="mt-3 text-white/60 text-sm">Camera is off</p>
            </div>
          )}

          {/* Camera/Mic controls overlay */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-3">
            <button
              onClick={onToggleMic}
              aria-label={mediaState.micEnabled ? 'Mute mic' : 'Unmute mic'}
              className={`p-2.5 rounded-full transition-all duration-200 ${
                mediaState.micEnabled
                  ? 'bg-white/20 hover:bg-white/30 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mediaState.micEnabled ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 016 0v8.25a3 3 0 01-3 3z" />
                ) : (
                  <>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 016 0v8.25a3 3 0 01-3 3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                  </>
                )}
              </svg>
            </button>

            <button
              onClick={onToggleCamera}
              aria-label={mediaState.cameraEnabled ? 'Turn camera off' : 'Turn camera on'}
              className={`p-2.5 rounded-full transition-all duration-200 ${
                mediaState.cameraEnabled
                  ? 'bg-white/20 hover:bg-white/30 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mediaState.cameraEnabled ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M12 18.75H4.5a2.25 2.25 0 01-2.25-2.25V9m12.841-4.5A2.245 2.245 0 0116.5 7.5v.975M3 3l18 18" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mic level indicator */}
        {mediaState.micEnabled && (
          <div className="mt-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 016 0v8.25a3 3 0 01-3 3z" />
            </svg>
            <div className="flex-1 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-75"
                style={{ width: `${audioLevel}%` }}
              />
            </div>
            <span className="text-xs text-white/40">Mic</span>
          </div>
        )}
      </div>

      {/* ── Right: Info & Join ──────────────────────────────────────── */}
      <div className="w-full max-w-sm lg:max-w-xs space-y-5">

        {/* Logo / Title */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <span className="text-white font-semibold text-lg">Video Consultation</span>
          </div>
          <p className="text-white/40 text-sm">Waiting Room</p>
        </div>

        {/* Appointment Info Card */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-white/40 text-xs">Doctor</p>
              <p className="text-white text-sm font-medium">{doctorName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
              </svg>
            </div>
            <div>
              <p className="text-white/40 text-xs">Appointment</p>
              <p className="text-white text-sm font-medium">{apptDate}</p>
              <p className="text-white/60 text-xs">{apptTime}</p>
            </div>
          </div>
        </div>

        {/* Error state */}
        {mediaError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <p className="text-red-300 text-sm">{mediaError}</p>
            </div>
          </div>
        )}

        {/* Waiting status */}
        <div className="flex items-center gap-2">
          <div className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              peerJoined ? 'bg-emerald-400' : 'bg-blue-400'
            }`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              peerJoined ? 'bg-emerald-400' : 'bg-blue-400'
            }`} />
          </div>
          <p className={`text-sm font-medium ${color}`}>{text}</p>
        </div>

        {/* Join Button */}
        <button
          id="join-consultation-btn"
          onClick={onJoin}
          disabled={isJoining || !socketConnected}
          className="w-full py-3.5 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 active:scale-95 shadow-lg shadow-indigo-900/40 flex items-center justify-center gap-2"
        >
          {isJoining ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Joining...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <span>Join Consultation</span>
            </>
          )}
        </button>

        <p className="text-white/30 text-xs text-center">
          By joining, you agree to our video consultation terms
        </p>
      </div>
    </div>
  );
};

export default WaitingRoom;
