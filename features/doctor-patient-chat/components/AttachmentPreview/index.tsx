import React from 'react';
import { isImageFile, formatFileSize } from '../../utils/chat.utils';

interface AttachmentPreviewProps {
  file: File;
  onRemove: () => void;
  uploading: boolean;
}

const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({ file, onRemove, uploading }) => {
  const isImage = isImageFile(file);
  const previewUrl = isImage ? URL.createObjectURL(file) : null;

  return (
    <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-3 py-2 mb-2">
      {previewUrl ? (
        <img src={previewUrl} alt={file.name} className="w-12 h-12 rounded-lg object-cover" />
      ) : (
        <div className="w-12 h-12 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl">
          📄
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
      </div>
      {uploading ? (
        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      ) : (
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500 px-2"
          aria-label="Remove attachment"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default AttachmentPreview;
