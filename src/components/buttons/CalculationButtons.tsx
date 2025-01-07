import React, { useState } from 'react';
import axios from 'axios';
import { Calculator, Check } from 'lucide-react';

// DTOs נדרשים בהתאם לקוד הבקאנד
interface SizeTariff {
  index: number;
  size: number;
  tariffCode: number;
}

interface RetroCalculationRequest {
  propertyId: string;
  startDate: string;
  endDate: string;
  chargeTypes: number[];
  sizesAndTariffs: SizeTariff[];
}

interface CalculationButtonsProps {
  propertyId: string;
  startDate: string;
  endDate: string;
  chargeTypes: number[];
  sizes: SizeTariff[];
  onResultsReceived: (results: any) => void;
  disabled?: boolean;
}

const CalculationButtons: React.FC<CalculationButtonsProps> = ({ 
  propertyId, 
  startDate, 
  endDate, 
  chargeTypes,
  sizes,
  onResultsReceived,
  disabled = false 
}) => {
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = async () => {
    // אימות תקינות נתונים
    if (!propertyId || !startDate || !endDate || chargeTypes.length === 0) {
      alert('אנא מלא את כל השדות הנדרשים');
      return;
    }

    setIsCalculating(true);

    const requestBody: RetroCalculationRequest = {
      propertyId,
      startDate,
      endDate,
      chargeTypes,
      sizesAndTariffs: sizes
    };

    try {
      const response = await axios.post(
        '/api/Retro/calculate', 
        requestBody,
        { 
          params: { 
            // כאן תעביר את שם ה-ODBC שלך 
            // ייתכן שתרצה לקחת אותו מהגדרות או מסביבת עבודה
            odbcName: 'YourOdbcConnectionName' 
          }
        }
      );

      // שליחת התוצאות לקומפוננט האב
      onResultsReceived(response.data);
    } catch (error) {
      console.error('שגיאה בחישוב רטרו:', error);
      alert('לא הצלחנו לבצע את החישוב. אנא נסה שוב.');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleConfirm = () => {
    // TODO: יישום לוגיקת אישור
    console.log('אישור הרטרו');
  };

  return (
    <div className="flex flex-col justify-end gap-2">
      <button
        className="bg-blue-600 text-white p-3 rounded flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50"
        onClick={handleCalculate}
        disabled={disabled || isCalculating}
      >
        <Calculator size={20} />
        {isCalculating ? 'מחשב...' : 'חשב'}
      </button>
      <button
        className="bg-green-600 text-white p-3 rounded flex items-center justify-center gap-2 hover:bg-green-700 disabled:opacity-50"
        onClick={handleConfirm}
        disabled={disabled}
      >
        <Check size={20} />
        אשר
      </button>
    </div>
  );
};

export default CalculationButtons;