import React from 'react';
import { formatDate, prescriptionStatusStyle, titleCase } from '../../../prescription-management';
import SectionCard from '../SectionCard';
import type { PrescriptionItem } from '../../types/patientDashboard.types';

interface PrescriptionSummaryProps {
  items: PrescriptionItem[];
  activeCount: number;
  error?: string;
  onOpen: (id: string) => void;
  onViewAll: () => void;
}

const PrescriptionSummary: React.FC<PrescriptionSummaryProps> = ({ items, activeCount, error, onOpen, onViewAll }) => (
  <SectionCard
    title="Prescriptions"
    icon="📝"
    actionLabel="View all"
    onAction={onViewAll}
    error={error}
    badge={
      activeCount > 0 ? (
        <span className="text-[11px] font-medium text-green-700 bg-green-50 rounded-full px-2 py-0.5">
          {activeCount} active
        </span>
      ) : undefined
    }
  >
    {items.length === 0 ? (
      <p className="text-xs text-gray-400 bg-gray-50 rounded-xl px-3 py-6 text-center">No prescriptions yet.</p>
    ) : (
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item._id}>
            <button
              onClick={() => onOpen(item._id)}
              className="w-full flex items-center justify-between gap-3 text-left rounded-xl px-2 py-2 hover:bg-gray-50"
            >
              <span className="min-w-0">
                <span className="block text-sm font-medium text-gray-900 truncate">{item.doctor.name}</span>
                <span className="block text-[11px] text-gray-400">
                  {formatDate(item.prescriptionDate)} · {item.medicineCount} medicine{item.medicineCount === 1 ? '' : 's'}
                </span>
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${prescriptionStatusStyle(item.status)}`}>
                {titleCase(item.status)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    )}
  </SectionCard>
);

export default PrescriptionSummary;
