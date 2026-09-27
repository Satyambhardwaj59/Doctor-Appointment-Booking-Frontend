'use client';

import React from 'react';
import type { ConnectionState } from '../../types/videoConsultation.types';

interface ConnectionStatusProps {
  state: ConnectionState;
  className?: string;
}

const STATE_CONFIG: Record<ConnectionState, { dot: string; label: string; pulse: boolean }> = {
  idle: { dot: 'bg-zinc-400', label: 'Not connected', pulse: false },
  connecting: { dot: 'bg-amber-400', label: 'Connecting...', pulse: true },
  connected: { dot: 'bg-emerald-400', label: 'Connected', pulse: false },
  disconnected: { dot: 'bg-red-500', label: 'Connection Lost', pulse: false },
  failed: { dot: 'bg-red-600', label: 'Connection Failed', pulse: false },
  reconnecting: { dot: 'bg-amber-400', label: 'Reconnecting...', pulse: true },
};

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ state, className = '' }) => {
  const config = STATE_CONFIG[state] || STATE_CONFIG.idle;

  return (
    <div className={`flex items-center gap-2 ${className}`} aria-live="polite" aria-label={`Connection status: ${config.label}`}>
      <span className="relative flex h-2.5 w-2.5">
        {config.pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dot}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${config.dot}`} />
      </span>
      <span className="text-xs font-medium text-white/80">{config.label}</span>
    </div>
  );
};

export default ConnectionStatus;
