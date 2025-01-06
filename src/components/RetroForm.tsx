import React, { useCallback, useEffect } from 'react';
import { useRetroStore } from '@/store';
import { useSession } from '@/hooks/useSession';
import { useErrorStore } from '@/lib/ErrorManager';
import { retroApi } from '@/services/api';
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
  // שימוש בהוק הסשן
  useSession();

  const {
    odbcName,
    jobNumber,
    property,
    startDate,
    endDate,
    selectedChargeTypes,
    results,
    isLoading,
    setLoading,
    setResults
  } = useRetroStore();

  const { errors, clearErrors, addError } = useErrorStore();

  // האם הסשן מוכן
  const isSessionReady = odbcName && jobNumber;

  const handleCalculate = useCallback(async () => {
    if (!isSessionReady) {
      addError({
        field: 'calculation',
        type: 'error',
        message: 'לא ניתן לבצע חישוב ללא פרמטרים מהאקסס'
      });
      return;
    }

    if (!property) {
      addError({
        field: 'calculation',
        type: 'error',
        message: 'יש לבחור נכס'
      });
      return;
    }

    if (!startDate || !endDate) {
      addError({
        field: 'calculation',
        type: 'error',
        message: 'יש לבחור תאריכי התחלה וסיום'
      });
      return;
    }

    if (selectedChargeTypes.length === 0) {
      addError({
        field: 'calculation',
        type: 'error',
        message: 'יש לבחור לפחות סוג חיוב אחד'
      });
      return;
    }

    clearErrors();
    setLoading(true);

    try {
      const response = await retroApi.calculateRetro({
        propertyId: property.id,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        chargeTypes: selectedChargeTypes.map(Number),
        jobNumber: jobNumber
      }, odbcName);

      setResults(response.rows);
    } catch (error) {
      if (error instanceof Error) {
        addError({
          field: 'calculation',
          type: 'error',
          message: error.message
        });
      }
    } finally {
      setLoading(false);
    }
  }, [isSessionReady, property, startDate, endDate, selectedChargeTypes, jobNumber, odbcName, clearErrors, setLoading, addError]);

  useEffect(() => {
    return () => clearErrors();
  }, [clearErrors]);

  if (!isSessionReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">שגיאה</h2>
          <p className="text-gray-600">הדף חייב להיפתח מתוך האקסס</p>
        </div>
      </div>
    );
  }

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
