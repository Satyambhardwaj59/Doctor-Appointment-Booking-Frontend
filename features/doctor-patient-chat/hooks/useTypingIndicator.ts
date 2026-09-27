'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Socket } from 'socket.io-client';
import type { TypingPayload } from '../types/chat.types';

const STOP_TYPING_DELAY_MS = 2000;
const EMIT_THROTTLE_MS = 1500;

// Debounced both ways: emits chat:typing at most once per throttle window
// (not on every keystroke) and automatically emits chat:stop-typing after
// a pause, so a client that closes the tab mid-type doesn't leave a
// "typing..." indicator stuck on the other end.
export const useTypingIndicator = (socket: Socket | null, conversationId: string | null) => {
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const lastEmitRef = useRef(0);
  const stopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const otherStopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const notifyTyping = useCallback(() => {
    if (!socket || !conversationId) return;

    const now = Date.now();
    if (now - lastEmitRef.current > EMIT_THROTTLE_MS) {
      socket.emit('chat:typing', { conversationId });
      lastEmitRef.current = now;
    }

    if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
    stopTimeoutRef.current = setTimeout(() => {
      socket.emit('chat:stop-typing', { conversationId });
    }, STOP_TYPING_DELAY_MS);
  }, [socket, conversationId]);

  const notifyStoppedTyping = useCallback(() => {
    if (!socket || !conversationId) return;
    if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
    socket.emit('chat:stop-typing', { conversationId });
  }, [socket, conversationId]);

  useEffect(() => {
    if (!socket || !conversationId) return;

    const handleTyping = (payload: TypingPayload) => {
      if (payload.conversationId !== conversationId) return;
      setOtherUserTyping(true);
      if (otherStopTimeoutRef.current) clearTimeout(otherStopTimeoutRef.current);
      // Safety net in case a stop-typing event is ever dropped.
      otherStopTimeoutRef.current = setTimeout(() => setOtherUserTyping(false), STOP_TYPING_DELAY_MS + 1000);
    };

    const handleStopTyping = (payload: TypingPayload) => {
      if (payload.conversationId !== conversationId) return;
      setOtherUserTyping(false);
    };

    socket.on('chat:typing', handleTyping);
    socket.on('chat:stop-typing', handleStopTyping);

    return () => {
      socket.off('chat:typing', handleTyping);
      socket.off('chat:stop-typing', handleStopTyping);
      if (otherStopTimeoutRef.current) clearTimeout(otherStopTimeoutRef.current);
      if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
      setOtherUserTyping(false);
    };
  }, [socket, conversationId]);

  return { otherUserTyping, notifyTyping, notifyStoppedTyping };
};
