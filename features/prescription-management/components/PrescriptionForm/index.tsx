'use client';

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import MedicineForm from '../MedicineForm';
import { EMPTY_MEDICINE, validateMedicines } from '../../utils/prescription.utils';
import type { MedicineFormValues, PrescriptionFormValues } from '../../types/prescription.types';

interface PrescriptionFormProps {
  appointmentId: string;
  initialValues?: Partial<PrescriptionFormValues>;
  onSubmit: (values: PrescriptionFormValues) => Promise<boolean>;
  submitting: boolean;
  submitLabel?: string;
}

const PrescriptionForm: React.FC<PrescriptionFormProps> = ({
  appointmentId,
  initialValues,
  onSubmit,
  submitting,
  submitLabel = 'Save Prescription',
}) => {
  const [medicines, setMedicines] = useState<MedicineFormValues[]>(
    initialValues?.medicines?.length ? initialValues.medicines : [{ ...EMPTY_MEDICINE }]
  );
  const [diagnosis, setDiagnosis] = useState(initialValues?.diagnosis || '');
  const [instructions, setInstructions] = useState(initialValues?.instructions || '');
  const [doctorNotes, setDoctorNotes] = useState(initialValues?.doctorNotes || '');
  const [validUntil, setValidUntil] = useState(initialValues?.validUntil || '');

  const updateMedicine = (index: number, value: MedicineFormValues) =>
    setMedicines((prev) => prev.map((m, i) => (i === index ? value : m)));

  const addMedicine = () => setMedicines((prev) => [...prev, { ...EMPTY_MEDICINE }]);

  const removeMedicine = (index: number) =>
    setMedicines((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    const medicinesError = validateMedicines(medicines);
    if (medicinesError) {
      toast.warn(medicinesError);
      return;
    }

    await onSubmit({ appointmentId, medicines, diagnosis, instructions, doctorNotes, validUntil });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-neutral-600 mb-1 block">Diagnosis</label>
        <textarea
          className="w-full bg-gray-100 px-3 py-2 rounded border border-gray-300 text-sm"
          rows={2}
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        {medicines.map((medicine, index) => (
          <MedicineForm
            key={medicine._id || index}
            index={index}
            value={medicine}
            onChange={(value) => updateMedicine(index, value)}
            onRemove={medicines.length > 1 ? () => removeMedicine(index) : undefined}
          />
        ))}
        <button
          type="button"
          onClick={addMedicine}
          className="text-sm text-indigo-600 font-medium hover:underline"
        >
          + Add another medicine
        </button>
      </div>

      <div>
        <label className="text-xs font-medium text-neutral-600 mb-1 block">Instructions</label>
        <textarea
          className="w-full bg-gray-100 px-3 py-2 rounded border border-gray-300 text-sm"
          rows={2}
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
      </div>

      <div>
        <label className="text-xs font-medium text-neutral-600 mb-1 block">Doctor Notes</label>
        <textarea
          className="w-full bg-gray-100 px-3 py-2 rounded border border-gray-300 text-sm"
          rows={2}
          value={doctorNotes}
          onChange={(e) => setDoctorNotes(e.target.value)}
        />
      </div>

      <div className="max-w-xs">
        <label className="text-xs font-medium text-neutral-600 mb-1 block">Valid Until</label>
        <input
          type="date"
          className="w-full bg-gray-100 px-3 py-2 rounded border border-gray-300 text-sm"
          value={validUntil}
          onChange={(e) => setValidUntil(e.target.value)}
        />
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="px-5 py-2 rounded-full text-sm bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {submitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </div>
  );
};

export default PrescriptionForm;
