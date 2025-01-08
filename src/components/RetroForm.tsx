import React from 'react';
import { useFormStore } from './store/form';
import { useSessionStore } from './store/session';
import { Calculator, Check } from 'lucide-react';
import { PropertySearch } from './PropertySearch';

export const RetroForm: React.FC = () => {
  const { 
    property,
    selectedChargeTypes,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    setSelectedChargeTypes
  } = useFormStore();

  const { currentOdbc, currentJobNumber } = useSessionStore();

  const handleCalculate = async () => {
    // TODO: Implement calculation
    console.log('Calculating...', { property, selectedChargeTypes, startDate, endDate });
  };

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen text-right">
      <div className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-semibold">חישוב רטרו</h1>
      </div>
      
      <div className="flex flex-col p-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-3 gap-6">
            {/* Property Search & Info */}
            <PropertySearch />

            {/* Dates & Charge Types */}
            <div>{/* TODO: Add dates and charge types */}</div>

            {/* Action Buttons */}
            <div className="flex flex-col justify-end gap-2">
              <button 
                className="bg-blue-600 text-white p-3 rounded flex items-center justify-center gap-2 hover:bg-blue-700"
                onClick={handleCalculate}
              >
                <Calculator size={20} />
                חשב
              </button>
              <button className="bg-green-600 text-white p-3 rounded flex items-center justify-center gap-2 hover:bg-green-700">
                <Check size={20} />
                אשר
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};