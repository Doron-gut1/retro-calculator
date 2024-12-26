import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useRetroStore } from '../../store/retroStore';

const PropertySearch: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const { setProperty, setError } = useRetroStore();

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      setError('נא להזין קוד נכס');
      return;
    }

    try {
      // TODO: Implement actual search through Access bridge
      console.log('Searching for property:', searchValue);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">קוד נכס</label>
      <div className="flex gap-2">
        <input 
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
          placeholder="הזן קוד נכס..."
        />
        <button 
          onClick={handleSearch}
          className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
        >
          <Search size={20} />
        </button>
      </div>
    </div>
  );
};

export default PropertySearch;