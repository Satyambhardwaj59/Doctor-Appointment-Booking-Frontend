'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useMediaDevices } from './useMediaDevices';
import { useWebRTC } from './useWebRTC';
import { useVideoSocket } from './useVideoSocket';
import { emitCallEnded } from '../services/signaling.service';
import { endConsultation, startConsultation as startConsultationApi } from '../services/videoConsultation.service';
import type { UserRole } from '../types/videoConsultation.types';

// ── Stable ref helpers ────────────────────────────────────────────────────────
// useVideoSocket registers listeners once (on consultationId change) so the
// callbacks it receives become stale closures. We work around this by storing
// the latest callback in a ref and forwarding through a stable wrapper.
function useStableCallback<T extends (...args: any[]) => any>(fn: T): T {
  const ref = useRef(fn);
  useEffect(() => { ref.current = fn; });
  return useCallback((...args: Parameters<T>) => ref.current(...args), []) as T;
}

interface UseCallOptions {
  consultationId: string | null;
  role: UserRole | null;
}

/**
 * Master orchestration hook that coordinates media, WebRTC, and signaling.
 *
 * OFFER/ANSWER TIEBREAKING RULE:
 *   The DOCTOR always sends the offer. The PATIENT always answers.
 *
 * This eliminates the "both waiting" deadlock that happens when both sides
 * join at nearly the same time and mediaState.localStream is not yet ready
 * when the video:user-joined event fires.
 *
 * Flow:
 *   1. Both connect to the /video namespace and emit video:join-room.
 *   2. Server fires video:user-joined on the other side.
 *   3. Whoever receives user-joined stores the remote socket ID.
 *   4. Once media is ready AND a remote peer is known, the doctor sends an offer.
 *   5. Patient receives offer, answers it. WebRTC handshake completes.
 */
