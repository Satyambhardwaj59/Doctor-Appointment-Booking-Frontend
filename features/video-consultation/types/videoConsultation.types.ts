// ─── Enums & Literals ─────────────────────────────────────────────────────

export type ConsultationStatus =
  | 'UPCOMING'
  | 'WAITING'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'EXPIRED';

export type UserRole = 'patient' | 'doctor' | 'admin';

export type ConnectionState =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'failed'
  | 'reconnecting';

// ─── Domain Models ────────────────────────────────────────────────────────

export interface VideoConsultation {
  _id: string;
  appointmentId: any;
  doctorId: any;
  patientId: any;
  roomId: string;
  status: ConsultationStatus;
  startedAt: string | null;
  endedAt: string | null;
  duration: number | null;
  consultationNotes: string;
  notesSubmitted: boolean;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  appointment?: {
    _id: string;
    slotDate: string;
    slotTime: string;
    docData: {
      name: string;
      speciality: string;
      image: string;
    };
    userData?: {
      name: string;
      image?: string;
    };
  };
}

// ─── Media ────────────────────────────────────────────────────────────────

export interface MediaState {
  cameraEnabled: boolean;
  micEnabled: boolean;
  speakerEnabled: boolean;
  screenSharing: boolean;
  localStream: MediaStream | null;
  screenStream: MediaStream | null;
  cameraPermission: 'granted' | 'denied' | 'prompt' | 'unknown';
  micPermission: 'granted' | 'denied' | 'prompt' | 'unknown';
}

export interface DeviceInfo {
  deviceId: string;
  label: string;
  kind: 'audioinput' | 'audiooutput' | 'videoinput';
}

// ─── Socket Events ────────────────────────────────────────────────────────

export const SOCKET_EVENTS = {
  JOIN_ROOM: 'video:join-room',
  USER_JOINED: 'video:user-joined',
  USER_LEFT: 'video:user-left',
  OFFER: 'video:offer',
  ANSWER: 'video:answer',
  ICE_CANDIDATE: 'video:ice-candidate',
  CALL_ENDED: 'video:call-ended',
  CONNECTION_STATUS: 'video:connection-status',
  ERROR: 'video:error',
  CALL_USER: 'video:call-user',
  INCOMING_CALL: 'video:incoming-call',
  ACCEPT_CALL: 'video:accept-call',
  REJECT_CALL: 'video:reject-call',
  CALL_REJECTED: 'video:call-rejected',
} as const;

export interface IncomingCallPayload {
  consultationId: string;
  roomId: string;
  appointmentId: string;
  callerId: string;
  callerRole: 'doctor' | 'patient';
  callerName: string;
  callerImage?: string;
  callerSpeciality?: string;
  timestamp: string;
}

// ─── API Response Types ───────────────────────────────────────────────────

export interface ApiResponse<T = undefined> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface CreateConsultationResponse {
  success: boolean;
  consultation: VideoConsultation;
  message?: string;
}

export interface JoinConsultationResponse {
  success: boolean;
  consultation: VideoConsultation;
  roomId: string;
  message?: string;
}

export interface ConsultationHistoryResponse {
  success: boolean;
  consultations: VideoConsultation[];
  total: number;
  page: number;
  totalPages: number;
}

// ─── Store State ──────────────────────────────────────────────────────────

export interface VideoConsultationState {
  consultation: VideoConsultation | null;
  role: UserRole | null;
  connectionState: ConnectionState;
  remoteStream: MediaStream | null;
  remoteSocketId: string | null;
  participantCount: number;
  callEnded: boolean;
  error: string | null;
}
