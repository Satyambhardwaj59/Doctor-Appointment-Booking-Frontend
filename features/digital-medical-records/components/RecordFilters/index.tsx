import React from 'react';
import { RECORD_TYPES } from '../../types/medicalRecords.types';
import { recordTypeLabel } from '../../utils/medicalRecords.utils';
import type { RecordFiltersState } from '../../types/medicalRecords.types';

interface Option {
  id: string;
  name: string;
}

interface RecordFiltersProps {
  filters: RecordFiltersState;
  onChange: (next: Partial<RecordFiltersState>) => void;
  onClear: () => void;
  doctorOptions: Option[];
  familyMemberOptions: Option[];
}

const selectClass =
  'bg-gray-100 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500';

const RecordFilters: React.FC<RecordFiltersProps> = ({
  filters,
  onChange,
  onClear,
  doctorOptions,
  familyMemberOptions,
}) => {
  const hasActiveFilters =
    filters.type || filters.doctor || filters.familyMember || filters.dateFrom || filters.dateTo;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={filters.type}
        onChange={(e) => onChange({ type: e.target.value as RecordFiltersState['type'] })}
        className={selectClass}
      >
        <option value="">All types</option>
        {RECORD_TYPES.map((type) => (
          <option key={type} value={type}>
            {recordTypeLabel(type)}
          </option>
        ))}
      </select>

      {doctorOptions.length > 0 && (
        <select
          value={filters.doctor}
          onChange={(e) => onChange({ doctor: e.target.value })}
          className={selectClass}
        >
          <option value="">All doctors</option>
          {doctorOptions.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name}
            </option>
          ))}
        </select>
      )}

      {familyMemberOptions.length > 0 && (
        <select
          value={filters.familyMember}
          onChange={(e) => onChange({ familyMember: e.target.value })}
          className={selectClass}
        >
          <option value="">Me</option>
          {familyMemberOptions.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      )}

      <input
        type="date"
        value={filters.dateFrom}
        onChange={(e) => onChange({ dateFrom: e.target.value })}
        className={selectClass}
        aria-label="From date"
      />
      <input
        type="date"
        value={filters.dateTo}
        onChange={(e) => onChange({ dateTo: e.target.value })}
        className={selectClass}
        aria-label="To date"
      />

      {hasActiveFilters && (
        <button onClick={onClear} className="text-xs text-indigo-600 hover:underline px-2">
          Clear filters
        </button>
      )}
    </div>
  );
};

export default RecordFilters;
