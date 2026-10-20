"use client";

import { createContext, useState, useCallback, type ReactNode } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import type { AdminContextType, Doctor, Appointment, AdminDashData } from "@/types";

export const AdminContext = createContext<AdminContextType>({} as AdminContextType);

export default function AdminContextProvider({ children }: { children: ReactNode }) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

  const [aToken, setAToken] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("aToken") ?? "";
    }
    return "";
  });
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [dashData, setDashData] = useState<AdminDashData | false>(false);

  const getAllDoctors = useCallback(async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/all-doctors",
        {},
        { headers: { aToken } }
      );
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An error occurred";
      toast.error(message);
    }
  }, [aToken, backendUrl]);

  const changeAvailability = useCallback(
    async (docId: string) => {
      try {
        const { data } = await axios.post(
          backendUrl + "/api/admin/change-availability",
          { docId },
          { headers: { aToken } }
        );
        if (data.success) {
          toast.success(data.message);
          getAllDoctors();
        } else {
          toast.error(data.message);
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "An error occurred";
        toast.error(message);
      }
    },
    [aToken, backendUrl, getAllDoctors]
  );

  const getAllAppointments = useCallback(async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/appointments", {
        headers: { aToken },
      });
      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An error occurred";
      toast.error(message);
    }
  }, [aToken, backendUrl]);

  const cancelAppointment = useCallback(
    async (appointmentId: string) => {
      try {
        const { data } = await axios.post(
          backendUrl + "/api/admin/cancel-appointment",
          { appointmentId },
          { headers: { aToken } }
        );
        if (data.success) {
          toast.success(data.message);
          getAllAppointments();
        } else {
          toast.error(data.message);
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "An error occurred";
        toast.error(message);
      }
    },
    [aToken, backendUrl, getAllAppointments]
  );

  const getDashData = useCallback(async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/dashboard", {
        headers: { aToken },
      });
      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An error occurred";
      toast.error(message);
    }
  }, [aToken, backendUrl]);

  const value: AdminContextType = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    getAllDoctors,
    changeAvailability,
    getAllAppointments,
    appointments,
    setAppointments,
    cancelAppointment,
    dashData,
    getDashData,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}
