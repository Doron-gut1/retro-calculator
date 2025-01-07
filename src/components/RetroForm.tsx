import React, { useCallback, useEffect } from 'react';
import { useRetroStore } from '../store';
import { useErrorSystem } from '../lib/ErrorSystem';
import { retroApi } from '../services/api';
import { PropertySearch, PropertyDetails } from './PropertySearch';
import { SizesTable } from './SizesAndTariffs';
import { CalculationButtons } from './buttons';
import { CalculationResults } from './results';
import { AnimatedAlert } from './UX';
import { LoadingSpinner } from './UX';

export const RetroForm: React.FC = () => {
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

  const { errors, clearErrors, addError } = useErrorSystem();

  const isSessionReady = odbcName && jobNumber;

  const handleCalculate = useCallback(async () => {
    if (!isSessionReady) {
      addError({
        type: 'error',
        message: 'לא ניתן לבצע חישוב ללא פרמטרים מהאקסס',
        field: 'calculation'
      });
      return;
    }

    if (!property) {
      addError({
        type: 'error',
        message: 'יש לבחור נכס',
        field: 'calculation'
      });
      return;
    }

    if (!startDate || !endDate) {
      addError({
        type: 'error',
        message: 'יש לבחור תאריכי התחלה וסיום',
        field: 'calculation'
      });
      return;
    }

    if (selectedChargeTypes.length === 0) {
      addError({
        type: 'error',
        message: 'יש לבחור לפחות סוג חיוב אחד',
        field: 'calculation'
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        addError({
          type: 'error',
          message: error.message,
          field: 'calculation'
        });
      }
    } finally {
      setLoading(false);
    }
  }, [isSessionReady, property, startDate, endDate, selectedChargeTypes, jobNumber, odbcName, clearErrors, setLoading, addError, setResults]);

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
      <div className="bg-blue-600 text-white p-4 rounded-lg shadow">
        <h1 className="text-2xl font-semibold">חישוב רטרו</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <PropertySearch property={property} />
            {property && <PropertyDetails property={property} />}
          </div>

          <div className="flex flex-col justify-end gap-2">
            <CalculationButtons
              onCalculate={handleCalculate}
              disabled={isLoading}
            />
          </div>
        </div>

        {property && (
          <div className="mt-6">
            <SizesTable property={property} />
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <CalculationResults results={results} />
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {errors.length > 0 && (
        <div className="fixed bottom-4 right-4 space-y-2 max-w-md">
          {errors.map((error, index: number) => (
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
