import type { Metadata } from 'next';
import { PrescriptionsPage } from '../../features/prescription-management';

export const metadata: Metadata = {
  title: 'Prescriptions & Medications | Docify',
  description: 'View your prescriptions, active medications and medication history on Docify.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PrescriptionsRoute() {
  return <PrescriptionsPage />;
}
