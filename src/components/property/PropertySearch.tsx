import React, { useState } from 'react';
import { Search } from 'lucide-react';
import type { Property } from '../../types';

interface PropertySearchProps {
  onPropertyFound: (property: Property) => void;
}

const PropertySearch: React.FC<PropertySearchProps> = ({ onPropertyFound }) => {
  const [propertyId, setPropertyId] = useState('');

  const handleSearch = async () => {
    // TODO: Implement actual API call
    // For now, just simulate finding a property
    const mockProperty: Property = {
      id: propertyId,
      address: 'כתובת לדוגמה 123',
      payerInfo: {
        id: '12345',
        name: 'ישראל ישראלי'
      },
      sizes: [
        {
          index: 0,
          size: 80,
          tariffCode: '101',
          tariffName: 'מגורים רגיל',
          price: 100
        }
      ]
    };
    
    onPropertyFound(mockProperty);
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

export default PropertySearch;