"use client";

import { useContext, useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { toast } from "react-toastify";
import { DoctorContext } from "@/context/DoctorContext";

interface QueueEntry {
  _id: string;
  tokenNumber: number;
  patientId: string;
  patientName?: string;
  appointmentId?: string;
  status: "WAITING" | "CALLED" | "IN_CONSULTATION" | "COMPLETED" | "SKIPPED";
  joinedAt: string;
  calledAt?: string;
  startedAt?: string;
  completedAt?: string;
}

interface DoctorQueue {
  _id: string;
  doctorId: string;
  isPaused: boolean;
  activeToken?: number;
  currentEntryId?: string;
  entries: QueueEntry[];
  currentEntry?: QueueEntry;
}

export default function DoctorQueuePage() {
  const { dToken, profileData, getProfileData, backendUrl } = useContext(DoctorContext);
  const [queue, setQueue] = useState<DoctorQueue | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (dToken && !profileData) {
      getProfileData();
    }
  }, [dToken, profileData, getProfileData]);

  const doctorId = profileData ? profileData._id : "";

  const fetchQueue = useCallback(async () => {
    if (!doctorId) return;
    try {
      const { data } = await axios.get(backendUrl + `/api/queues/${doctorId}`, {
        headers: { dtoken: dToken },
      });
      if (data.success && data.queue) {
        setQueue(data.queue);
      }
    } catch (err: unknown) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [doctorId, dToken, backendUrl]);

  useEffect(() => {
    if (doctorId) {
      fetchQueue();
    }
  }, [doctorId, fetchQueue]);

  // Connect to live queue socket for real-time synchronization
  useEffect(() => {
    if (!backendUrl || !dToken || !queue?._id) return;

    const socket = io(`${backendUrl}/queue`, {
      transports: ["websocket", "polling"],
      auth: { token: dToken },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join-queue", { queueId: queue._id });
    });

    socket.on("queue-updated", () => {
      fetchQueue();
    });

    socket.on("patient-joined", () => {
      fetchQueue();
      toast.info("A new patient joined the queue");
    });

    return () => {
      socket.disconnect();
    };
  }, [backendUrl, dToken, queue?._id, fetchQueue]);

  const handleQueueAction = async (action: string, entryId?: string) => {
    if (!queue) return;
    try {
      setActionLoading(true);
      let url = `${backendUrl}/api/queues/${queue._id}/${action}`;
      let body: Record<string, string> = {};
      if (entryId) {
        body.entryId = entryId;
      }

      const { data } = await axios.patch(url, body, {
        headers: { dtoken: dToken },
      });

      if (data.success) {
        toast.success(data.message || `Action "${action}" succeeded`);
        fetchQueue();
      } else {
        toast.error(data.message || `Failed to perform ${action}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error executing queue action";
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="m-5 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const waitingEntries =
    queue?.entries?.filter((e) => e.status === "WAITING") || [];
  const activeEntry =
    queue?.entries?.find(
      (e) => e.status === "IN_CONSULTATION" || e.status === "CALLED"
    ) || null;
  const historyEntries =
    queue?.entries?.filter(
      (e) => e.status === "COMPLETED" || e.status === "SKIPPED"
    ) || [];

  return (
    <div className="m-5 max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Smart Live Queue Console
          </h1>
          <p className="text-sm text-gray-500">
            Real-time clinic waiting room management, token dispatch, and patient flow.
          </p>
        </div>

        {queue && (
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                queue.isPaused
                  ? "bg-amber-100 text-amber-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {queue.isPaused ? "Queue Paused" : "Queue Active"}
            </span>

            {queue.isPaused ? (
              <button
                disabled={actionLoading}
                onClick={() => handleQueueAction("resume")}
                className="bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-4 py-1.5 rounded-full cursor-pointer transition-colors"
              >
                Resume Queue
              </button>
            ) : (
              <button
                disabled={actionLoading}
                onClick={() => handleQueueAction("pause")}
                className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium px-4 py-1.5 rounded-full cursor-pointer transition-colors"
              >
                Pause Queue
              </button>
            )}
          </div>
        )}
      </div>

      {!queue ? (
        <div className="bg-white border rounded-xl p-12 text-center text-gray-500">
          No active queue session found for today.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Consultation Hero Card */}
          <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
              <div>
                <span className="text-indigo-200 text-xs font-semibold tracking-wider uppercase">
                  Current Token in Chamber
                </span>
                <div className="flex items-baseline gap-4 mt-2">
                  <span className="text-5xl font-black">
                    {activeEntry ? `#${activeEntry.tokenNumber}` : "None"}
                  </span>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      activeEntry?.status === "IN_CONSULTATION"
                        ? "bg-green-500/20 text-green-300 border border-green-400/30"
                        : activeEntry?.status === "CALLED"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-400/30"
                        : "bg-white/10 text-gray-300"
                    }`}
                  >
                    {activeEntry ? activeEntry.status.replace("_", " ") : "Waiting for Next Patient"}
                  </span>
                </div>
                {activeEntry && (
                  <p className="text-indigo-100 text-sm mt-2">
                    Patient Name: <strong className="text-white">{activeEntry.patientName || "Booked Patient"}</strong>
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2.5">
                {activeEntry?.status === "CALLED" && (
                  <button
                    disabled={actionLoading}
                    onClick={() => handleQueueAction("start")}
                    className="bg-green-500 hover:bg-green-600 text-white font-medium text-sm px-5 py-2.5 rounded-xl cursor-pointer transition-colors shadow-sm"
                  >
                    Start Consultation
                  </button>
                )}

                {activeEntry?.status === "IN_CONSULTATION" && (
                  <button
                    disabled={actionLoading}
                    onClick={() => handleQueueAction("complete")}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium text-sm px-5 py-2.5 rounded-xl cursor-pointer transition-colors shadow-sm"
                  >
                    Complete & Next
                  </button>
                )}

                {activeEntry && (
                  <button
                    disabled={actionLoading}
                    onClick={() => handleQueueAction("skip", activeEntry._id)}
                    className="bg-white/10 hover:bg-white/20 text-white font-medium text-sm px-4 py-2.5 rounded-xl cursor-pointer transition-colors border border-white/20"
                  >
                    Skip Patient
                  </button>
                )}

                <button
                  disabled={actionLoading || waitingEntries.length === 0}
                  onClick={() => handleQueueAction("call-next")}
                  className="bg-white text-indigo-700 hover:bg-indigo-50 font-semibold text-sm px-6 py-2.5 rounded-xl cursor-pointer transition-colors shadow-md disabled:opacity-50"
                >
                  Call Next Patient ({waitingEntries.length})
                </button>
              </div>
            </div>
          </div>

          {/* 2-Column: Waiting Patients vs Past Flow */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Waiting List */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center justify-between">
                <span>Waiting In Queue</span>
                <span className="text-xs font-normal text-gray-500">
                  {waitingEntries.length} patient(s)
                </span>
              </h2>

              {waitingEntries.length === 0 ? (
                <p className="text-sm text-gray-400 py-6 text-center">
                  No patients currently waiting.
                </p>
              ) : (
                <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                  {waitingEntries.map((entry) => (
                    <div
                      key={entry._id}
                      className="py-3 flex items-center justify-between hover:bg-gray-50 px-2 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                          #{entry.tokenNumber}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {entry.patientName || "Patient"}
                          </p>
                          <p className="text-xs text-gray-400">
                            Joined at {new Date(entry.joinedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>

                      <button
                        disabled={actionLoading}
                        onClick={() => handleQueueAction("skip", entry._id)}
                        className="text-xs text-gray-500 hover:text-red-600 transition-colors cursor-pointer px-2 py-1"
                      >
                        Skip
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Completed & Skipped List */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center justify-between">
                <span>Completed / Skipped</span>
                <span className="text-xs font-normal text-gray-500">
                  {historyEntries.length} recorded
                </span>
              </h2>

              {historyEntries.length === 0 ? (
                <p className="text-sm text-gray-400 py-6 text-center">
                  No consultations completed yet today.
                </p>
              ) : (
                <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                  {historyEntries.map((entry) => (
                    <div
                      key={entry._id}
                      className="py-3 flex items-center justify-between hover:bg-gray-50 px-2 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs ${
                            entry.status === "COMPLETED"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          #{entry.tokenNumber}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {entry.patientName || "Patient"}
                          </p>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              entry.status === "COMPLETED"
                                ? "bg-green-50 text-green-700"
                                : "bg-red-50 text-red-600"
                            }`}
                          >
                            {entry.status}
                          </span>
                        </div>
                      </div>

                      {entry.status === "SKIPPED" && (
                        <button
                          disabled={actionLoading}
                          onClick={() => handleQueueAction("recall", entry._id)}
                          className="text-xs text-indigo-600 hover:underline font-medium cursor-pointer"
                        >
                          Recall
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
