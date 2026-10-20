import type { Metadata } from "next";
import AdminDoctorLogin from "@/components/panel/AdminDoctorLogin";

export const metadata: Metadata = {
  title: "Admin Login | Docify",
  description: "Sign in to the Docify administrative portal",
};

export default function AdminLoginPage() {
  return <AdminDoctorLogin initialRole="Admin" />;
}
