import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface PropertyDetails {
  id: string;
  address: string;
  payerCode: string;
  payerName: string;
}

interface PropertySearchProps {
  onPropertyFound: (property: PropertyDetails) => void;
}

export const PropertySearch: React.FC<PropertySearchProps> = ({ onPropertyFound }) => {
  const [propertyId, setPropertyId] = useState('');

  const handleSearch = () => {
    debugger; // נקודת עצירה לבדיקה
    if (!propertyId) {
      alert('נא להזין קוד נכס');
      return;
    }

    // מוקאפ של נכס לדוגמא
    onPropertyFound({
      id: propertyId,
      address: 'כתובת לדוגמה 123',
      payerCode: '12345',
      payerName: 'ישראל ישראלי'
    });
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