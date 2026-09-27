'use client';

import React, { ChangeEvent, KeyboardEvent, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { isImageFile } from '../../utils/chat.utils';
import { validateAttachment } from '../../validations/chat.validation';
import AttachmentPreview from '../AttachmentPreview';

interface MessageInputProps {
  onSendText: (content: string) => { success: boolean; error?: string };
  onSendAttachment: (file: File, messageType: 'IMAGE' | 'FILE', caption?: string) => Promise<boolean>;
  onTyping: () => void;
  onStopTyping: () => void;
  uploading: boolean;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendText,
  onSendAttachment,
  onTyping,
  onStopTyping,
  uploading,
  disabled,
}) => {
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (e.target.value.trim()) onTyping();
    else onStopTyping();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateAttachment(file);
    if (!validation.valid) {
      toast.warn(validation.message);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setSelectedFile(file);
  };

  const handleSend = async () => {
    if (selectedFile) {
      const messageType = isImageFile(selectedFile) ? 'IMAGE' : 'FILE';
      const success = await onSendAttachment(selectedFile, messageType, content.trim() || undefined);
      if (success) {
        setSelectedFile(null);
        setContent('');
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
      return;
    }

    if (!content.trim()) return;

    const result = onSendText(content.trim());
    if (result.success) {
      setContent('');
      onStopTyping();
    } else if (result.error) {
      toast.warn(result.error);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-3">
      {selectedFile && (
        <AttachmentPreview file={selectedFile} onRemove={() => setSelectedFile(null)} uploading={uploading} />
      )}
      <div className="flex items-end gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || uploading}
          className="p-2 text-gray-500 hover:text-indigo-600 disabled:opacity-50"
          aria-label="Attach file"
        >
          📎
        </button>
        <input
          ref={fileInputRef}
          type="file"
          hidden
          accept="image/jpeg,image/png,image/webp,image/gif,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileChange}
        />
        <textarea
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={onStopTyping}
          placeholder="Type a message..."
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none bg-gray-100 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 max-h-32 disabled:opacity-60"
        />
        <button
          onClick={handleSend}
          disabled={disabled || uploading || (!content.trim() && !selectedFile)}
          className="p-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 transition-colors"
          aria-label="Send message"
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
