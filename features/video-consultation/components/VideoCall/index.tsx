'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useCall } from '../../hooks/useCall';
import ConsultationHeader from '../ConsultationHeader';
import ParticipantVideo from '../ParticipantVideo';
import VideoControls from '../VideoControls';
import CallEnded from '../CallEnded';
import type { VideoConsultation, UserRole } from '../../types/videoConsultation.types';

interface VideoCallProps {
  consultation: VideoConsultation;
  role: UserRole;
  onCallEnded?: () => void;
}

export default function VideoCall({ consultation, role, onCallEnded }: VideoCallProps) {
  const {
    mediaState,
    mediaError,
    connectionState,
    peerJoined,
    callEnded,
    remoteStream,
    joinCall,
    endCall,
    toggleCamera,
    toggleMic,
    toggleSpeaker,
    handleScreenShare,
  } = useCall({
    consultationId: consultation._id,
    role,
  });

  const [callDuration, setCallDuration] = useState(0);
  const [layoutMode, setLayoutMode] = useState<'pip' | 'grid'>('pip');

  // Automatically request media and connect when entering room
  useEffect(() => {
    joinCall();
  }, [joinCall]);

  // Track call duration when peer is connected
  useEffect(() => {
    if (connectionState !== 'connected') return;

    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [connectionState]);

  // Determine peer display information
  const doctorName =
    (consultation.doctorId as any)?.name ||
    consultation.appointment?.docData?.name ||
    'Doctor';

  const patientName =
    (consultation.patientId as any)?.name ||
    consultation.appointment?.userData?.name ||
    'Patient';

  const remoteName = role === 'doctor' ? patientName : `Dr. ${doctorName}`;
  const remoteAvatar = role === 'doctor'
    ? ((consultation.patientId as any)?.image || consultation.appointment?.userData?.image)
    : ((consultation.doctorId as any)?.image || consultation.appointment?.docData?.image);

  const localName = role === 'doctor' ? `Dr. ${doctorName} (You)` : `${patientName} (You)`;

  // If call ended, render post-consultation screen
  if (callEnded) {
    return (
      <CallEnded
        consultation={consultation}
        role={role}
        durationSeconds={callDuration}
      />
    );
  }

  return (
    <div className="relative flex flex-col h-screen w-full bg-gray-950 text-white overflow-hidden select-none">
      {/* Consultation Header */}
      <ConsultationHeader
        doctorName={doctorName}
        patientName={patientName}
        role={role}
        connectionState={connectionState}
        durationSeconds={callDuration}
      />

      {/* Main Video View Area */}
      <div className="relative flex-1 w-full p-3 sm:p-4 overflow-hidden flex items-center justify-center">
        {/* Layout: Grid Mode (Side-by-Side) */}
        {layoutMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full max-w-7xl">
            {/* Remote Participant */}
            <div className="relative w-full h-full min-h-[260px] bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 shadow-xl flex items-center justify-center">
              {remoteStream ? (
                <ParticipantVideo
                  stream={remoteStream}
                  name={remoteName}
                  avatarUrl={remoteAvatar}
                  className="w-full h-full"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
                      <span className="text-2xl font-bold text-blue-400">
                        {remoteName.charAt(0)}
                      </span>
                    </div>
                    <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-amber-400 border-2 border-gray-950 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-200">
                      Waiting for {remoteName}...
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 max-w-xs">
                      The consultation will begin with video as soon as the other participant joins.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Local Participant */}
            <div className="relative w-full h-full min-h-[260px] bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 shadow-xl">
              <ParticipantVideo
                stream={mediaState.localStream}
                name={localName}
                isLocal
                isMuted={!mediaState.micEnabled}
                isCameraOff={!mediaState.cameraEnabled}
                className="w-full h-full"
              />
            </div>
          </div>
        )}

        {/* Layout: PiP Mode (Primary Remote + Floating Local) */}
        {layoutMode === 'pip' && (
          <div className="relative w-full h-full max-w-7xl flex items-center justify-center">
            {/* Primary Display: Remote Video / Waiting Screen */}
            <div className="w-full h-full rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl relative flex items-center justify-center">
              {remoteStream ? (
                <ParticipantVideo
                  stream={remoteStream}
                  name={remoteName}
                  avatarUrl={remoteAvatar}
                  className="w-full h-full"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-6 space-y-5 animate-fade-in">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 p-0.5 shadow-lg shadow-blue-500/20">
                      <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                        <span className="text-3xl font-bold text-blue-400">
                          {remoteName.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <span className="absolute bottom-1 right-1 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-gray-900" />
                    </span>
                  </div>

                  <div className="max-w-md">
                    <h3 className="text-lg font-semibold text-white">
                      Waiting for {remoteName}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1.5">
                      {role === 'doctor'
                        ? 'The patient has been invited. They will appear here once they connect.'
                        : 'Doctor will join momentarily. Your camera and microphone are ready.'}
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800/80 border border-gray-700/60 text-xs text-gray-300">
                    <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>End-to-end encrypted WebRTC session</span>
                  </div>
                </div>
              )}
            </div>

            {/* Floating PiP Window (Local Stream) */}
            <div className="absolute bottom-4 right-4 w-36 h-48 sm:w-56 sm:h-36 md:w-64 md:h-44 rounded-xl overflow-hidden border-2 border-gray-700/80 shadow-2xl bg-gray-950 transition-all z-20 hover:border-blue-500">
              <ParticipantVideo
                stream={mediaState.localStream}
                name="You"
                isLocal
                isMuted={!mediaState.micEnabled}
                isCameraOff={!mediaState.cameraEnabled}
                className="w-full h-full"
              />
            </div>
          </div>
        )}

        {/* Layout Switcher Button */}
        <button
          onClick={() => setLayoutMode(layoutMode === 'pip' ? 'grid' : 'pip')}
          className="absolute top-6 right-6 z-20 px-3 py-1.5 bg-gray-900/80 hover:bg-gray-800 border border-gray-700/60 rounded-lg text-xs font-medium text-gray-300 backdrop-blur-md transition-all flex items-center gap-1.5 shadow-lg"
          title="Toggle between Picture-in-Picture and Grid view"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
          <span className="hidden sm:inline">{layoutMode === 'pip' ? 'Grid View' : 'Focus View'}</span>
        </button>
      </div>

      {/* Video Call Controls Bar */}
      <VideoControls
        micEnabled={mediaState.micEnabled}
        cameraEnabled={mediaState.cameraEnabled}
        speakerEnabled={mediaState.speakerEnabled}
        screenSharing={mediaState.screenSharing}
        onToggleMic={toggleMic}
        onToggleCamera={toggleCamera}
        onToggleSpeaker={toggleSpeaker}
        onToggleScreenShare={handleScreenShare}
        onEndCall={endCall}
      />
    </div>
  );
}
