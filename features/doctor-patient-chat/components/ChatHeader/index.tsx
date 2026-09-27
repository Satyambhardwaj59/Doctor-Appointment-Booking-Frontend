'use client';

import React from 'react';

interface ChatHeaderProps {
  name: string;
  imageUrl?: string;
  online: boolean;
  onBack?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ name, imageUrl, online, onBack }) => (
  <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3">
    {onBack && (
      <button onClick={onBack} className="text-gray-500 hover:text-gray-800 sm:hidden" aria-label="Back">
        ←
      </button>
    )}
    {imageUrl ? (
      <img src={imageUrl} alt={name} className="w-10 h-10 rounded-full object-cover" />
    ) : (
      <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
        {name.charAt(0).toUpperCase()}
      </div>
    )}
    <div>
      <p className="font-semibold text-gray-900 text-sm">{name}</p>
      <p className={`text-xs ${online ? 'text-green-600' : 'text-gray-400'}`}>
        {online ? '🟢 Online' : 'Offline'}
      </p>
    </div>
  </div>
);

export default ChatHeader;
