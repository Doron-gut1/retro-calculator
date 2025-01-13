import React, { useCallback } from 'react';
import { useRetroStore } from '../store';
import PropertySearch from './PropertySearch';
import { SizesTable } from './SizesAndTariffs';
import { DateRangeSelect, ChargeTypesSelect } from './inputs';
import { CalculationButtons } from './buttons';
import { AnimatedAlert } from './UX';
import { LoadingSpinner } from './UX';
import { ResultsTable } from './results';


export const RetroForm: React.FC = () => {
  const {
    property,
    selectedChargeTypes,
    isLoading,
    error,
    sessionParams,
    setSelectedChargeTypes,
    setStartDate,
    setEndDate,
    searchProperty,
    calculateRetro,
    addSize,
    deleteSize,
    updateTariff,
    startDate,
    endDate,
    updateSize,
     calculationResults,
    clearResults
  } = useRetroStore();
  

  
  const isCalculateDisabled = 
  !property || 
  !startDate  || 
  !endDate  || 
  !selectedChargeTypes?.length ||  // בודק שיש סוגי חיוב כלשהם שנבחרו
  endDate < startDate ;
  
  console.log('Calculation button state:', {
    property: !!property,
    startDate: !!setStartDate,
    endDate: !!setEndDate,
    chargeTypes: selectedChargeTypes.length,
    isDisabled: isCalculateDisabled
  });

  console.log('Date types:', {
    startDate: setStartDate instanceof Date,
    endDate: setEndDate instanceof Date,
    startDateType: typeof setStartDate,
    endDateType: typeof setEndDate,
    startDateValue: setStartDate,
    endDateValue: setEndDate
});
  const handleSearch = useCallback(async (propertyCode: string) => {
    await searchProperty(propertyCode);
  }, [searchProperty]);

  const handleDateChange = useCallback((startDate: Date | null, endDate: Date | null) => {
    setStartDate(startDate);
    setEndDate(endDate);
  }, [setStartDate, setEndDate]);

  /* const handleChargeTypesChange = useCallback((types: string[]) => {
    setSelectedChargeTypes(types.map(Number));
  }, [setSelectedChargeTypes]);
 */
  const handleUpdateTariff = useCallback((index: number, tariffKodln: string, tariffName: string) => {
    updateTariff(index, tariffKodln, tariffName);
  }, [updateTariff]);

  const handleUpdateSize = useCallback((index: number, newSize: number) => {
    updateSize(index, newSize);
  }, [updateSize]);

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
              selected={selectedChargeTypes} 
              onChange={setSelectedChargeTypes}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col justify-end gap-2">
            <CalculationButtons
              onCalculate={calculateRetro}
              disabled={isCalculateDisabled}
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
                onUpdateSize={handleUpdateSize}  // הוספה חדשה
                onUpdateTariff={handleUpdateTariff}
                odbcName={sessionParams.odbcName || undefined}
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

      {calculationResults && (
          <ResultsTable 
            results={calculationResults} 
            onClose={clearResults}
          />
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