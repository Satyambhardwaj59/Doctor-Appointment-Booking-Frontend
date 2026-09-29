import axios from 'axios';
import type {
  RecordCredentials,
  RecordFiltersState,
  RecordFormValues,
  RecordsListResponse,
  RecordResponse,
  RecordActionResponse,
} from '../types/medicalRecords.types';

const getBackendUrl = () =>
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'https://doctor-appointment-booking-backend-92ui.onrender.com';

const headersFor = ({ token, role }: RecordCredentials) =>
  role === 'doctor' ? { dtoken: token } : { token };

const buildRecordFormData = (values: Partial<RecordFormValues>): FormData => {
  const formData = new FormData();

  if (values.recordType) formData.append('recordType', values.recordType);
  if (values.title !== undefined) formData.append('title', values.title);
  if (values.description !== undefined) formData.append('description', values.description);
  if (values.recordDate) formData.append('recordDate', values.recordDate);
  if (values.doctorId) formData.append('doctorId', values.doctorId);
  if (values.familyMemberId) formData.append('familyMemberId', values.familyMemberId);
  (values.files || []).forEach((file) => formData.append('attachments', file));

  return formData;
};

export const listRecords = async (
  credentials: RecordCredentials,
  filters: Partial<RecordFiltersState & { page: number; limit: number; patientId: string; archived: boolean }>
): Promise<RecordsListResponse> => {
  const { data } = await axios.get(`${getBackendUrl()}/api/medical-records`, {
    params: filters,
    headers: headersFor(credentials),
  });
  return data;
};

export const getRecord = async (
  credentials: RecordCredentials,
  recordId: string
): Promise<RecordResponse> => {
  const { data } = await axios.get(`${getBackendUrl()}/api/medical-records/${recordId}`, {
    headers: headersFor(credentials),
  });
  return data;
};

export const createRecord = async (
  credentials: RecordCredentials,
  values: RecordFormValues
): Promise<RecordResponse> => {
  const { data } = await axios.post(
    `${getBackendUrl()}/api/medical-records`,
    buildRecordFormData(values),
    { headers: headersFor(credentials) }
  );
  return data;
};

export const updateRecord = async (
  credentials: RecordCredentials,
  recordId: string,
  values: Partial<Pick<RecordFormValues, 'title' | 'description' | 'recordDate' | 'recordType'>> & {
    diagnosis?: string;
    doctorNotes?: string;
  }
): Promise<RecordResponse> => {
  const { data } = await axios.patch(`${getBackendUrl()}/api/medical-records/${recordId}`, values, {
    headers: headersFor(credentials),
  });
  return data;
};

export const deleteRecord = async (
  credentials: RecordCredentials,
  recordId: string
): Promise<RecordActionResponse> => {
  const { data } = await axios.delete(`${getBackendUrl()}/api/medical-records/${recordId}`, {
    headers: headersFor(credentials),
  });
  return data;
};

export const restoreRecord = async (
  credentials: RecordCredentials,
  recordId: string
): Promise<RecordResponse> => {
  const { data } = await axios.patch(
    `${getBackendUrl()}/api/medical-records/${recordId}/restore`,
    {},
    { headers: headersFor(credentials) }
  );
  return data;
};

export const addAttachments = async (
  credentials: RecordCredentials,
  recordId: string,
  files: File[]
): Promise<RecordResponse> => {
  const formData = new FormData();
  files.forEach((file) => formData.append('attachments', file));

  const { data } = await axios.post(
    `${getBackendUrl()}/api/medical-records/${recordId}/attachments`,
    formData,
    { headers: headersFor(credentials) }
  );
  return data;
};

export const removeAttachment = async (
  credentials: RecordCredentials,
  recordId: string,
  attachmentId: string
): Promise<RecordResponse> => {
  const { data } = await axios.delete(
    `${getBackendUrl()}/api/medical-records/${recordId}/attachments/${attachmentId}`,
    { headers: headersFor(credentials) }
  );
  return data;
};
