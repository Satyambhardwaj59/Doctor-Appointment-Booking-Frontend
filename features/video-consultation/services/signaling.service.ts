import { io, Socket } from 'socket.io-client';
import { SOCKET_EVENTS, IncomingCallPayload } from '../types/videoConsultation.types';

type SignalingEventHandler = (...args: any[]) => void;

let socketInstance: Socket | null = null;

const getBackendUrl = () =>
  // process.env.NEXT_PUBLIC_BACKEND_URL ||
  // 'https://doctor-appointment-booking-backend-92ui.onrender.com';
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'http://localhost:4001';

/**
 * Get auth tokens from localStorage based on current role.
 */
const getAuthTokens = () => {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('token');
  const dToken = localStorage.getItem('dToken') || localStorage.getItem('dtoken');
  return dToken ? { dtoken: dToken } : token ? { token } : {};
};

/**
 * Connect to the /video Socket.IO namespace.
 * Returns the socket instance (singleton per session).
 */
export const connectSignaling = (): Socket => {
  if (socketInstance?.connected) return socketInstance;

  // Disconnect stale instance
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }

  socketInstance = io(`${getBackendUrl()}/video`, {
    auth: getAuthTokens(),
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
    timeout: 10000,
  });

  return socketInstance;
};

/**
 * Disconnect from the signaling server and clean up.
 */
export const disconnectSignaling = (): void => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};

/**
 * Get the active socket instance.
 */
export const getSocket = (): Socket | null => socketInstance;

// ── Typed Emit Functions ──────────────────────────────────────────────────

export const emitJoinRoom = (consultationId: string): void => {
  socketInstance?.emit(SOCKET_EVENTS.JOIN_ROOM, { consultationId });
};

export const emitOffer = (offer: RTCSessionDescriptionInit, targetSocketId?: string): void => {
  socketInstance?.emit(SOCKET_EVENTS.OFFER, { offer, targetSocketId });
};

export const emitAnswer = (answer: RTCSessionDescriptionInit, targetSocketId?: string): void => {
  socketInstance?.emit(SOCKET_EVENTS.ANSWER, { answer, targetSocketId });
};

export const emitIceCandidate = (candidate: RTCIceCandidateInit, targetSocketId?: string): void => {
  socketInstance?.emit(SOCKET_EVENTS.ICE_CANDIDATE, { candidate, targetSocketId });
};

export const emitCallEnded = (): void => {
  socketInstance?.emit(SOCKET_EVENTS.CALL_ENDED);
};

export const emitCallUser = (consultationId: string): void => {
  socketInstance?.emit(SOCKET_EVENTS.CALL_USER, { consultationId });
};

export const emitRejectCall = (consultationId: string, callerId?: string, callerRole?: string): void => {
  socketInstance?.emit(SOCKET_EVENTS.REJECT_CALL, { consultationId, callerId, callerRole });
};

// ── Typed Event Listeners ─────────────────────────────────────────────────

export const onIncomingCall = (handler: (data: IncomingCallPayload) => void) => {
  socketInstance?.on(SOCKET_EVENTS.INCOMING_CALL, handler);
};

export const offIncomingCall = (handler?: (data: IncomingCallPayload) => void) => {
  if (handler) {
    socketInstance?.off(SOCKET_EVENTS.INCOMING_CALL, handler);
  } else {
    socketInstance?.off(SOCKET_EVENTS.INCOMING_CALL);
  }
};

export const onCallRejected = (handler: SignalingEventHandler) => {
  socketInstance?.on(SOCKET_EVENTS.CALL_REJECTED, handler);
};

export const onUserJoined = (handler: SignalingEventHandler) => {
  socketInstance?.on(SOCKET_EVENTS.USER_JOINED, handler);
};

export const onUserLeft = (handler: SignalingEventHandler) => {
  socketInstance?.on(SOCKET_EVENTS.USER_LEFT, handler);
};

export const onOffer = (handler: SignalingEventHandler) => {
  socketInstance?.on(SOCKET_EVENTS.OFFER, handler);
};

export const onAnswer = (handler: SignalingEventHandler) => {
  socketInstance?.on(SOCKET_EVENTS.ANSWER, handler);
};

export const onIceCandidate = (handler: SignalingEventHandler) => {
  socketInstance?.on(SOCKET_EVENTS.ICE_CANDIDATE, handler);
};

export const onCallEnded = (handler: SignalingEventHandler) => {
  socketInstance?.on(SOCKET_EVENTS.CALL_ENDED, handler);
};

export const onConnectionStatus = (handler: SignalingEventHandler) => {
  socketInstance?.on(SOCKET_EVENTS.CONNECTION_STATUS, handler);
};

export const onSignalingError = (handler: SignalingEventHandler) => {
  socketInstance?.on(SOCKET_EVENTS.ERROR, handler);
};

export const offAllVideoEvents = (): void => {
  if (!socketInstance) return;
  Object.values(SOCKET_EVENTS).forEach((event) => {
    socketInstance!.off(event);
  });
};
