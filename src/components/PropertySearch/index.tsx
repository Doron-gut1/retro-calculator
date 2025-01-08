import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Property, PropertySearchProps } from '../../types';
import { retroApi } from '../../services/api';
import { useRetroStore } from '../../store';
import SearchResults from './SearchResults';

const PropertySearch: React.FC<PropertySearchProps> = ({ onPropertySelect }) => {
  const [propertyCode, setPropertyCode] = useState('');
  const [searchResults, setSearchResults] = useState<Property[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { odbcName } = useRetroStore();
  
  const handleSearch = async () => {
    if (!propertyCode || !odbcName) return;

    setIsSearching(true);
    try {
      const results = await retroApi.searchProperty(propertyCode, odbcName);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching property:', error);
      // TODO: להוסיף הודעת שגיאה למשתמש
    } finally {
      setIsSearching(false);
    }
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
            disabled={isSearching}
          />
          <button 
            className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 disabled:opacity-50"
            onClick={handleSearch}
            disabled={isSearching || !propertyCode}
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