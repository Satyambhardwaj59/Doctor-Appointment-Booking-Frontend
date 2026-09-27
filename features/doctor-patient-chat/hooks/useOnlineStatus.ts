'use client';

import { useEffect, useState } from 'react';
import type { Socket } from 'socket.io-client';
import type { ChatRole, PresencePayload } from '../types/chat.types';

const identityKey = (id: string, role: ChatRole) => `${role}:${id}`;

// Online status is derived purely from live socket presence events, never
// from "does a user record exist in the database" — a disconnected user
// is offline even though their profile obviously still exists.
export const useOnlineStatus = (socket: Socket | null) => {
  const [onlineIds, setOnlineIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!socket) return;

    const handleOnline = ({ id, role }: PresencePayload) => {
      setOnlineIds((prev) => new Set(prev).add(identityKey(id, role)));
    };

    const handleOffline = ({ id, role }: PresencePayload) => {
      setOnlineIds((prev) => {
        const next = new Set(prev);
        next.delete(identityKey(id, role));
        return next;
      });
    };

    socket.on('chat:user-online', handleOnline);
    socket.on('chat:user-offline', handleOffline);

    return () => {
      socket.off('chat:user-online', handleOnline);
      socket.off('chat:user-offline', handleOffline);
    };
  }, [socket]);

  const isOnline = (id: string, role: ChatRole) => onlineIds.has(identityKey(id, role));

  return { isOnline };
};
