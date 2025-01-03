import React, { useCallback, useEffect } from 'react';
import { useRetroStore } from '@/store';
import { useErrorStore } from '@/lib/ErrorManager';
import { PropertySearch } from './Form/PropertySearch';
import { PayerInfo } from './Form/PayerInfo';
import { DateRange } from './Form/DateRange';
import { ChargeTypes } from './Form/ChargeTypes';
import { SizesTable } from './Form/SizesTable';
import { CalculationButtons } from './Form/CalculationButtons';
import { ResultsView } from './Form/ResultsView';
import { AnimatedAlert } from './UX/AnimatedAlert';
import { LoadingSpinner } from './UX/LoadingSpinner';

export const RetroForm: React.FC = () => {
  const {
    property,
    startDate,
    endDate,
    selectedChargeTypes,
    results,
    isLoading,
    setLoading
  } = useRetroStore();

  const { errors, clearErrors } = useErrorStore();

  const handleCalculate = useCallback(async () => {
    clearErrors();
    setLoading(true);

    try {
      // כאן יתווסף החישוב האמיתי מול השרת
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error('שגיאה בחישוב:', error);
    } finally {
      setLoading(false);
    }
  }, [clearErrors, setLoading]);

  useEffect(() => {
    return () => clearErrors();
  }, [clearErrors]);

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-lg shadow">
        <h1 className="text-2xl font-semibold">חישוב רטרו</h1>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-lg shadow p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Property Search & Payer Info */}
          <div className="space-y-4">
            <PropertySearch />
            {property && <PayerInfo />}
          </div>

          {/* Dates & Charge Types */}
          <div className="space-y-4">
            <DateRange />
            <ChargeTypes />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col justify-end gap-2">
            <CalculationButtons
              onCalculate={handleCalculate}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Sizes Table */}
        {property && (
          <div className="mt-6">
            <SizesTable />
          </div>
        )}
      </div>

      {/* Results Section */}
      {results.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <ResultsView />
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="fixed bottom-4 right-4 space-y-2 max-w-md">
          {errors.map((error, index) => (
            <AnimatedAlert
              key={`${error.field}-${index}`}
              type={error.type || 'error'}
              title="שגיאה"
              message={error.message}
              duration={5000}
            />
          ))}
        </div>
      )}
    </div>
  );
};