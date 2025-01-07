import React, { useCallback, useEffect } from 'react';
import { useRetroStore } from '@/store';
import { useErrorStore } from '@/lib/ErrorManager';
import { PropertySearch, PropertyDetails } from './PropertySearch';
import DateRangeSelect from './inputs/DateRangeSelect';
import ChargeTypesSelect from './inputs/ChargeTypesSelect';
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
    setResults,
    setStartDate,
    setEndDate,
    setSelectedChargeTypes,
    handlePayerChange
  } = useRetroStore();

  const { errors, clearErrors, addError } = useErrorStore();

  const isSessionReady = odbcName && jobNumber;

  const handleDateChange = useCallback((start: Date | null, end: Date | null) => {
    if (start) setStartDate(start.toISOString().split('T')[0]);
    if (end) setEndDate(end.toISOString().split('T')[0]);
  }, [setStartDate, setEndDate]);

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
      // TODO: Add real calculation when backend is ready
      setResults([]);
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
  }, [isSessionReady, property, startDate, endDate, selectedChargeTypes, clearErrors, setLoading, addError, setResults]);

  const handleConfirm = useCallback(() => {
    window.close();
  }, []);

  useEffect(() => {
    return () => clearErrors();
  }, [clearErrors]);

  if (!isSessionReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">שגיאה בטעינה</h2>
          <p className="text-gray-600">הדף חייב להיפתח מתוך האקסס</p>
          <p className="text-sm text-gray-500">{odbcName ? `ODBC: ${odbcName}` : 'חסר ODBC'}, {jobNumber ? `Job: ${jobNumber}` : 'חסר Job'}</p>
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
            <PropertySearch />
            {property && <PropertyDetails property={property} onPayerChange={handlePayerChange} />}
          </div>

          <div className="space-y-4">
            <DateRangeSelect startDate={startDate} endDate={endDate} onChange={handleDateChange} />
            <ChargeTypesSelect selected={selectedChargeTypes} onChange={setSelectedChargeTypes} />
          </div>

          <div className="flex flex-col justify-end gap-2">
            <CalculationButtons
              onCalculate={handleCalculate}
              onConfirm={handleConfirm}
              disabled={isLoading}
            />
          </div>
        </div>

        {property && (
          <div className="mt-6">
            <SizesTable />
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
