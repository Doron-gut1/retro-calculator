import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useRetroStore } from '../../store';

interface PropertySearchProps {
  onSearch: (propertyCode: string) => Promise<void>;
}

export const PropertySearch: React.FC<PropertySearchProps> = ({ onSearch }) => {
  const [propertyCode, setPropertyCode] = useState('');
  const { isLoading } = useRetroStore();

  const handleSubmit = async () => {
    if (!propertyCode.trim()) return;
    await onSearch(propertyCode.trim());
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
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            disabled={isLoading}
          />
          <button 
            className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 disabled:opacity-50"
            onClick={handleSubmit}
            disabled={isLoading || !propertyCode.trim()}
          >
            <Search size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertySearch;