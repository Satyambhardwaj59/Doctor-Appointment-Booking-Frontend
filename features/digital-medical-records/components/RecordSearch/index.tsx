'use client';

import React, { useEffect, useState } from 'react';

interface RecordSearchProps {
  value: string;
  onChange: (value: string) => void;
}

const DEBOUNCE_MS = 400;

const RecordSearch: React.FC<RecordSearchProps> = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (inputValue !== value) onChange(inputValue);
    }, DEBOUNCE_MS);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  return (
    <div className="relative flex-1">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search records..."
        className="w-full pl-9 pr-3 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
};

export default RecordSearch;
