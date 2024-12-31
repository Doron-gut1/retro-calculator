import React, { useState } from 'react';
import { PropertySearch } from '../property/PropertySearch';
import { PayerInfo } from '../property/PayerInfo';
import { SizesTable } from '../property/SizesTable';
import { ResultsTable } from '../results/ResultsTable';
import { retroCalculationService } from '../../services/calculations';

interface RetroCalculatorProps {
  onCalculationComplete?: (results: any) => void;
}

export const RetroCalculator: React.FC<RetroCalculatorProps> = ({ onCalculationComplete }) => {
  const [showResults, setShowResults] = useState(false);
  const [propertyData, setPropertyData] = useState(null);
  const [calculationResults, setCalculationResults] = useState(null);

  const handleCalculate = async () => {
    try {
      const results = await retroCalculationService.calculateRetro(propertyData);
      setCalculationResults(results);
      setShowResults(true);
      onCalculationComplete?.(results);
    } catch (error) {
      console.error('Calculation error:', error);
    }
  };

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen text-right" dir="rtl">
      <div className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-semibold">חישוב רטרו</h1>
      </div>
      
      <div className="flex flex-col p-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-4">
              <PropertySearch onPropertySelect={setPropertyData} />
              <PayerInfo data={propertyData?.payer} />
            </div>

            <div className="space-y-4">
              {/* DateRangePicker and ChargeTypeSelect will be added here */}
            </div>

            <div className="flex flex-col justify-end gap-2">
              <button 
                className="bg-blue-600 text-white p-3 rounded flex items-center justify-center gap-2 hover:bg-blue-700"
                onClick={handleCalculate}
              >
                חשב
              </button>
              <button className="bg-green-600 text-white p-3 rounded flex items-center justify-center gap-2 hover:bg-green-700">
                אשר
              </button>
            </div>
          </div>

          <SizesTable 
            sizes={propertyData?.sizes} 
            onSizesChange={(sizes) => setPropertyData(prev => ({ ...prev, sizes }))} 
          />
        </div>

        {showResults && calculationResults && (
          <ResultsTable results={calculationResults} />
        )}
      </div>
    </div>
  );
};