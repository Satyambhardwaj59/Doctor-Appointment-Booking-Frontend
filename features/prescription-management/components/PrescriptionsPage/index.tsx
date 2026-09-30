'use client';

import React, { useContext, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppContext } from '../../../../context/AppContext';
import { useFamilyMembers } from '../../../family-accounts';
import { usePrescriptions } from '../../hooks/usePrescriptions';
import { useMedications } from '../../hooks/useMedications';
import PrescriptionList from '../PrescriptionList';
import MedicationSchedule from '../MedicationSchedule';
import MedicationHistory from '../MedicationHistory';
import type { Prescription, PrescriptionCredentials } from '../../types/prescription.types';

type Tab = 'prescriptions' | 'today' | 'history';

const PrescriptionsPage: React.FC = () => {
  const { token, doctors } = useContext(AppContext);
  const router = useRouter();

  const credentials: PrescriptionCredentials | null = useMemo(
    () => (token ? { token, role: 'patient' } : null),
    [token]
  );

  const { familyMembers } = useFamilyMembers({ enabled: !!token });
  const [familyMember, setFamilyMember] = useState('');
  const [tab, setTab] = useState<Tab>('prescriptions');

  const prescriptionsApi = usePrescriptions(credentials, familyMember);
  const medicationsApi = useMedications(credentials, familyMember);

  const resolveDoctorName = (doctorId: string) => doctors.find((d) => d._id === doctorId)?.name || 'Doctor';

  if (!token) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Please login to view your prescriptions.</p>
        <button
          onClick={() => router.push('/login')}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700"
        >
          Login
        </button>
      </div>
    );
  }

  const handleSelectPrescription = (prescription: Prescription) => {
    router.push(`/prescriptions/${prescription._id}`);
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prescriptions & Medications</h1>
          <p className="text-sm text-gray-500 mt-1">Your prescriptions, active medications and history.</p>
        </div>

        {familyMembers.length > 0 && (
          <select
            value={familyMember}
            onChange={(e) => setFamilyMember(e.target.value)}
            className="bg-gray-100 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shrink-0"
          >
            <option value="">Me</option>
            {familyMembers.map((member) => (
              <option key={member._id} value={member._id}>
                {member.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="flex gap-2 mb-5 border-b border-gray-200">
        {([
          { key: 'prescriptions', label: 'Prescriptions' },
          { key: 'today', label: "Today's Medications" },
          { key: 'history', label: 'Medication History' },
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

      {tab === 'prescriptions' && (
        <PrescriptionList
          prescriptions={prescriptionsApi.prescriptions}
          status={prescriptionsApi.status}
          onStatusChange={prescriptionsApi.setStatus}
          loading={prescriptionsApi.loading}
          error={prescriptionsApi.error}
          resolveDoctorName={resolveDoctorName}
          onSelect={handleSelectPrescription}
          page={prescriptionsApi.page}
          totalPages={prescriptionsApi.totalPages}
          onPageChange={prescriptionsApi.setPage}
        />
      )}

      {tab === 'today' && (
        <MedicationSchedule
          entries={medicationsApi.today}
          nextDose={medicationsApi.nextDose}
          loading={medicationsApi.todayLoading}
          error={medicationsApi.todayError}
          updatingId={medicationsApi.updatingId}
          onMark={medicationsApi.markStatus}
        />
      )}

      {tab === 'history' && (
        <MedicationHistory
          entries={medicationsApi.history}
          loading={medicationsApi.historyLoading}
          error={medicationsApi.historyError}
          status={medicationsApi.historyStatus}
          onStatusChange={medicationsApi.setHistoryStatus}
          page={medicationsApi.historyPage}
          totalPages={medicationsApi.historyTotalPages}
          onPageChange={medicationsApi.setHistoryPage}
        />
      )}
    </div>
  );
};

export default PrescriptionsPage;
