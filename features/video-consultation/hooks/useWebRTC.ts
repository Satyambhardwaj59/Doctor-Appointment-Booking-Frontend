'use client';

import { useState, useRef, useCallback } from 'react';
import {
  createPeerConnection,
  addTracksToConnection,
  createOffer,
  createAnswer,
  closePeerConnection,
  replaceVideoTrack,
} from '../utils/rtc.utils';
import {
  emitOffer,
  emitAnswer,
  emitIceCandidate,
} from '../services/signaling.service';
import type { ConnectionState } from '../types/videoConsultation.types';

/**
 * Manages the RTCPeerConnection lifecycle.
 * Handles offer/answer/ICE negotiation via the signaling service.
 */
export const useWebRTC = () => {
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const remoteStreamRef = useRef<MediaStream>(new MediaStream());

  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>('idle');
  const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);

  /**
   * Initialize the RTCPeerConnection with the local stream.
   * Attaches all ICE and track event handlers.
   */
  const initializePeerConnection = useCallback((localStream: MediaStream) => {
    if (pcRef.current) {
      closePeerConnection(pcRef.current);
    }

    const pc = createPeerConnection();
    pcRef.current = pc;

    // Add local tracks so they're sent to the remote peer
    addTracksToConnection(pc, localStream);

    // Handle remote tracks
    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStreamRef.current.addTrack(track);
      });
      setRemoteStream(new MediaStream(remoteStreamRef.current.getTracks()));
    };

    // ICE candidate generated — send via signaling
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        emitIceCandidate(event.candidate.toJSON());
      }
    };

    // Track connection state changes
    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      if (state === 'connected') setConnectionState('connected');
      else if (state === 'connecting' || state === 'new') setConnectionState('connecting');
      else if (state === 'disconnected') setConnectionState('disconnected');
      else if (state === 'failed') setConnectionState('failed');
      else if (state === 'closed') setConnectionState('idle');
    };

    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === 'disconnected') {
        setConnectionState('reconnecting');
      }
    };

    setConnectionState('connecting');
    return pc;
  }, []);

  /**
   * Create and send an offer to the remote peer (call initiator).
   */
  const sendOffer = useCallback(async (targetSocketId?: string) => {
    if (!pcRef.current) return;
    try {
      const offer = await createOffer(pcRef.current);
      emitOffer(offer, targetSocketId);
      if (targetSocketId) setRemoteSocketId(targetSocketId);
    } catch {
      setConnectionState('failed');
    }
  }, []);

  /**
   * Handle an incoming offer and send back an answer.
   */
  const handleOffer = useCallback(
    async (offer: RTCSessionDescriptionInit, fromSocketId: string) => {
      if (!pcRef.current) return;
      try {
        setRemoteSocketId(fromSocketId);
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await createAnswer(pcRef.current);
        emitAnswer(answer, fromSocketId);
      } catch {
        setConnectionState('failed');
      }
    },
    []
  );

  /**
   * Handle an incoming answer from the remote peer.
   */
  const handleAnswer = useCallback(async (answer: RTCSessionDescriptionInit) => {
    if (!pcRef.current) return;
    try {
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    } catch {
      // Remote description may already be set in race conditions
    }
  }, []);

  /**
   * Handle an incoming ICE candidate.
   */
  const handleIceCandidate = useCallback(async (candidate: RTCIceCandidateInit) => {
    if (!pcRef.current) return;
    try {
      await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    } catch {
      // May happen if PC is already closed
    }
  }, []);

  /**
   * Replace the video track (for screen share).
   */
  const switchVideoTrack = useCallback(async (newTrack: MediaStreamTrack) => {
    if (!pcRef.current) return;
    await replaceVideoTrack(pcRef.current, newTrack);
  }, []);

  /**
   * Close the peer connection and reset state.
   */
  const closePeer = useCallback(() => {
    closePeerConnection(pcRef.current);
    pcRef.current = null;
    remoteStreamRef.current = new MediaStream();
    setRemoteStream(null);
    setConnectionState('idle');
    setRemoteSocketId(null);
  }, []);

  return {
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
  };
};
