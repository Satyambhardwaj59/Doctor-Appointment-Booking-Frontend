export type UserRole = 'doctor' | 'patient';

export interface PrescriptionCredentials {
  token: string;
  role: UserRole;
}

export type MedicineForm = 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Other';
export type MedicineFrequency = 'Once' | 'Twice' | 'Thrice' | 'As Needed';
export type MedicineTiming = 'Before Food' | 'After Food' | 'With Food';
export type PrescriptionStatus = 'ACTIVE' | 'COMPLETED' | 'EXPIRED';
export type MedicationStatus = 'PENDING' | 'TAKEN' | 'SKIPPED' | 'MISSED';

export const MEDICINE_FORMS: MedicineForm[] = ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Other'];
export const MEDICINE_FREQUENCIES: MedicineFrequency[] = ['Once', 'Twice', 'Thrice', 'As Needed'];
export const MEDICINE_TIMINGS: MedicineTiming[] = ['Before Food', 'After Food', 'With Food'];

export interface Medicine {
  _id: string;
  name: string;
  dosage: string;
  form: MedicineForm;
  frequency: MedicineFrequency;
  timing: MedicineTiming;
  duration: string;
  quantity: number;
  instructions: string;
}

export interface PrescriptionAttachment {
  _id: string;
  url: string;
  publicId?: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

export interface Prescription {
  _id: string;
  patientId: string;
  doctorId: string;
  appointmentId: string;
  consultationId: string | null;
  familyMemberId: string | null;
  medicalRecordId: string | null;
  medicines: Medicine[];
  diagnosis: string;
  instructions: string;
  doctorNotes: string;
  prescriptionDate: string;
  validUntil: string | null;
  status: PrescriptionStatus;
  attachments: PrescriptionAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface MedicationEntry {
  _id: string;
  prescriptionId: string;
  medicineId: string;
  patientId: string;
  familyMemberId: string | null;
  medicineName: string;
  dosage: string;
  timing: string;
  scheduledTime: string;
  status: MedicationStatus;
  takenAt: string | null;
}

// Editable medicine row used by the doctor-side form. `_id` is only present
// for medicines that already exist on the prescription being edited.
export interface MedicineFormValues {
  _id?: string;
  name: string;
  dosage: string;
  form: MedicineForm;
  frequency: MedicineFrequency;
  timing: MedicineTiming;
  duration: string;
  quantity: number;
  instructions: string;
}

export interface PrescriptionFormValues {
  appointmentId: string;
  medicines: MedicineFormValues[];
  diagnosis: string;
  instructions: string;
  doctorNotes: string;
  validUntil: string;
}

export type PrescriptionStatusFilter = 'ALL' | PrescriptionStatus;

// ─── API response shapes (mirror the backend's {success, message, ...}) ──

export interface PrescriptionsListResponse {
  success: boolean;
  message?: string;
  prescriptions?: Prescription[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface PrescriptionResponse {
  success: boolean;
  message?: string;
  prescription?: Prescription;
}

export interface MedicationsListResponse {
  success: boolean;
  message?: string;
  medications?: MedicationEntry[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface TodayMedicationsResponse {
  success: boolean;
  message?: string;
  medications?: MedicationEntry[];
  nextDose?: MedicationEntry | null;
}

export interface MedicationResponse {
  success: boolean;
  message?: string;
  medication?: MedicationEntry;
}
