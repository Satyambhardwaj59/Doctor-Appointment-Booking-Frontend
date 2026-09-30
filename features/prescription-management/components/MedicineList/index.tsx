import React from 'react';
import type { Medicine } from '../../types/prescription.types';

const Detail: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div>
    <p className="text-[11px] text-gray-400">{label}</p>
    <p className="text-sm text-gray-800">{value === '' || value === 0 ? '—' : value}</p>
  </div>
);

const MedicineList: React.FC<{ medicines: Medicine[] }> = ({ medicines }) => (
  <div className="space-y-3">
    {medicines.map((medicine) => (
      <div key={medicine._id} className="border border-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">💊</span>
          <h4 className="font-semibold text-gray-900 text-sm">{medicine.name}</h4>
          <span className="text-[11px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">{medicine.form}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Detail label="Dosage" value={medicine.dosage} />
          <Detail label="Frequency" value={medicine.frequency} />
          <Detail label="Timing" value={medicine.timing} />
          <Detail label="Duration" value={medicine.duration} />
          <Detail label="Quantity" value={medicine.quantity} />
        </div>
        {medicine.instructions && (
          <p className="text-xs text-gray-600 mt-3 bg-gray-50 rounded-lg px-3 py-2">{medicine.instructions}</p>
        )}
      </div>
    ))}
  </div>
);

export default MedicineList;
