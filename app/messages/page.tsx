import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ChatPage } from '../../features/doctor-patient-chat';

export const metadata: Metadata = {
  title: 'Messages | Docify',
  description: 'Message your doctors directly on Docify.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function MessagesPage() {
  return (
    <Suspense fallback={null}>
      <ChatPage />
    </Suspense>
  );
}
