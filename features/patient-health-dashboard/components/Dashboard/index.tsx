'use client';

import React, { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppContext } from '../../../../context/AppContext';
import { useFamilyMembers } from '../../../family-accounts';
import { notificationService, notificationTarget } from '../../../notification-center';
import type { AppNotification, NotificationType } from '../../../notification-center';
import { usePatientDashboard } from '../../hooks/usePatientDashboard';
import { greeting, relationshipText, initialsOf } from '../../utils/patientDashboard.utils';
import ProfileSwitcher from '../ProfileSwitcher';
import AppointmentSummary from '../AppointmentSummary';
import LiveQueueCard from '../LiveQueueCard';
import MedicationSummary from '../MedicationSummary';
import MedicalRecordsSummary from '../MedicalRecordsSummary';
import PrescriptionSummary from '../PrescriptionSummary';
import ConsultationSummary from '../ConsultationSummary';
import NotificationSummary from '../NotificationSummary';
import QuickActions from '../QuickActions';
import DashboardSkeleton from '../DashboardSkeleton';
import type { DashboardNotification } from '../../types/patientDashboard.types';

const Dashboard: React.FC = () => {
  const { token } = useContext(AppContext);
  const router = useRouter();

  const { familyMembers } = useFamilyMembers({ enabled: !!token });
  const [selectedId, setSelectedId] = useState('');
  // A profile that no longer exists falls back to the account holder.
  const profileId = familyMembers.some((member) => member._id === selectedId) ? selectedId : '';

  const { data, loading, error, refresh } = usePatientDashboard(token || null, profileId);

  if (!token) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Please login to view your health dashboard.</p>
        <button
          onClick={() => router.push('/login')}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700"
        >
          Login
        </button>
      </div>
    );
  }

  // Opening a notification marks it read (via the existing Notification
  // Center service) and goes to the feature it refers to.
  const openNotification = (item: DashboardNotification) => {
    notificationService.markNotificationRead({ token, role: 'patient' }, item._id).catch(() => {});
    const asNotification: AppNotification = {
      ...item,
      type: item.type as NotificationType,
      userId: '',
      recipientRole: 'patient',
      isRead: false,
      readAt: null,
      expiresAt: null,
    };
    router.push(notificationTarget(asNotification) || '/notifications');
  };

  const errors = data?.sectionErrors ?? {};
  const profile = data?.profile;
  const viewingFamily = !!profile?.isFamilyMember;

  return (
    <div className="max-w-5xl mx-auto py-6">
      <header className="mb-5">
        <div className="flex items-center gap-3">
          {profile?.image ? (
            <img src={profile.image} alt="" className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold" aria-hidden="true">
              {initialsOf(profile?.name || '')}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {viewingFamily ? `${profile?.name}'s Health` : `${greeting()}${profile?.name ? `, ${profile.name.split(' ')[0]}` : ''}`}
            </h1>
            <p className="text-sm text-gray-500">
              {viewingFamily
                ? `${relationshipText(profile?.relationship || '')} · viewing as a family member`
                : 'Your health at a glance'}
            </p>
          </div>
        </div>

        {familyMembers.length > 0 && (
          <div className="mt-4">
            <ProfileSwitcher familyMembers={familyMembers} selectedId={profileId} onChange={setSelectedId} />
          </div>
        )}
      </header>

      {error && !data ? (
        <div role="alert" className="text-center py-16 bg-white border border-gray-200 rounded-2xl">
          <p className="text-sm text-red-500">{error}</p>
          <div className="flex justify-center gap-3 mt-4">
            <button
              onClick={() => refresh()}
              className="px-4 py-2 rounded-full text-sm bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Try again
            </button>
            <button
              onClick={() => router.push('/login')}
              className="px-4 py-2 rounded-full text-sm border border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              Log in again
            </button>
          </div>
        </div>
      ) : loading || !data ? (
        <DashboardSkeleton />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 1 + 2: what matters right now */}
          <AppointmentSummary
            appointment={data.upcomingAppointment}
            upcomingCount={data.upcomingCount}
            error={errors.appointments}
            onView={() => router.push('/my-appointments')}
            onBook={() => router.push('/doctors')}
          />
          <LiveQueueCard queue={data.queueStatus} error={errors.queue} onOpen={() => router.push('/queue')} />

          {/* 3: medications */}
          <div className="lg:col-span-2">
            <MedicationSummary
              today={data.todayMedications}
              activeMedications={data.activeMedications}
              todayError={errors.medications}
              activeError={errors.prescriptions}
              onManage={() => router.push('/prescriptions')}
            />
          </div>

          {/* 4: records and prescriptions */}
          <MedicalRecordsSummary
            records={data.recentRecords}
            error={errors.records}
            onOpenRecord={(id) => router.push(`/medical-records/${id}`)}
            onViewAll={() => router.push('/medical-records')}
          />
          <PrescriptionSummary
            items={data.recentPrescriptions.items}
            activeCount={data.recentPrescriptions.activeCount}
            error={errors.prescriptions}
            onOpen={(id) => router.push(`/prescriptions/${id}`)}
            onViewAll={() => router.push('/prescriptions')}
          />

          {/* 5: consultations and notifications */}
          <ConsultationSummary
            consultations={data.recentConsultations}
            error={errors.consultations}
            onOpenRecord={(id) => router.push(`/medical-records/${id}`)}
            onViewAll={() => router.push('/my-appointments')}
          />
          <NotificationSummary
            unreadCount={data.unreadNotifications.unreadCount}
            items={data.unreadNotifications.items}
            error={errors.notifications}
            onOpen={openNotification}
            onViewAll={() => router.push('/notifications')}
          />

          {/* 6: quick actions */}
          <QuickActions className="lg:col-span-2" />
        </div>
      )}

      {viewingFamily && data && (
        <p className="text-[11px] text-gray-400 text-center mt-4">
          Notifications belong to your account, so they are the same for every profile.
        </p>
      )}
    </div>
  );
};

export default Dashboard;
