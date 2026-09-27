import React from 'react';
import type { Attachment } from '../../types/chat.types';
import { formatFileSize } from '../../utils/chat.utils';

interface FileMessageProps {
  attachment: Attachment;
  isOwn: boolean;
}

const FileMessage: React.FC<FileMessageProps> = ({ attachment, isOwn }) => (
  <a
    href={attachment.url}
    target="_blank"
    rel="noopener noreferrer"
    className={`flex items-center gap-3 rounded-xl px-3 py-2 transition-colors ${
      isOwn ? 'bg-indigo-700/40 hover:bg-indigo-700/60' : 'bg-gray-100 hover:bg-gray-200'
    }`}
  >
    <span className="text-2xl">📄</span>
    <div className="min-w-0">
      <p className="text-sm font-medium truncate">{attachment.fileName}</p>
      <p className={`text-xs ${isOwn ? 'text-indigo-100' : 'text-gray-500'}`}>
        {formatFileSize(attachment.fileSize)}
      </p>
    </div>
  </a>
);

export default FileMessage;
