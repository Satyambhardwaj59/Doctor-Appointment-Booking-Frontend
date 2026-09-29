import React from 'react';
import type { MedicalRecord } from '../../types/medicalRecords.types';
import { groupRecordsByMonth } from '../../utils/medicalRecords.utils';
import MedicalRecordCard from '../MedicalRecordCard';
import MedicalRecordSkeleton from '../MedicalRecordSkeleton';

interface MedicalRecordTimelineProps {
  records: MedicalRecord[];
  loading: boolean;
  resolveDoctorName: (doctorId: string) => string;
  onSelectRecord?: (record: MedicalRecord) => void;
  onRestore?: (recordId: string) => void;
  canRestoreRecord?: (record: MedicalRecord) => boolean;
  restoringRecordId?: string | null;
  archived?: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const MedicalRecordTimeline: React.FC<MedicalRecordTimelineProps> = ({
  records,
  loading,
  resolveDoctorName,
  onSelectRecord,
  onRestore,
  canRestoreRecord,
  restoringRecordId,
  archived = false,
  page,
  totalPages,
  onPageChange,
}) => {
  if (loading) {
    return <MedicalRecordSkeleton />;
  }

  if (records.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
        <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-indigo-50 flex items-center justify-center text-2xl">
          📋
        </div>
        <h3 className="text-base font-semibold text-gray-800">
          {archived ? 'No archived records' : 'No records found'}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {archived ? 'Records you archive will appear here.' : 'Try adjusting your filters or search.'}
        </p>
      </div>
    );
  }

  const groups = groupRecordsByMonth(records);

  return (
    <div>
      {groups.map((group) => (
        <div key={group.monthLabel} className="mb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-1">
            {group.monthLabel}
          </h3>
          <div className="space-y-3">
            {group.records.map((record) => (
              <div key={record._id} className={onRestore ? 'flex flex-col sm:flex-row gap-2' : ''}>
                <div className={onRestore ? 'min-w-0 flex-1' : undefined}>
                  <MedicalRecordCard
                    record={record}
                    doctorName={resolveDoctorName(record.doctorId)}
                    onClick={onSelectRecord ? () => onSelectRecord(record) : undefined}
                  />
                </div>
                {onRestore && (!canRestoreRecord || canRestoreRecord(record)) && (
                  <button
                    onClick={() => onRestore(record._id)}
                    disabled={restoringRecordId === record._id}
                    className="shrink-0 rounded-lg border border-emerald-700 px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-50 disabled:opacity-50 sm:self-center"
                  >
                    {restoringRecordId === record._id ? 'Restoring...' : 'Restore'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="px-3 py-1.5 text-sm rounded-full border border-gray-300 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs text-gray-500">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-1.5 text-sm rounded-full border border-gray-300 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MedicalRecordTimeline;
