import React, { useCallback, useState } from 'react';
import { useRetroStore } from '../store';
import PropertySearch from './PropertySearch';
import PayerInfo from './PayerInfo';
import { SizesTable } from './SizesAndTariffs';
import { DateRangeSelect, ChargeTypesSelect } from './inputs';
import { AnimatedAlert } from './UX';
import { LoadingSpinner } from './UX';
import { ResultsTable } from './results';
import { CalculatorIcon, CheckCircle2 } from 'lucide-react';

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
    !selectedChargeTypes?.length ||
    endDate < startDate;

  const handleSearch = useCallback(async (propertyCode: string) => {
    await searchProperty(propertyCode);
  }, [searchProperty]);

  const handleDateChange = useCallback((startDate: Date | null, endDate: Date | null) => {
    setStartDate(startDate);
    setEndDate(endDate);
  }, [setStartDate, setEndDate]);

  const handleUpdateTariff = useCallback((index: number, tariffKodln: string, tariffName: string) => {
    updateTariff(index, tariffKodln, tariffName);
  }, [updateTariff]);

  const handleUpdateSize = useCallback((index: number, newSize: number) => {
    updateSize(index, newSize);
  }, [updateSize]);

  const [isConfirmDisabled, setIsConfirmDisabled] = useState(true);

  const handleCalculate = async () => {
    await calculateRetro();
    setIsConfirmDisabled(false);
  };

  const handleConfirm = () => {
    // Add logic to confirm the calculation
    console.log('Confirm button clicked');
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold">חישוב רטרו</h1>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Property Search and Payer Info */}
          <div className="space-y-6">
            <PropertySearch onSearch={handleSearch} />
            <div className={`transition-all duration-500 ease-in-out ${property ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'}`}>
              {property && <PayerInfo />}
            </div>
          </div>

          {/* Dates & Charge Types */}
          <div className="space-y-6">
            <DateRangeSelect onChange={handleDateChange} />
            <ChargeTypesSelect 
              selected={selectedChargeTypes}
              onChange={setSelectedChargeTypes}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col justify-end gap-4">
            <button
              onClick={handleCalculate}
              disabled={isCalculateDisabled}
              className={`flex items-center justify-center gap-2 p-4 rounded-lg text-white font-medium transition-all duration-200
                ${isCalculateDisabled 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}`}
            >
              <CalculatorIcon className="w-5 h-5" />
              חשב
            </button>
            <button
              onClick={handleConfirm}
              disabled={isConfirmDisabled}
              className={`flex items-center justify-center gap-2 p-4 rounded-lg text-white font-medium transition-all duration-200
                ${isConfirmDisabled
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg'}`}
            >
              <CheckCircle2 className="w-5 h-5" />
              אשר
            </button>
          </div>
        </div>

        {/* Sizes Table */}
        <div className={`transition-all duration-500 ease-in-out ${property ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4 hidden'}`}>
          {property && (
            <SizesTable
              property={property}
              onDeleteSize={deleteSize}
              onAddSize={addSize}
              onUpdateSize={handleUpdateSize}
              onUpdateTariff={handleUpdateTariff}
              odbcName={sessionParams.odbcName || undefined}
            />
          )}
        </div>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Results Table */}
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

export default RetroForm;