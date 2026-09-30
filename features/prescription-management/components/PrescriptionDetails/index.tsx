'use client';

import React, { useContext, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AppContext } from '../../../../context/AppContext';
import { usePrescription } from '../../hooks/usePrescription';
import MedicineList from '../MedicineList';
import {
  formatDate,
  getUserIdFromToken,
  prescriptionStatusStyle,
  titleCase,
} from '../../utils/prescription.utils';
import type { PrescriptionCredentials } from '../../types/prescription.types';

interface PrescriptionDetailsProps {
  prescriptionId: string;
}

const PrescriptionDetails: React.FC<PrescriptionDetailsProps> = ({ prescriptionId }) => {
  const { token, doctors } = useContext(AppContext);
  const router = useRouter();

  const credentials: PrescriptionCredentials | null = useMemo(
    () => (token ? { token, role: 'patient' } : null),
    [token]
  );

  const { prescription, loading, error, update } = usePrescription(credentials, prescriptionId);

  if (!token) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Please login to view this prescription.</p>
        <button
          onClick={() => router.push('/login')}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700"
        >
          Login
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !prescription) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-gray-500">{error || 'Prescription not found'}</p>
        <button onClick={() => router.push('/prescriptions')} className="mt-3 text-indigo-600 text-sm hover:underline">
          Back to prescriptions
        </button>
      </div>
    );
  }

  const doctorName = doctors.find((d) => d._id === prescription.doctorId)?.name || 'Doctor';

  // Every current viewer here is a patient (no doctor panel exists yet), so
  // this is always false in this app today. It's written as a real
  // ownership check — not hardcoded to false — so the same component works
  // unchanged once a doctor session supplies doctor credentials.
  const currentUserId = credentials ? getUserIdFromToken(credentials.token) : null;
  const canEdit = credentials?.role === 'doctor' && prescription.doctorId === currentUserId;

  return (
    <div className="max-w-3xl mx-auto py-6">
      <button onClick={() => router.push('/prescriptions')} className="text-sm text-gray-500 hover:text-gray-800 mb-4">
        ← Back to prescriptions
      </button>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400">{formatDate(prescription.prescriptionDate)}</p>
            <h1 className="text-xl font-bold text-gray-900">{doctorName}</h1>
            {prescription.diagnosis && (
              <p className="text-sm text-gray-600 mt-1">Diagnosis: {prescription.diagnosis}</p>
            )}
          </div>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full shrink-0 ${prescriptionStatusStyle(
              prescription.status
            )}`}
          >
            {titleCase(prescription.status)}
          </span>
        </div>

        <div className="mt-5">
          <p className="text-xs text-gray-400 mb-2">Medicines</p>
          <MedicineList medicines={prescription.medicines} />
        </div>

        {prescription.instructions && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <p className="text-xs text-gray-400 mb-1">Instructions</p>
            <p className="text-sm text-gray-700">{prescription.instructions}</p>
          </div>
        )}

        {prescription.doctorNotes && (
          <div className="mt-3">
            <p className="text-xs text-gray-400 mb-1">Doctor Notes</p>
            <p className="text-sm text-gray-700">{prescription.doctorNotes}</p>
          </div>
        )}

        {prescription.validUntil && (
          <p className="text-xs text-gray-400 mt-4">Valid until {formatDate(prescription.validUntil)}</p>
        )}

        {prescription.attachments.length > 0 && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <p className="text-xs text-gray-400 mb-2">Attachments</p>
            <div className="space-y-2">
              {prescription.attachments.map((attachment) => (
                <a
                  key={attachment._id}
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 rounded-xl px-3 py-2"
                >
                  <span className="text-xl">📄</span>
                  <span className="text-sm text-gray-800 truncate">{attachment.fileName}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {canEdit && prescription.status === 'ACTIVE' && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
            <button
              onClick={() => update({ status: 'COMPLETED' })}
              className="px-4 py-2 rounded-full text-sm bg-gray-900 text-white hover:bg-gray-800"
            >
              Mark Completed
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionDetails;
