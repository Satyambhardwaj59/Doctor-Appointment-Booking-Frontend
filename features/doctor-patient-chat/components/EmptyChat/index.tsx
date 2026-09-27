import React from 'react';

const EmptyChat: React.FC = () => (
  <div className="flex-1 flex flex-col items-center justify-center text-center px-6 bg-gray-50">
    <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-3xl mb-4">💬</div>
    <h3 className="text-lg font-semibold text-gray-800">Select a conversation</h3>
    <p className="text-sm text-gray-500 mt-1 max-w-sm">
      Choose a conversation from the list to start messaging.
    </p>
  </div>
);

export default EmptyChat;
