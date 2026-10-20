import type { Metadata } from "next";
import AdminDoctorLogin from "@/components/panel/AdminDoctorLogin";

export const metadata: Metadata = {
  title: "Doctor Login | Docify",
  description: "Sign in to the Docify Doctor portal",
};

export default function DoctorLoginPage() {
  return <AdminDoctorLogin initialRole="Doctor" />;
}
