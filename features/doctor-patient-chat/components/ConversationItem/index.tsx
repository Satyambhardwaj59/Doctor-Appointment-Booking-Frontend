import React from 'react';
import type { Conversation } from '../../types/chat.types';
import { formatConversationTimestamp } from '../../utils/chat.utils';

interface ConversationItemProps {
  conversation: Conversation;
  name: string;
  imageUrl?: string;
  online: boolean;
  active: boolean;
  onClick: () => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  name,
  imageUrl,
  online,
  active,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-gray-100 ${
      active ? 'bg-indigo-50' : 'hover:bg-gray-50'
    }`}
  >
    <div className="relative shrink-0">
      {imageUrl ? (
        <img src={imageUrl} alt={name} className="w-12 h-12 rounded-full object-cover" />
      ) : (
        <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
          {name.charAt(0).toUpperCase()}
        </div>
      )}
      {online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />}
    </div>

    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-gray-900 text-sm truncate">{name}</p>
        <span className="text-xs text-gray-400 shrink-0 ml-2">
          {formatConversationTimestamp(conversation.lastMessageAt)}
        </span>
      </div>
      <div className="flex items-center justify-between mt-0.5">
        <p className="text-xs text-gray-500 truncate">{conversation.lastMessage || 'No messages yet'}</p>
        {!!conversation.unreadCount && (
          <span className="ml-2 shrink-0 bg-indigo-600 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
            {conversation.unreadCount}
          </span>
        )}
      </div>
    </div>
  </button>
);

export default ConversationItem;
