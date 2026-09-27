'use client';

import React from 'react';

interface VideoControlsProps {
  micEnabled: boolean;
  cameraEnabled: boolean;
  speakerEnabled: boolean;
  screenSharing: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onToggleSpeaker: () => void;
  onToggleScreenShare: () => void;
  onEndCall: () => void;
  disabled?: boolean;
}

interface ControlButtonProps {
  onClick: () => void;
  active: boolean;
  activeIcon: React.ReactNode;
  inactiveIcon: React.ReactNode;
  activeLabel: string;
  inactiveLabel: string;
  activeClass?: string;
  inactiveClass?: string;
  disabled?: boolean;
}

const ControlButton: React.FC<ControlButtonProps> = ({
  onClick,
  active,
  activeIcon,
  inactiveIcon,
  activeLabel,
  inactiveLabel,
  activeClass = 'bg-white/10 hover:bg-white/20 text-white',
  inactiveClass = 'bg-red-500/90 hover:bg-red-600 text-white',
  disabled = false,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={active ? activeLabel : inactiveLabel}
    title={active ? activeLabel : inactiveLabel}
    className={`
      flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200
      active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed
      ${active ? activeClass : inactiveClass}
    `}
  >
    <div className="w-6 h-6">{active ? activeIcon : inactiveIcon}</div>
  </button>
);

// ── Icon Components ──────────────────────────────────────────────────────

const MicOn = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 016 0v8.25a3 3 0 01-3 3z" />
  </svg>
);

const MicOff = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 016 0v8.25a3 3 0 01-3 3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
  </svg>
);

const CameraOn = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const CameraOff = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M12 18.75H4.5a2.25 2.25 0 01-2.25-2.25V9m12.841-4.5A2.245 2.245 0 0116.5 7.5v.975M3 3l18 18" />
  </svg>
);

const SpeakerOn = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
  </svg>
);

const SpeakerOff = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
  </svg>
);

const ScreenShareOn = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
  </svg>
);

const EndCallIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 3.75v4.5m0-4.5h-4.5m4.5 0l-6 6m3 12c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 014.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 00-.38 1.21 12.035 12.035 0 007.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 011.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 01-2.25 2.25h-2.25z" />
  </svg>
);

// ── Main Component ────────────────────────────────────────────────────────

const VideoControls: React.FC<VideoControlsProps> = ({
  micEnabled,
  cameraEnabled,
  speakerEnabled,
  screenSharing,
  onToggleMic,
  onToggleCamera,
  onToggleSpeaker,
  onToggleScreenShare,
  onEndCall,
  disabled = false,
}) => {
  return (
    <div className="flex items-center justify-center gap-3 md:gap-4 px-4 py-4 bg-zinc-900/95 backdrop-blur-sm border-t border-white/5">
      {/* Microphone */}
      <ControlButton
        onClick={onToggleMic}
        active={micEnabled}
        activeIcon={<MicOn />}
        inactiveIcon={<MicOff />}
        activeLabel="Mute microphone"
        inactiveLabel="Unmute microphone"
        disabled={disabled}
      />

      {/* Camera */}
      <ControlButton
        onClick={onToggleCamera}
        active={cameraEnabled}
        activeIcon={<CameraOn />}
        inactiveIcon={<CameraOff />}
        activeLabel="Turn camera off"
        inactiveLabel="Turn camera on"
        disabled={disabled}
      />

      {/* Speaker */}
      <ControlButton
        onClick={onToggleSpeaker}
        active={speakerEnabled}
        activeIcon={<SpeakerOn />}
        inactiveIcon={<SpeakerOff />}
        activeLabel="Mute speaker"
        inactiveLabel="Unmute speaker"
        disabled={disabled}
      />

      {/* Screen Share */}
      <ControlButton
        onClick={onToggleScreenShare}
        active={!screenSharing}
        activeIcon={<ScreenShareOn />}
        inactiveIcon={<ScreenShareOn />}
        activeLabel="Share screen"
        inactiveLabel="Stop sharing"
        activeClass="bg-white/10 hover:bg-white/20 text-white"
        inactiveClass="bg-indigo-600 hover:bg-indigo-700 text-white"
        disabled={disabled}
      />

      {/* Divider */}
      <div className="h-10 w-px bg-white/10 mx-1 hidden sm:block" />

      {/* End Call */}
      <button
        onClick={onEndCall}
        disabled={disabled}
        aria-label="End call"
        title="End call"
        className="flex items-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-xl transition-all duration-200 font-medium disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-red-900/40"
      >
        <div className="w-5 h-5">
          <EndCallIcon />
        </div>
        <span className="hidden sm:block text-sm">End Call</span>
      </button>
    </div>
  );
};

export default VideoControls;
