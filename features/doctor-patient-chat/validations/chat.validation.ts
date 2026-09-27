const MAX_MESSAGE_LENGTH = 2000;
const MAX_ATTACHMENT_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_ATTACHMENT_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export interface ValidationResult {
  valid: boolean;
  message?: string;
}

export const validateTextMessage = (content: string): ValidationResult => {
  if (!content.trim()) {
    return { valid: false, message: 'Message cannot be empty' };
  }
  if (content.length > MAX_MESSAGE_LENGTH) {
    return { valid: false, message: `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters` };
  }
  return { valid: true };
};

export const validateAttachment = (file: File): ValidationResult => {
  if (!ALLOWED_ATTACHMENT_MIME_TYPES.includes(file.type)) {
    return { valid: false, message: 'File type not allowed' };
  }
  if (file.size > MAX_ATTACHMENT_SIZE_BYTES) {
    return { valid: false, message: 'File exceeds the 10MB size limit' };
  }
  return { valid: true };
};

export { MAX_MESSAGE_LENGTH, MAX_ATTACHMENT_SIZE_BYTES, ALLOWED_ATTACHMENT_MIME_TYPES };
