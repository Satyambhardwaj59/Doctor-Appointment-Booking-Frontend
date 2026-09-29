'use client';

import { useCallback, useState } from 'react';
import { createRecord } from '../services/medicalRecords.service';
import { extractErrorMessage } from '../utils/medicalRecords.utils';
import { PATIENT_CREATABLE_TYPES } from '../types/medicalRecords.types';
import type { RecordCredentials, RecordFormValues } from '../types/medicalRecords.types';

const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB
const MAX_FILES = 10;

export interface UploadValidationResult {
  valid: boolean;
  message?: string;
}

export const validateRecordFiles = (files: File[]): UploadValidationResult => {
  if (files.length > MAX_FILES) {
    return { valid: false, message: `You can attach at most ${MAX_FILES} files` };
  }
  for (const file of files) {
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return { valid: false, message: 'Only PDF, JPG, JPEG and PNG files are allowed' };
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return { valid: false, message: 'Each file must be under 15MB' };
    }
  }
  return { valid: true };
};

export const useRecordUpload = (credentials: RecordCredentials | null) => {
  const [uploading, setUploading] = useState(false);

  const submit = useCallback(
    async (values: RecordFormValues): Promise<{ success: boolean; message?: string }> => {
      if (!credentials) return { success: false, message: 'Not authenticated' };

      if (!values.recordType) {
        return { success: false, message: 'Please select a record type' };
      }
      if (credentials.role === 'patient' && !PATIENT_CREATABLE_TYPES.includes(values.recordType)) {
        return { success: false, message: 'You can only add document/report records, not clinical records' };
      }
      if (!values.title.trim()) {
        return { success: false, message: 'Title is required' };
      }
      if (!values.recordDate) {
        return { success: false, message: 'Record date is required' };
      }
      if (credentials.role === 'patient' && !values.doctorId) {
        return { success: false, message: 'Please select the doctor this record is associated with' };
      }

      const fileValidation = validateRecordFiles(values.files);
      if (!fileValidation.valid) {
        return { success: false, message: fileValidation.message };
      }

      setUploading(true);
      try {
        const data = await createRecord(credentials, values);
        if (!data.success) {
          return { success: false, message: data.message || 'Could not create record' };
        }
        return { success: true };
      } catch (err: unknown) {
        return { success: false, message: extractErrorMessage(err, 'Could not create record') };
      } finally {
        setUploading(false);
      }
    },
    [credentials]
  );

  return { submit, uploading };
};
