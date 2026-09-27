import React from 'react';
import type { ChatMessage } from '../../types/chat.types';
import { formatMessageTime } from '../../utils/chat.utils';
import MessageStatus from '../MessageStatus';
import FileMessage from '../FileMessage';

interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
  onDelete?: (messageId: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn, onDelete }) => {
  const isDeleted = !!message.isDeleted;

  return (
    <div className={`flex mb-2 ${isOwn ? 'justify-end' : 'justify-start'} group`}>
      <div
        className={`max-w-[75%] rounded-2xl px-3 py-2 ${
          isOwn ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
        }`}
      >
        {isDeleted ? (
          <p className={`text-sm italic ${isOwn ? 'text-indigo-100' : 'text-gray-400'}`}>
            This message was deleted
          </p>
        ) : message.messageType === 'IMAGE' && message.attachment ? (
          <a href={message.attachment.url} target="_blank" rel="noopener noreferrer">
            <img
              src={message.attachment.url}
              alt={message.attachment.fileName || 'Shared image'}
              className="rounded-lg max-h-64 object-cover mb-1"
            />
          </a>
        ) : message.messageType === 'FILE' && message.attachment ? (
          <FileMessage attachment={message.attachment} isOwn={isOwn} />
        ) : null}

        {!isDeleted && message.content && message.messageType !== 'TEXT' && (
          <p className="text-sm mt-1">{message.content}</p>
        )}
        {!isDeleted && message.messageType === 'TEXT' && (
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        )}

        <div
          className={`flex items-center gap-1 mt-1 justify-end ${
            isOwn ? 'text-indigo-100' : 'text-gray-400'
          }`}
        >
          <span className="text-[10px]">{formatMessageTime(message.createdAt)}</span>
          {isOwn && !isDeleted && <MessageStatus status={message.status} />}
        </div>
      </div>

      {isOwn && !isDeleted && onDelete && (
        <button
          onClick={() => onDelete(message._id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 text-xs self-center ml-1 px-1"
          aria-label="Delete message"
        >
          🗑
        </button>
      )}
    </div>
  );
};

export default MessageBubble;
