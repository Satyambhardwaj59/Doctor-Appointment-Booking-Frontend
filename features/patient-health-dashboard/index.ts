/**
 * Patient Health Dashboard Feature Module
 * A read-only overview that reuses the existing features' sockets, hooks,
 * components and helpers (family-accounts, smart-live-queue,
 * notification-center, digital-medical-records, prescription-management).
 */

// Components
export { default as Dashboard } from './components/Dashboard';
export { default as ProfileSwitcher } from './components/ProfileSwitcher';
export { default as AppointmentSummary } from './components/AppointmentSummary';
export { default as LiveQueueCard } from './components/LiveQueueCard';
export { default as MedicalRecordsSummary } from './components/MedicalRecordsSummary';
export { default as PrescriptionSummary } from './components/PrescriptionSummary';
export { default as MedicationSummary } from './components/MedicationSummary';
export { default as ConsultationSummary } from './components/ConsultationSummary';
export { default as NotificationSummary } from './components/NotificationSummary';
export { default as QuickActions } from './components/QuickActions';
export { default as DashboardSkeleton } from './components/DashboardSkeleton';

// Hooks
export { usePatientDashboard } from './hooks/usePatientDashboard';

// Services
export * as patientDashboardService from './services/patientDashboard.service';

// Utils
export * from './utils/patientDashboard.utils';

// Types
export * from './types/patientDashboard.types';
