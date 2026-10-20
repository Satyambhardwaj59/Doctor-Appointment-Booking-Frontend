"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DoctorContext } from "@/context/DoctorContext";
import PanelNavbar from "@/components/panel/PanelNavbar";
import PanelSidebar from "@/components/panel/PanelSidebar";
import DoctorIncomingCallModal from "@/components/panel/DoctorIncomingCallModal";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { dToken } = useContext(DoctorContext);
  const router = useRouter();

  useEffect(() => {
    if (!dToken) {
      router.push("/doctor/login");
    }
  }, [dToken, router]);

  if (!dToken) return null;

  return (
    <div className="bg-[#F8F9FD] min-h-screen">
      <DoctorIncomingCallModal />
      <PanelNavbar />
      <div className="flex items-start">
        <PanelSidebar role="doctor" />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
