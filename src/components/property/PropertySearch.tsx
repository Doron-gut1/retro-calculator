import React, { useState } from 'react';
import { accessService } from '../../services/access-service';
import { Search } from 'lucide-react';

interface PropertySearchProps {
  onPropertyFound: (property: any) => void;
}

interface CustomError extends Error {
  message: string;
}

export const PropertySearch: React.FC<PropertySearchProps> = ({ onPropertyFound }) => {
  const [propertyId, setPropertyId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    try {
      setError(null);
      const property = await accessService.searchProperty(propertyId);
      onPropertyFound(property);
    } catch (error) {
      const err = error as CustomError;
      setError(err.message);
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
          value={propertyId}
          onChange={(e) => setPropertyId(e.target.value)}
        />
        <button 
          className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
          onClick={handleSearch}
        >
          <Search size={20} />
        </button>
      </div>
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};

export default PropertySearch;