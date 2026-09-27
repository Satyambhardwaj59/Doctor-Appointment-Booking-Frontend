/**
 * Media device utility functions.
 * Wraps browser media APIs with proper error categorization.
 */

export type PermissionState = 'granted' | 'denied' | 'prompt' | 'unknown';

export interface MediaError {
  type: 'camera-denied' | 'mic-denied' | 'not-found' | 'not-supported' | 'unknown';
  message: string;
}

/**
 * Categorize a getUserMedia error into a friendly type.
 */
const categorizeError = (err: unknown): MediaError => {
  if (err instanceof DOMException) {
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      return {
        type: 'camera-denied',
        message: 'Camera or microphone access was denied. Please allow access from your browser settings.',
      };
    }
    if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
      return { type: 'not-found', message: 'No camera or microphone found on this device.' };
    }
  }
  return { type: 'unknown', message: 'Failed to access media devices.' };
};

/**
 * Get user camera + microphone stream.
 */
export const getUserMedia = async (
  constraints: MediaStreamConstraints = { video: true, audio: true }
): Promise<{ stream: MediaStream | null; error: MediaError | null }> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    return { stream, error: null };
  } catch (err) {
    return { stream: null, error: categorizeError(err) };
  }
};

/**
 * Get screen share stream.
 */
export const getDisplayMedia = async (): Promise<{
  stream: MediaStream | null;
  error: MediaError | null;
}> => {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
    return { stream, error: null };
  } catch (err) {
    if (err instanceof DOMException && err.name === 'NotAllowedError') {
      return { stream: null, error: { type: 'camera-denied', message: 'Screen sharing was cancelled.' } };
    }
    return { stream: null, error: categorizeError(err) };
  }
};

/**
 * Stop all tracks in a MediaStream.
 */
export const stopAllTracks = (stream: MediaStream | null): void => {
  if (!stream) return;
  stream.getTracks().forEach((track) => track.stop());
};

/**
 * Enumerate available audio/video devices.
 */
export const enumerateDevices = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return {
      cameras: devices.filter((d) => d.kind === 'videoinput'),
      microphones: devices.filter((d) => d.kind === 'audioinput'),
      speakers: devices.filter((d) => d.kind === 'audiooutput'),
    };
  } catch {
    return { cameras: [], microphones: [], speakers: [] };
  }
};

/**
 * Check current camera/mic permission state.
 */
export const checkPermissions = async (): Promise<{
  camera: PermissionState;
  mic: PermissionState;
}> => {
  try {
    const [camResult, micResult] = await Promise.all([
      navigator.permissions.query({ name: 'camera' as PermissionName }),
      navigator.permissions.query({ name: 'microphone' as PermissionName }),
    ]);
    return {
      camera: camResult.state as PermissionState,
      mic: micResult.state as PermissionState,
    };
  } catch {
    return { camera: 'unknown', mic: 'unknown' };
  }
};
