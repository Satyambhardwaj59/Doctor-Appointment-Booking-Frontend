'use client';

import React, { ChangeEvent } from 'react';
import { FAMILY_RELATIONSHIPS } from '../../types/familyAccount.types';
import type { FamilyMemberFormValues } from '../../types/familyAccount.types';
import { relationshipLabel } from '../../utils/familyAccount.utils';

interface FamilyMemberFormProps {
  values: FamilyMemberFormValues;
  onChange: (values: FamilyMemberFormValues) => void;
  existingImageUrl?: string;
}

const inputClass =
  'w-full bg-gray-100 px-3 py-2 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500';
const labelClass = 'text-sm font-medium text-neutral-700 mb-1 block';

const FamilyMemberForm: React.FC<FamilyMemberFormProps> = ({
  values,
  onChange,
  existingImageUrl,
}) => {
  const set = <K extends keyof FamilyMemberFormValues>(key: K, value: FamilyMemberFormValues[K]) =>
    onChange({ ...values, [key]: value });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      set('profileImage', e.target.files[0]);
    }
  };

  const previewSrc = values.profileImage
    ? URL.createObjectURL(values.profileImage)
    : existingImageUrl;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <label htmlFor="profileImage" className="cursor-pointer">
          {previewSrc ? (
            <img
              src={previewSrc}
              alt="Profile preview"
              className="w-16 h-16 rounded-full object-cover border border-gray-300"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold text-lg border border-gray-300">
              +
            </div>
          )}
        </label>
        <input
          id="profileImage"
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageChange}
        />
        <p className="text-xs text-gray-500">Optional profile photo</p>
      </div>

      <div>
        <label className={labelClass} htmlFor="name">
          Full Name *
        </label>
        <input
          id="name"
          className={inputClass}
          type="text"
          value={values.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="e.g. Sunita Sharma"
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="relationship">
          Relationship *
        </label>
        <select
          id="relationship"
          className={inputClass}
          value={values.relationship}
          onChange={(e) => set('relationship', e.target.value as FamilyMemberFormValues['relationship'])}
        >
          <option value="">Select relationship</option>
          {FAMILY_RELATIONSHIPS.map((rel) => (
            <option key={rel} value={rel}>
              {relationshipLabel(rel)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass} htmlFor="dateOfBirth">
            Date of Birth
          </label>
          <input
            id="dateOfBirth"
            className={inputClass}
            type="date"
            value={values.dateOfBirth}
            onChange={(e) => set('dateOfBirth', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="gender">
            Gender
          </label>
          <select
            id="gender"
            className={inputClass}
            value={values.gender}
            onChange={(e) => set('gender', e.target.value)}
          >
            <option value="Not Selected">Not Selected</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass} htmlFor="phone">
            Phone
          </label>
          <input
            id="phone"
            className={inputClass}
            type="tel"
            value={values.phone}
            onChange={(e) => set('phone', e.target.value)}
            placeholder="Optional"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className={inputClass}
            type="email"
            value={values.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="Optional"
          />
        </div>
      </div>
    </div>
  );
};

export default FamilyMemberForm;
