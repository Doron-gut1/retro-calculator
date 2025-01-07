import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Property, PropertySearchProps } from '../../types/property';
import SearchResults from './SearchResults';

const PropertySearch: React.FC<PropertySearchProps> = ({ onPropertySelect }) => {
  const [propertyCode, setPropertyCode] = useState('');
  const [searchResults, setSearchResults] = useState<Property[]>([]);
  
  const handleSearch = () => {
    // TODO: להוסיף חיבור לשרת
    // כרגע מדמה נתונים לצורך הדגמה
    const mockResults: Property[] = [
      {
        hskod: propertyCode,
        ktovet: 'רחוב הרצל 1',
        mspkod: 12345,
        fullname: 'ישראל ישראלי',
        maintz: '12345',
        sughs: 1,
        godel: 80
      },
      {
        hskod: propertyCode + '1',
        ktovet: 'רחוב הרצל 2',
        mspkod: 12346,
        fullname: 'ישראל כהן',
        maintz: '12346',
        sughs: 1,
        godel: 90
      }
    ];
    
    setSearchResults(mockResults);
  };

  const handlePropertySelect = (property: Property) => {
    setSearchResults([]);
    onPropertySelect(property);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2 relative">
        <label className="block text-sm font-medium">קוד נכס</label>
        <div className="flex gap-2">
          <input 
            type="text" 
            className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="הזן קוד נכס..."
            value={propertyCode}
            onChange={(e) => setPropertyCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
            onClick={handleSearch}
          >
            <Search size={20} />
          </button>
        </div>
        <SearchResults 
          results={searchResults}
          onSelect={handlePropertySelect}
        />
      </div>
    </div>
  );
};

export default PropertySearch;