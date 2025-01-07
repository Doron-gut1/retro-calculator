import React, { useState } from 'react';
import { useErrorSystem } from '@/lib/ErrorSystem';
import { PropertySearch, PropertyDetails } from './PropertySearch';
import DateRangeSelect from './inputs/DateRangeSelect';
import ChargeTypesSelect from './inputs/ChargeTypesSelect';
import { SizesTable } from './SizesAndTariffs';
import { CalculationButtons } from './buttons';
import { CalculationResults } from './results';
import { AnimatedAlert } from './UX/AnimatedAlert';

export const RetroForm: React.FC = () => {
  const [property, setProperty] = useState(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedChargeTypes, setSelectedChargeTypes] = useState<string[]>([]);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { addError, errors, clearErrors } = useErrorSystem();

  const handleCalculate = async () => {
    if (!property) {
      addError({
        type: 'error',
        message: 'יש לבחור נכס',
        field: 'property'
      });
      return;
    }

    if (!startDate || !endDate) {
      addError({
        type: 'error',
        message: 'יש לבחור תאריכי התחלה וסיום',
        field: 'dates'
      });
      return;
    }

    if (selectedChargeTypes.length === 0) {
      addError({
        type: 'error',
        message: 'יש לבחור לפחות סוג חיוב אחד',
        field: 'chargeTypes'
      });
      return;
    }

    setIsLoading(true);
    clearErrors();

    try {
      // TODO: כאן יהיה הקוד לחישוב
      setResults([]);
    } catch (error) {
      addError({
        type: 'error',
        message: error instanceof Error ? error.message : 'שגיאה בחישוב',
        field: 'calculation'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayerChange = (newPayerId: string) => {
    // TODO: יישום החלפת משלם
    console.log('החלפת משלם:', newPayerId);
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 min-h-screen">
      <div className="bg-blue-600 text-white p-4 rounded-lg shadow">
        <h1 className="text-2xl font-semibold">חישוב רטרו</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <PropertySearch onPropertySelect={setProperty} />
            {property && (
              <PropertyDetails 
                property={property} 
                onPayerChange={handlePayerChange} 
              />
            )}
          </div>

          <div className="space-y-4">
            <DateRangeSelect 
              startDate={startDate} 
              endDate={endDate} 
              onChange={(start, end) => {
                setStartDate(start);
                setEndDate(end);
              }} 
            />
            <ChargeTypesSelect 
              selected={selectedChargeTypes} 
              onChange={setSelectedChargeTypes} 
            />
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
    </div>
  );
};