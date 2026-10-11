import axios from 'axios';
import type { DashboardCredentials, DashboardResponse } from '../types/patientDashboard.types';

const getBackendUrl = () =>
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'https://doctor-appointment-booking-backend-92ui.onrender.com';

// The patient is identified by the token alone. Only an optional
// familyMemberId is sent, and the backend re-verifies it belongs to the
// account — it grants nothing by itself.
export const getDashboard = async (
  credentials: DashboardCredentials,
  familyMemberId?: string
): Promise<DashboardResponse> => {
  const { data } = await axios.get(`${getBackendUrl()}/api/patient/dashboard`, {
    params: familyMemberId ? { familyMemberId } : undefined,
    headers: { token: credentials.token },
  });
  return data;
};
