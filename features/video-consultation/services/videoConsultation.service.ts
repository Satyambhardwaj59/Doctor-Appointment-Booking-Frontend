import axios from 'axios';
import type {
  VideoConsultation,
  CreateConsultationResponse,
  JoinConsultationResponse,
  ConsultationHistoryResponse,
} from '../types/videoConsultation.types';

const getBackendUrl = () =>
  // process.env.NEXT_PUBLIC_BACKEND_URL ||
  // 'https://doctor-appointment-booking-backend-92ui.onrender.com';
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'http://localhost:4001';

/**
 * Build auth headers based on the role detected from localStorage.
 * Doctor token is stored as 'dToken'; patient token is stored as 'token'.
 */
const getAuthHeaders = () => {
  if (typeof window === 'undefined') return {};

  const token = localStorage.getItem('token');
  const dToken = localStorage.getItem('dToken') || localStorage.getItem('dtoken');
  const atoken = localStorage.getItem('atoken') || localStorage.getItem('aToken');

  if (dToken) return { dtoken: dToken };
  if (atoken) return { atoken };
  if (token) return { token };
  return {};
};

/**
 * Create a video consultation for an appointment.
 * Only the patient (appointment owner) can create.
 */
export const createConsultation = async (
  appointmentId: string
): Promise<CreateConsultationResponse> => {
  const { data } = await axios.post(
    `${getBackendUrl()}/api/video-consultations`,
    { appointmentId },
    { headers: getAuthHeaders() }
  );
  return data;
};

/**
 * Fetch a single consultation by ID.
 */
export const getConsultation = async (consultationId: string): Promise<VideoConsultation> => {
  const { data } = await axios.get(
    `${getBackendUrl()}/api/video-consultations/${consultationId}`,
    { headers: getAuthHeaders() }
  );
  if (!data.success) throw new Error(data.message);
  return data.consultation;
};

export const getConsultationById = async (
  consultationId: string
): Promise<{ success: boolean; consultation?: VideoConsultation; message?: string }> => {
  try {
    const { data } = await axios.get(
      `${getBackendUrl()}/api/video-consultations/${consultationId}`,
      { headers: getAuthHeaders() }
    );
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message || 'Failed to fetch consultation',
    };
  }
};

/**
 * Validate time window and move consultation to WAITING status.
 * Returns roomId on success.
 */
export const joinConsultation = async (
  consultationId: string
): Promise<JoinConsultationResponse> => {
  const { data } = await axios.post(
    `${getBackendUrl()}/api/video-consultations/${consultationId}/join`,
    {},
    { headers: getAuthHeaders() }
  );
  return data;
};

/**
 * Mark consultation as ACTIVE (doctor only).
 */
export const startConsultation = async (consultationId: string): Promise<VideoConsultation> => {
  const { data } = await axios.post(
    `${getBackendUrl()}/api/video-consultations/${consultationId}/start`,
    {},
    { headers: getAuthHeaders() }
  );
  if (!data.success) throw new Error(data.message);
  return data.consultation;
};

/**
 * End the consultation (either participant).
 */
export const endConsultation = async (consultationId: string): Promise<VideoConsultation> => {
  const { data } = await axios.post(
    `${getBackendUrl()}/api/video-consultations/${consultationId}/end`,
    {},
    { headers: getAuthHeaders() }
  );
  if (!data.success) throw new Error(data.message);
  return data.consultation;
};

/**
 * Get the current consultation status (lightweight poll).
 */
export const getConsultationStatus = async (
  consultationId: string
): Promise<{ status: string; roomId: string }> => {
  const { data } = await axios.get(
    `${getBackendUrl()}/api/video-consultations/${consultationId}/status`,
    { headers: getAuthHeaders() }
  );
  if (!data.success) throw new Error(data.message);
  return { status: data.status, roomId: data.roomId };
};

/**
 * Fetch paginated consultation history.
 */
export const getConsultationHistory = async (
  page = 1,
  limit = 10
): Promise<ConsultationHistoryResponse> => {
  const { data } = await axios.get(
    `${getBackendUrl()}/api/video-consultations/history`,
    {
      headers: getAuthHeaders(),
      params: { page, limit },
    }
  );
  return data;
};

/**
 * Submit post-consultation notes (doctor only).
 */
export const submitConsultationNotes = async (
  consultationId: string,
  notes: string
): Promise<VideoConsultation> => {
  const { data } = await axios.post(
    `${getBackendUrl()}/api/video-consultations/${consultationId}/notes`,
    { notes },
    { headers: getAuthHeaders() }
  );
  if (!data.success) throw new Error(data.message);
  return data.consultation;
};
