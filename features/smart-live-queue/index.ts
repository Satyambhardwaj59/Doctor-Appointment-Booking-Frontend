/**
 * Smart Live Queue Feature Module
 * Role-agnostic credentials (same pattern as the other feature modules).
 * QueueStatus is the patient page; DoctorQueue takes credentials as a prop
 * so it can be dropped into a doctor panel.
 */

// Components
export { default as QueueStatus } from './components/QueueStatus';
export { default as DoctorQueue } from './components/DoctorQueue';
export { default as QueuePosition } from './components/QueuePosition';
export { default as QueueProgress } from './components/QueueProgress';
export { default as EstimatedWait } from './components/EstimatedWait';
export { default as CurrentPatient } from './components/CurrentPatient';
export { default as WaitingPatients } from './components/WaitingPatients';
export { default as QueueSkeleton } from './components/QueueSkeleton';

// Hooks
export { useLiveQueue } from './hooks/useLiveQueue';
export { useQueueSocket } from './hooks/useQueueSocket';

// Services
export * as queueService from './services/queue.service';
export { getQueueSocket, disconnectQueueSocket } from './services/queueSocket.service';

// Utils
export * from './utils/queue.utils';

// Types
export * from './types/queue.types';
