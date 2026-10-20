"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { assets } from "@/lib/assets";

interface SidebarLinkProps {
  href: string;
  icon: string;
  label: string;
}

function SidebarLink({ href, icon, label }: SidebarLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      className={`flex items-center gap-3 px-3 py-3.5 md:px-9 md:min-w-60 cursor-pointer transition-colors ${
        isActive
          ? "bg-[#F2F3FF] border-r-4 border-indigo-600 text-indigo-700 font-medium"
          : "hover:bg-gray-50 text-[#515151]"
      }`}
      href={href}
    >
      <Image src={icon} alt="" width={20} height={20} />
      <p className="hidden md:block text-sm">{label}</p>
    </Link>
  );
}

const ADMIN_LINKS = [
  { href: "/admin/dashboard", icon: assets.home_icon, label: "Dashboard" },
  { href: "/admin/appointments", icon: assets.appointment_icon, label: "Appointments" },
  { href: "/admin/add-doctor", icon: assets.add_icon, label: "Add Doctor" },
  { href: "/admin/doctors", icon: assets.people_icon, label: "Doctors List" },
];

const DOCTOR_LINKS = [
  { href: "/doctor/dashboard", icon: assets.home_icon, label: "Dashboard" },
  { href: "/doctor/appointments", icon: assets.appointment_icon, label: "Appointments" },
  { href: "/doctor/messages", icon: assets.patient_icon, label: "Messages" },
  { href: "/doctor/queue", icon: assets.list_icon, label: "Live Queue" },
  { href: "/doctor/prescriptions", icon: assets.add_icon, label: "Prescriptions" },
  { href: "/doctor/profile", icon: assets.people_icon, label: "Profile" },
];

interface PanelSidebarProps {
  role: "admin" | "doctor";
}

export default function PanelSidebar({ role }: PanelSidebarProps) {
  const links = role === "admin" ? ADMIN_LINKS : DOCTOR_LINKS;

  return (
    <div className="min-h-screen bg-white border-r w-14 md:w-64 shrink-0">
      <ul className="text-[#515151] mt-5">
        {links.map((link) => (
          <li key={link.href}>
            <SidebarLink href={link.href} icon={link.icon} label={link.label} />
          </li>
        ))}
      </ul>
    </div>
  );
}
