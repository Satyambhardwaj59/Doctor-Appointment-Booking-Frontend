import { StaticImageData } from "next/image";

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
}

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
}
