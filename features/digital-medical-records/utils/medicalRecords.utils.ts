import type { MedicalRecord, RecordType } from '../types/medicalRecords.types';

const RECORD_TYPE_LABELS: Record<RecordType, string> = {
  CONSULTATION: 'Consultation',
  DIAGNOSIS: 'Diagnosis',
  PRESCRIPTION: 'Prescription',
  LAB_REPORT: 'Lab Report',
  MEDICAL_DOCUMENT: 'Document',
  VISIT: 'Visit',
  OTHER: 'Other',
};

const RECORD_TYPE_ICONS: Record<RecordType, string> = {
  CONSULTATION: '🩺',
  DIAGNOSIS: '🔬',
  PRESCRIPTION: '💊',
  LAB_REPORT: '🧪',
  MEDICAL_DOCUMENT: '📄',
  VISIT: '🏥',
  OTHER: '📁',
};

export const recordTypeLabel = (type: RecordType | string): string =>
  RECORD_TYPE_LABELS[type as RecordType] || type;

export const recordTypeIcon = (type: RecordType | string): string =>
  RECORD_TYPE_ICONS[type as RecordType] || '📁';

export const formatRecordDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  return date.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const isImageAttachment = (fileType: string): boolean => fileType.startsWith('image/');

// Groups records by month for the timeline view (e.g. "March 2026").
export interface RecordGroup {
  monthLabel: string;
  records: MedicalRecord[];
}

export const groupRecordsByMonth = (records: MedicalRecord[]): RecordGroup[] => {
  const groups: RecordGroup[] = [];

  records.forEach((record) => {
    const date = new Date(record.recordDate);
    const monthLabel = date.toLocaleDateString([], { year: 'numeric', month: 'long' });

    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.monthLabel === monthLabel) {
      lastGroup.records.push(record);
    } else {
      groups.push({ monthLabel, records: [record] });
    }
  });

  return groups;
};

export const extractErrorMessage = (error: unknown, fallback: string): string => {
  if (error && typeof error === 'object') {
    const maybeAxiosError = error as { response?: { data?: { message?: unknown } }; message?: unknown };
    const responseMessage = maybeAxiosError.response?.data?.message;
    if (typeof responseMessage === 'string' && responseMessage) return responseMessage;
    if (typeof maybeAxiosError.message === 'string' && maybeAxiosError.message) return maybeAxiosError.message;
  }
  return fallback;
};

// Decodes the payload of our own JWT purely to read the user id for
// display purposes (e.g. "can I edit this record?" UI gating). Never used
// as a security boundary — the backend independently re-derives and
// verifies identity and edit rights on every request.
export const getUserIdFromToken = (token: string): string | null => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return typeof decoded.id === 'string' ? decoded.id : null;
  } catch {
    return null;
  }
};
