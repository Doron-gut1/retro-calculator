import React, { useCallback } from 'react';
import { useRetroStore } from '../store';
import { Calculator, Check } from 'lucide-react';

export const RetroForm: React.FC = () => {
  const {
    property,
    selectedChargeTypes,
    startDate,
    endDate,
    isLoading,
    error,
    searchProperty,
    setSelectedChargeTypes,
    setStartDate,
    setEndDate,
    calculateRetro
  } = useRetroStore();

  console.log('RetroForm rendered with state:', { 
    property, 
    selectedChargeTypes, 
    startDate, 
    endDate 
  });

  const handleSearch = useCallback(async (propertyCode: string) => {
    console.log('Property search triggered:', propertyCode);
    await searchProperty(propertyCode);
  }, [searchProperty]);

  const handleCalculate = useCallback(async () => {
    console.log('Calculate button clicked');
    await calculateRetro();
  }, [calculateRetro]);

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen text-right">
      <div className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-semibold">חישוב רטרו</h1>
      </div>
      
      <div className="flex flex-col p-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-3 gap-6">
            {/* Property Search */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">קוד נכס</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="הזן קוד נכס..."
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Dates & Types Selection */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">תאריך התחלה</label>
                <input 
                  type="date" 
                  className="w-full p-2 border rounded"
                  value={startDate?.toISOString().split('T')[0] || ''}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">תאריך סיום</label>
                <input 
                  type="date" 
                  className="w-full p-2 border rounded"
                  value={endDate?.toISOString().split('T')[0] || ''}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col justify-end gap-2">
              <button 
                className="bg-blue-600 text-white p-3 rounded flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50"
                onClick={handleCalculate}
                disabled={isLoading || !property}
              >
                <Calculator size={20} />
                חשב
              </button>
              <button 
                className="bg-green-600 text-white p-3 rounded flex items-center justify-center gap-2 hover:bg-green-700 disabled:opacity-50"
                disabled={isLoading || !property}
              >
                <Check size={20} />
                אשר
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading & Error States */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      )}

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          {error}
        </div>
      )}
    </div>
  );
};