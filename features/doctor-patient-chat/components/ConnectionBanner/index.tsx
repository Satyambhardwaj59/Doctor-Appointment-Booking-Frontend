import React from 'react';
import type { ConnectionState } from '../../types/chat.types';

interface ConnectionBannerProps {
  state: ConnectionState;
}

const ConnectionBanner: React.FC<ConnectionBannerProps> = ({ state }) => {
  if (state === 'connected') return null;

  const config = {
    connecting: { label: '🟡 Connecting...', className: 'bg-yellow-50 text-yellow-700' },
    reconnecting: { label: '🟡 Reconnecting...', className: 'bg-yellow-50 text-yellow-700' },
    disconnected: { label: '🔴 Connection lost. Messages will sync once reconnected.', className: 'bg-red-50 text-red-700' },
  }[state];

  return (
    <div className={`text-xs text-center py-1.5 ${config.className}`}>{config.label}</div>
  );
};

export default ConnectionBanner;
