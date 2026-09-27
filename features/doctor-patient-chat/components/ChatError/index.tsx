import React from 'react';

interface ChatErrorProps {
  message: string;
  onRetry?: () => void;
}

const ChatError: React.FC<ChatErrorProps> = ({ message, onRetry }) => (
  <div className="flex-1 flex flex-col items-center justify-center text-center px-6 bg-gray-50">
    <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-2xl mb-3">⚠️</div>
    <p className="text-sm text-gray-600 max-w-sm">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700"
      >
        Try again
      </button>
    )}
  </div>
);

export default ChatError;
