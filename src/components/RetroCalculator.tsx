import React from 'react';
import { Calculator, Check } from 'lucide-react';
import { useRetroStore } from '../store/retroStore';
import PropertySearch from './property/PropertySearch';
import PayerInfo from './property/PayerInfo';
import DateRangeSelector from './inputs/DateRangeSelector';
import ChargeTypesSelector from './inputs/ChargeTypesSelector';
import SizesAndTariffs from './tariffs/SizesAndTariffs';
import CalculationResults from './results/CalculationResults';

const RetroCalculator: React.FC = () => {
  const { 
    property,
    calculationResults,
    isCalculating,
    error,
  } = useRetroStore();

  const handleCalculate = async () => {
    // TODO: Implement calculation logic
    console.log('Calculating...');
  };

  const handleApprove = async () => {
    // TODO: Implement approval logic
    console.log('Approving...');
  };

  return (
    <div dir="rtl" className="flex flex-col bg-gray-50 min-h-screen text-right">
      <div className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-semibold">חישוב רטרו</h1>
      </div>
      
      <div className="flex flex-col p-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-4">
              <PropertySearch />
              {property && <PayerInfo />}
            </div>

            <div className="space-y-4">
              <DateRangeSelector />
              <ChargeTypesSelector />
            </div>

            <div className="flex flex-col justify-end gap-2">
              <button
                onClick={handleCalculate}
                disabled={isCalculating}
                className="bg-blue-600 text-white p-3 rounded flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50"
              >
                <Calculator size={20} />
                חשב
              </button>
              <button
                onClick={handleApprove}
                disabled={!calculationResults}
                className="bg-green-600 text-white p-3 rounded flex items-center justify-center gap-2 hover:bg-green-700 disabled:opacity-50"
              >
                <Check size={20} />
                אשר
              </button>
            </div>
          </div>

          {property && <SizesAndTariffs />}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        {calculationResults && <CalculationResults />}
      </div>
    </div>
  );
};

export default RetroCalculator;
