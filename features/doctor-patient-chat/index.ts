/**
 * Doctor-Patient Chat Feature Module
 * Single export point for all chat components, hooks, services, and types.
 * Designed to be role-agnostic: pass { token, role } credentials explicitly
 * so the same components/hooks work for both the patient app (AppContext's
 * token) and a future doctor panel (DoctorContext's dToken), once that
 * panel is converted to Next.js.
 */

// Components
export { default as ChatPage } from './components/ChatPage';
export { default as ChatWindow } from './components/ChatWindow';
export { default as ChatHeader } from './components/ChatHeader';
export { default as ConversationList } from './components/ConversationList';
export { default as ConversationItem } from './components/ConversationItem';
export { default as MessageList } from './components/MessageList';
export { default as MessageBubble } from './components/MessageBubble';
export { default as MessageInput } from './components/MessageInput';
export { default as TypingIndicator } from './components/TypingIndicator';
export { default as MessageStatus } from './components/MessageStatus';
export { default as AttachmentPreview } from './components/AttachmentPreview';
export { default as FileMessage } from './components/FileMessage';
export { default as EmptyChat } from './components/EmptyChat';
export { default as ChatError } from './components/ChatError';
export { default as ConnectionBanner } from './components/ConnectionBanner';

// Hooks
export { useChat } from './hooks/useChat';
export { useChatSocket } from './hooks/useChatSocket';
export { useConversations } from './hooks/useConversations';
export { useMessages } from './hooks/useMessages';
export { useTypingIndicator } from './hooks/useTypingIndicator';
export { useOnlineStatus } from './hooks/useOnlineStatus';

// Services
export * as chatService from './services/chat.service';
export { getChatSocket, disconnectChatSocket } from './services/chatSocket.service';

// Utils
export * from './utils/chat.utils';
export * from './utils/message.utils';

// Validations
export * from './validations/chat.validation';

// Types
export * from './types/chat.types';
