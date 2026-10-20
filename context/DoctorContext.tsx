"use client";

import { createContext, useState, useCallback, type ReactNode } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import type { DoctorContextType, Appointment, DoctorDashData, Doctor } from "@/types";

export const DoctorContext = createContext<DoctorContextType>({} as DoctorContextType);

export default function DoctorContextProvider({ children }: { children: ReactNode }) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

  const [dToken, setDToken] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("dToken") ?? "";
    }
    return "";
  });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [dashData, setDashData] = useState<DoctorDashData | false>(false);
  const [profileData, setProfileData] = useState<Doctor | false>(false);

  const getAppointments = useCallback(async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/appointments", {
        headers: { dToken },
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
  }, [dToken, backendUrl]);

  const completeAppointment = useCallback(
    async (appointmentId: string) => {
      try {
        const { data } = await axios.post(
          backendUrl + "/api/doctor/complete-appointment",
          { appointmentId },
          { headers: { dToken } }
        );
        if (data.success) {
          toast.success(data.message);
          getAppointments();
        } else {
          toast.error(data.message);
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "An error occurred";
        toast.error(message);
      }
    },
    [dToken, backendUrl, getAppointments]
  );

  const cancelAppointment = useCallback(
    async (appointmentId: string) => {
      try {
        const { data } = await axios.post(
          backendUrl + "/api/doctor/cancel-appointment",
          { appointmentId },
          { headers: { dToken } }
        );
        if (data.success) {
          toast.success(data.message);
          getAppointments();
        } else {
          toast.error(data.message);
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "An error occurred";
        toast.error(message);
      }
    },
    [dToken, backendUrl, getAppointments]
  );

  const getDashData = useCallback(async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/dashboard", {
        headers: { dToken },
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
  }, [dToken, backendUrl]);

  const getProfileData = useCallback(async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/profile", {
        headers: { dToken },
      });
      if (data.success) {
        setProfileData(data.profileData);
      } else {
        toast.error(data.message);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An error occurred";
      toast.error(message);
    }
  }, [dToken, backendUrl]);

  const value: DoctorContextType = {
    dToken,
    setDToken,
    backendUrl,
    appointments,
    setAppointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
    dashData,
    setDashData,
    getDashData,
    profileData,
    setProfileData,
    getProfileData,
  };

  return <DoctorContext.Provider value={value}>{children}</DoctorContext.Provider>;
}
