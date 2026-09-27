import type { FamilyMemberFormValues } from '../types/familyAccount.types';
import { FAMILY_RELATIONSHIPS } from '../types/familyAccount.types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-\s()]{7,15}$/;

export interface ValidationResult {
  valid: boolean;
  message?: string;
}

// Mirrors modules/family-accounts/validators/familyAccount.validator.js on
// the backend. This only exists to give the user fast, friendly feedback —
// the backend re-validates and rejects invalid data regardless.
export const validateFamilyMemberForm = (
  values: FamilyMemberFormValues
): ValidationResult => {
  if (!values.name.trim()) {
    return { valid: false, message: 'Name is required' };
  }

  if (!values.relationship || !FAMILY_RELATIONSHIPS.includes(values.relationship)) {
    return { valid: false, message: 'Please select a relationship' };
  }

  if (values.dateOfBirth) {
    const dob = new Date(values.dateOfBirth);
    if (isNaN(dob.getTime()) || dob.getTime() > Date.now()) {
      return { valid: false, message: 'Enter a valid date of birth' };
    }
  }

  if (values.phone && !PHONE_REGEX.test(values.phone)) {
    return { valid: false, message: 'Enter a valid phone number' };
  }

  if (values.email && !EMAIL_REGEX.test(values.email)) {
    return { valid: false, message: 'Enter a valid email' };
  }

  return { valid: true };
};
