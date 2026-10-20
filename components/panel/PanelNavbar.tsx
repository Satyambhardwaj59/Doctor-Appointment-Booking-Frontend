"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AdminContext } from "@/context/AdminContext";
import { DoctorContext } from "@/context/DoctorContext";
import { assets } from "@/lib/assets";
import { NotificationBell } from "@/features/notification-center";

export default function PanelNavbar() {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);
  const router = useRouter();

  const role = aToken ? "Admin" : dToken ? "Doctor" : null;

  const logout = () => {
    if (aToken) {
      setAToken("");
      localStorage.removeItem("aToken");
      router.push("/admin/login");
    } else if (dToken) {
      setDToken("");
      localStorage.removeItem("dToken");
      router.push("/doctor/login");
    }
  };

  if (!role) return null;

  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white sticky top-0 z-30">
      <div className="flex items-center gap-2 text-xs">
        <Image
          className="w-36 sm:w-40 cursor-pointer"
          src={assets.logo_one}
          alt="Docify Logo"
          width={160}
          height={40}
          priority
          onClick={() => router.push(aToken ? "/admin/dashboard" : "/doctor/dashboard")}
        />
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600 font-medium">
          {role}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {dToken && (
          <NotificationBell credentials={{ token: dToken, role: "doctor" }} />
        )}
        <button
          onClick={logout}
          className="bg-indigo-600 text-white text-sm px-8 py-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors shadow-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
