import type { Metadata } from 'next';
import MyAppointmentsClient from '../../components/MyAppointmentsClient';

export const metadata: Metadata = {
  title: 'My Appointments | Docify',
  description: 'View and manage your upcoming and past doctor appointments, pay online, or cancel bookings.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function MyAppointmentsPage() {
  return <MyAppointmentsClient />;
}
