import type { FamilyRelationship } from '../types/familyAccount.types';

const RELATIONSHIP_LABELS: Record<FamilyRelationship, string> = {
  SELF: 'Me',
  SPOUSE: 'Spouse',
  CHILD: 'Child',
  PARENT: 'Parent',
  SIBLING: 'Sibling',
  GRANDPARENT: 'Grandparent',
  OTHER: 'Other',
};

export const relationshipLabel = (relationship: FamilyRelationship | string): string =>
  RELATIONSHIP_LABELS[relationship as FamilyRelationship] || relationship;

// Returns a display age from a 'YYYY-MM-DD' date string, or null when the
// date is missing/unparseable (dateOfBirth is optional on a family member).
export const calculateAge = (dateOfBirth: string): number | null => {
  if (!dateOfBirth) return null;

  const dob = new Date(dateOfBirth);
  if (isNaN(dob.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age -= 1;
  }

  return age >= 0 ? age : null;
};

export const initials = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

// Narrows an unknown caught error down to a displayable message, without
// resorting to `any`. Handles Axios-style error shapes (error.response.data.message)
// as well as plain Error instances.
export const extractErrorMessage = (error: unknown, fallback: string): string => {
  if (error && typeof error === 'object') {
    const maybeAxiosError = error as {
      response?: { data?: { message?: unknown } };
      message?: unknown;
    };
    const responseMessage = maybeAxiosError.response?.data?.message;
    if (typeof responseMessage === 'string' && responseMessage) {
      return responseMessage;
    }
    if (typeof maybeAxiosError.message === 'string' && maybeAxiosError.message) {
      return maybeAxiosError.message;
    }
  }
  return fallback;
};
