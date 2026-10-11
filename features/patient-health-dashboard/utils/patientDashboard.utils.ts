const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Appointments store slotDate as "D_M_YYYY" (e.g. "6_10_2026").
export const formatSlotDate = (slotDate: string): string => {
  const [day, month, year] = slotDate.split('_').map(Number);
  if (!day || !month || !year) return slotDate;
  return `${day} ${MONTHS[month - 1] || ''} ${year}`.trim();
};

export const greeting = (date: Date = new Date()): string => {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const RELATIONSHIP_LABELS: Record<string, string> = {
  SELF: 'You',
  SPOUSE: 'Spouse',
  CHILD: 'Child',
  PARENT: 'Parent',
  SIBLING: 'Sibling',
  GRANDPARENT: 'Grandparent',
  OTHER: 'Family member',
};

export const relationshipText = (relationship: string): string =>
  RELATIONSHIP_LABELS[relationship] || relationship;

export const initialsOf = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || '?';

export const extractErrorMessage = (error: unknown, fallback: string): string => {
  if (error && typeof error === 'object') {
    const maybe = error as { response?: { data?: { message?: unknown } }; message?: unknown };
    const responseMessage = maybe.response?.data?.message;
    if (typeof responseMessage === 'string' && responseMessage) return responseMessage;
    if (typeof maybe.message === 'string' && maybe.message) return maybe.message;
  }
  return fallback;
};
