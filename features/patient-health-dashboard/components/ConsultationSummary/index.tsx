import React from 'react';
import SectionCard from '../SectionCard';
import { formatSlotDate } from '../../utils/patientDashboard.utils';
import type { ConsultationItem } from '../../types/patientDashboard.types';

interface ConsultationSummaryProps {
  consultations: ConsultationItem[];
  error?: string;
  onOpenRecord: (id: string) => void;
  onViewAll: () => void;
}

const ConsultationSummary: React.FC<ConsultationSummaryProps> = ({ consultations, error, onOpenRecord, onViewAll }) => (
  <SectionCard title="Recent Consultations" icon="🩺" actionLabel="Appointments" onAction={onViewAll} error={error}>
    {consultations.length === 0 ? (
      <p className="text-xs text-gray-400 bg-gray-50 rounded-xl px-3 py-6 text-center">No completed consultations yet.</p>
    ) : (
      <ul className="space-y-3">
        {consultations.map((consultation) => (
          <li key={consultation.appointmentId} className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{consultation.doctor.name}</p>
              <p className="text-[11px] text-gray-400">
                {formatSlotDate(consultation.slotDate)} · {consultation.slotTime}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">Completed</span>
              {consultation.relatedRecordIds.length > 0 && (
                <button
                  onClick={() => onOpenRecord(consultation.relatedRecordIds[0])}
                  className="text-[11px] text-indigo-600 hover:underline"
                >
                  {consultation.relatedRecordIds.length > 1
                    ? `${consultation.relatedRecordIds.length} records`
                    : 'View record'}
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    )}
  </SectionCard>
);

export default ConsultationSummary;
