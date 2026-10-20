"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createConsultation } from "@/features/video-consultation/services/videoConsultation.service";

function VideoConsultationDispatcher() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!appointmentId) {
      router.push("/video-consultation/history");
      return;
    }

    const initConsultation = async () => {
      try {
        const res = await createConsultation(appointmentId);
        if (res.success && res.consultation) {
          const dToken =
            typeof window !== "undefined"
              ? localStorage.getItem("dToken") || localStorage.getItem("dtoken")
              : null;
          const query = dToken ? `?dtoken=${encodeURIComponent(dToken)}` : "";
          router.push(`/video-consultation/${res.consultation._id}/waiting-room${query}`);
        } else {
          setError(res.message || "Failed to start consultation session");
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Error initializing consultation";
        setError(msg);
      }
    };

    initConsultation();
  }, [appointmentId, router]);

  if (error) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white border border-gray-200 rounded-2xl shadow-sm text-center">
        <h2 className="text-lg font-bold text-gray-800 mb-2">Unable to Start Consultation</h2>
        <p className="text-sm text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-full"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-600 font-medium">Connecting to consultation chamber...</p>
    </div>
  );
}

export default function VideoConsultationRootPage() {
  return (
    <Suspense fallback={null}>
      <VideoConsultationDispatcher />
    </Suspense>
  );
}
