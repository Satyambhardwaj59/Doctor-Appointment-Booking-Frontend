'use client';

import { useEffect, useState } from 'react';
import type { Socket } from 'socket.io-client';
import { getQueueSocket } from '../services/queueSocket.service';
import type { QueueCredentials, ConnectionState } from '../types/queue.types';

export const useQueueSocket = (credentials: QueueCredentials | null) => {
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    credentials ? 'connecting' : 'disconnected'
  );
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!credentials) return;

    const instance = getQueueSocket(credentials);
    setSocket(instance);
    setConnectionState(instance.connected ? 'connected' : 'connecting');

    const handleConnect = () => setConnectionState('connected');
    const handleDisconnect = () => setConnectionState('disconnected');
    const handleReconnectAttempt = () => setConnectionState('reconnecting');
    const handleConnectError = () => setConnectionState('disconnected');

    instance.on('connect', handleConnect);
    instance.on('disconnect', handleDisconnect);
    instance.io.on('reconnect_attempt', handleReconnectAttempt);
    instance.on('connect_error', handleConnectError);

    return () => {
      instance.off('connect', handleConnect);
      instance.off('disconnect', handleDisconnect);
      instance.io.off('reconnect_attempt', handleReconnectAttempt);
      instance.off('connect_error', handleConnectError);
    };
  }, [credentials]);

  return { socket, connectionState };
};
