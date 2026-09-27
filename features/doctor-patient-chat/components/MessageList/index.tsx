'use client';

import React, { useEffect, useRef } from 'react';
import type { ChatMessage } from '../../types/chat.types';
import { groupMessagesByDay } from '../../utils/message.utils';
import MessageBubble from '../MessageBubble';
import TypingIndicator from '../TypingIndicator';

interface MessageListProps {
  messages: ChatMessage[];
  currentUserId: string | null;
  loading: boolean;
  loadingOlder: boolean;
  hasMore: boolean;
  onLoadOlder: () => void;
  onDeleteMessage: (messageId: string) => void;
  typingLabel: string | null;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  loading,
  loadingOlder,
  hasMore,
  onLoadOlder,
  onDeleteMessage,
  typingLabel,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef(0);

  // Auto-scroll to the newest message, but only when the count grows from
  // a *new* message (not from prepending an older page, which would yank
  // the view away from what the person was reading).
  useEffect(() => {
    if (messages.length > prevMessageCountRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevMessageCountRef.current = messages.length;
  }, [messages.length]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (el && el.scrollTop < 80 && hasMore && !loadingOlder) {
      onLoadOlder();
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const groups = groupMessagesByDay(messages);

  return (
    <div ref={containerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto px-4 py-3 bg-gray-50">
      {loadingOlder && (
        <div className="flex justify-center py-2">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {groups.map((group) => (
        <div key={group.dateLabel}>
          <div className="flex justify-center my-3">
            <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{group.dateLabel}</span>
          </div>
          {group.messages.map((message) => (
            <MessageBubble
              key={message._id}
              message={message}
              isOwn={message.senderId === currentUserId}
              onDelete={onDeleteMessage}
            />
          ))}
        </div>
      ))}

      {typingLabel && <TypingIndicator label={typingLabel} />}

      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
