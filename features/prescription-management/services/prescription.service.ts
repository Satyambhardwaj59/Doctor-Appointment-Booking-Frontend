import axios from 'axios';
import type {
  PrescriptionCredentials,
  PrescriptionFormValues,
  PrescriptionsListResponse,
  PrescriptionResponse,
  MedicationsListResponse,
  TodayMedicationsResponse,
  MedicationResponse,
  MedicationStatus,
} from '../types/prescription.types';

const getBackendUrl = () =>
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'https://doctor-appointment-booking-backend-92ui.onrender.com';

const headersFor = ({ token, role }: PrescriptionCredentials) =>
  role === 'doctor' ? { dtoken: token } : { token };

// ─── Prescriptions ──────────────────────────────────────────────────────

export interface PrescriptionQuery {
  status?: string;
  familyMember?: string;
  doctor?: string;
  patient?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export const listPrescriptions = async (
  credentials: PrescriptionCredentials,
  query: PrescriptionQuery
): Promise<PrescriptionsListResponse> => {
  const { data } = await axios.get(`${getBackendUrl()}/api/prescriptions`, {
    params: query,
    headers: headersFor(credentials),
  });
  return data;
};

export const getPrescription = async (
  credentials: PrescriptionCredentials,
  id: string
): Promise<PrescriptionResponse> => {
  const { data } = await axios.get(`${getBackendUrl()}/api/prescriptions/${id}`, {
    headers: headersFor(credentials),
  });
  return data;
};

// Doctor only. Only the appointmentId identifies the patient — the backend
// derives patient and family member from that appointment.
export const createPrescription = async (
  credentials: PrescriptionCredentials,
  values: PrescriptionFormValues
): Promise<PrescriptionResponse> => {
  const { data } = await axios.post(
    `${getBackendUrl()}/api/prescriptions`,
    { ...values, validUntil: values.validUntil || undefined },
    { headers: headersFor(credentials) }
  );
  return data;
};

export const updatePrescription = async (
  credentials: PrescriptionCredentials,
  id: string,
  values: Partial<PrescriptionFormValues> & { status?: string }
): Promise<PrescriptionResponse> => {
  const { data } = await axios.patch(`${getBackendUrl()}/api/prescriptions/${id}`, values, {
    headers: headersFor(credentials),
  });
  return data;
};

export const addAttachments = async (
  credentials: PrescriptionCredentials,
  id: string,
  files: File[]
): Promise<PrescriptionResponse> => {
  const formData = new FormData();
  files.forEach((file) => formData.append('attachments', file));
  const { data } = await axios.post(`${getBackendUrl()}/api/prescriptions/${id}/attachments`, formData, {
    headers: headersFor(credentials),
  });
  return data;
};

export const removeAttachment = async (
  credentials: PrescriptionCredentials,
  id: string,
  attachmentId: string
): Promise<PrescriptionResponse> => {
  const { data } = await axios.delete(
    `${getBackendUrl()}/api/prescriptions/${id}/attachments/${attachmentId}`,
    { headers: headersFor(credentials) }
  );
  return data;
};

// ─── Medications (patient) ───────────────────────────────────────────────

export interface MedicationQuery {
  status?: string;
  familyMember?: string;
  prescriptionId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export const listMedications = async (
  credentials: PrescriptionCredentials,
  query: MedicationQuery
): Promise<MedicationsListResponse> => {
  const { data } = await axios.get(`${getBackendUrl()}/api/medications`, {
    params: query,
    headers: headersFor(credentials),
  });
  return data;
};

export const getTodayMedications = async (
  credentials: PrescriptionCredentials,
  familyMember?: string
): Promise<TodayMedicationsResponse> => {
  const { data } = await axios.get(`${getBackendUrl()}/api/medications/today`, {
    params: familyMember ? { familyMember } : undefined,
    headers: headersFor(credentials),
  });
  return data;
};

export const updateMedicationStatus = async (
  credentials: PrescriptionCredentials,
  id: string,
  status: Extract<MedicationStatus, 'TAKEN' | 'SKIPPED'>
): Promise<MedicationResponse> => {
  const { data } = await axios.patch(
    `${getBackendUrl()}/api/medications/${id}/status`,
    { status },
    { headers: headersFor(credentials) }
  );
  return data;
};
