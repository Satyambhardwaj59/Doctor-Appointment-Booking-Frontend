"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { io, Socket } from "socket.io-client";
import { DoctorContext } from "@/context/DoctorContext";

interface IncomingCallPayload {
  consultationId: string;
  roomId: string;
  appointmentId: string;
  callerId: string;
  callerRole: "doctor" | "patient";
  callerName: string;
  callerImage?: string;
  timestamp: string;
}

export default function DoctorIncomingCallModal() {
  const { dToken, backendUrl } = useContext(DoctorContext);
  const [incomingCall, setIncomingCall] = useState<IncomingCallPayload | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const ringIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRinging = () => {
    try {
      if (typeof window === "undefined") return;
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const playTone = () => {
        if (!ctx || ctx.state === "closed") return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.3);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.5);
      };
      playTone();
      ringIntervalRef.current = setInterval(playTone, 2000);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  const stopRinging = () => {
    if (ringIntervalRef.current) {
      clearInterval(ringIntervalRef.current);
      ringIntervalRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
  };

  useEffect(() => {
    if (!dToken) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    const socket = io(`${backendUrl}/video`, {
      auth: { dtoken: dToken },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
    });
    socketRef.current = socket;

    socket.on("video:incoming-call", (data: IncomingCallPayload) => {
      if (data.callerRole === "doctor") return;
      setIncomingCall(data);
      startRinging();
    });

    return () => {
      stopRinging();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [dToken, backendUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-decline after 45 seconds
  useEffect(() => {
    if (!incomingCall) return;
    const timeout = setTimeout(() => handleDecline(), 45000);
    return () => clearTimeout(timeout);
  }, [incomingCall]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAccept = () => {
    if (!incomingCall) return;
    const { consultationId } = incomingCall;
    stopRinging();
    setIncomingCall(null);
    window.open(
      `/video-consultation/${consultationId}/waiting-room?dtoken=${encodeURIComponent(dToken)}`,
      "_blank"
    );
  };

  const handleDecline = () => {
    if (!incomingCall) return;
    if (socketRef.current) {
      socketRef.current.emit("video:reject-call", {
        consultationId: incomingCall.consultationId,
        callerId: incomingCall.callerId,
        callerRole: incomingCall.callerRole,
      });
    }
    stopRinging();
    setIncomingCall(null);
  };

  if (!incomingCall) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 text-center">
        {/* Animated Ring */}
        <div className="relative mx-auto mb-5 h-24 w-24">
          <div className="absolute inset-0 rounded-full bg-indigo-500 opacity-20 animate-ping" />
          <div className="absolute inset-1 rounded-full bg-blue-500 opacity-30 animate-pulse" />
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full border-4 border-white bg-indigo-50 shadow-md">
            {incomingCall.callerImage ? (
              <Image
                src={incomingCall.callerImage}
                alt={incomingCall.callerName}
                width={96}
                height={96}
                className="h-full w-full object-cover"
                unoptimized
              />
            ) : (
              <svg className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          </div>
        </div>

        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
          Incoming Patient Call
        </p>
        <h3 className="text-xl font-bold text-gray-900 mb-1">{incomingCall.callerName}</h3>
        <p className="text-sm text-gray-500 mb-6">Patient is calling for video consultation</p>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleDecline}
            className="flex items-center justify-center gap-2 rounded-2xl bg-gray-100 hover:bg-gray-200 py-3.5 px-4 font-semibold text-gray-700 transition active:scale-95 cursor-pointer"
          >
            <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 py-3.5 px-4 font-semibold text-white shadow-lg transition active:scale-95 cursor-pointer"
          >
            <svg className="h-5 w-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Accept Call
          </button>
        </div>
      </div>
    </div>
  );
}
