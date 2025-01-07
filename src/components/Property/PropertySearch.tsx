import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useRetroStore } from '@/store';

export const PropertySearch: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const { setProperty } = useRetroStore();

  const handleSearch = async () => {
    // TODO: Implement property search
    console.log('Searching for property:', searchValue);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">קוד נכס</label>
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
          placeholder="הזן קוד נכס..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button
          className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
          onClick={handleSearch}
        >
          <Search size={20} />
        </button>
      </div>
    </div>
  );
};
