/**
 * Video Consultation Feature Module
 * Single export point for all video consultation components, hooks, services, and types.
 */

// Components
export { default as VideoCall } from './components/VideoCall';
export { default as WaitingRoom } from './components/WaitingRoom';
export { default as CallEnded } from './components/CallEnded';
export { default as ConnectionStatus } from './components/ConnectionStatus';
export { default as ParticipantVideo } from './components/ParticipantVideo';
export { default as VideoControls } from './components/VideoControls';
export { default as ConsultationHeader } from './components/ConsultationHeader';

// Hooks
export { useCall } from './hooks/useCall';
export { useMediaDevices } from './hooks/useMediaDevices';
export { useWebRTC } from './hooks/useWebRTC';
export { useVideoSocket } from './hooks/useVideoSocket';

// Services
export * as videoService from './services/videoConsultation.service';
export * as signalingService from './services/signaling.service';

// Store
export { VideoConsultationProvider, useVideoConsultationContext } from './store/videoConsultation.store';

// Types
export * from './types/videoConsultation.types';
