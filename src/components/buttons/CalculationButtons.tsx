import React from 'react';
import { Calculator, Check } from 'lucide-react';

export interface CalculationButtonsProps {
  onCalculate: () => Promise<void>;
  disabled?: boolean;
}

export const CalculationButtons: React.FC<CalculationButtonsProps> = ({ 
  onCalculate,
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
        {disabled ? 'מחשב...' : 'חשב'}
      </button>
      <button
        className="bg-green-600 text-white p-3 rounded flex items-center justify-center gap-2 hover:bg-green-700 disabled:opacity-50"
        onClick={() => console.log('אישור הרטרו')}
        disabled={disabled}
      >
        <Check size={20} />
        אשר
      </button>
    </div>
  );
};

export default CalculationButtons;