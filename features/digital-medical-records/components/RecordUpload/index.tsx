'use client';

import React, { ChangeEvent, useState } from 'react';
import { PATIENT_CREATABLE_TYPES } from '../../types/medicalRecords.types';
import { recordTypeLabel } from '../../utils/medicalRecords.utils';
import { validateRecordFiles } from '../../hooks/useRecordUpload';
import type { RecordFormValues, RecordType } from '../../types/medicalRecords.types';

interface Option {
  id: string;
  name: string;
}

interface RecordUploadProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: RecordFormValues) => Promise<{ success: boolean; message?: string }>;
  uploading: boolean;
  doctorOptions: Option[];
  familyMemberOptions: Option[];
}

const EMPTY_FORM: RecordFormValues = {
  recordType: '',
  title: '',
  description: '',
  recordDate: '',
  doctorId: '',
  familyMemberId: '',
  files: [],
};

const inputClass =
  'w-full bg-gray-100 px-3 py-2 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500';
const labelClass = 'text-sm font-medium text-neutral-700 mb-1 block';

const RecordUpload: React.FC<RecordUploadProps> = ({
  open,
  onClose,
  onSubmit,
  uploading,
  doctorOptions,
  familyMemberOptions,
}) => {
  const [values, setValues] = useState<RecordFormValues>(EMPTY_FORM);
  const [fileError, setFileError] = useState<string | null>(null);

  if (!open) return null;

  const handleClose = () => {
    setValues(EMPTY_FORM);
    setFileError(null);
    onClose();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validation = validateRecordFiles(files);
    if (!validation.valid) {
      setFileError(validation.message || 'Invalid file');
      return;
    }
    setFileError(null);
    setValues((prev) => ({ ...prev, files }));
  };

  const handleSubmit = async () => {
    const result = await onSubmit(values);
    if (result.success) {
      handleClose();
    } else if (result.message) {
      setFileError(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-lg font-bold text-gray-900">Add Medical Record</h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 rounded-lg p-1" aria-label="Close">
            ✕
          </button>
        </div>

        <div>
          <label className={labelClass}>Record Type *</label>
          <select
            className={inputClass}
            value={values.recordType}
            onChange={(e) => setValues((prev) => ({ ...prev, recordType: e.target.value as RecordType }))}
          >
            <option value="">Select type</option>
            {PATIENT_CREATABLE_TYPES.map((type) => (
              <option key={type} value={type}>
                {recordTypeLabel(type)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Title *</label>
          <input
            className={inputClass}
            type="text"
            value={values.title}
            onChange={(e) => setValues((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="e.g. Blood test report"
          />
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea
            className={inputClass}
            rows={2}
            value={values.description}
            onChange={(e) => setValues((prev) => ({ ...prev, description: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Record Date *</label>
            <input
              className={inputClass}
              type="date"
              max={new Date().toISOString().split('T')[0]}
              value={values.recordDate}
              onChange={(e) => setValues((prev) => ({ ...prev, recordDate: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass}>Doctor *</label>
            <select
              className={inputClass}
              value={values.doctorId}
              onChange={(e) => setValues((prev) => ({ ...prev, doctorId: e.target.value }))}
            >
              <option value="">Select doctor</option>
              {doctorOptions.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {familyMemberOptions.length > 0 && (
          <div>
            <label className={labelClass}>For</label>
            <select
              className={inputClass}
              value={values.familyMemberId}
              onChange={(e) => setValues((prev) => ({ ...prev, familyMemberId: e.target.value }))}
            >
              <option value="">Me</option>
              {familyMemberOptions.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className={labelClass}>Attachments (PDF, JPG, PNG)</label>
          <input
            type="file"
            multiple
            accept="application/pdf,image/jpeg,image/jpg,image/png"
            onChange={handleFileChange}
            className="text-sm"
          />
          {values.files.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">{values.files.length} file(s) selected</p>
          )}
        </div>

        {fileError && <p className="text-xs text-red-500">{fileError}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-full text-sm border border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={uploading}
            className="px-5 py-2 rounded-full text-sm bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {uploading ? 'Uploading...' : 'Add Record'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecordUpload;
