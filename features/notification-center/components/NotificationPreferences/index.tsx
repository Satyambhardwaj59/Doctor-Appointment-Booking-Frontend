'use client';

import React from 'react';
import { PREFERENCE_CATEGORIES } from '../../types/notification.types';
import type { NotificationPreferences as Preferences } from '../../types/notification.types';

interface NotificationPreferencesProps {
  preferences: Preferences | null;
  loading: boolean;
  onToggle: (category: keyof Preferences, value: boolean) => void;
}

const CATEGORY_LABELS: Record<keyof Preferences, string> = {
  appointments: 'Appointments',
  consultations: 'Consultations',
  prescriptions: 'Prescriptions',
  medications: 'Medications',
  chat: 'Chat Messages',
  medicalRecords: 'Medical Records',
  family: 'Family Account Activity',
};

const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({ preferences, loading, onToggle }) => {
  if (loading || !preferences) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {PREFERENCE_CATEGORIES.map((category) => (
        <div
          key={category}
          className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl"
        >
          <span className="text-sm text-gray-700">{CATEGORY_LABELS[category]}</span>
          <button
            onClick={() => onToggle(category, !preferences[category])}
            role="switch"
            aria-checked={preferences[category]}
            className={`w-10 h-6 rounded-full relative transition-colors ${
              preferences[category] ? 'bg-indigo-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                preferences[category] ? 'translate-x-4' : ''
              }`}
            />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationPreferences;
