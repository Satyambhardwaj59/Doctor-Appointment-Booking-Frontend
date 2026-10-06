import axios from 'axios';
import type {
  QueueCredentials,
  PositionsResponse,
  DoctorQueueResponse,
  JoinResponse,
  QueueActionResponse,
  DoctorAction,
} from '../types/queue.types';

const getBackendUrl = () =>
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'https://doctor-appointment-booking-backend-92ui.onrender.com';

const headersFor = ({ token, role }: QueueCredentials) =>
  role === 'doctor' ? { dtoken: token } : { token };

export const getMyPositions = async (credentials: QueueCredentials): Promise<PositionsResponse> => {
  const { data } = await axios.get(`${getBackendUrl()}/api/queues/my-position`, {
    headers: headersFor(credentials),
  });
  return data;
};

// Doctor: their own queue for today (created on first open).
export const getDoctorQueue = async (
  credentials: QueueCredentials,
  doctorId: string
): Promise<DoctorQueueResponse> => {
  const { data } = await axios.get(`${getBackendUrl()}/api/queues/${doctorId}`, {
    headers: headersFor(credentials),
  });
  return data;
};

// Only the appointmentId is sent — the backend derives the patient and
// doctor from the JWT and the verified appointment.
export const joinQueue = async (
  credentials: QueueCredentials,
  appointmentId: string
): Promise<JoinResponse> => {
  const { data } = await axios.post(
    `${getBackendUrl()}/api/queues/join`,
    { appointmentId },
    { headers: headersFor(credentials) }
  );
  return data;
};

export const leaveQueue = async (
  credentials: QueueCredentials,
  queueId: string,
  appointmentId?: string
): Promise<QueueActionResponse> => {
  const { data } = await axios.delete(`${getBackendUrl()}/api/queues/${queueId}/leave`, {
    params: appointmentId ? { appointmentId } : undefined,
    headers: headersFor(credentials),
  });
  return data;
};

export const doctorAction = async (
  credentials: QueueCredentials,
  queueId: string,
  action: DoctorAction,
  body?: { entryId?: string }
): Promise<QueueActionResponse> => {
  const { data } = await axios.patch(`${getBackendUrl()}/api/queues/${queueId}/${action}`, body ?? {}, {
    headers: headersFor(credentials),
  });
  return data;
};
