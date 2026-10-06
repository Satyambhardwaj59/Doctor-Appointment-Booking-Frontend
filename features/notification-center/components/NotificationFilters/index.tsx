import React from 'react';
import { NOTIFICATION_TYPES } from '../../types/notification.types';
import { notificationTypeLabel } from '../../utils/notification.utils';
import type { NotificationFilter } from '../../types/notification.types';

interface NotificationFiltersProps {
  filter: NotificationFilter;
  onChange: (filter: NotificationFilter) => void;
}

const NotificationFilters: React.FC<NotificationFiltersProps> = ({ filter, onChange }) => {
  const options: { value: NotificationFilter; label: string }[] = [
    { value: 'ALL', label: 'All' },
    { value: 'UNREAD', label: 'Unread' },
    ...NOTIFICATION_TYPES.map((type) => ({ value: type, label: notificationTypeLabel(type) })),
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            filter === option.value
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'border-gray-300 text-gray-600 hover:bg-gray-50'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default NotificationFilters;
