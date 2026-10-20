"use client";

import { useContext, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { DoctorContext } from "@/context/DoctorContext";
import { AppContext } from "@/context/AppContext";
import { assets } from "@/lib/assets";

export default function DoctorDashboardPage() {
  const {
    dToken,
    dashData,
    getDashData,
    cancelAppointment,
    completeAppointment,
  } = useContext(DoctorContext);
  const { currency, slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getDashData();
    }
  }, [dToken, getDashData]);

  if (!dashData) {
    return (
      <div className="m-5 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="m-5 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Doctor Dashboard</h1>
        <p className="text-sm text-gray-500">
          Overview of your patients, scheduled appointments, and clinical earnings.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="flex items-center gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
            <Image
              src={assets.earning_icon}
              alt="Earnings"
              width={36}
              height={36}
            />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">
              {currency} {dashData.earnings}
            </p>
            <p className="text-xs text-gray-500 font-medium">Total Earnings</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
            <Image
              src={assets.appointment_icon}
              alt="Appointments"
              width={36}
              height={36}
            />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">
              {dashData.appointments}
            </p>
            <p className="text-xs text-gray-500 font-medium">Appointments</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
            <Image
              src={assets.patients_icon}
              alt="Patients"
              width={36}
              height={36}
            />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">
              {dashData.patients}
            </p>
            <p className="text-xs text-gray-500 font-medium">Unique Patients</p>
          </div>
        </div>
      </div>

      {/* Latest Bookings Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50/50">
          <div className="flex items-center gap-2.5">
            <Image src={assets.list_icon} alt="" width={20} height={20} />
            <h2 className="font-semibold text-gray-800 text-base">
              Latest Bookings
            </h2>
          </div>
          <Link
            href="/doctor/appointments"
            className="text-xs text-indigo-600 hover:underline font-medium"
          >
            View All Appointments →
          </Link>
        </div>

        <div className="divide-y divide-gray-100">
          {dashData.latestAppointments.length === 0 ? (
            <p className="p-8 text-center text-sm text-gray-400">
              No appointments booked yet.
            </p>
          ) : (
            dashData.latestAppointments.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="w-full h-full object-cover"
                      src={item.userData?.image || "/assets/profile_pic.png"}
                      alt={item.userData?.name || "Patient"}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {item.userData?.name || "Patient"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {slotDateFormat(item.slotDate)} at {item.slotTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {item.cancelled ? (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-600">
                      Cancelled
                    </span>
                  ) : item.isCompleted ? (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                      Completed
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        title="Cancel Appointment"
                        onClick={() => cancelAppointment(item._id)}
                        className="w-8 h-8 rounded-full border border-red-200 flex items-center justify-center hover:bg-red-50 text-red-500 transition-colors cursor-pointer"
                      >
                        <Image
                          src={assets.cancel_icon}
                          alt="Cancel"
                          width={18}
                          height={18}
                        />
                      </button>
                      <button
                        title="Complete Appointment"
                        onClick={() => completeAppointment(item._id)}
                        className="w-8 h-8 rounded-full border border-green-200 flex items-center justify-center hover:bg-green-50 text-green-600 transition-colors cursor-pointer"
                      >
                        <Image
                          src={assets.tick_icon}
                          alt="Complete"
                          width={18}
                          height={18}
                        />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
