import React from 'react';
import { Calculator, Check } from 'lucide-react';

interface CalculationButtonsProps {
  onCalculate: () => void;
  onConfirm: () => void;
  disabled?: boolean;
}

const CalculationButtons: React.FC<CalculationButtonsProps> = ({ 
  onCalculate, 
  onConfirm, 
  disabled = false 
}) => {
  return (
    <div className="flex flex-col justify-end gap-2">
      <button
        className="bg-blue-600 text-white p-3 rounded flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50"
        onClick={onCalculate}
        disabled={disabled}
      >
        <Calculator size={20} />
        חשב
      </button>
      <button
        className="bg-green-600 text-white p-3 rounded flex items-center justify-center gap-2 hover:bg-green-700 disabled:opacity-50"
        onClick={onConfirm}
        disabled={disabled}
      >
        <Check size={20} />
        אשר
      </button>
    </div>
  );
};

export default CalculationButtons;