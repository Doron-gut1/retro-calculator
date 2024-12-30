import React from 'react';
import { Calculator, Check } from 'lucide-react';
import { useCalculationStore } from '../../store';

export const CalculationButtons = () => {
  const { calculate, isCalculating } = useCalculationStore();

  return (
    <div className="flex flex-col justify-end gap-2">
      <button 
        className="bg-blue-600 text-white p-3 rounded flex items-center justify-center gap-2 hover:bg-blue-700"
        onClick={() => calculate()}
        disabled={isCalculating}
      >
        <Calculator size={20} />
        חשב
      </button>
      
      <button 
        className="bg-green-600 text-white p-3 rounded flex items-center justify-center gap-2 hover:bg-green-700"
        disabled={isCalculating}
      >
        <Check size={20} />
        אשר
      </button>
    </div>
  );
};
