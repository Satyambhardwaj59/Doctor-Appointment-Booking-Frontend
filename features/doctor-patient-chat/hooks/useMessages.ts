'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Socket } from 'socket.io-client';
import {
  listMessages as fetchMessages,
  sendMessageWithAttachment,
  markConversationRead,
} from '../services/chat.service';
import { validateTextMessage, validateAttachment } from '../validations/chat.validation';
import { extractErrorMessage } from '../utils/chat.utils';
import type { ChatCredentials, ChatMessage, DeliveredPayload, ReadReceiptPayload } from '../types/chat.types';

const PAGE_SIZE = 30;

export const useMessages = (
  socket: Socket | null,
  credentials: ChatCredentials,
  conversationId: string | null
) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pageRef = useRef(1);

  // ─── Initial load + room join/leave ──────────────────────────────────
  useEffect(() => {
    if (!conversationId) return;

    let cancelled = false;
    pageRef.current = 1;
    setMessages([]);
    setHasMore(true);
    setLoading(true);
    setError(null);

    fetchMessages(credentials, conversationId, 1, PAGE_SIZE)
      .then((data) => {
        if (cancelled) return;
        if (data.success) {
          setMessages(data.messages || []);
          setHasMore((data.messages || []).length === PAGE_SIZE);
        } else {
          setError(data.message || 'Could not load messages');
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(extractErrorMessage(err, 'Could not load messages'));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    if (socket) {
      socket.emit('chat:join', { conversationId });
      markConversationRead(credentials, conversationId).catch(() => {});
    }

    return () => {
      cancelled = true;
      if (socket) socket.emit('chat:leave', { conversationId });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, conversationId]);

  // ─── Load older messages (scroll-up pagination) ──────────────────────
  const loadOlder = useCallback(async () => {
    if (!conversationId || loadingOlder || !hasMore) return;

    setLoadingOlder(true);
    try {
      const nextPage = pageRef.current + 1;
      const data = await fetchMessages(credentials, conversationId, nextPage, PAGE_SIZE);
      if (data.success) {
        const older = data.messages || [];
        setMessages((prev) => [...older, ...prev]);
        setHasMore(older.length === PAGE_SIZE);
        pageRef.current = nextPage;
      }
    } catch (err: unknown) {
      setError(extractErrorMessage(err, 'Could not load older messages'));
    } finally {
      setLoadingOlder(false);
    }
  }, [conversationId, loadingOlder, hasMore, credentials]);

  // ─── Live updates from the socket ─────────────────────────────────────
  useEffect(() => {
    if (!socket || !conversationId) return;

    const handleNewMessage = (message: ChatMessage) => {
      if (message.conversationId !== conversationId) return;
      setMessages((prev) => (prev.some((m) => m._id === message._id) ? prev : [...prev, message]));
      // If we're actively viewing this conversation, mark it read as new
      // messages arrive instead of waiting for the next page open.
      markConversationRead(credentials, conversationId).catch(() => {});
    };

    const handleDelivered = ({ messageId }: DeliveredPayload) => {
      setMessages((prev) => prev.map((m) => (m._id === messageId ? { ...m, status: 'DELIVERED' } : m)));
    };

    const handleRead = (payload: ReadReceiptPayload) => {
      if (payload.conversationId !== conversationId) return;
      setMessages((prev) =>
        prev.map((m) => (m.senderId !== payload.readerId ? { ...m, status: 'READ' } : m))
      );
    };

    const handleDeleted = (payload: { messageId: string; conversationId: string }) => {
      if (payload.conversationId !== conversationId) return;
      setMessages((prev) =>
        prev.map((m) => (m._id === payload.messageId ? { ...m, isDeleted: true, content: '', attachment: null } : m))
      );
    };

    socket.on('chat:message-sent', handleNewMessage);
    socket.on('chat:message-delivered', handleDelivered);
    socket.on('chat:message-read', handleRead);
    socket.on('chat:message-deleted', handleDeleted);

    return () => {
      socket.off('chat:message-sent', handleNewMessage);
      socket.off('chat:message-delivered', handleDelivered);
      socket.off('chat:message-read', handleRead);
      socket.off('chat:message-deleted', handleDeleted);
    };
  }, [socket, conversationId, credentials]);

  // ─── Reconnect handling ────────────────────────────────────────────────
  // A dropped socket loses its room membership entirely on reconnect (new
  // socket.id), and may have missed messages sent while offline. On every
  // 'connect' event (including the first), rejoin the room and merge in
  // the latest page from the server — new/updated messages are folded into
  // existing state by id rather than replacing it, so messages loaded via
  // "load older" pagination are preserved.
  useEffect(() => {
    if (!socket || !conversationId) return;

    const resync = () => {
      socket.emit('chat:join', { conversationId });
      markConversationRead(credentials, conversationId).catch(() => {});

      fetchMessages(credentials, conversationId, 1, PAGE_SIZE)
        .then((data) => {
          if (!data.success) return;
          const fetched = data.messages || [];
          setMessages((prev) => {
            const byId = new Map(prev.map((m) => [m._id, m]));
            fetched.forEach((m) => byId.set(m._id, m));
            return Array.from(byId.values()).sort(
              (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          });
        })
        .catch(() => {
          // A resync failure isn't surfaced as a hard error — the person
          // is still viewing whatever messages were already loaded, and
          // the next successful reconnect will resync again.
        });
    };

    socket.on('connect', resync);
    return () => {
      socket.off('connect', resync);
    };
  }, [socket, conversationId, credentials]);

  // ─── Sending ────────────────────────────────────────────────────────

  const sendText = useCallback(
    (content: string): { success: boolean; error?: string } => {
      const validation = validateTextMessage(content);
      if (!validation.valid) return { success: false, error: validation.message };

      if (!socket || !conversationId) {
        return { success: false, error: 'Not connected. Please wait and try again.' };
      }

      setSending(true);
      socket.emit(
        'chat:message',
        { conversationId, content },
        (ack: { success: boolean; message?: string | ChatMessage }) => {
          setSending(false);
          if (!ack?.success) {
            setError(typeof ack?.message === 'string' ? ack.message : 'Could not send message');
          }
        }
      );
      return { success: true };
    },
    [socket, conversationId]
  );

  const sendAttachment = useCallback(
    async (file: File, messageType: 'IMAGE' | 'FILE', caption?: string) => {
      const validation = validateAttachment(file);
      if (!validation.valid) {
        setError(validation.message || 'Invalid file');
        return false;
      }
      if (!conversationId) return false;

      setUploading(true);
      try {
        const data = await sendMessageWithAttachment(credentials, conversationId, file, messageType, caption);
        if (!data.success) {
          setError(typeof data.message === 'string' ? data.message : 'Could not send attachment');
          return false;
        }
        // The message will also arrive via the socket room broadcast the
        // backend performs after persisting it, so we don't need to (and
        // shouldn't) append it here too — avoids a duplicate bubble.
        return true;
      } catch (err: unknown) {
        setError(extractErrorMessage(err, 'Could not send attachment'));
        return false;
      } finally {
        setUploading(false);
      }
    },
    [conversationId, credentials]
  );

  return {
    messages,
    loading,
    loadingOlder,
    hasMore,
    sending,
    uploading,
    error,
    loadOlder,
    sendText,
    sendAttachment,
  };
};
