import React from 'react';
import type { MessageStatusValue } from '../../types/chat.types';

interface MessageStatusProps {
  status: MessageStatusValue;
}

const MessageStatus: React.FC<MessageStatusProps> = ({ status }) => {
  if (status === 'READ') {
    return <span className="text-xs text-indigo-200" title="Read">✓✓</span>;
  }
  if (status === 'DELIVERED') {
    return <span className="text-xs text-indigo-300/80" title="Delivered">✓✓</span>;
  }
  return <span className="text-xs text-indigo-300/60" title="Sent">✓</span>;
};

export default MessageStatus;
