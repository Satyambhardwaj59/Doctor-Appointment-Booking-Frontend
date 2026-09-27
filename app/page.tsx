import type { Metadata } from 'next';
import Header from '../components/Header';
import SpecialityMenu from '../components/SpecialityMenu';
import TopDoctors from '../components/TopDoctors';
import Banner from '../components/Banner';

export const metadata: Metadata = {
  title: 'Book Appointments with Trusted Doctors',
  description: 'Easily find verified doctors, choose from top specialties, and book appointments online with Docify.',
  alternates: {
    canonical: '/',
  },
};

export default function Home() {
  return (
    <div>
      <Header />
      <SpecialityMenu />
      <TopDoctors />
      <Banner />
    </div>
  );
}
