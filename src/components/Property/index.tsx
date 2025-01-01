import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface PropertyDetails {
  hskod: string;
  ktovet: string;
  mspkod: number;
  fullname: string;
  maintz: string;
}

export const Property: React.FC = () => {
  const [propertyCode, setPropertyCode] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<PropertyDetails | null>(null);

  const handleSearch = () => {
    // מדמה חיפוש עם נתונים סטטיים
    const mockProperty: PropertyDetails = {
      hskod: propertyCode,
      ktovet: 'רחוב הרצל 1',
      mspkod: 12345,
      fullname: 'ישראל ישראלי',
      maintz: '12345'
    };
    
    setSelectedProperty(mockProperty);
  };

  return (
    <div className="space-y-4">
      {/* חיפוש נכס */}
      <div className="space-y-2">
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
      </div>

      {/* פרטי משלם */}
      {selectedProperty && (
        <div className="p-4 border rounded bg-blue-50">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">פרטי משלם</h4>
              <button className="text-blue-600 hover:text-blue-800 text-sm">
                החלף משלם
              </button>
            </div>
            <div className="space-y-2">
              <div>
                <label className="block text-sm text-gray-600">מספר משלם</label>
                <input 
                  type="text" 
                  className="w-full p-1 border rounded bg-gray-50" 
                  value={selectedProperty.maintz} 
                  readOnly 
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">שם משלם</label>
                <input 
                  type="text" 
                  className="w-full p-1 border rounded bg-gray-50" 
                  value={selectedProperty.fullname} 
                  readOnly 
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Property;