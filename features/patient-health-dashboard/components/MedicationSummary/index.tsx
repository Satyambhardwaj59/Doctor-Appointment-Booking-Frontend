import React from 'react';
import { medicationStatusStyle, titleCase, formatTime } from '../../../prescription-management';
import SectionCard from '../SectionCard';
import type { ActiveMedication, TodayMedications } from '../../types/patientDashboard.types';

interface MedicationSummaryProps {
  today: TodayMedications;
  activeMedications: ActiveMedication[];
  todayError?: string;
  activeError?: string;
  onManage: () => void;
}

const MedicationSummary: React.FC<MedicationSummaryProps> = ({
  today,
  activeMedications,
  todayError,
  activeError,
  onManage,
}) => {
  const { summary } = today;
  const error = todayError && activeError ? todayError : undefined;

  return (
    <SectionCard
      title="Medications"
      icon="💊"
      actionLabel="Manage"
      onAction={onManage}
      error={error}
      badge={
        summary.total > 0 ? (
          <span className="text-[11px] font-medium text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
            {summary.taken}/{summary.total} taken
          </span>
        ) : undefined
      }
    >
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <h3 className="text-xs font-semibold text-gray-500 mb-2">Today&apos;s schedule</h3>
          {todayError ? (
            <p role="alert" className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{todayError}</p>
          ) : today.items.length === 0 ? (
            <p className="text-xs text-gray-400 bg-gray-50 rounded-xl px-3 py-4 text-center">
              Nothing scheduled for today.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {today.items.slice(0, 5).map((dose) => (
                <li key={dose._id} className="flex items-center justify-between gap-2 text-sm">
                  <span className="truncate text-gray-800">
                    <span className="text-gray-400 mr-2">{formatTime(dose.scheduledTime)}</span>
                    {dose.medicineName}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${medicationStatusStyle(dose.status)}`}>
                    {titleCase(dose.status)}
                  </span>
                </li>
              ))}
              {today.items.length > 5 && (
                <li className="text-[11px] text-gray-400">+{today.items.length - 5} more today</li>
              )}
            </ul>
          )}
          {today.nextDose && (
            <p className="text-[11px] text-indigo-600 mt-2">
              Next: {today.nextDose.medicineName} at {formatTime(today.nextDose.scheduledTime)}
            </p>
          )}
        </div>

        <div>
          <h3 className="text-xs font-semibold text-gray-500 mb-2">Active medications</h3>
          {activeError ? (
            <p role="alert" className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{activeError}</p>
          ) : activeMedications.length === 0 ? (
            <p className="text-xs text-gray-400 bg-gray-50 rounded-xl px-3 py-4 text-center">
              No active medications.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {activeMedications.map((medicine, index) => (
                <li key={`${medicine.prescriptionId}-${index}`} className="text-sm">
                  <span className="text-gray-800">{medicine.name}</span>
                  <span className="text-xs text-gray-400"> · {medicine.dosage} · {medicine.frequency}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </SectionCard>
  );
};

export default MedicationSummary;
