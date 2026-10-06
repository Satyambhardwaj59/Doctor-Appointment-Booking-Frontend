import type { Metadata } from 'next';
import { QueueStatus } from '../../features/smart-live-queue';

export const metadata: Metadata = {
  title: 'Live Queue | Docify',
  description: 'Track your place in the doctor\'s queue in real time on Docify.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function QueuePage() {
  return <QueueStatus />;
}
