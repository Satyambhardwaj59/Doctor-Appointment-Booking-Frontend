/**
 * Digital Medical Records Feature Module
 * Single export point for all record components, hooks, services, and types.
 * Role-agnostic credentials (same pattern as doctor-patient-chat), and
 * reuses the family-accounts feature's useFamilyMembers hook rather than
 * rebuilding family member lookup.
 */

// Components
export { default as MedicalRecords } from './components/MedicalRecords';
export { default as MedicalRecordDetails } from './components/MedicalRecordDetails';
export { default as MedicalRecordCard } from './components/MedicalRecordCard';
export { default as MedicalRecordTimeline } from './components/MedicalRecordTimeline';
export { default as RecordFilters } from './components/RecordFilters';
export { default as RecordSearch } from './components/RecordSearch';
export { default as RecordUpload } from './components/RecordUpload';
export { default as MedicalRecordSkeleton } from './components/MedicalRecordSkeleton';

// Hooks
export { useMedicalRecords } from './hooks/useMedicalRecords';
export { useMedicalRecord } from './hooks/useMedicalRecord';
export { useRecordUpload, validateRecordFiles } from './hooks/useRecordUpload';

// Services
export * as medicalRecordsService from './services/medicalRecords.service';

// Utils
export * from './utils/medicalRecords.utils';

// Types
export * from './types/medicalRecords.types';
