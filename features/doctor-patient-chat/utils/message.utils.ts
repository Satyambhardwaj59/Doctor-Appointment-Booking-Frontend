import type { ChatMessage, ChatRole } from '../types/chat.types';

export const isOwnMessage = (message: ChatMessage, currentUserId: string): boolean =>
  message.senderId === currentUserId;

export interface MessageGroup {
  dateLabel: string;
  messages: ChatMessage[];
}

// Groups a chronological message list into day-buckets, for rendering a
// "Today" / "Yesterday" / date divider above each group in the chat window.
export const groupMessagesByDay = (messages: ChatMessage[]): MessageGroup[] => {
  const groups: MessageGroup[] = [];

  messages.forEach((message) => {
    const date = new Date(message.createdAt);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    let dateLabel: string;
    if (date.toDateString() === now.toDateString()) {
      dateLabel = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateLabel = 'Yesterday';
    } else {
      dateLabel = date.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
    }

    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.dateLabel === dateLabel) {
      lastGroup.messages.push(message);
    } else {
      groups.push({ dateLabel, messages: [message] });
    }
  });

  return groups;
};

export const otherRole = (role: ChatRole): ChatRole => (role === 'doctor' ? 'patient' : 'doctor');
