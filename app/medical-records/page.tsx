import type { Metadata } from 'next';
import { MedicalRecords } from '../../features/digital-medical-records';

export const metadata: Metadata = {
  title: 'Medical Records | Docify',
  description: 'View and manage your medical history, documents and reports on Docify.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function MedicalRecordsPage() {
  return <MedicalRecords />;
}
