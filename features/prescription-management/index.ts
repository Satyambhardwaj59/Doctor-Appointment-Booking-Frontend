/**
 * Prescription & Medication Management Feature Module
 * Role-agnostic credentials (same pattern as chat/medical-records), and
 * reuses the family-accounts feature's useFamilyMembers hook rather than
 * rebuilding family member lookup.
 */

// Components
export { default as PrescriptionsPage } from './components/PrescriptionsPage';
export { default as PrescriptionDetails } from './components/PrescriptionDetails';
export { default as PrescriptionList } from './components/PrescriptionList';
export { default as PrescriptionCard } from './components/PrescriptionCard';
export { default as PrescriptionForm } from './components/PrescriptionForm';
export { default as MedicineList } from './components/MedicineList';
export { default as MedicineForm } from './components/MedicineForm';
export { default as MedicationSchedule } from './components/MedicationSchedule';
export { default as MedicationHistory } from './components/MedicationHistory';
export { default as PrescriptionSkeleton } from './components/PrescriptionSkeleton';

// Hooks
export { usePrescriptions } from './hooks/usePrescriptions';
export { usePrescription } from './hooks/usePrescription';
export { useMedications } from './hooks/useMedications';

// Services
export * as prescriptionService from './services/prescription.service';

// Utils
export * from './utils/prescription.utils';

// Types
export * from './types/prescription.types';
