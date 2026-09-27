'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { VideoConsultation, UserRole, ConnectionState } from '../types/videoConsultation.types';

interface VideoConsultationContextType {
  consultation: VideoConsultation | null;
  setConsultation: (c: VideoConsultation | null) => void;
  role: UserRole | null;
  setRole: (r: UserRole | null) => void;
  connectionState: ConnectionState;
  setConnectionState: (s: ConnectionState) => void;
  participantCount: number;
  setParticipantCount: (n: number) => void;
}

const VideoConsultationContext = createContext<VideoConsultationContextType>(
  {} as VideoConsultationContextType
);

export const VideoConsultationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [consultation, setConsultation] = useState<VideoConsultation | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>('idle');
  const [participantCount, setParticipantCount] = useState(0);

  return (
    <VideoConsultationContext.Provider
      value={{
        consultation,
        setConsultation,
        role,
        setRole,
        connectionState,
        setConnectionState,
        participantCount,
        setParticipantCount,
      }}
    >
      {children}
    </VideoConsultationContext.Provider>
  );
};

export const useVideoConsultationContext = () => {
  return useContext(VideoConsultationContext);
};

export const useVideoConsultationStore = () => {
  return useContext(VideoConsultationContext);
};
