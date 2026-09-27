import React from 'react';
import type { Conversation, ChatRole } from '../../types/chat.types';
import ConversationItem from '../ConversationItem';

interface ConversationListProps {
  conversations: Conversation[];
  loading: boolean;
  activeId: string | null;
  onSelect: (conversation: Conversation) => void;
  resolveName: (counterpartId: string) => string;
  resolveImage: (counterpartId: string) => string | undefined;
  isOnline: (id: string, role: ChatRole) => boolean;
  myRole: ChatRole;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  loading,
  activeId,
  onSelect,
  resolveName,
  resolveImage,
  isOnline,
  myRole,
}) => {
  const counterpartRole: ChatRole = myRole === 'doctor' ? 'patient' : 'doctor';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <p className="text-sm text-gray-500">No conversations yet.</p>
      </div>
    );
  }

  return (
    <div>
      {conversations.map((conversation) => {
        const counterpartId = myRole === 'doctor' ? conversation.patientId : conversation.doctorId;
        return (
          <ConversationItem
            key={conversation._id}
            conversation={conversation}
            name={resolveName(counterpartId)}
            imageUrl={resolveImage(counterpartId)}
            online={isOnline(counterpartId, counterpartRole)}
            active={conversation._id === activeId}
            onClick={() => onSelect(conversation)}
          />
        );
      })}
    </div>
  );
};

export default ConversationList;
