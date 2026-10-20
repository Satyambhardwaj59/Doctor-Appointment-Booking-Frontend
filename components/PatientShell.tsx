"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import IncomingCallModal from "./IncomingCallModal";

// Routes that have their own layout (sidebar + navbar) — hide the patient shell
const NON_PATIENT_PREFIXES = ["/doctor", "/admin"];

export default function PatientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isNonPatient = NON_PATIENT_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isNonPatient) {
    // Doctor/Admin routes render their own layout via route group layouts
    return <>{children}</>;
  }

  return (
    <div className="mx-4 sm:mx-[10%]">
      <IncomingCallModal />
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
    </div>
  );
}
