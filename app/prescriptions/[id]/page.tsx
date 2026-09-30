import type { Metadata } from 'next';
import { PrescriptionDetails } from '../../../features/prescription-management';

export const metadata: Metadata = {
  title: 'Prescription | Docify',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function PrescriptionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PrescriptionDetails prescriptionId={id} />;
}
