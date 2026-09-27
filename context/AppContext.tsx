'use client'

import React, { createContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContextType, Doctor, UserData } from "../types";

export const AppContext = createContext<AppContextType>({} as AppContextType);

interface AppContextProviderProps {
  children: ReactNode;
}

const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  const currencySymbol = "$";
  // const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://doctor-appointment-booking-backend-92ui.onrender.com";
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4001";

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
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to fetch doctors");
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
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to load profile");
    }
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
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(false);
    }
  }, [token]);

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
};

export default AppContextProvider;
