import React from 'react';
import { Calculator, Check } from 'lucide-react';
import { useCalculationStore } from '../stores/calculationStore';
import { usePropertyStore } from '../stores/propertyStore';
import { CalculationService } from '../services/calculationService';

export const CalculationButtons: React.FC = () => {
  const { property } = usePropertyStore();
  const { 
    period, 
    chargeTypes, 
    setResults, 
    setCalculating,
    setError 
  } = useCalculationStore();

  const handleCalculate = async () => {
    if (!property || !period) return;

    setCalculating(true);
    setError(null);

    try {
      const calculationService = new CalculationService();
      const results = await calculationService.calculateRetro(
        property,
        period,
        chargeTypes
      );
      setResults(results);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'אירעה שגיאה בחישוב');
    } finally {
      setCalculating(false);
    }
  };

  const handleApprove = () => {
    // TODO: Implement approval logic
    console.log('Approve calculation');
  };

  return (
    <div className="flex flex-col justify-end gap-2">
      <button 
        className="bg-blue-600 text-white p-3 rounded flex items-center justify-center gap-2 hover:bg-blue-700"
        onClick={handleCalculate}
      >
        <Calculator size={20} />
        חשב
      </button>
      <button 
        className="bg-green-600 text-white p-3 rounded flex items-center justify-center gap-2 hover:bg-green-700"
        onClick={handleApprove}
      >
        <Check size={20} />
        אשר
      </button>
    </div>
  );
};
