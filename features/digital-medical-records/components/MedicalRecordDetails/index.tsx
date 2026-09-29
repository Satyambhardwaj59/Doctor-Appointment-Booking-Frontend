'use client';

import React, { useContext, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppContext } from '../../../../context/AppContext';
import { useMedicalRecord } from '../../hooks/useMedicalRecord';
import { recordTypeIcon, recordTypeLabel, formatRecordDate, formatFileSize, getUserIdFromToken } from '../../utils/medicalRecords.utils';
import type { RecordCredentials } from '../../types/medicalRecords.types';

interface MedicalRecordDetailsProps {
  recordId: string;
}

const MedicalRecordDetails: React.FC<MedicalRecordDetailsProps> = ({ recordId }) => {
  const { token, doctors } = useContext(AppContext);
  const router = useRouter();

  const credentials: RecordCredentials | null = useMemo(
    () => (token ? { token, role: 'patient' } : null),
    [token]
  );

  const { record, loading, error, save, remove } = useMedicalRecord(credentials, recordId);

  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', description: '' });

  if (!token) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Please login to view this record.</p>
        <button
          onClick={() => router.push('/login')}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700"
        >
          Login
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-gray-500">{error || 'Record not found'}</p>
        <button onClick={() => router.push('/medical-records')} className="mt-3 text-indigo-600 text-sm hover:underline">
          Back to records
        </button>
      </div>
    );
  }

  const doctorName = doctors.find((d) => d._id === record.doctorId)?.name || 'Doctor';
  const currentUserId = credentials ? getUserIdFromToken(credentials.token) : null;
  const canEdit = record.createdByRole === 'patient' && record.createdById === currentUserId;

  const startEditing = () => {
    setForm({ title: record.title, description: record.description });
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const success = await save(form);
    setSaving(false);
    if (success) setEditing(false);
  };

  const handleDelete = async () => {
    const success = await remove();
    if (success) router.push('/medical-records');
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <button onClick={() => router.push('/medical-records')} className="text-sm text-gray-500 hover:text-gray-800 mb-4">
        ← Back to records
      </button>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-2xl">
              {recordTypeIcon(record.recordType)}
            </div>
            <div>
              <p className="text-xs text-indigo-600 font-medium">{recordTypeLabel(record.recordType)}</p>
              {editing ? (
                <input
                  className="text-xl font-bold text-gray-900 border-b border-gray-300 focus:outline-none"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                />
              ) : (
                <h1 className="text-xl font-bold text-gray-900">{record.title}</h1>
              )}
            </div>
          </div>

          {canEdit && !editing && !confirmingDelete && (
            <div className="flex gap-2 shrink-0">
              <button
                onClick={startEditing}
                className="px-3 py-1.5 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
              >
                Edit
              </button>
              <button
                onClick={() => setConfirmingDelete(true)}
                className="px-3 py-1.5 text-xs font-semibold rounded-full bg-red-50 text-red-600 hover:bg-red-100"
              >
                Archive
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
          <div>
            <p className="text-xs text-gray-400">Date</p>
            <p className="text-gray-800">{formatRecordDate(record.recordDate)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Doctor</p>
            <p className="text-gray-800">{doctorName}</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs text-gray-400 mb-1">Description</p>
          {editing ? (
            <textarea
              className="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm"
              rows={2}
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            />
          ) : (
            <p className="text-sm text-gray-700">{record.description || '—'}</p>
          )}
        </div>

        {(record.diagnosis || record.doctorNotes) && (
          <div className="mt-4 border-t border-gray-100 pt-4 space-y-3">
            <div>
              <p className="text-xs text-gray-400 mb-1">Diagnosis</p>
              <p className="text-sm text-gray-700">{record.diagnosis || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Doctor Notes</p>
              <p className="text-sm text-gray-700">{record.doctorNotes || '—'}</p>
            </div>
          </div>
        )}

        {record.attachments.length > 0 && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <p className="text-xs text-gray-400 mb-2">Attachments</p>
            <div className="space-y-2">
              {record.attachments.map((attachment) => (
                <a
                  key={attachment._id}
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 rounded-xl px-3 py-2"
                >
                  <span className="text-xl">📄</span>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-800 truncate">{attachment.fileName}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(attachment.fileSize)}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {editing && (
          <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={() => setEditing(false)}
              className="px-4 py-2 rounded-full text-sm border border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 rounded-full text-sm bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}

        {confirmingDelete && (
          <div className="mt-4 pt-4 border-t border-gray-100 bg-red-50 rounded-xl p-4">
            <p className="text-sm text-gray-700 mb-3">
              Archive this record? It will be hidden from your timeline but not permanently deleted.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmingDelete(false)}
                className="px-4 py-2 rounded-full text-sm border border-gray-300 text-gray-600 hover:bg-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 rounded-full text-sm bg-red-600 text-white hover:bg-red-700"
              >
                Archive
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalRecordDetails;
