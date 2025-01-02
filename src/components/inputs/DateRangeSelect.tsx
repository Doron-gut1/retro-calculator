import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

interface DateRangeSelectProps {
  onChange: (startDate: Date | null, endDate: Date | null) => void;
}

const DateRangeSelect: React.FC<DateRangeSelectProps> = ({ onChange }) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const validateDateInput = (dateStr: string): boolean => {
    // בדיקה שהשנה היא בת 4 ספרות בדיוק
    const yearMatch = dateStr.match(/^\d{4}-\d{2}-\d{2}$/);
    if (!yearMatch) {
      alert('פורמט תאריך לא תקין. השנה חייבת להיות בת 4 ספרות בדיוק');
      return false;
    }

    const today = new Date();
    const date = new Date(dateStr);

    // בדיקה שהתאריך לא עתידי
    if (date > today) {
      alert('לא ניתן לבחור תאריך עתידי');
      return false;
    }

    // בדיקת תאריך תקין
    if (isNaN(date.getTime())) {
      alert('תאריך לא תקין');
      return false;
    }

    return true;
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    console.log('Start date input:', newDate);
    
    if (!newDate || validateDateInput(newDate)) {
      setStartDate(newDate);
      onChange(newDate ? new Date(newDate) : null, endDate ? new Date(endDate) : null);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    console.log('End date input:', newDate);

    if (!newDate || validateDateInput(newDate)) {
      if (startDate && new Date(newDate) < new Date(startDate)) {
        alert('תאריך סיום חייב להיות אחרי תאריך התחלה');
        return;
      }
      setEndDate(newDate);
      onChange(startDate ? new Date(startDate) : null, new Date(newDate));
    }
  };

  // הגבלת ערך מקסימלי
  const maxDate = new Date();
  maxDate.setHours(0, 0, 0, 0);
  const maxDateString = maxDate.toISOString().split('T')[0];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium">תאריך התחלה</label>
        <div className="flex gap-2">
          <input 
            type="date" 
            className="flex-1 p-2 border rounded" 
            value={startDate}
            onChange={handleStartDateChange}
            max={maxDateString}
          />
          <button className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200">
            <Calendar size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">תאריך סיום</label>
        <div className="flex gap-2">
          <input 
            type="date" 
            className="flex-1 p-2 border rounded" 
            value={endDate}
            onChange={handleEndDateChange}
            min={startDate}
            max={maxDateString}
          />
          <button className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200">
            <Calendar size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateRangeSelect;