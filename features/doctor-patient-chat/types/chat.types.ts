export type ChatRole = 'doctor' | 'patient';

// Explicit credentials instead of reading from a hardcoded context. The
// patient-side pages in this app supply { token, role: 'patient' } from
// AppContext; a future doctor panel would supply { token: dToken, role:
// 'doctor' } from its own DoctorContext — same components and hooks,
// no duplication required.
export interface ChatCredentials {
  token: string;
  role: ChatRole;
}

export type MessageType = 'TEXT' | 'IMAGE' | 'FILE';
export type MessageStatusValue = 'SENT' | 'DELIVERED' | 'READ';

export interface Attachment {
  url: string;
  publicId?: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

export interface ChatMessage {
  _id: string;
  conversationId: string;
  senderId: string;
  senderRole: ChatRole;
  receiverId: string;
  messageType: MessageType;
  content: string;
  attachment: Attachment | null;
  status: MessageStatusValue;
  readAt: string | null;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  _id: string;
  doctorId: string;
  patientId: string;
  appointmentId: string | null;
  lastMessage: string;
  lastMessageAt: string | null;
  lastMessageSender: ChatRole | null;
  unreadCount?: number;
  createdAt: string;
  updatedAt: string;
}

// ─── API response shapes (mirrors backend's {success, message, ...}) ──────

export interface ConversationsResponse {
  success: boolean;
  message?: string;
  conversations?: Conversation[];
}

export interface ConversationResponse {
  success: boolean;
  message?: string;
  conversation?: Conversation;
  created?: boolean;
}

export interface MessagesResponse {
  success: boolean;
  message?: string;
  messages?: ChatMessage[];
}

export interface SendMessageResponse {
  success: boolean;
  message?: string | ChatMessage;
}

// ─── Connection state for the reconnect-handling UI ────────────────────────

export type ConnectionState = 'connected' | 'connecting' | 'reconnecting' | 'disconnected';

// ─── Socket event payloads ──────────────────────────────────────────────

export interface TypingPayload {
  conversationId: string;
  userId: string;
  role: ChatRole;
}

export interface PresencePayload {
  id: string;
  role: ChatRole;
}

export interface ReadReceiptPayload {
  conversationId: string;
  readerId: string;
  readerRole: ChatRole;
}

export interface DeliveredPayload {
  messageId: string;
}
