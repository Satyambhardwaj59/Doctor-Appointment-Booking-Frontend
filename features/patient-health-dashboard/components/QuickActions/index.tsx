import React from 'react';
import Link from 'next/link';
import SectionCard from '../SectionCard';

// Links to features that already exist; nothing is rebuilt here.
const ACTIONS: { label: string; href: string; icon: string }[] = [
  { label: 'Book Appointment', href: '/doctors', icon: '➕' },
  { label: 'View Appointments', href: '/my-appointments', icon: '📅' },
  { label: 'Medical Records', href: '/medical-records', icon: '📄' },
  { label: 'Prescriptions', href: '/prescriptions', icon: '📝' },
  { label: 'Medications', href: '/prescriptions', icon: '💊' },
  { label: 'Doctor Chat', href: '/messages', icon: '💬' },
  { label: 'Notifications', href: '/notifications', icon: '🔔' },
];

const QuickActions: React.FC<{ className?: string }> = ({ className }) => (
  <SectionCard title="Quick Actions" icon="⚡" className={className}>
    <nav aria-label="Quick actions" className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {ACTIONS.map((action) => (
        <Link
          key={action.label}
          href={action.href}
          className="flex flex-col items-center justify-center gap-1 rounded-xl border border-gray-200 px-2 py-3 text-center text-xs font-medium text-gray-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
        >
          <span className="text-lg" aria-hidden="true">{action.icon}</span>
          {action.label}
        </Link>
      ))}
    </nav>
  </SectionCard>
);

export default QuickActions;
