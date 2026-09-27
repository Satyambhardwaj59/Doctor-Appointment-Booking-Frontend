import { io, Socket } from 'socket.io-client';
import type { ChatCredentials } from '../types/chat.types';

const getBackendUrl = () =>
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'https://doctor-appointment-booking-backend-92ui.onrender.com';

let socketInstance: Socket | null = null;
let socketCredentials: ChatCredentials | null = null;

// A single shared socket for the whole chat feature (one namespace
// connection per browser tab), reused across conversations rather than
// reconnecting per chat window. Reconnects automatically on network drop
// via socket.io-client's built-in retry, which useChatSocket surfaces as
// connection state for the UI.
export const getChatSocket = (credentials: ChatCredentials): Socket => {
  const sameCredentials =
    socketCredentials && socketCredentials.token === credentials.token && socketCredentials.role === credentials.role;

  if (socketInstance && sameCredentials) {
    return socketInstance;
  }

  if (socketInstance) {
    socketInstance.disconnect();
  }

  socketCredentials = credentials;
  socketInstance = io(`${getBackendUrl()}/chat`, {
    auth: credentials.role === 'doctor' ? { dtoken: credentials.token } : { token: credentials.token },
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  return socketInstance;
};

export const disconnectChatSocket = () => {
  socketInstance?.disconnect();
  socketInstance = null;
  socketCredentials = null;
};
