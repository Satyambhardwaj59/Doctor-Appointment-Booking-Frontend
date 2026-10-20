"use client";

import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import { DoctorContext } from "@/context/DoctorContext";
import { AppContext } from "@/context/AppContext";
import { assets } from "@/lib/assets";
import { createConsultation } from "@/features/video-consultation/services/videoConsultation.service";

interface MedicalRecordAttachment {
  url: string;
  fileName?: string;
  fileType?: string;
}

interface MedicalRecord {
  _id: string;
  title: string;
  type: string;
  recordDate: string;
  doctorNotes?: string;
  attachments?: MedicalRecordAttachment[];
}

export default function DoctorAppointmentsPage() {
  const {
    dToken,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
    backendUrl,
  } = useContext(DoctorContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);
  const [filter, setFilter] = useState<"all" | "active" | "completed" | "cancelled">("all");
  const [search, setSearch] = useState("");
  const [startingVideoId, setStartingVideoId] = useState<string | null>(null);

  // Medical Records Modal State
  const [selectedPatient, setSelectedPatient] = useState<{ id: string; name: string } | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken, getAppointments]);

  const handleStartVideo = async (appointmentId: string) => {
    try {
      setStartingVideoId(appointmentId);
      const res = await createConsultation(appointmentId);
      if (res.success && res.consultation) {
        window.open(
          `/video-consultation/${res.consultation._id}/waiting-room?dtoken=${encodeURIComponent(dToken)}`,
          "_blank"
        );
      } else {
        toast.error(res.message || "Failed to start video consultation");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error initiating video call";
      toast.error(msg);
    } finally {
      setStartingVideoId(null);
    }
  };

  const openPatientRecords = async (patientId?: string, patientName?: string) => {
    if (!patientId) {
      toast.error("No patient identifier associated with this booking");
      return;
    }

    setSelectedPatient({ id: patientId, name: patientName || "Patient" });
    setLoadingRecords(true);
    setRecords([]);

    try {
      const { data } = await axios.get(`${backendUrl}/api/medical-records`, {
        headers: { dtoken: dToken },
        params: { patientId },
      });

      if (data.success && data.records) {
        setRecords(data.records);
      } else {
        setRecords([]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not load patient medical records";
      toast.error(msg);
    } finally {
      setLoadingRecords(false);
    }
  };

  const filtered = appointments.filter((item) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "completed"
        ? item.isCompleted
        : filter === "cancelled"
        ? item.cancelled
        : !item.isCompleted && !item.cancelled;

    const patientName = item.userData?.name?.toLowerCase() || "";
    const matchesSearch = patientName.includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="w-full max-w-7xl m-5">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Doctor Appointments
          </h1>
          <p className="text-sm text-gray-500">
            Manage your patient consultation schedule, video sessions, medical history, and completion statuses.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search patient name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value as "all" | "active" | "completed" | "cancelled")
            }
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Appointments</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl text-sm shadow-sm max-h-[80vh] overflow-y-auto">
        {/* Table Header */}
        <div className="hidden lg:grid grid-cols-[0.4fr_2.2fr_1fr_0.8fr_2fr_0.9fr_2.4fr] gap-3 py-3.5 px-6 border-b bg-gray-50/70 font-semibold text-gray-600 text-xs uppercase tracking-wider">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p className="text-right">Actions</p>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            No appointments found.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((item, index) => (
              <div
                key={item._id}
                className="flex flex-col lg:grid lg:grid-cols-[0.4fr_2.2fr_1fr_0.8fr_2fr_0.9fr_2.4fr] gap-3 items-start lg:items-center py-4 px-6 hover:bg-gray-50/60 transition-colors"
              >
                {/* Index */}
                <p className="hidden lg:block text-gray-400 text-xs">{index + 1}</p>

                {/* Patient Info */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-50 overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="w-full h-full object-cover"
                      src={item.userData?.image || "/assets/profile_pic.png"}
                      alt={item.userData?.name || "Patient"}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {item.userData?.name || "Unknown Patient"}
                    </p>
                    {item.familyMemberData && (
                      <p className="text-xs text-indigo-600 font-medium">
                        For: {item.familyMemberData.name} ({item.familyMemberData.relationship})
                      </p>
                    )}
                  </div>
                </div>

                {/* Payment Badge */}
                <div>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                      item.payment
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-amber-100 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {item.payment ? "Online Paid" : "Pay at Clinic"}
                  </span>
                </div>

                {/* Age */}
                <p className="text-gray-500 text-xs">
                  {item.userData?.dob ? `${calculateAge(item.userData.dob)} yrs` : "—"}
                </p>

                {/* Date & Time */}
                <p className="text-gray-600 text-xs font-medium">
                  {slotDateFormat(item.slotDate)}, {item.slotTime}
                </p>

                {/* Amount */}
                <p className="text-gray-800 font-semibold text-xs">
                  {currency}
                  {item.amount}
                </p>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 justify-start lg:justify-end w-full flex-wrap">
                  {/* Medical Records Viewer Button */}
                  <button
                    onClick={() => openPatientRecords(item.userId, item.userData?.name)}
                    className="px-2.5 py-1 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors cursor-pointer"
                    title="View Patient Medical Records"
                  >
                    Records
                  </button>

                  {/* Quick Chat Link */}
                  <Link
                    href="/doctor/messages"
                    className="px-2.5 py-1 text-xs font-medium bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors"
                    title="Chat with Patient"
                  >
                    Chat
                  </Link>

                  {item.cancelled ? (
                    <span className="text-xs font-medium text-red-500 bg-red-50 px-3 py-1 rounded-full">
                      Cancelled
                    </span>
                  ) : item.isCompleted ? (
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      Completed
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      {/* Video Consultation Button */}
                      <button
                        disabled={startingVideoId === item._id}
                        onClick={() => handleStartVideo(item._id)}
                        className="px-2.5 py-1 text-xs font-medium bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md transition-colors cursor-pointer disabled:opacity-50"
                        title="Start Video Consultation"
                      >
                        {startingVideoId === item._id ? "Connecting..." : "Video"}
                      </button>

                      <button
                        onClick={() => completeAppointment(item._id)}
                        className="p-1 rounded-full border border-green-200 hover:bg-green-50 text-green-600 transition-colors cursor-pointer"
                        title="Mark Complete"
                      >
                        <Image
                          src={assets.tick_icon}
                          alt="Complete"
                          width={20}
                          height={20}
                        />
                      </button>

                      <button
                        onClick={() => cancelAppointment(item._id)}
                        className="p-1 rounded-full border border-red-200 hover:bg-red-50 text-red-500 transition-colors cursor-pointer"
                        title="Cancel"
                      >
                        <Image
                          src={assets.cancel_icon}
                          alt="Cancel"
                          width={20}
                          height={20}
                        />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Patient Medical Records Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Medical Records: {selectedPatient.name}
                </h3>
                <p className="text-xs text-gray-500">
                  Patient clinical history, uploaded documents, and prescriptions.
                </p>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4">
              {loadingRecords ? (
                <div className="py-12 flex justify-center">
                  <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : records.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-sm">
                  No medical records found for this patient.
                </div>
              ) : (
                <div className="space-y-3">
                  {records.map((rec) => (
                    <div
                      key={rec._id}
                      className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50/60 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-800 text-sm">{rec.title}</h4>
                        <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                          {rec.type.replace(/_/g, " ")}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        Date: {new Date(rec.recordDate).toLocaleDateString()}
                      </p>
                      {rec.doctorNotes && (
                        <p className="text-xs text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                          {rec.doctorNotes}
                        </p>
                      )}
                      {rec.attachments && rec.attachments.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {rec.attachments.map((att, idx) => (
                            <a
                              key={idx}
                              href={att.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline bg-indigo-50 px-2 py-1 rounded"
                            >
                              📄 {att.fileName || `Attachment ${idx + 1}`}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t mt-4">
              <button
                onClick={() => setSelectedPatient(null)}
                className="px-5 py-2 bg-gray-900 text-white rounded-full text-xs font-semibold hover:bg-gray-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
