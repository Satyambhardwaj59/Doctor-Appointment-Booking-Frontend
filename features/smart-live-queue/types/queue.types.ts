export type UserRole = 'doctor' | 'patient';

export interface QueueCredentials {
  token: string;
  role: UserRole;
}

export type QueueEntryStatus =
  | 'WAITING'
  | 'CALLED'
  | 'IN_CONSULTATION'
  | 'COMPLETED'
  | 'SKIPPED'
  | 'CANCELLED';

// ─── What a PATIENT receives: their own token + anonymous aggregates only ─

export interface PatientEntry {
  _id: string;
  appointmentId: string;
  queueNumber: number;
  status: QueueEntryStatus;
  position: number | null;
  patientsAhead: number;
  estimatedWaitMinutes: number;
}

export interface PatientQueueView {
  view: 'patient';
  queueId: string;
  doctorId: string;
  slotDate: string;
  // Increases on every queue change; updates older than the newest
  // applied version are ignored (duplicate / out-of-order protection).
  version: number;
  isPaused: boolean;
  nowServing: number | null;
  waitingCount: number;
  // Always true: the wait time is an approximation, never a promise.
  isEstimate: boolean;
  entry: PatientEntry;
  event?: string;
}

// ─── What a DOCTOR receives: the full queue for their own session ─────

export interface DoctorEntry {
  _id: string;
  appointmentId: string;
  queueNumber: number;
  status: QueueEntryStatus;
  patientName: string;
  familyMemberName: string;
  joinedAt: string;
  calledAt: string | null;
  startedAt: string | null;
  estimatedWaitTime: number;
}

export interface DoctorQueueView {
  view: 'doctor';
  queueId: string;
  doctorId: string;
  slotDate: string;
  version: number;
  isPaused: boolean;
  nowServing: number | null;
  active: DoctorEntry | null;
  waiting: DoctorEntry[];
  skipped: DoctorEntry[];
  waitingCount: number;
  completedCount: number;
  avgConsultationMinutes: number;
  isEstimate: boolean;
  event?: string;
}

export type DoctorAction =
  | 'call-next'
  | 'start'
  | 'complete'
  | 'skip'
  | 'recall'
  | 'pause'
  | 'resume';

export type ConnectionState = 'connected' | 'connecting' | 'reconnecting' | 'disconnected';

// ─── API response shapes (mirror the backend's {success, message, ...}) ──

export interface PositionsResponse {
  success: boolean;
  message?: string;
  positions?: PatientQueueView[];
}

export interface DoctorQueueResponse {
  success: boolean;
  message?: string;
  queue?: DoctorQueueView;
}

export interface JoinResponse {
  success: boolean;
  message?: string;
  alreadyJoined?: boolean;
  queueId?: string;
  entryId?: string;
}

export interface QueueActionResponse {
  success: boolean;
  message?: string;
}
