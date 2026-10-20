"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminContext } from "@/context/AdminContext";
import { AppContext } from "@/context/AppContext";
import Image from "next/image";
import { assets } from "@/lib/assets";

export default function AdminDashboardPage() {
  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);
  const router = useRouter();

  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!dashData) {
    return (
      <div className="m-5 flex items-center justify-center min-h-[60vh]">
        <div className="text-center text-gray-400">
          <svg className="mx-auto mb-4 w-12 h-12 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="m-5">
      {/* Stats */}
      <div className="flex flex-wrap gap-3 mb-8">
        <div
          onClick={() => router.push("/admin/doctors")}
          className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all"
        >
          <Image className="w-14" src={assets.doctor_icon} alt="Doctors" width={56} height={56} />
          <div>
            <p className="text-xl font-semibold text-gray-600">{dashData.doctors}</p>
            <p className="text-gray-400">Doctors</p>
          </div>
        </div>

        <div
          onClick={() => router.push("/admin/appointments")}
          className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all"
        >
          <Image className="w-14" src={assets.appointment_icon} alt="Appointments" width={56} height={56} />
          <div>
            <p className="text-xl font-semibold text-gray-600">{dashData.appointments}</p>
            <p className="text-gray-400">Appointments</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <Image className="w-14" src={assets.patients_icon} alt="Patients" width={56} height={56} />
          <div>
            <p className="text-xl font-semibold text-gray-600">{dashData.patients}</p>
            <p className="text-gray-400">Patients</p>
          </div>
        </div>
      </div>

      {/* Latest Bookings */}
      <div className="bg-white rounded border">
        <div className="flex items-center gap-2.5 px-4 py-4 border-b">
          <Image src={assets.list_icon} alt="List" width={20} height={20} />
          <p className="font-semibold">Latest Bookings</p>
        </div>
        <div>
          {dashData.latestAppointments.map((item) => (
            <div
              key={item._id}
              className="flex items-center px-6 py-3 gap-3 hover:bg-gray-50 border-b last:border-b-0"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-full h-full object-cover"
                  src={typeof item.docData?.image === "string" ? item.docData.image : "/assets/doc1.png"}
                  alt={item.docData?.name || "Doctor"}
                />
              </div>
              <div className="flex-1 text-sm">
                <p className="text-gray-800 font-medium">{item.docData?.name || "Doctor"}</p>
                <p className="text-gray-500">
                  {slotDateFormat(item.slotDate)}, {item.slotTime}
                </p>
              </div>
              {item.cancelled ? (
                <span className="text-red-400 text-xs font-medium bg-red-50 px-2 py-0.5 rounded-full">Cancelled</span>
              ) : item.isCompleted ? (
                <span className="text-green-500 text-xs font-medium bg-green-50 px-2 py-0.5 rounded-full">Completed</span>
              ) : (
                <button
                  onClick={() => cancelAppointment(item._id)}
                  className="text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1 rounded-full transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
