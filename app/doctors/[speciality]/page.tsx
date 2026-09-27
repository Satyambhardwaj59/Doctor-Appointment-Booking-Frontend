import type { Metadata } from 'next';
import DoctorsView from '../../../components/DoctorsView';

interface Props {
  params: Promise<{ speciality: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { speciality } = await params;
  const decoded = decodeURIComponent(speciality);
  return {
    title: `${decoded} Doctors | Find Top Specialists`,
    description: `Book an appointment with top ${decoded} doctors. Check availability, doctor fees, and verified reviews on Docify.`,
    alternates: {
      canonical: `/doctors/${encodeURIComponent(speciality)}`,
    },
  };
}

export default async function SpecialityDoctorsPage({ params }: Props) {
  const { speciality } = await params;
  return <DoctorsView speciality={speciality} />;
}
