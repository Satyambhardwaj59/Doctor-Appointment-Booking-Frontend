import type { Metadata } from 'next';
import LoginClient from '../../components/LoginClient';

export const metadata: Metadata = {
  title: 'Login or Sign Up',
  description: 'Log in to your Docify account or register as a new user to book doctor appointments, track medical history, and manage healthcare bookings.',
  alternates: {
    canonical: '/login',
  },
};

export default function LoginPage() {
  return <LoginClient />;
}
