'use client';

import React from 'react';
import ConnectionStatus from '../ConnectionStatus';
import type { ConnectionState, UserRole } from '../../types/videoConsultation.types';

interface ConsultationHeaderProps {
  doctorName: string;
  patientName?: string;
  role?: UserRole;
  appointmentTime?: string;
  connectionState: ConnectionState;
  duration?: string;
  durationSeconds?: number;
}

const ConsultationHeader: React.FC<ConsultationHeaderProps> = ({
  doctorName,
  patientName,
  role,
  appointmentTime,
  connectionState,
  duration,
  durationSeconds,
}) => {
  const displayDuration = duration || (typeof durationSeconds === 'number' ? `${Math.floor(durationSeconds / 60)}:${(durationSeconds % 60).toString().padStart(2, '0')}` : undefined);
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/95 backdrop-blur-sm border-b border-white/5">
      {/* Left: Doctor/Participant Info */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          {doctorName.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        <div>
          <h1 className="text-white text-sm font-semibold leading-tight">{doctorName}</h1>
          {patientName && (
            <p className="text-white/50 text-xs">with {patientName}</p>
          )}
          {appointmentTime && (
            <p className="text-white/40 text-xs">{appointmentTime}</p>
          )}
        </div>
      </div>

      {/* Center: Duration */}
      {displayDuration && (
        <div className="hidden sm:flex items-center gap-1.5 text-white/60">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-mono">{displayDuration}</span>
        </div>
      )}

      {/* Right: Connection Status */}
      <ConnectionStatus state={connectionState} />
    </div>
  );
};

export default ConsultationHeader;
