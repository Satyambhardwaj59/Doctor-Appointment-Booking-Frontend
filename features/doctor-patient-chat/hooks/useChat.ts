'use client';

import { useMemo } from 'react';
import { useChatSocket } from './useChatSocket';
import { useMessages } from './useMessages';
import { useTypingIndicator } from './useTypingIndicator';
import { useOnlineStatus } from './useOnlineStatus';
import { getUserIdFromToken } from '../utils/chat.utils';
import { otherRole } from '../utils/message.utils';
import type { ChatCredentials, Conversation } from '../types/chat.types';

// Composes the lower-level hooks into everything a ChatWindow needs for
// one open conversation: connection state, message history + pagination +
// send actions, typing indicator (both directions), and the counterpart's
// online status.
export const useChat = (credentials: ChatCredentials, conversation: Conversation | null) => {
  const { socket, connectionState } = useChatSocket(credentials);
  const conversationId = conversation?._id || null;

  const messagesApi = useMessages(socket, credentials, conversationId);
  const typingApi = useTypingIndicator(socket, conversationId);
  const { isOnline } = useOnlineStatus(socket);

  const currentUserId = useMemo(() => getUserIdFromToken(credentials.token), [credentials.token]);

  const counterpartId = conversation
    ? credentials.role === 'doctor'
      ? conversation.patientId
      : conversation.doctorId
    : null;
  const counterpartRole = otherRole(credentials.role);
  const counterpartOnline = counterpartId ? isOnline(counterpartId, counterpartRole) : false;

  return {
    connectionState,
    currentUserId,
    counterpartId,
    counterpartRole,
    counterpartOnline,
    ...messagesApi,
    ...typingApi,
  };
};
