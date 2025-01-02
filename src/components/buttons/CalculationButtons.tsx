import { Calculator, Check } from 'lucide-react';
import { useRetroStore } from '../../store';

const CalculationButtons = () => {
  const { startCalculation, confirmCalculation, property, startDate, endDate, selectedChargeTypes } = useRetroStore();

  const handleCalculate = async () => {
    // וולידציה לפני החישוב
    if (!property) {
      alert('לא נבחר נכס');
      return;
    }
    if (!startDate || !endDate) {
      alert('חובה לבחור תאריכי התחלה וסיום');
      return;
    }
    if (selectedChargeTypes.length === 0) {
      alert('חובה לבחור לפחות סוג חיוב אחד');
      return;
    }

    try {
      await startCalculation();
    } catch (error) {
      alert('אירעה שגיאה בחישוב: ' + (error instanceof Error ? error.message : 'שגיאה לא ידועה'));
    }
  };

  const handleConfirm = async () => {
    try {
      await confirmCalculation();
      alert('החישוב אושר בהצלחה');
    } catch (error) {
      alert('אירעה שגיאה באישור החישוב: ' + (error instanceof Error ? error.message : 'שגיאה לא ידועה'));
    }
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
        onClick={handleConfirm}
      >
        <Check size={20} />
        אשר
      </button>
    </div>
  );
};

export default CalculationButtons;