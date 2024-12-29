import React from 'react';
import { PropertySearch } from './components/PropertySearch';
import { PayerInfo } from './components/PayerInfo';
import { DateRangeSelect } from './components/DateRangeSelect';
import { ChargeTypesSelect } from './components/ChargeTypesSelect';
import { CalculationButtons } from './components/CalculationButtons';
import { SizesTable } from './components/SizesTable';
import { CalculationResults } from './components/CalculationResults';
import { useCalculationStore } from './store';

function App() {
  const { results } = useCalculationStore();

  return (
    <div dir="rtl" className="flex flex-col bg-gray-50 min-h-screen text-right">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-semibold">חישוב רטרו</h1>
      </div>
      
      <div className="flex flex-col p-4 gap-4">
        {/* Main Form Section */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-3 gap-6">
            {/* Right Column - Property & Payer Info */}
            <div className="space-y-4">
              <PropertySearch />
              <PayerInfo />
            </div>

            {/* Middle Column - Dates & Charge Types */}
            <div className="space-y-4">
              <DateRangeSelect />
              <ChargeTypesSelect />
            </div>

            {/* Action Buttons */}
            <CalculationButtons />
          </div>

          {/* Sizes and Tariffs Table */}
          <SizesTable />
        </div>

        {/* Results Section */}
        {results.length > 0 && <CalculationResults />}
      </div>
    </div>
  );
}

export default App;
