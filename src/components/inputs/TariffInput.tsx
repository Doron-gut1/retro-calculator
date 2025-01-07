import React from 'react';
import { Search } from 'lucide-react';

interface TariffInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

export const TariffInput: React.FC<TariffInputProps> = ({ value, onChange, onSearch }) => {
  return (
    <div className="flex gap-2">
      <input 
        type="text" 
        className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="הזן קוד תעריף..."
      />
      <button 
        onClick={onSearch}
        className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
      >
        <Search size={20} />
      </button>
    </div>
  );
};
