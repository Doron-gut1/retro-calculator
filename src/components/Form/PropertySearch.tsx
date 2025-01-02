import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useRetroStore } from '@/store';
import { useErrorStore } from '@/lib/ErrorManager';
import { LoadingSpinner } from '../UX/LoadingSpinner';

export const PropertySearch: React.FC = () => {
  const { setProperty } = useRetroStore();
  const { getFieldErrors } = useErrorStore();
  const [isSearching, setIsSearching] = useState(false);
  const [propertyCode, setPropertyCode] = useState('');

  const errors = getFieldErrors('property');

  const handleSearch = async () => {
    if (!propertyCode.trim()) return;

    setIsSearching(true);
    try {
      // כאן יתווסף החיפוש האמיתי מול השרת
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // מוקאפ נתונים
      setProperty({
        id: propertyCode,
        address: 'רחוב הרצל 1',
        type: 'מגורים',
        payerId: '12345',
        payerName: 'ישראל ישראלי'
      });
    } catch (error) {
      console.error('שגיאה בחיפוש נכס:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">קוד נכס</label>
      <div className="flex gap-2">
        <input
          type="text"
          className={`flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 ${errors.length > 0 ? 'border-red-500' : ''}`}
          placeholder="הזן קוד נכס..."
          value={propertyCode}
          onChange={(e) => setPropertyCode(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 disabled:opacity-50"
          onClick={handleSearch}
          disabled={isSearching}
        >
          {isSearching ? <LoadingSpinner size="sm" /> : <Search size={20} />}
        </button>
      </div>
      {errors.length > 0 && (
        <p className="text-sm text-red-500 mt-1">{errors[0].message}</p>
      )}
    </div>
  );
};