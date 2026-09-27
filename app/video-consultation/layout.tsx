'use client';

import React from 'react';
import { VideoConsultationProvider } from '../../features/video-consultation/store/videoConsultation.store';

export default function VideoConsultationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <VideoConsultationProvider>
      <div className="w-full min-h-[calc(100vh-140px)] flex flex-col">
        {children}
      </div>
    </VideoConsultationProvider>
  );
}
