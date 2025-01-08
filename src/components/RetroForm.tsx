import React, { useCallback } from 'react';
import { useRetroStore } from '../store';
import PropertySearch from './PropertySearch';
import { SizesTable } from './SizesAndTariffs';
import { DateRangeSelect, ChargeTypesSelect } from './inputs';
import { CalculationButtons } from './buttons';
import { AnimatedAlert } from './UX';
import { LoadingSpinner } from './UX';
import { Calculator, Check } from 'lucide-react';

export const RetroForm: React.FC = () => {
  const {
    property,
    selectedChargeTypes,
    startDate,
    endDate,
    isLoading,
    error,
    setSelectedChargeTypes,
    setStartDate,
    setEndDate,
    searchProperty,
    calculateRetro
  } = useRetroStore();

  console.log('RetroForm rendered with state:', { property, selectedChargeTypes, startDate, endDate });

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
            {/* Property Search & Info */}
            <PropertySearch onSearch={handleSearch} />

            {/* Dates & Charge Types */}
            <div className="space-y-4">
              {property && (
                <>
                  <DateRangeSelect
                    startDate={startDate}
                    endDate={endDate}
                    onStartDateChange={(date) => setStartDate(date?.toISOString() ?? '')}
                    onEndDateChange={(date) => setEndDate(date?.toISOString() ?? '')}
                  />
                  <ChargeTypesSelect
                    selected={selectedChargeTypes}
                    onChange={setSelectedChargeTypes}
                  />
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col justify-end gap-2">
              <button 
                className="bg-blue-600 text-white p-3 rounded flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleCalculate}
                disabled={isLoading || !property}
              >
                <Calculator size={20} />
                חשב
              </button>
              <button 
                className="bg-green-600 text-white p-3 rounded flex items-center justify-center gap-2 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || !property}
              >
                <Check size={20} />
                אשר
              </button>
            </div>
          </div>

          {/* Sizes Table */}
          {property && (
            <div className="mt-6">
              <SizesTable property={property} />
            </div>
          )}
        </div>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}

      {/* Error Messages */}
      {error && (
        <div className="fixed bottom-4 right-4 space-y-2 max-w-md">
          <AnimatedAlert
            type="error"
            title="שגיאה"
            message={error}
            duration={5000}
          />
        </div>
      )}
    </div>
  );
};
