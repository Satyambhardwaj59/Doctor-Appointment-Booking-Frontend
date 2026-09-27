'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { getUserMedia, stopAllTracks, getDisplayMedia } from '../utils/media.utils';
import type { MediaState } from '../types/videoConsultation.types';

/**
 * Manages local media streams (camera + mic + screen share).
 * Provides toggle functions and handles permission errors.
 */
export const useMediaDevices = () => {
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  const [mediaState, setMediaState] = useState<MediaState>({
    cameraEnabled: true,
    micEnabled: true,
    speakerEnabled: true,
    screenSharing: false,
    localStream: null,
    screenStream: null,
    cameraPermission: 'unknown',
    micPermission: 'unknown',
  });

  const [mediaError, setMediaError] = useState<string | null>(null);

  /**
   * Initialize camera and microphone.
   */
  const initializeMedia = useCallback(async () => {
    setMediaError(null);

    const { stream, error } = await getUserMedia({ video: true, audio: true });

    if (error || !stream) {
      setMediaError(error?.message || 'Failed to access media devices');
      // Try audio-only fallback
      const audioOnly = await getUserMedia({ video: false, audio: true });
      if (audioOnly.stream) {
        localStreamRef.current = audioOnly.stream;
        setMediaState((prev) => ({
          ...prev,
          localStream: audioOnly.stream,
          cameraEnabled: false,
          cameraPermission: 'denied',
        }));
      }
      return;
    }

    localStreamRef.current = stream;
    setMediaState((prev) => ({
      ...prev,
      localStream: stream,
      cameraEnabled: true,
      micEnabled: true,
      cameraPermission: 'granted',
      micPermission: 'granted',
    }));
  }, []);

  /**
   * Toggle camera on/off by enabling/disabling the video track.
   */
  const toggleCamera = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;

    const videoTracks = stream.getVideoTracks();
    if (videoTracks.length === 0) return;

    const newEnabled = !videoTracks[0].enabled;
    videoTracks.forEach((track) => {
      track.enabled = newEnabled;
    });

    setMediaState((prev) => ({ ...prev, cameraEnabled: newEnabled }));
  }, []);

  /**
   * Toggle microphone mute/unmute.
   */
  const toggleMic = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;

    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) return;

    const newEnabled = !audioTracks[0].enabled;
    audioTracks.forEach((track) => {
      track.enabled = newEnabled;
    });

    setMediaState((prev) => ({ ...prev, micEnabled: newEnabled }));
  }, []);

  /**
   * Start screen sharing. Returns the screen stream for RTC track replacement.
   */
  const startScreenShare = useCallback(async (): Promise<MediaStream | null> => {
    const { stream, error } = await getDisplayMedia();

    if (error || !stream) {
      setMediaError(error?.message || 'Failed to start screen sharing');
      return null;
    }

    // Auto-stop when the user clicks browser's "Stop sharing"
    stream.getVideoTracks()[0].addEventListener('ended', () => {
      stopScreenShare();
    });

    screenStreamRef.current = stream;
    setMediaState((prev) => ({ ...prev, screenSharing: true, screenStream: stream }));
    return stream;
  }, []);

  /**
   * Stop screen sharing and restore camera stream.
   */
  const stopScreenShare = useCallback(() => {
    if (screenStreamRef.current) {
      stopAllTracks(screenStreamRef.current);
      screenStreamRef.current = null;
    }
    setMediaState((prev) => ({ ...prev, screenSharing: false, screenStream: null }));
  }, []);

  /**
   * Toggle speaker (best-effort; browser support varies).
   */
  const toggleSpeaker = useCallback(() => {
    setMediaState((prev) => ({ ...prev, speakerEnabled: !prev.speakerEnabled }));
  }, []);

  /**
   * Clean up all media streams on unmount.
   */
  const cleanup = useCallback(() => {
    stopAllTracks(localStreamRef.current);
    stopAllTracks(screenStreamRef.current);
    localStreamRef.current = null;
    screenStreamRef.current = null;
    setMediaState({
      cameraEnabled: true,
      micEnabled: true,
      speakerEnabled: true,
      screenSharing: false,
      localStream: null,
      screenStream: null,
      cameraPermission: 'unknown',
      micPermission: 'unknown',
    });
  }, []);

  useEffect(() => {
    return () => {
      // Ensure cleanup on unmount
      stopAllTracks(localStreamRef.current);
      stopAllTracks(screenStreamRef.current);
    };
  }, []);

  return {
    mediaState,
    mediaError,
    initializeMedia,
    toggleCamera,
    toggleMic,
    toggleSpeaker,
    startScreenShare,
    stopScreenShare,
    cleanup,
  };
};
