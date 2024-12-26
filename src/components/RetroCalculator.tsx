import React, { useState } from 'react';
import { Search, Calendar, FileText, Calculator, Check, X } from 'lucide-react';
import PropertySearch from './property/PropertySearch';
import PayerInfo from './property/PayerInfo';
import DateRangeSelector from './inputs/DateRangeSelector';
import ChargeTypesSelector from './inputs/ChargeTypesSelector';
import SizesAndTariffs from './tariffs/SizesAndTariffs';
import CalculationResults from './results/CalculationResults';

export interface Property {
  propertyId: string;
  address: string;
  payerId: string;
  payerName: string;
  sizes: Array<{
    id: number;
    size: number;
    tariffCode: string;
    tariffName: string;
    tariffAmount: number;
  }>;
}

export interface CalculationResult {
  period: string;
  chargeType: string;
  amount: number;
  discount: number;
  total: number;
}

const RetroCalculator: React.FC = () => {
  const [property, setProperty] = useState<Property | null>(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedChargeTypes, setSelectedChargeTypes] = useState<string[]>(['ארנונה']);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<CalculationResult[]>([]);

  const handlePropertySearch = async (propertyId: string) => {
    // TODO: Implement property search API call
    console.log('Searching for property:', propertyId);
  };

  const handlePayerChange = async (payerId: string) => {
    // TODO: Implement payer change API call
    console.log('Changing payer to:', payerId);
  };

  const handleCalculate = async () => {
    if (!property || !dateRange.start || !dateRange.end || selectedChargeTypes.length === 0) {
      alert('נא למלא את כל השדות הנדרשים');
      return;
    }

    try {
      // TODO: Implement calculation API call
      console.log('Calculating with params:', { property, dateRange, selectedChargeTypes });
      setShowResults(true);
    } catch (error) {
      console.error('Calculation failed:', error);
      alert('שגיאה בביצוע החישוב');
    }
  };

  const handleApprove = async () => {
    if (!showResults) {
      alert('נא לבצע חישוב לפני אישור');
      return;
    }

    try {
      // TODO: Implement approval API call
      console.log('Approving calculation');
    } catch (error) {
      console.error('Approval failed:', error);
      alert('שגיאה באישור החישוב');
    }
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
              <PropertySearch onSearch={handlePropertySearch} />
              {property && (
                <PayerInfo
                  payerId={property.payerId}
                  payerName={property.payerName}
                  onPayerChange={handlePayerChange}
                />
              )}
            </div>

            <div className="space-y-4">
              <DateRangeSelector
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
              />
              <ChargeTypesSelector
                selected={selectedChargeTypes}
                onSelectionChange={setSelectedChargeTypes}
              />
            </div>

            <div className="flex flex-col justify-end gap-2">
              <button
                onClick={handleCalculate}
                className="bg-blue-600 text-white p-3 rounded flex items-center justify-center gap-2 hover:bg-blue-700"
              >
                <Calculator size={20} />
                חשב
              </button>
              <button
                onClick={handleApprove}
                className="bg-green-600 text-white p-3 rounded flex items-center justify-center gap-2 hover:bg-green-700"
              >
                <Check size={20} />
                אשר
              </button>
            </div>
          </div>

          {property && (
            <SizesAndTariffs
              sizes={property.sizes}
              onSizesChange={(sizes) => setProperty({ ...property, sizes })}
            />
          )}
        </div>

        {showResults && <CalculationResults results={results} />}
      </div>
    </div>
  );
};

export default RetroCalculator;