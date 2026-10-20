"use client";

import { useEffect, useContext } from "react";
import Image from "next/image";
import { AdminContext } from "@/context/AdminContext";
import { AppContext } from "@/context/AppContext";
import { assets } from "@/lib/assets";

export default function AdminAppointmentsPage() {
  const { aToken, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>
      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
        {/* Table Header */}
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] py-3 px-6 border-b bg-gray-50 font-medium text-gray-600">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date &amp; Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>

        {appointments.length === 0 && (
          <div className="flex items-center justify-center h-40 text-gray-400">
            No appointments found
          </div>
        )}

        {appointments.map((item, index) => (
          <div
            className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
            key={item._id}
          >
            <p className="max-sm:hidden">{index + 1}</p>
            <div className="flex items-center gap-2">
              <Image
                className="w-8 h-8 rounded-full object-cover"
                src={item.userData?.image || "/assets/patient_icon.svg"}
                alt={item.userData?.name || "Patient"}
                width={32}
                height={32}
                unoptimized
              />
              <p>{item.userData?.name}</p>
            </div>
            <p className="max-sm:hidden">
              {item.userData?.dob ? calculateAge(item.userData.dob) : "-"}
            </p>
            <p>
              {slotDateFormat(item.slotDate)}, {item.slotTime}
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-full h-full object-cover"
                  src={typeof item.docData?.image === "string" ? item.docData.image : "/assets/doc1.png"}
                  alt={item.docData?.name || "Doctor"}
                />
              </div>
              <p>{item.docData?.name || "Doctor"}</p>
            </div>
            <p>
              {currency}
              {item.amount}
            </p>
            {item.cancelled ? (
              <span className="text-red-400 text-xs font-medium">Cancelled</span>
            ) : item.isCompleted ? (
              <span className="text-green-500 text-xs font-medium">Completed</span>
            ) : (
              <button
                onClick={() => cancelAppointment(item._id)}
                title="Cancel appointment"
              >
                <Image
                  className="w-10 cursor-pointer hover:opacity-75"
                  src={assets.cancel_icon}
                  alt="Cancel"
                  width={40}
                  height={40}
                />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
