import React, { useCallback, useEffect } from 'react';
import { useRetroStore } from '@/store';
import { useErrorStore } from '@/lib/ErrorManager';
import { PropertySearch } from './PropertySearch';
import { PayerInfo } from './PayerInfo';
import { DateRange } from './DateRange';
import { ChargeTypes } from './ChargeTypes';
import { SizesTable } from './SizesTable';
import { CalculationButtons } from './CalculationButtons';
import { ResultsView } from './ResultsView';
import { AnimatedAlert } from '../UX/AnimatedAlert';
import { LoadingSpinner } from '../UX/LoadingSpinner';

export const RetroForm: React.FC = () => {
  const { setLoading, isLoading } = useRetroStore();
  const { errors, clearErrors } = useErrorStore();

  const handleCalculate = useCallback(async () => {
    clearErrors();
    setLoading(true);

    try {
      // הוספת מוקאפ תוצאות
      const mockResults = [
        { period: '01/2024', chargeType: 'ארנונה', amount: 1500, discount: 150, total: 1350 },
        { period: '01/2024', chargeType: 'מים', amount: 800, discount: 80, total: 720 },
        { period: '01/2024', chargeType: 'ביוב', amount: 400, discount: 40, total: 360 }
      ];
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      useRetroStore.setState({ results: mockResults });
      
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
          <div className="space-y-4">
            <PropertySearch />
            <PayerInfo />
          </div>

          <div className="space-y-4">
            <DateRange />
            <ChargeTypes />
          </div>

          <div className="flex flex-col justify-end gap-2">
            <CalculationButtons
              onCalculate={handleCalculate}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="mt-6">
          <SizesTable />
        </div>
      </div>

      {useRetroStore.getState().results.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <ResultsView />
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