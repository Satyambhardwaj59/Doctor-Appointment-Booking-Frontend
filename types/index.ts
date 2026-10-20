import { StaticImageData } from 'next/image';

// ─── Doctor ──────────────────────────────────────────────────────────────────

export interface DoctorAddress {
  line1: string;
  line2: string;
}

export interface Doctor {
  _id: string;
  name: string;
  image: string | StaticImageData;
  speciality: string;
  degree: string;
  experience: string;
  about: string;
  fees: number;
  address: DoctorAddress;
  available?: boolean;
  slots_booked?: Record<string, string[]>;
  date?: number;
  email?: string;
}

// ─── User / Patient ───────────────────────────────────────────────────────────

export interface UserAddress {
  line1: string;
  line2: string;
}

export interface UserData {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  image: string;
  address: UserAddress;
}

// ─── Appointment ─────────────────────────────────────────────────────────────

export interface Appointment {
  _id: string;
  userId?: string;
  docId?: string;
  slotDate: string;
  slotTime: string;
  userData?: UserData;
  docData: Doctor;
  amount?: number;
  date?: number;
  cancelled: boolean;
  payment: boolean;
  isCompleted: boolean;
  familyMemberData?: {
    familyMemberId?: string;
    name: string;
    relationship: string;
  } | null;
}

export interface SpecialityItem {
  speciality: string;
  image: StaticImageData | string;
}

// ─── Dashboard Data ───────────────────────────────────────────────────────────

export interface AdminDashData {
  doctors: number;
  appointments: number;
  patients: number;
  latestAppointments: Appointment[];
}

export interface DoctorDashData {
  earnings: number;
  appointments: number;
  patients: number;
  latestAppointments: Appointment[];
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  [key: string]: T | boolean | string;
}

// ─── Context Types ────────────────────────────────────────────────────────────

export interface AppContextType {
  doctors: Doctor[];
  getDoctorsData: () => Promise<void>;
  currencySymbol: string;
  token: string | false;
  setToken: React.Dispatch<React.SetStateAction<string | false>>;
  backendUrl: string;
  userData: UserData | false;
  setUserData: React.Dispatch<React.SetStateAction<UserData | false>>;
  loadUserProfileData: () => Promise<void>;
  // Helpers used by Admin/Doctor panels
  calculateAge: (dob: string) => number;
  slotDateFormat: (slotDate: string) => string;
  currency: string;
}

export interface AdminContextType {
  aToken: string;
  setAToken: React.Dispatch<React.SetStateAction<string>>;
  backendUrl: string;
  doctors: Doctor[];
  getAllDoctors: () => Promise<void>;
  changeAvailability: (docId: string) => Promise<void>;
  getAllAppointments: () => Promise<void>;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  cancelAppointment: (appointmentId: string) => Promise<void>;
  dashData: AdminDashData | false;
  getDashData: () => Promise<void>;
}

export interface DoctorContextType {
  dToken: string;
  setDToken: React.Dispatch<React.SetStateAction<string>>;
  backendUrl: string;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  getAppointments: () => Promise<void>;
  completeAppointment: (appointmentId: string) => Promise<void>;
  cancelAppointment: (appointmentId: string) => Promise<void>;
  dashData: DoctorDashData | false;
  setDashData: React.Dispatch<React.SetStateAction<DoctorDashData | false>>;
  getDashData: () => Promise<void>;
  profileData: Doctor | false;
  setProfileData: React.Dispatch<React.SetStateAction<Doctor | false>>;
  getProfileData: () => Promise<void>;
}
