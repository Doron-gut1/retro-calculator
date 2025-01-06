import React from 'react';
import { Calculator, Check } from 'lucide-react';

interface Props {
  onCalculate: () => void;
  disabled?: boolean;
}

export const CalculationButtons: React.FC<Props> = ({ onCalculate, disabled }) => {
  const handleApprove = () => {
    // TODO: הוספת לוגיקת אישור
    window.close();
  };

  return (
    <>
      <button
        className="bg-blue-600 text-white p-3 rounded flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onCalculate}
        disabled={disabled}
      >
        <Calculator size={20} />
        חשב
      </button>

      <button
        className="bg-green-600 text-white p-3 rounded flex items-center justify-center gap-2 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleApprove}
        disabled={disabled}
      >
        <Check size={20} />
        אשר
      </button>
    </>
  );
};
