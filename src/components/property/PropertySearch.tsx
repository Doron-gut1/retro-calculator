import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface PropertySearchProps {
  onSearch: (propertyId: string) => Promise<void>;
}

const PropertySearch: React.FC<PropertySearchProps> = ({ onSearch }) => {
  const [propertyId, setPropertyId] = useState('');

  const handleSearch = async () => {
    if (!propertyId.trim()) {
      alert('נא להזין קוד נכס');
      return;
    }
    await onSearch(propertyId);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">קוד נכס</label>
      <div className="flex gap-2">
        <input 
          type="text"
          value={propertyId}
          onChange={(e) => setPropertyId(e.target.value)}
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