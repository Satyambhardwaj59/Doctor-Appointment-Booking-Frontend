import type { PatientQueueView } from '../../smart-live-queue';

export interface DashboardCredentials {
  token: string;
}

export interface DoctorRef {
  id: string;
  name: string;
  speciality: string;
  image?: string;
}

export interface DashboardProfile {
  name: string;
  relationship: string;
  image: string;
  isFamilyMember: boolean;
  familyMemberId: string | null;
}

export interface UpcomingAppointment {
  _id: string;
  slotDate: string;
  slotTime: string;
  isToday: boolean;
  status: 'TODAY' | 'UPCOMING';
  payment: boolean;
  doctor: DoctorRef;
}

// The Smart Live Queue's own patient view, plus the doctor's name.
export type DashboardQueueStatus = PatientQueueView & { doctor: DoctorRef };

export interface RecordSummary {
  _id: string;
  recordType: string;
  title: string;
  recordDate: string;
  doctorId: string;
  doctor: DoctorRef;
}

export interface PrescriptionItem {
  _id: string;
  prescriptionDate: string;
  status: 'ACTIVE' | 'COMPLETED' | 'EXPIRED';
  medicineCount: number;
  doctorId: string;
  doctor: DoctorRef;
}

export interface ActiveMedication {
  prescriptionId: string;
  name: string;
  dosage: string;
  frequency: string;
  timing: string;
}

export type DoseStatus = 'PENDING' | 'TAKEN' | 'SKIPPED' | 'MISSED';

export interface TodayDose {
  _id: string;
  medicineName: string;
  dosage: string;
  timing: string;
  scheduledTime: string;
  status: DoseStatus;
}

export interface TodayMedications {
  items: TodayDose[];
  summary: { total: number; taken: number; pending: number; missed: number; skipped: number };
  nextDose: { _id: string; medicineName: string; dosage: string; scheduledTime: string } | null;
}

export interface ConsultationItem {
  appointmentId: string;
  slotDate: string;
  slotTime: string;
  status: 'COMPLETED';
  doctor: DoctorRef;
  relatedRecordIds: string[];
}

export interface DashboardNotification {
  _id: string;
  type: string;
  title: string;
  message: string;
  createdAt: string;
  data: Record<string, string>;
}

export type SectionKey =
  | 'appointments'
  | 'queue'
  | 'records'
  | 'prescriptions'
  | 'medications'
  | 'consultations'
  | 'notifications';

export interface PatientDashboardData {
  generatedAt: string;
  profile: DashboardProfile;
  upcomingAppointment: UpcomingAppointment | null;
  upcomingCount: number;
  queueStatus: DashboardQueueStatus | null;
  recentRecords: RecordSummary[];
  recentPrescriptions: { items: PrescriptionItem[]; activeCount: number };
  activeMedications: ActiveMedication[];
  todayMedications: TodayMedications;
  recentConsultations: ConsultationItem[];
  unreadNotifications: { unreadCount: number; items: DashboardNotification[] };
  // A section that failed server-side: shown inside its own card.
  sectionErrors: Partial<Record<SectionKey, string>>;
}

export interface DashboardResponse extends Partial<PatientDashboardData> {
  success: boolean;
  message?: string;
}
