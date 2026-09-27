// ─── Domain Models ────────────────────────────────────────────────────────

export type FamilyRelationship =
  | 'SELF'
  | 'SPOUSE'
  | 'CHILD'
  | 'PARENT'
  | 'SIBLING'
  | 'GRANDPARENT'
  | 'OTHER';

export const FAMILY_RELATIONSHIPS: FamilyRelationship[] = [
  'SPOUSE',
  'CHILD',
  'PARENT',
  'SIBLING',
  'GRANDPARENT',
  'OTHER',
];

export interface FamilyMember {
  _id: string;
  primaryUserId: string;
  name: string;
  relationship: FamilyRelationship;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  profileImage: string;
  createdAt: string;
  updatedAt: string;
}

// Shape used when creating/editing a family member from a form.
export interface FamilyMemberFormValues {
  name: string;
  relationship: FamilyRelationship | '';
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  profileImage?: File | null;
}

// ─── API Response Types ───────────────────────────────────────────────────
// Mirrors the backend's res.json({ success, message, ... }) convention.

export interface FamilyMembersResponse {
  success: boolean;
  message?: string;
  familyMembers?: FamilyMember[];
}

export interface FamilyMemberResponse {
  success: boolean;
  message?: string;
  familyMember?: FamilyMember;
}

export interface FamilyActionResponse {
  success: boolean;
  message?: string;
}
