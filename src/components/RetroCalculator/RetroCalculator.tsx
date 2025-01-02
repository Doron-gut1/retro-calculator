import React, { useState } from 'react';
import { PropertySearch } from '../property/PropertySearch';
import { SizesAndTariffs } from '../property/SizesAndTariffs';
import DateRangeSelect from '../inputs/DateRangeSelect';
import ChargeTypesSelect from '../inputs/ChargeTypesSelect';
import CalculationButtons from '../buttons/CalculationButtons';
import CalculationResults from '../results/CalculationResults';

interface PropertyDetails {
  id: string;
  address: string;
  payerCode: string;
  payerName: string;
}

interface CalculationResult {
  period: string;
  chargeType: string;
  amount: number;
  discount: number;
  total: number;
}

const RetroCalculator = () => {
  const [property, setProperty] = useState<PropertyDetails | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedChargeTypes, setSelectedChargeTypes] = useState<string[]>([]);
  const [results, setResults] = useState<CalculationResult[]>([]);

  const handleCalculate = () => {
    debugger; // נקודת עצירה לבדיקה
    console.log('Starting calculation with:', { property, startDate, endDate, selectedChargeTypes });

    if (!property) {
      alert('נא לבחור נכס');
      return;
    }

    if (!startDate || !endDate) {
      alert('נא לבחור תאריכי התחלה וסיום');
      return;
    }

    if (selectedChargeTypes.length === 0) {
      alert('נא לבחור לפחות סוג חיוב אחד');
      return;
    }

    // מוקאפ לתוצאות
    const mockResults = selectedChargeTypes.map(type => ({
      period: startDate.toLocaleDateString('he-IL', { month: '2-digit', year: 'numeric' }),
      chargeType: type === '1010' ? 'ארנונה' : type === '1020' ? 'מים' : 'ביוב',
      amount: 1500,
      discount: 150,
      total: 1350
    }));

    console.log('Setting results:', mockResults);
    setResults(mockResults);
  };

  const handleConfirm = () => {
    if (results.length === 0) {
      alert('יש לבצע חישוב לפני אישור');
      return;
    }
    alert('החישוב אושר בהצלחה');
  };

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen text-right">
      <div className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-semibold">חישוב רטרו</h1>
      </div>
      
      <div className="flex flex-col p-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          {/* חיפוש נכס */}
          <PropertySearch onPropertyFound={setProperty} />

          {/* גדלים ותעריפים מוצגים רק אחרי בחירת נכס */}
          {property && <SizesAndTariffs />}

          <div className="mt-4">
            <DateRangeSelect 
              onChange={(start, end) => {
                setStartDate(start);
                setEndDate(end);
              }} 
            />
          </div>

          <div className="mt-4">
            <ChargeTypesSelect 
              selected={selectedChargeTypes}
              onChange={setSelectedChargeTypes}
            />
          </div>

          <div className="mt-4">
            <CalculationButtons
              onCalculate={handleCalculate}
              onConfirm={handleConfirm}
              disabled={!property || !startDate || !endDate || selectedChargeTypes.length === 0}
            />
          </div>
        </div>

        {results.length > 0 && (
          <CalculationResults results={results} />
        )}
      </div>
    </div>
  );
};

export default RetroCalculator;