import React from 'react';

interface TypingIndicatorProps {
  label: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ label }) => (
  <div className="flex items-center gap-2 px-4 py-1 text-xs text-gray-500">
    <span className="flex gap-1">
      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
    </span>
    {label}
  </div>
);

export default TypingIndicator;
