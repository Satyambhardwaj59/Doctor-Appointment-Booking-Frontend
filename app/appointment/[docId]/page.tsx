import type { Metadata } from 'next';
import AppointmentClient from '../../../components/AppointmentClient';

interface Props {
  params: Promise<{ docId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { docId } = await params;
  return {
    title: `Book Appointment with Doctor`,
    description: `Choose booking slots and schedule your medical appointment with verified doctors on Docify.`,
    alternates: {
      canonical: `/appointment/${docId}`,
    },
  };
}

export default async function AppointmentPage({ params }: Props) {
  const { docId } = await params;
  return <AppointmentClient docId={docId} />;
}
