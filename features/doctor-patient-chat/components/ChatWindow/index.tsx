'use client';

import React from 'react';
import { useChat } from '../../hooks/useChat';
import { deleteMessage } from '../../services/chat.service';
import ChatHeader from '../ChatHeader';
import ConnectionBanner from '../ConnectionBanner';
import MessageList from '../MessageList';
import MessageInput from '../MessageInput';
import ChatError from '../ChatError';
import type { ChatCredentials, Conversation } from '../../types/chat.types';

interface ChatWindowProps {
  credentials: ChatCredentials;
  conversation: Conversation;
  counterpartName: string;
  counterpartImage?: string;
  onBack?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  credentials,
  conversation,
  counterpartName,
  counterpartImage,
  onBack,
}) => {
  const {
    connectionState,
    currentUserId,
    counterpartOnline,
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
    otherUserTyping,
    notifyTyping,
    notifyStoppedTyping,
  } = useChat(credentials, conversation);

  const handleDeleteMessage = async (messageId: string) => {
    await deleteMessage(credentials, messageId);
  };

  return (
    <div className="flex flex-col h-full">
      <ChatHeader name={counterpartName} imageUrl={counterpartImage} online={counterpartOnline} onBack={onBack} />
      <ConnectionBanner state={connectionState} />

      {error && !loading ? (
        <ChatError message={error} />
      ) : (
        <MessageList
          messages={messages}
          currentUserId={currentUserId}
          loading={loading}
          loadingOlder={loadingOlder}
          hasMore={hasMore}
          onLoadOlder={loadOlder}
          onDeleteMessage={handleDeleteMessage}
          typingLabel={otherUserTyping ? `${counterpartName} is typing...` : null}
        />
      )}

      <MessageInput
        onSendText={sendText}
        onSendAttachment={sendAttachment}
        onTyping={notifyTyping}
        onStopTyping={notifyStoppedTyping}
        uploading={uploading}
        disabled={sending || connectionState === 'disconnected'}
      />
    </div>
  );
};

export default ChatWindow;
