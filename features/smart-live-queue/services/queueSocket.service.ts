import { io, Socket } from 'socket.io-client';
import type { QueueCredentials } from '../types/queue.types';

const getBackendUrl = () =>
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'https://doctor-appointment-booking-backend-92ui.onrender.com';

let socketInstance: Socket | null = null;
let socketCredentials: QueueCredentials | null = null;

// One shared connection for every queue component. There is no "join a
// room" call: the server places the connection in its own personal room
// from the verified token at handshake time.
export const getQueueSocket = (credentials: QueueCredentials): Socket => {
  const same =
    socketCredentials &&
    socketCredentials.token === credentials.token &&
    socketCredentials.role === credentials.role;

  if (socketInstance && same) return socketInstance;

  if (socketInstance) socketInstance.disconnect();

  socketCredentials = credentials;
  socketInstance = io(`${getBackendUrl()}/queue`, {
    auth: credentials.role === 'doctor' ? { dtoken: credentials.token } : { token: credentials.token },
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  return socketInstance;
};

export const disconnectQueueSocket = () => {
  socketInstance?.disconnect();
  socketInstance = null;
  socketCredentials = null;
};
