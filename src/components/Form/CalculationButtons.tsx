import React from 'react';
import { Calculator, Check, Undo2, Redo2 } from 'lucide-react';
import { useRetroStore } from '@/store';

interface CalculationButtonsProps {
  onCalculate: () => void;
  disabled?: boolean;
}

export const CalculationButtons: React.FC<CalculationButtonsProps> = ({ 
  onCalculate,
  disabled = false 
}) => {
  const { undo, redo } = useRetroStore();

  return (
    <div className="space-y-2">
      {/* History Controls */}
      <div className="flex gap-2 mb-4">
        <button
          className="p-2 text-gray-600 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={undo}
          disabled={disabled}
          title="בטל"
        >
          <Undo2 size={20} />
        </button>
        <button
          className="p-2 text-gray-600 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={redo}
          disabled={disabled}
          title="בצע שוב"
        >
          <Redo2 size={20} />
        </button>
      </div>

      {/* Main Actions */}
      <button
        className="w-full bg-blue-600 text-white p-3 rounded flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        onClick={onCalculate}
        disabled={disabled}
      >
        <Calculator size={20} />
        חשב
      </button>
      <button
        className="w-full bg-green-600 text-white p-3 rounded flex items-center justify-center gap-2 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        disabled={disabled}
      >
        <Check size={20} />
        אשר
      </button>
    </div>
  );
};