import type {
  MedicationStatus,
  MedicineFormValues,
  PrescriptionStatus,
  PrescriptionStatusFilter,
} from '../types/prescription.types';

export const STATUS_FILTERS: { value: PrescriptionStatusFilter; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'EXPIRED', label: 'Expired' },
];

const PRESCRIPTION_STATUS_STYLES: Record<PrescriptionStatus, string> = {
  ACTIVE: 'bg-green-50 text-green-700',
  COMPLETED: 'bg-blue-50 text-blue-700',
  EXPIRED: 'bg-gray-100 text-gray-500',
};

const MEDICATION_STATUS_STYLES: Record<MedicationStatus, string> = {
  PENDING: 'bg-yellow-50 text-yellow-700',
  TAKEN: 'bg-green-50 text-green-700',
  SKIPPED: 'bg-gray-100 text-gray-600',
  MISSED: 'bg-red-50 text-red-600',
};

export const prescriptionStatusStyle = (status: PrescriptionStatus): string =>
  PRESCRIPTION_STATUS_STYLES[status] || 'bg-gray-100 text-gray-500';

export const medicationStatusStyle = (status: MedicationStatus): string =>
  MEDICATION_STATUS_STYLES[status] || 'bg-gray-100 text-gray-500';

export const titleCase = (value: string): string =>
  value.charAt(0) + value.slice(1).toLowerCase();

export const formatDate = (isoDate: string | null): string => {
  if (!isoDate) return '—';
  return new Date(isoDate).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
};

export const formatTime = (isoDate: string): string =>
  new Date(isoDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export const formatDateTime = (isoDate: string): string => `${formatDate(isoDate)}, ${formatTime(isoDate)}`;

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const EMPTY_MEDICINE: MedicineFormValues = {
  name: '',
  dosage: '',
  form: 'Tablet',
  frequency: 'Once',
  timing: 'After Food',
  duration: '',
  quantity: 0,
  instructions: '',
};

// Client-side mirror of the backend validator, for immediate feedback only —
// the backend remains the source of truth.
export const validateMedicines = (medicines: MedicineFormValues[]): string | null => {
  if (medicines.length === 0) return 'Add at least one medicine';
  for (let i = 0; i < medicines.length; i++) {
    const m = medicines[i];
    if (!m.name.trim()) return `Medicine #${i + 1}: name is required`;
    if (!m.dosage.trim()) return `Medicine #${i + 1}: dosage is required`;
    if (m.quantity < 0 || Number.isNaN(m.quantity)) return `Medicine #${i + 1}: quantity is invalid`;
  }
  return null;
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
// display-only "can I edit this?" gating — never a security boundary, the
// backend independently re-derives and verifies this on every request.
export const getUserIdFromToken = (token: string): string | null => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return typeof decoded.id === 'string' ? decoded.id : null;
  } catch {
    return null;
  }
};
