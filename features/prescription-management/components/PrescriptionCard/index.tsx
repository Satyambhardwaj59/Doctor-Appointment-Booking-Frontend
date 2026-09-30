import React from 'react';
import type { Prescription } from '../../types/prescription.types';
import { formatDate, prescriptionStatusStyle, titleCase } from '../../utils/prescription.utils';

interface PrescriptionCardProps {
  prescription: Prescription;
  doctorName: string;
  onClick: () => void;
}

const MAX_NAMES_SHOWN = 3;

const PrescriptionCard: React.FC<PrescriptionCardProps> = ({ prescription, doctorName, onClick }) => {
  const names = prescription.medicines.map((m) => m.name);
  const shown = names.slice(0, MAX_NAMES_SHOWN).join(', ');
  const extra = names.length - MAX_NAMES_SHOWN;

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md hover:border-indigo-200 transition-all"
    >
      <div className="flex items-center justify-between gap-2">
        <h4 className="font-semibold text-gray-900 text-sm truncate">{doctorName}</h4>
        <span
          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${prescriptionStatusStyle(
            prescription.status
          )}`}
        >
          {titleCase(prescription.status)}
        </span>
      </div>
      <p className="text-xs text-gray-400 mt-0.5">{formatDate(prescription.prescriptionDate)}</p>
      {prescription.diagnosis && (
        <p className="text-xs text-gray-600 mt-2 truncate">Diagnosis: {prescription.diagnosis}</p>
      )}
      <p className="text-xs text-indigo-600 mt-2 truncate">
        💊 {shown}
        {extra > 0 ? ` +${extra} more` : ''}
      </p>
    </button>
  );
};

export default PrescriptionCard;
