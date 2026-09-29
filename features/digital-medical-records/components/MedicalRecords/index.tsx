'use client';

import React, { useContext, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppContext } from '../../../../context/AppContext';
import { useFamilyMembers } from '../../../family-accounts';
import { useMedicalRecords } from '../../hooks/useMedicalRecords';
import { useRecordUpload } from '../../hooks/useRecordUpload';
import RecordSearch from '../RecordSearch';
import RecordFilters from '../RecordFilters';
import MedicalRecordTimeline from '../MedicalRecordTimeline';
import RecordUpload from '../RecordUpload';
import type { RecordCredentials } from '../../types/medicalRecords.types';
import { getUserIdFromToken } from '../../utils/medicalRecords.utils';

const MedicalRecords: React.FC = () => {
  const { token, doctors } = useContext(AppContext);
  const router = useRouter();

  const credentials: RecordCredentials | null = useMemo(
    () => (token ? { token, role: 'patient' } : null),
    [token]
  );
  const [archivedView, setArchivedView] = useState(false);
  const [restoringRecordId, setRestoringRecordId] = useState<string | null>(null);

  const { familyMembers } = useFamilyMembers({ enabled: !!token });
  const {
    records,
    filters,
    updateFilters,
    clearFilters,
    restore,
    page,
    setPage,
    totalPages,
    loading,
  } = useMedicalRecords(credentials, archivedView);
  const { submit, uploading } = useRecordUpload(credentials);

  const [showUpload, setShowUpload] = useState(false);

  const resolveDoctorName = (doctorId: string) => doctors.find((d) => d._id === doctorId)?.name || 'Doctor';

  const doctorOptions = doctors.map((d) => ({ id: d._id, name: d.name }));
  const familyMemberOptions = familyMembers.map((m) => ({ id: m._id, name: m.name }));
  const currentUserId = token ? getUserIdFromToken(token) : null;

  const handleRestore = async (recordId: string) => {
    setRestoringRecordId(recordId);
    await restore(recordId);
    setRestoringRecordId(null);
  };

  if (!token) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Please login to view your medical records.</p>
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
    <div className="max-w-4xl mx-auto py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
          <p className="text-sm text-gray-500 mt-1">
            {archivedView ? 'Records you have archived.' : 'Your medical history, documents and reports in one place.'}
          </p>
        </div>
          {!archivedView && (
            <button
              onClick={() => setShowUpload(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700 shrink-0"
            >
              + Add Record
            </button>
          )}
      </div>

        <div role="tablist" aria-label="Medical record status" className="flex border-b border-gray-200 mb-5">
          {[
            { archived: false, label: 'Active' },
            { archived: true, label: 'Archived' },
          ].map((tab) => (
            <button
              key={tab.label}
              type="button"
              role="tab"
              aria-selected={archivedView === tab.archived}
              onClick={() => {
                setArchivedView(tab.archived);
                setPage(1);
              }}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                archivedView === tab.archived
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <RecordSearch value={filters.search} onChange={(search) => updateFilters({ search })} />
      </div>
      <div className="mb-6">
        <RecordFilters
          filters={filters}
          onChange={updateFilters}
          onClear={clearFilters}
          doctorOptions={doctorOptions}
          familyMemberOptions={familyMemberOptions}
        />
      </div>

      <MedicalRecordTimeline
        records={records}
        loading={loading}
        resolveDoctorName={resolveDoctorName}
        onSelectRecord={archivedView ? undefined : (record) => router.push(`/medical-records/${record._id}`)}
        onRestore={archivedView ? handleRestore : undefined}
        canRestoreRecord={(record) =>
          record.createdByRole === 'patient' && record.createdById === currentUserId
        }
        restoringRecordId={restoringRecordId}
        archived={archivedView}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <RecordUpload
        open={showUpload}
        onClose={() => setShowUpload(false)}
        onSubmit={submit}
        uploading={uploading}
        doctorOptions={doctorOptions}
        familyMemberOptions={familyMemberOptions}
      />
    </div>
  );
};

export default MedicalRecords;
