import React from 'react';
import { recordTypeIcon, recordTypeLabel, formatRecordDate } from '../../../digital-medical-records';
import SectionCard from '../SectionCard';
import type { RecordSummary } from '../../types/patientDashboard.types';

interface MedicalRecordsSummaryProps {
  records: RecordSummary[];
  error?: string;
  onOpenRecord: (id: string) => void;
  onViewAll: () => void;
}

const MedicalRecordsSummary: React.FC<MedicalRecordsSummaryProps> = ({ records, error, onOpenRecord, onViewAll }) => (
  <SectionCard title="Recent Medical Records" icon="📄" actionLabel="View all" onAction={onViewAll} error={error}>
    {records.length === 0 ? (
      <p className="text-xs text-gray-400 bg-gray-50 rounded-xl px-3 py-6 text-center">No medical records yet.</p>
    ) : (
      <ul className="space-y-2">
        {records.map((record) => (
          <li key={record._id}>
            <button
              onClick={() => onOpenRecord(record._id)}
              className="w-full flex items-center gap-3 text-left rounded-xl px-2 py-2 hover:bg-gray-50"
            >
              <span className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-lg shrink-0" aria-hidden="true">
                {recordTypeIcon(record.recordType)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-gray-900 truncate">{record.title}</span>
                <span className="block text-[11px] text-gray-400 truncate">
                  {recordTypeLabel(record.recordType)} · {record.doctor.name} · {formatRecordDate(record.recordDate)}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    )}
  </SectionCard>
);

export default MedicalRecordsSummary;