export const useCall = ({ consultationId, role }: UseCallOptions) => {
  const [callEnded, setCallEnded] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [peerJoined, setPeerJoined] = useState(false);

  // Store the remote socket ID from the user-joined event so we can use it
  // even if media isn't ready yet when the event fires.
  const pendingPeerSocketIdRef = useRef<string | null>(null);
  // Guard against sending the offer more than once
  const offerSentRef = useRef(false);
  // Buffer an offer that arrived before our local media was ready
  const pendingOfferRef = useRef<{ offer: RTCSessionDescriptionInit; fromSocketId: string } | null>(null);

  const {
    mediaState,
    mediaError,
    initializeMedia,
    toggleCamera,
    toggleMic,
    toggleSpeaker,
    startScreenShare,
    stopScreenShare,
    cleanup: cleanupMedia,
  } = useMediaDevices();

  const {
    connectionState,
    remoteStream,
    remoteSocketId,
    initializePeerConnection,
    sendOffer,
    handleOffer,
    handleAnswer,
    handleIceCandidate,
    switchVideoTrack,
    closePeer,
  } = useWebRTC();

  // ── Helper: try to send offer if doctor + media ready + peer known ────────

  const tryInitiateOffer = useCallback(
    async (localStream: MediaStream, peerSocketId: string) => {
      if (role !== 'doctor') return; // Only doctor initiates
      if (offerSentRef.current) return; // Don't send twice
      offerSentRef.current = true;

      initializePeerConnection(localStream);
      await sendOffer(peerSocketId);

      if (consultationId) {
        try {
          await startConsultationApi(consultationId);
        } catch {
          // May already be active
        }
      }
    },
    [role, consultationId, initializePeerConnection, sendOffer]
  );

  // ── Socket event handlers ─────────────────────────────────────────────────

  const handlePeerJoined = useStableCallback(
    async (data: { socketId: string; participantCount: number }) => {
      setParticipantCount(data.participantCount);
      setPeerJoined(true);
      pendingPeerSocketIdRef.current = data.socketId;

      if (role === 'doctor') {
        // Doctor: send offer if media is already ready, otherwise
        // the useEffect below will pick it up when media becomes available.
        if (mediaState.localStream) {
          await tryInitiateOffer(mediaState.localStream, data.socketId);
        }
      }
      // Patient does nothing here — they wait for the offer.
    }
  );

  // ── Fire the offer as soon as the doctor gets their camera stream ─────────
  // This handles the race condition: peer joined BEFORE media was ready.
  useEffect(() => {
    if (role !== 'doctor') return;
    if (!mediaState.localStream) return;
    if (!pendingPeerSocketIdRef.current) return;
    if (offerSentRef.current) return;

    tryInitiateOffer(mediaState.localStream, pendingPeerSocketIdRef.current);
  }, [role, mediaState.localStream, tryInitiateOffer]);

  // ── Handle peer leaving ───────────────────────────────────────────────────

  const handlePeerLeft = useCallback((data: { participantCount: number }) => {
    setParticipantCount(data.participantCount);
    if (data.participantCount < 2) {
      setPeerJoined(false);
      // Reset offer guard so a reconnecting peer can trigger a new offer
      offerSentRef.current = false;
      pendingPeerSocketIdRef.current = null;
    }
  }, []);

  // ── Handle incoming offer (patient side) ─────────────────────────────────

  const handleRemoteOffer = useStableCallback(
    async (data: { offer: RTCSessionDescriptionInit; fromSocketId: string }) => {
      if (!mediaState.localStream) {
        // Media not ready yet — buffer the offer and process it once we have a stream
        pendingOfferRef.current = data;
        return;
      }

      initializePeerConnection(mediaState.localStream);
      await handleOffer(data.offer, data.fromSocketId);
    }
  );

  // ── Process a buffered offer once localStream becomes available ───────────
  useEffect(() => {
    if (!mediaState.localStream) return;
    if (!pendingOfferRef.current) return;

    const buffered = pendingOfferRef.current;
    pendingOfferRef.current = null;

    initializePeerConnection(mediaState.localStream);
    handleOffer(buffered.offer, buffered.fromSocketId);
  }, [mediaState.localStream, initializePeerConnection, handleOffer]);

  // ── Handle remote call ended ──────────────────────────────────────────────

  const handleRemoteCallEnded = useStableCallback(async () => {
    if (consultationId) {
      try {
        await endConsultation(consultationId);
      } catch {
        // May already be ended via HTTP
      }
    }
    closePeer();
    cleanupMedia();
    setCallEnded(true);
  });

  // ── Socket hook ───────────────────────────────────────────────────────────

  const { socketConnected, socketId, disconnect: disconnectSocket } = useVideoSocket({
    consultationId,
    onUserJoined: handlePeerJoined,
    onUserLeft: handlePeerLeft,
    onOffer: handleRemoteOffer,
    onAnswer: ({ answer }) => handleAnswer(answer),
    onIceCandidate: ({ candidate }) => handleIceCandidate(candidate),
    onCallEnded: handleRemoteCallEnded,
  });

  // ── Public actions ────────────────────────────────────────────────────────

  /**
   * Initialize local media and connect to signaling.
   * Call this when entering the consultation room.
   */
  const joinCall = useCallback(async () => {
    await initializeMedia();
  }, [initializeMedia]);

  /**
   * End the call — cleanup everything and notify the backend.
   */
  const endCall = useCallback(async () => {
    emitCallEnded();

    if (consultationId) {
      try {
        await endConsultation(consultationId);
      } catch {
        // May already be ended
      }
    }

    closePeer();
    cleanupMedia();
    disconnectSocket();
    offerSentRef.current = false;
    pendingPeerSocketIdRef.current = null;
    setCallEnded(true);
  }, [consultationId, closePeer, cleanupMedia, disconnectSocket]);

  /**
   * Toggle screen sharing. Replaces the video track in the peer connection.
   */
  const handleScreenShare = useCallback(async () => {
    if (mediaState.screenSharing) {
      stopScreenShare();
      const cameraTrack = mediaState.localStream?.getVideoTracks()[0];
      if (cameraTrack) {
        await switchVideoTrack(cameraTrack);
      }
    } else {
      const screenStream = await startScreenShare();
      if (screenStream) {
        const screenTrack = screenStream.getVideoTracks()[0];
        await switchVideoTrack(screenTrack);
        screenTrack.addEventListener('ended', async () => {
          const cameraTrack = mediaState.localStream?.getVideoTracks()[0];
          if (cameraTrack) await switchVideoTrack(cameraTrack);
        });
      }
    }
  }, [mediaState, startScreenShare, stopScreenShare, switchVideoTrack]);

  return {
    // Media state
    mediaState,
    mediaError,
    // Connection state
    connectionState,
    socketConnected,
    socketId,
    peerJoined,
    participantCount,
    callEnded,
    // Streams
    remoteStream,
    // Actions
    joinCall,
    endCall,
    toggleCamera,
    toggleMic,
    toggleSpeaker,
    handleScreenShare,
  };
};
