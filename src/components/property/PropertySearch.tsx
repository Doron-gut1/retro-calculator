import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Property } from '../../types';

interface PropertySearchProps {
  onPropertySelect?: (property: Property | null) => void;
}

export const PropertySearch: React.FC<PropertySearchProps> = ({ onPropertySelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async () => {
    if (!searchTerm) return;

    try {
      // TODO: Replace with actual API call
      const mockProperty: Property = {
        hskod: searchTerm,
        ktovet: 'רחוב לדוגמה 1',
        sughs: 1,
        mspkod: 12345,
        sizes: []
      };

      onPropertySelect?.(mockProperty);
    } catch (error) {
      console.error('Error searching property:', error);
      onPropertySelect?.(null);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">קוד נכס</label>
      <div className="flex gap-2">
        <input 
          type="text" 
          className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
          placeholder="הזן קוד נכס..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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