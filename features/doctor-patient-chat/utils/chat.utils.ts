export const formatMessageTime = (isoDate: string | null): string => {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatConversationTimestamp = (isoDate: string | null): string => {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (isYesterday) return 'Yesterday';
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const isImageFile = (file: File): boolean => file.type.startsWith('image/');

// Decodes the payload of our own JWT purely to read the user id for
// display purposes (e.g. "is this my message?" bubble alignment). This is
// never used as a security boundary — the backend independently verifies
// and derives identity from the token on every request/socket event.
export const getUserIdFromToken = (token: string): string | null => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return typeof decoded.id === 'string' ? decoded.id : null;
  } catch {
    return null;
  }
};

// Extracts a typed, displayable error message without resorting to `any`.
export const extractErrorMessage = (error: unknown, fallback: string): string => {
  if (error && typeof error === 'object') {
    const maybeAxiosError = error as { response?: { data?: { message?: unknown } }; message?: unknown };
    const responseMessage = maybeAxiosError.response?.data?.message;
    if (typeof responseMessage === 'string' && responseMessage) return responseMessage;
    if (typeof maybeAxiosError.message === 'string' && maybeAxiosError.message) return maybeAxiosError.message;
  }
  return fallback;
};
