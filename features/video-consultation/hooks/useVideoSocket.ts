'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import {
  connectSignaling,
  disconnectSignaling,
  emitJoinRoom,
  onUserJoined,
  onUserLeft,
  onOffer,
  onAnswer,
  onIceCandidate,
  onCallEnded,
  onConnectionStatus,
  onSignalingError,
  offAllVideoEvents,
} from '../services/signaling.service';

interface UseVideoSocketOptions {
  consultationId: string | null;
  onUserJoined?: (data: { userId: string; role: string; socketId: string; participantCount: number }) => void;
  onUserLeft?: (data: { userId: string; role: string; socketId: string; participantCount: number }) => void;
  onOffer?: (data: { offer: RTCSessionDescriptionInit; fromSocketId: string }) => void;
  onAnswer?: (data: { answer: RTCSessionDescriptionInit; fromSocketId: string }) => void;
  onIceCandidate?: (data: { candidate: RTCIceCandidateInit; fromSocketId: string }) => void;
  onCallEnded?: (data: { userId: string; role: string }) => void;
  onError?: (data: { message: string }) => void;
}

/**
 * Manages the Socket.IO connection for video consultation signaling.
 * Registers typed event listeners and handles connect/disconnect lifecycle.
 */
export const useVideoSocket = ({
  consultationId,
  onUserJoined: onUserJoinedCb,
  onUserLeft: onUserLeftCb,
  onOffer: onOfferCb,
  onAnswer: onAnswerCb,
  onIceCandidate: onIceCandidateCb,
  onCallEnded: onCallEndedCb,
  onError: onErrorCb,
}: UseVideoSocketOptions) => {
  const [socketConnected, setSocketConnected] = useState(false);
  const [socketId, setSocketId] = useState<string | null>(null);
  const connectedRef = useRef(false);

  useEffect(() => {
    if (!consultationId) return;

    const socket = connectSignaling();

    const handleConnect = () => {
      setSocketConnected(true);
      setSocketId(socket.id || null);
      connectedRef.current = true;

      // Join the room immediately upon socket connection
      emitJoinRoom(consultationId);
    };

    const handleDisconnect = () => {
      setSocketConnected(false);
      connectedRef.current = false;
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    // If already connected (e.g. reconnect scenario), join immediately
    if (socket.connected) {
      handleConnect();
    }

    // Register typed event handlers
    if (onUserJoinedCb) onUserJoined(onUserJoinedCb);
    if (onUserLeftCb) onUserLeft(onUserLeftCb);
    if (onOfferCb) onOffer(onOfferCb);
    if (onAnswerCb) onAnswer(onAnswerCb);
    if (onIceCandidateCb) onIceCandidate(onIceCandidateCb);
    if (onCallEndedCb) onCallEnded(onCallEndedCb);
    if (onErrorCb) onSignalingError(onErrorCb);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      offAllVideoEvents();
    };
  }, [consultationId]);

  const disconnect = useCallback(() => {
    offAllVideoEvents();
    disconnectSignaling();
    setSocketConnected(false);
  }, []);

  return {
    socketConnected,
    socketId,
    disconnect,
  };
};
