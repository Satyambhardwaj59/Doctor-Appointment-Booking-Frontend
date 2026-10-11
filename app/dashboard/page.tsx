import type { Metadata } from 'next';
import { Dashboard } from '../../features/patient-health-dashboard';

export const metadata: Metadata = {
  title: 'Health Dashboard | Docify',
  description: 'Your appointments, live queue, medications, records and notifications in one place.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardPage() {
  return <Dashboard />;
}
