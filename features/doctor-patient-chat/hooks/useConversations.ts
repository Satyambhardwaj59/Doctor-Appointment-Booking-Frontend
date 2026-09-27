'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Socket } from 'socket.io-client';
import { listConversations, startConversation } from '../services/chat.service';
import { extractErrorMessage } from '../utils/chat.utils';
import type { ChatCredentials, ChatMessage, Conversation } from '../types/chat.types';

export const useConversations = (socket: Socket | null, credentials: ChatCredentials | null) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!credentials) return;
    setLoading(true);
    setError(null);
    try {
      const data = await listConversations(credentials);
      if (data.success) {
        setConversations(data.conversations || []);
      } else {
        setError(data.message || 'Could not load conversations');
      }
    } catch (err: unknown) {
      setError(extractErrorMessage(err, 'Could not load conversations'));
    } finally {
      setLoading(false);
    }
  }, [credentials]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Bump the relevant conversation to the top with an incremented unread
  // count whenever any new message arrives, rather than waiting for the
  // person to manually refresh the list.
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: ChatMessage) => {
      if (!credentials) return;
      setConversations((prev) => {
        const index = prev.findIndex((c) => c._id === message.conversationId);
        if (index === -1) return prev;

        const isIncoming = message.senderRole !== credentials.role;
        const updated: Conversation = {
          ...prev[index],
          lastMessage: message.messageType === 'TEXT' ? message.content : `📎 ${message.messageType}`,
          lastMessageAt: message.createdAt,
          lastMessageSender: message.senderRole,
          unreadCount: isIncoming ? (prev[index].unreadCount || 0) + 1 : prev[index].unreadCount,
        };

        const rest = prev.filter((_, i) => i !== index);
        return [updated, ...rest];
      });
    };

    socket.on('chat:message-sent', handleNewMessage);
    return () => {
      socket.off('chat:message-sent', handleNewMessage);
    };
  }, [socket, credentials]);

  const startOrOpenConversation = useCallback(
    async (counterpartId: string) => {
      if (!credentials) return { success: false, message: 'Not authenticated' };
      const data = await startConversation(credentials, counterpartId);
      if (data.success && data.conversation) {
        await refresh();
      }
      return data;
    },
    [credentials, refresh]
  );

  // Called by the chat window when a conversation is opened, to zero out
  // its unread count locally without waiting for a full refetch.
  const clearUnread = useCallback((conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c._id === conversationId ? { ...c, unreadCount: 0 } : c))
    );
  }, []);

  return { conversations, loading, error, refresh, startOrOpenConversation, clearUnread };
};
