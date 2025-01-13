import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

interface CalculationButtonsProps {
  onCalculate: () => void;
  disabled: boolean;
}

export const CalculationButtons: React.FC<CalculationButtonsProps> = ({ 
  onCalculate,
  disabled = false 
}) => {
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = async () => {
    setIsCalculating(true);
    try {
      await onCalculate();
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="flex flex-col justify-end gap-2">
      <button
        className="bg-blue-600 text-white p-3 rounded flex items-center justify-center gap-2 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
        onClick={handleCalculate}
        disabled={disabled || isCalculating}
      >
        <Calculator size={20} />
        {isCalculating ? 'מחשב...' : 'חשב'}
      </button>
    </div>
  );
};

export default CalculationButtons;