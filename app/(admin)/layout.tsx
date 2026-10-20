"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminContext } from "@/context/AdminContext";
import PanelNavbar from "@/components/panel/PanelNavbar";
import PanelSidebar from "@/components/panel/PanelSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { aToken } = useContext(AdminContext);
  const router = useRouter();

  useEffect(() => {
    if (!aToken) {
      router.push("/admin/login");
    }
  }, [aToken, router]);

  if (!aToken) return null;

  return (
    <div className="bg-[#F8F9FD] min-h-screen">
      <PanelNavbar />
      <div className="flex items-start">
        <PanelSidebar role="admin" />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
