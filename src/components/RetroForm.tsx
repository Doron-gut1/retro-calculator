import React, { useCallback } from 'react';
import { useRetroStore } from '../store';
import PropertySearch from './PropertySearch';
import { SizesTable } from './SizesAndTariffs';
import { DateRangeSelect, ChargeTypesSelect } from './inputs';
import { CalculationButtons } from './buttons';
import { AnimatedAlert } from './UX';
import { LoadingSpinner } from './UX';

export const RetroForm: React.FC = () => {
  const {
    property,
    selectedChargeTypes,
    isLoading,
    error,
    setSelectedChargeTypes,
    setStartDate,
    setEndDate,
    searchProperty,
    calculateRetro,
    addSize,
    deleteSize
    
  } = useRetroStore();

  //const odbcName = useRetroStore.getState().getSessionOdbcName();

  const handleSearch = useCallback(async (propertyCode: string) => {
    await searchProperty(propertyCode);
  }, [searchProperty]);

  const handleDateChange = useCallback((startDate: Date | null, endDate: Date | null) => {
    setStartDate(startDate);
    setEndDate(endDate);
  }, [setStartDate, setEndDate]);

  const handleChargeTypesChange = useCallback((types: string[]) => {
    setSelectedChargeTypes(types.map(Number));
  }, [setSelectedChargeTypes]);

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-lg shadow">
        <h1 className="text-2xl font-semibold">חישוב רטרו</h1>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-lg shadow p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Property Search */}
          <div className="space-y-4">
            <PropertySearch onSearch={handleSearch} />
          </div>

          {/* Dates & Charge Types */}
          <div className="space-y-4">
            <DateRangeSelect onChange={handleDateChange} />
            <ChargeTypesSelect 
              selected={selectedChargeTypes.map(String)}
              onChange={handleChargeTypesChange}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col justify-end gap-2">
            <CalculationButtons
              onCalculate={calculateRetro}
              disabled={isLoading || !property}
            />
          </div>
        </div>
       
        {/* Sizes Table */}
        {property && (
          <div className="mt-6">
            <SizesTable 
              property={property}
              onDeleteSize={deleteSize}
              onAddSize={addSize}
              odbcName={"brngviadev"}  // הוסף זאת
            />
          </div>
        )}
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <LoadingSpinner size="lg" />
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
