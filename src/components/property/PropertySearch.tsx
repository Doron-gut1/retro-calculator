import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { PropertyDetails } from '../../types/property.types';

interface PropertySearchProps {
  onPropertyFound: (property: PropertyDetails) => void;
}

const PropertySearch: React.FC<PropertySearchProps> = ({ onPropertyFound }) => {
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchValue.trim()) return;

    setIsLoading(true);
    try {
      const mockProperty: PropertyDetails = {
        id: searchValue,
        address: 'כתובת לדוגמה',
        type: 1,
        payer: {
          id: 12345,
          name: 'שם משלם לדוגמה'
        },
        sizes: [
          { index: 1, size: 80, tariffCode: 101, tariffName: 'מגורים רגיל', price: 0 },
          { index: 2, size: 20, tariffCode: 102, tariffName: 'מרפסת', price: 0 }
        ]
      };
      
      onPropertyFound(mockProperty);
    } catch (error) {
      console.error('Property search failed:', error);
    } finally {
      setIsLoading(false);
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
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button 
          className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 disabled:opacity-50"
          onClick={handleSearch}
          disabled={isLoading}
        >
          <Search size={20} />
        </button>
      </div>
    </div>
  );
};

export default PropertySearch;