'use client';

import React, { useEffect, useRef } from 'react';

interface ParticipantVideoProps {
  stream: MediaStream | null;
  name: string;
  isMuted?: boolean;
  isCameraOff?: boolean;
  isLocal?: boolean;
  className?: string;
  avatarUrl?: string;
}

const ParticipantVideo: React.FC<ParticipantVideoProps> = ({
  stream,
  name,
  isMuted = false,
  isCameraOff = false,
  isLocal = false,
  className = '',
  avatarUrl,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-zinc-900 ${className}`}>
      {/* Video Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isCameraOff || !stream ? 'opacity-0 absolute inset-0' : 'opacity-100'
        }`}
        aria-label={`${name}'s video`}
      />

      {/* Avatar fallback when camera is off */}
      {(isCameraOff || !stream) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-indigo-500/30"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-xl">
              {initials}
            </div>
          )}
          <p className="mt-3 text-white/70 text-sm font-medium">{name}</p>
          <p className="text-white/40 text-xs mt-1">Camera off</p>
        </div>
      )}

      {/* Name tag overlay */}
      <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="text-white text-sm font-medium truncate">
            {name}
            {isLocal && <span className="text-white/50 text-xs ml-1">(You)</span>}
          </span>
          {isMuted && (
            <span className="ml-auto" title="Microphone muted">
              <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 016 0v6a3 3 0 01-3 3z" />
                <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
          )}
        </div>
      </div>

      {/* Local video mirror indicator */}
      {isLocal && stream && !isCameraOff && (
        <style>{`#local-video-el { transform: scaleX(-1); }`}</style>
      )}
    </div>
  );
};

export default ParticipantVideo;
