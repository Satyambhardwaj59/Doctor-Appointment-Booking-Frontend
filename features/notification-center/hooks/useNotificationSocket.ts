'use client';

import { useEffect, useState } from 'react';
import type { Socket } from 'socket.io-client';
import { getNotificationSocket } from '../services/notificationSocket.service';
import type { NotificationCredentials } from '../types/notification.types';

export type ConnectionState = 'connected' | 'connecting' | 'reconnecting' | 'disconnected';

export const useNotificationSocket = (credentials: NotificationCredentials | null) => {
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    credentials ? 'connecting' : 'disconnected'
  );
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!credentials) return;

    const socketInstance = getNotificationSocket(credentials);
    setSocket(socketInstance);
    setConnectionState(socketInstance.connected ? 'connected' : 'connecting');

    const handleConnect = () => setConnectionState('connected');
    const handleDisconnect = () => setConnectionState('disconnected');
    const handleReconnectAttempt = () => setConnectionState('reconnecting');
    const handleConnectError = () => setConnectionState('disconnected');

    socketInstance.on('connect', handleConnect);
    socketInstance.on('disconnect', handleDisconnect);
    socketInstance.io.on('reconnect_attempt', handleReconnectAttempt);
    socketInstance.on('connect_error', handleConnectError);

    return () => {
      socketInstance.off('connect', handleConnect);
      socketInstance.off('disconnect', handleDisconnect);
      socketInstance.io.off('reconnect_attempt', handleReconnectAttempt);
      socketInstance.off('connect_error', handleConnectError);
    };
  }, [credentials]);

  return { socket, connectionState };
};
