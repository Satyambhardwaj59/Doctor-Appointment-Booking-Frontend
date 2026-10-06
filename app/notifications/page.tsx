import type { Metadata } from 'next';
import { NotificationCenter } from '../../features/notification-center';

export const metadata: Metadata = {
  title: 'Notifications | Docify',
  description: 'View and manage your notifications on Docify.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotificationsPage() {
  return <NotificationCenter />;
}
