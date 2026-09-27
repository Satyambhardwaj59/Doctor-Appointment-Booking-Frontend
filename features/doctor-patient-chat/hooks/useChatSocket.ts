'use client';

import { useEffect, useState } from 'react';
import type { Socket } from 'socket.io-client';
import { getChatSocket } from '../services/chatSocket.service';
import type { ChatCredentials, ConnectionState } from '../types/chat.types';

// Owns the socket.io connection for the chat feature and surfaces
// connection state so the UI can show Connected / Reconnecting /
// Connection lost, per the feature's reconnection-handling requirement.
// socket.io-client already retries automatically (see chatSocket.service's
// reconnection options) — this hook just reflects that state to React.
export const useChatSocket = (credentials: ChatCredentials | null) => {
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    credentials ? 'connecting' : 'disconnected'
  );
  // The socket instance is kept in state (not a ref) so returning it from
  // this hook is safe to read during render — a ref's `.current` should
  // never be read at render time, since ref changes don't themselves
  // trigger a re-render.
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!credentials) {
      setSocket(null);
      return;
    }

    const socketInstance = getChatSocket(credentials);
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
