import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Property, PropertySearchProps } from '../../types/property';

const PropertySearch: React.FC<PropertySearchProps> = ({ onPropertySelect }) => {
  const [propertyCode, setPropertyCode] = useState('');
  
  const handleSearch = () => {
    // TODO: להוסיף חיבור לשרת
    // כרגע מדמה נתונים לצורך הדגמה
    const mockProperty: Property = {
      hskod: propertyCode,
      ktovet: 'כתובת לדוגמה 123',
      mspkod: 12345,
      fullname: 'ישראל ישראלי',
      maintz: '12345'
    };
    
    onPropertySelect(mockProperty);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">קוד נכס</label>
      <div className="flex gap-2">
        <input 
          type="text" 
          className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
          placeholder="הזן קוד נכס..."
          value={propertyCode}
          onChange={(e) => setPropertyCode(e.target.value)}
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