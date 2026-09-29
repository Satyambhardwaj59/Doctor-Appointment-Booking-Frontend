export type ChatRole = 'doctor' | 'patient';

export interface RecordCredentials {
  token: string;
  role: ChatRole;
}

export type RecordType =
  | 'CONSULTATION'
  | 'DIAGNOSIS'
  | 'PRESCRIPTION'
  | 'LAB_REPORT'
  | 'MEDICAL_DOCUMENT'
  | 'VISIT'
  | 'OTHER';

export const RECORD_TYPES: RecordType[] = [
  'CONSULTATION',
  'DIAGNOSIS',
  'PRESCRIPTION',
  'LAB_REPORT',
  'MEDICAL_DOCUMENT',
  'VISIT',
  'OTHER',
];

// Types a patient is allowed to create themselves — clinical types
// (CONSULTATION, DIAGNOSIS, PRESCRIPTION, VISIT) are doctor-authored only.
// Mirrors the backend's PATIENT_CREATABLE_TYPES.
export const PATIENT_CREATABLE_TYPES: RecordType[] = ['MEDICAL_DOCUMENT', 'LAB_REPORT', 'OTHER'];

export interface RecordAttachment {
  _id: string;
  url: string;
  publicId?: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

export interface MedicalRecord {
  _id: string;
  patientId: string;
  doctorId: string;
  appointmentId: string | null;
  consultationId: string | null;
  familyMemberId: string | null;
  recordType: RecordType;
  title: string;
  description: string;
  diagnosis: string;
  doctorNotes: string;
  recordDate: string;
  attachments: RecordAttachment[];
  createdByRole: ChatRole;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecordFormValues {
  recordType: RecordType | '';
  title: string;
  description: string;
  recordDate: string;
  doctorId: string;
  familyMemberId: string;
  files: File[];
}

export interface RecordFiltersState {
  type: RecordType | '';
  doctor: string;
  familyMember: string;
  dateFrom: string;
  dateTo: string;
  search: string;
}

// ─── API response shapes (mirrors backend's {success, message, ...}) ──────

export interface RecordsListResponse {
  success: boolean;
  message?: string;
  records?: MedicalRecord[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface RecordResponse {
  success: boolean;
  message?: string;
  record?: MedicalRecord;
}

export interface RecordActionResponse {
  success: boolean;
  message?: string;
}
