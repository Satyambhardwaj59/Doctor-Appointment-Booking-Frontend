import type { Metadata } from 'next';
import DoctorsView from '../../components/DoctorsView';

export const metadata: Metadata = {
  title: 'All Doctors | Browse by Specialty',
  description: 'Explore our complete list of certified doctors and healthcare specialists. Filter by General physician, Gynecologist, Dermatologist, and more.',
  alternates: {
    canonical: '/doctors',
  },
};

export default function DoctorsPage() {
  return <DoctorsView />;
}
