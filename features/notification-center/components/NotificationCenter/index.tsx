'use client';

import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { AppContext } from '../../../../context/AppContext';
import { useNotifications } from '../../hooks/useNotifications';
import { getPreferences, updatePreferences } from '../../services/notification.service';
import { extractErrorMessage } from '../../utils/notification.utils';
import NotificationFilters from '../NotificationFilters';
import NotificationList from '../NotificationList';
import NotificationPreferences from '../NotificationPreferences';
import type { NotificationCredentials, NotificationPreferences as Preferences } from '../../types/notification.types';

type Tab = 'notifications' | 'preferences';

const NotificationCenter: React.FC = () => {
  const { token } = useContext(AppContext);
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('notifications');

  const credentials: NotificationCredentials | null = useMemo(
    () => (token ? { token, role: 'patient' } : null),
    [token]
  );

  const {
    notifications,
    unreadCount,
    filter,
    setFilter,
    page,
    setPage,
    totalPages,
    loading,
    error,
    markRead,
    markAllRead,
    remove,
  } = useNotifications(credentials);

  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [preferencesLoading, setPreferencesLoading] = useState(true);

  useEffect(() => {
    if (!credentials || tab !== 'preferences') return;

    let cancelled = false;
    setPreferencesLoading(true);
    getPreferences(credentials)
      .then((data) => {
        if (!cancelled && data.success) setPreferences(data.preferences || null);
      })
      .finally(() => {
        if (!cancelled) setPreferencesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [credentials, tab]);

  const handleToggle = async (category: keyof Preferences, value: boolean) => {
    if (!credentials || !preferences) return;

    const optimistic = { ...preferences, [category]: value };
    setPreferences(optimistic);

    try {
      const data = await updatePreferences(credentials, { [category]: value });
      if (data.success) {
        setPreferences(data.preferences || optimistic);
      } else {
        setPreferences(preferences);
        toast.error(data.message || 'Could not update preference');
      }
    } catch (err: unknown) {
      setPreferences(preferences);
      toast.error(extractErrorMessage(err, 'Could not update preference'));
    }
  };

  if (!token) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Please login to view your notifications.</p>
        <button
          onClick={() => router.push('/login')}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        {unreadCount > 0 && tab === 'notifications' && (
          <button onClick={markAllRead} className="text-sm text-indigo-600 hover:underline">
            Mark all read
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-5 border-b border-gray-200">
        {([
          { key: 'notifications', label: 'All Notifications' },
          { key: 'preferences', label: 'Preferences' },
        ] as { key: Tab; label: string }[]).map((item) => (
          <button
            key={item.key}
            onClick={() => setTab(item.key)}
            className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === item.key ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'notifications' ? (
        <>
          <div className="mb-4">
            <NotificationFilters filter={filter} onChange={setFilter} />
          </div>
          <NotificationList
            notifications={notifications}
            loading={loading}
            error={error}
            onNavigate={router.push}
            onMarkRead={markRead}
            onDelete={remove}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      ) : (
        <NotificationPreferences preferences={preferences} loading={preferencesLoading} onToggle={handleToggle} />
      )}
    </div>
  );
};

export default NotificationCenter;
