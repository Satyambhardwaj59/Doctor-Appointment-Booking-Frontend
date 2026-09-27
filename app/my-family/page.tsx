import type { Metadata } from 'next';
import { FamilyAccountsPage } from '../../features/family-accounts';

export const metadata: Metadata = {
  title: 'My Family | Docify',
  description: 'Manage your family members and book appointments on their behalf on Docify.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function MyFamilyPage() {
  return <FamilyAccountsPage />;
}
