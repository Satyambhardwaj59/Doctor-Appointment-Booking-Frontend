import React from 'react';
import type { MedicalRecord } from '../../types/medicalRecords.types';
import { recordTypeIcon, recordTypeLabel, formatRecordDate } from '../../utils/medicalRecords.utils';

interface MedicalRecordCardProps {
  record: MedicalRecord;
  doctorName: string;
  onClick?: () => void;
}

const MedicalRecordCard: React.FC<MedicalRecordCardProps> = ({ record, doctorName, onClick }) => {
  const content = (
    <>
    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-2xl shrink-0">
      {recordTypeIcon(record.recordType)}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2">
        <h4 className="font-semibold text-gray-900 text-sm truncate">{record.title}</h4>
        <span className="text-xs text-gray-400 shrink-0">{formatRecordDate(record.recordDate)}</span>
      </div>
      <p className="text-xs text-indigo-600 font-medium mt-0.5">{recordTypeLabel(record.recordType)}</p>
      <p className="text-xs text-gray-500 mt-1 truncate">{doctorName}</p>
      {record.attachments.length > 0 && (
        <p className="text-xs text-gray-400 mt-1">
          📎 {record.attachments.length} attachment{record.attachments.length > 1 ? 's' : ''}
        </p>
      )}
    </div>
    </>
  );

  const className = 'w-full flex items-start gap-4 bg-white border border-gray-200 rounded-2xl p-4 text-left hover:shadow-md hover:border-indigo-200 transition-all';

  return onClick ? (
    <button onClick={onClick} className={className}>
      {content}
    </button>
  ) : (
    <div className={className}>{content}</div>
  );
};

export default MedicalRecordCard;
