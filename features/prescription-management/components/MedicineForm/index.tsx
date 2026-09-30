'use client';

import React from 'react';
import {
  MEDICINE_FORMS,
  MEDICINE_FREQUENCIES,
  MEDICINE_TIMINGS,
} from '../../types/prescription.types';
import type {
  MedicineForm as MedicineFormType,
  MedicineFormValues,
  MedicineFrequency,
  MedicineTiming,
} from '../../types/prescription.types';

interface MedicineFormProps {
  index: number;
  value: MedicineFormValues;
  onChange: (value: MedicineFormValues) => void;
  onRemove?: () => void;
}

const inputClass =
  'w-full bg-gray-100 px-3 py-2 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500';
const labelClass = 'text-xs font-medium text-neutral-600 mb-1 block';

const MedicineForm: React.FC<MedicineFormProps> = ({ index, value, onChange, onRemove }) => {
  const set = <K extends keyof MedicineFormValues>(key: K, next: MedicineFormValues[K]) =>
    onChange({ ...value, [key]: next });

  return (
    <div className="border border-gray-200 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-800">Medicine #{index + 1}</p>
        {onRemove && (
          <button type="button" onClick={onRemove} className="text-xs text-red-500 hover:underline">
            Remove
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Name *</label>
          <input className={inputClass} value={value.name} onChange={(e) => set('name', e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Dosage *</label>
          <input
            className={inputClass}
            value={value.dosage}
            onChange={(e) => set('dosage', e.target.value)}
            placeholder="e.g. 500 mg"
          />
        </div>
        <div>
          <label className={labelClass}>Form</label>
          <select
            className={inputClass}
            value={value.form}
            onChange={(e) => set('form', e.target.value as MedicineFormType)}
          >
            {MEDICINE_FORMS.map((form) => (
              <option key={form}>{form}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Frequency *</label>
          <select
            className={inputClass}
            value={value.frequency}
            onChange={(e) => set('frequency', e.target.value as MedicineFrequency)}
          >
            {MEDICINE_FREQUENCIES.map((frequency) => (
              <option key={frequency}>{frequency}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Timing</label>
          <select
            className={inputClass}
            value={value.timing}
            onChange={(e) => set('timing', e.target.value as MedicineTiming)}
          >
            {MEDICINE_TIMINGS.map((timing) => (
              <option key={timing}>{timing}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Duration</label>
          <input
            className={inputClass}
            value={value.duration}
            onChange={(e) => set('duration', e.target.value)}
            placeholder="e.g. 5 days or 2 weeks"
          />
        </div>
        <div>
          <label className={labelClass}>Quantity</label>
          <input
            className={inputClass}
            type="number"
            min={0}
            value={value.quantity}
            onChange={(e) => set('quantity', Number(e.target.value))}
          />
        </div>
        <div>
          <label className={labelClass}>Instructions</label>
          <input
            className={inputClass}
            value={value.instructions}
            onChange={(e) => set('instructions', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default MedicineForm;
