import React, { useState } from 'react';
import DateRangeSelect from '../inputs/DateRangeSelect';
import ChargeTypesSelect from '../inputs/ChargeTypesSelect';
import CalculationButtons from '../buttons/CalculationButtons';
import CalculationResults from '../results/CalculationResults';

interface CalculationResult {
  period: string;
  chargeType: string;
  amount: number;
  discount: number;
  total: number;
}

const RetroCalculator = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedChargeTypes, setSelectedChargeTypes] = useState<string[]>([]);
  const [results, setResults] = useState<CalculationResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleCalculate = () => {
    console.log('Calculate button clicked');
    console.log('Start date:', startDate);
    console.log('End date:', endDate);
    console.log('Selected charge types:', selectedChargeTypes);

    if (!startDate || !endDate) {
      console.log('Missing dates');
      alert('נא להזין תאריכי התחלה וסיום');
      return;
    }
    
    if (selectedChargeTypes.length === 0) {
      console.log('No charge types selected');
      alert('נא לבחור לפחות סוג חיוב אחד');
      return;
    }

    // מוקאפ לתוצאות חישוב
    const mockResults = selectedChargeTypes.map(type => {
      const result = {
        period: startDate.toLocaleDateString('he-IL', { month: '2-digit', year: 'numeric' }),
        chargeType: type === '1010' ? 'ארנונה' : type === '1020' ? 'מים' : 'ביוב',
        amount: 1500,
        discount: 150,
        total: 1350
      };
      console.log('Generated mock result:', result);
      return result;
    });

    console.log('Setting results:', mockResults);
    setResults(mockResults);
    setShowResults(true);
  };

  const handleConfirm = () => {
    console.log('Confirm button clicked');
    console.log('Current results:', results);

    if (results.length === 0) {
      console.log('No results to confirm');
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
          <DateRangeSelect 
            onChange={(start, end) => {
              console.log('Date range changed:', { start, end });
              setStartDate(start);
              setEndDate(end);
              setShowResults(false);
            }} 
          />
          <div className="mt-4">
            <ChargeTypesSelect 
              selected={selectedChargeTypes}
              onChange={(types) => {
                console.log('Charge types changed:', types);
                setSelectedChargeTypes(types);
                setShowResults(false);
              }}
            />
          </div>
          <div className="mt-4">
            <CalculationButtons
              onCalculate={handleCalculate}
              onConfirm={handleConfirm}
              disabled={!startDate || !endDate || selectedChargeTypes.length === 0}
            />
          </div>
        </div>

        {showResults && results.length > 0 && (
          <CalculationResults results={results} />
        )}
      </div>
    </div>
  );
};

export default RetroCalculator;