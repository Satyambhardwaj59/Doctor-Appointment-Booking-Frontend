import { io, Socket } from 'socket.io-client';
import type { NotificationCredentials } from '../types/notification.types';

const getBackendUrl = () =>
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'https://doctor-appointment-booking-backend-92ui.onrender.com';

let socketInstance: Socket | null = null;
let socketCredentials: NotificationCredentials | null = null;

// A single shared socket for the whole notification feature, reused
// across every component that needs live updates (bell, panel, full
// page) rather than reconnecting per component. There is no client-side
// "join a room" step — the server places this connection into the
// caller's own room purely from the verified JWT at handshake time.
export const getNotificationSocket = (credentials: NotificationCredentials): Socket => {
  const sameCredentials =
    socketCredentials &&
    socketCredentials.token === credentials.token &&
    socketCredentials.role === credentials.role;

  if (socketInstance && sameCredentials) {
    return socketInstance;
  }

  if (socketInstance) {
    socketInstance.disconnect();
  }

  socketCredentials = credentials;
  socketInstance = io(`${getBackendUrl()}/notifications`, {
    auth: credentials.role === 'doctor' ? { dtoken: credentials.token } : { token: credentials.token },
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  return socketInstance;
};

export const disconnectNotificationSocket = () => {
  socketInstance?.disconnect();
  socketInstance = null;
  socketCredentials = null;
};
