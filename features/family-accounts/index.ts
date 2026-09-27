/**
 * Family Accounts Feature Module
 * Single export point for all family accounts components, hooks, services, and types.
 */

// Components
export { default as FamilyAccountsPage } from './components/FamilyAccountsPage';
export { default as FamilyList } from './components/FamilyList';
export { default as FamilyMemberCard } from './components/FamilyMemberCard';
export { default as AddFamilyMember } from './components/AddFamilyMember';
export { default as EditFamilyMember } from './components/EditFamilyMember';
export { default as FamilyProfile } from './components/FamilyProfile';
export { default as FamilySwitcher } from './components/FamilySwitcher';
export { default as RemoveFamilyMember } from './components/RemoveFamilyMember';
export { default as FamilyEmptyState } from './components/FamilyEmptyState';

// Hooks
export { useFamilyMembers } from './hooks/useFamilyMembers';
export { useFamilySwitcher, SELF_OPTION } from './hooks/useFamilySwitcher';

// Services
export * as familyAccountService from './services/familyAccount.service';

// Utils
export * from './utils/familyAccount.utils';

// Validations
export { validateFamilyMemberForm } from './validations/familyAccount.validation';

// Types
export * from './types/familyAccount.types';
