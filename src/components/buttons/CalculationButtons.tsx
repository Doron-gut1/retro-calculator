import { FC } from 'react';
import { useRetroStore } from '../../store';
import { Calculator, Check } from 'lucide-react';

export const CalculationButtons: FC = () => {
  const { startCalculation, confirmCalculation } = useRetroStore();

  return (
    <div className="flex flex-col justify-end gap-2">
      <button 
        className="bg-blue-600 text-white p-3 rounded flex items-center justify-center gap-2 hover:bg-blue-700"
        onClick={startCalculation}
      >
        <Calculator size={20} />
        חשב
      </button>
      <button 
        className="bg-green-600 text-white p-3 rounded flex items-center justify-center gap-2 hover:bg-green-700"
        onClick={confirmCalculation}
      >
        <Check size={20} />
        אשר
      </button>
    </div>
  );
};