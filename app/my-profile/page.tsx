import type { Metadata } from 'next';
import MyProfileClient from '../../components/MyProfileClient';

export const metadata: Metadata = {
  title: 'My Profile | Docify',
  description: 'Manage your personal details, contact information, and medical profile on Docify.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function MyProfilePage() {
  return <MyProfileClient />;
}
