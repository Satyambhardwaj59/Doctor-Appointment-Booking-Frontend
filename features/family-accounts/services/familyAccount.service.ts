import axios from 'axios';
import type {
  FamilyMemberFormValues,
  FamilyMembersResponse,
  FamilyMemberResponse,
  FamilyActionResponse,
} from '../types/familyAccount.types';

const getBackendUrl = () =>
  // process.env.NEXT_PUBLIC_BACKEND_URL ||
  // 'https://doctor-appointment-booking-backend-92ui.onrender.com';
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'http://localhost:4001';

// Family Accounts is a patient-facing feature, so it only ever reads the
// patient token (same key the rest of the app uses, see AppContext).
const getAuthHeaders = () => {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('token');
  return token ? { token } : {};
};

// The backend's multer field for this feature is 'profileImage' (see
// modules/family-accounts/routes/familyAccount.routes.js).
const buildFormData = (payload: Partial<FamilyMemberFormValues>): FormData => {
  const formData = new FormData();

  if (payload.name !== undefined) formData.append('name', payload.name);
  if (payload.relationship) formData.append('relationship', payload.relationship);
  if (payload.dateOfBirth !== undefined) formData.append('dateOfBirth', payload.dateOfBirth);
  if (payload.gender !== undefined) formData.append('gender', payload.gender);
  if (payload.phone !== undefined) formData.append('phone', payload.phone);
  if (payload.email !== undefined) formData.append('email', payload.email);
  if (payload.profileImage) formData.append('profileImage', payload.profileImage);

  return formData;
};

export const listFamilyMembers = async (): Promise<FamilyMembersResponse> => {
  const { data } = await axios.get(`${getBackendUrl()}/api/family-members`, {
    headers: getAuthHeaders(),
  });
  return data;
};

export const getFamilyMember = async (id: string): Promise<FamilyMemberResponse> => {
  const { data } = await axios.get(`${getBackendUrl()}/api/family-members/${id}`, {
    headers: getAuthHeaders(),
  });
  return data;
};

export const createFamilyMember = async (
  payload: FamilyMemberFormValues
): Promise<FamilyMemberResponse> => {
  const { data } = await axios.post(
    `${getBackendUrl()}/api/family-members`,
    buildFormData(payload),
    { headers: getAuthHeaders() }
  );
  return data;
};

export const updateFamilyMember = async (
  id: string,
  payload: Partial<FamilyMemberFormValues>
): Promise<FamilyMemberResponse> => {
  const { data } = await axios.patch(
    `${getBackendUrl()}/api/family-members/${id}`,
    buildFormData(payload),
    { headers: getAuthHeaders() }
  );
  return data;
};

export const deleteFamilyMember = async (id: string): Promise<FamilyActionResponse> => {
  const { data } = await axios.delete(`${getBackendUrl()}/api/family-members/${id}`, {
    headers: getAuthHeaders(),
  });
  return data;
};
