import type { Metadata } from 'next';
import { MedicalRecordDetails } from '../../../features/digital-medical-records';

export const metadata: Metadata = {
  title: 'Medical Record | Docify',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function MedicalRecordDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MedicalRecordDetails recordId={id} />;
}
