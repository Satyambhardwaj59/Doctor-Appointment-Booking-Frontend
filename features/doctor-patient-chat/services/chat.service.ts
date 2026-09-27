import axios from 'axios';
import type {
  ChatCredentials,
  ConversationsResponse,
  ConversationResponse,
  MessagesResponse,
  ChatMessage,
} from '../types/chat.types';

const getBackendUrl = () =>
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'https://doctor-appointment-booking-backend-92ui.onrender.com';

// The backend's authChatIdentity middleware reads either 'token' (patient)
// or 'dtoken' (doctor) — same header names the rest of the app already
// uses for each role, so this feature doesn't introduce a new auth scheme.
const headersFor = ({ token, role }: ChatCredentials) =>
  role === 'doctor' ? { dtoken: token } : { token };

export const startConversation = async (
  credentials: ChatCredentials,
  counterpartId: string
): Promise<ConversationResponse> => {
  const body = credentials.role === 'doctor' ? { patientId: counterpartId } : { doctorId: counterpartId };
  const { data } = await axios.post(`${getBackendUrl()}/api/chat/conversations`, body, {
    headers: headersFor(credentials),
  });
  return data;
};

export const listConversations = async (credentials: ChatCredentials): Promise<ConversationsResponse> => {
  const { data } = await axios.get(`${getBackendUrl()}/api/chat/conversations`, {
    headers: headersFor(credentials),
  });
  return data;
};

export const getConversation = async (
  credentials: ChatCredentials,
  conversationId: string
): Promise<ConversationResponse> => {
  const { data } = await axios.get(`${getBackendUrl()}/api/chat/conversations/${conversationId}`, {
    headers: headersFor(credentials),
  });
  return data;
};

export const listMessages = async (
  credentials: ChatCredentials,
  conversationId: string,
  page = 1,
  limit = 30
): Promise<MessagesResponse> => {
  const { data } = await axios.get(
    `${getBackendUrl()}/api/chat/conversations/${conversationId}/messages`,
    { params: { page, limit }, headers: headersFor(credentials) }
  );
  return data;
};

// Attachments always go through this REST endpoint (multer needs a real
// multipart request) — the backend then relays the persisted message into
// the socket room itself, so the sender doesn't need to also emit it.
export const sendMessageWithAttachment = async (
  credentials: ChatCredentials,
  conversationId: string,
  file: File,
  messageType: 'IMAGE' | 'FILE',
  caption?: string
): Promise<{ success: boolean; message?: ChatMessage | string }> => {
  const formData = new FormData();
  formData.append('attachment', file);
  formData.append('messageType', messageType);
  if (caption) formData.append('content', caption);

  const { data } = await axios.post(
    `${getBackendUrl()}/api/chat/conversations/${conversationId}/messages`,
    formData,
    { headers: headersFor(credentials) }
  );
  return data;
};

export const markConversationRead = async (
  credentials: ChatCredentials,
  conversationId: string
): Promise<{ success: boolean }> => {
  const { data } = await axios.patch(
    `${getBackendUrl()}/api/chat/conversations/${conversationId}/read`,
    {},
    { headers: headersFor(credentials) }
  );
  return data;
};

export const deleteMessage = async (
  credentials: ChatCredentials,
  messageId: string
): Promise<{ success: boolean; message?: string }> => {
  const { data } = await axios.delete(`${getBackendUrl()}/api/chat/messages/${messageId}`, {
    headers: headersFor(credentials),
  });
  return data;
};
