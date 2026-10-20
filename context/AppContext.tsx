'use client'

import React, { createContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContextType, Doctor, UserData } from "../types";

export const AppContext = createContext<AppContextType>({} as AppContextType);

interface AppContextProviderProps {
  children: ReactNode;
}

const months = [" ", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  const currencySymbol = "$";
  const currency = "$";
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [token, setToken] = useState<string | false>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token") || false;
    }
    return false;
  });
  const [userData, setUserData] = useState<UserData | false>(false);

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Failed to fetch doctors";
      toast.error(message);
    }
  };

  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
        headers: { token: token as string },
      });
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Failed to load profile";
      toast.error(message);
    }
  };

  const calculateAge = (dob: string): number => {
    const today = new Date();
    const birthDate = new Date(dob);
    return today.getFullYear() - birthDate.getFullYear();
  };

  const slotDateFormat = (slotDate: string): string => {
    const dateArray = slotDate.split("_");
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2];
  };

  const value: AppContextType = {
    doctors,
    getDoctorsData,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData,
    calculateAge,
    slotDateFormat,
    currency,
  };

  useEffect(() => {
    getDoctorsData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(false);
    }
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
};

export default AppContextProvider;
