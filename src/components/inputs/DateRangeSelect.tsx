import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

interface DateRangeSelectProps {
  onChange: (startDate: Date | null, endDate: Date | null) => void;
}

const DateRangeSelect: React.FC<DateRangeSelectProps> = ({ onChange }) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const validateDateInput = (dateStr: string): boolean => {
    // נקודת עצירה לדיבוג
    debugger;
    
    if (!dateStr) return true;

    const [year, month, day] = dateStr.split('-').map(Number);

    // בדיקת שנה בת 4 ספרות
    if (year.toString().length !== 4) {
      alert('שנה חייבת להיות בת 4 ספרות');
      return false;
    }

    const today = new Date();
    const inputDate = new Date(year, month - 1, day);

    // בדיקת תאריך עתידי
    if (inputDate > today) {
      alert('לא ניתן להזין תאריך עתידי');
      return false;
    }

    return true;
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    // רק מעדכנים את הערך המוצג
    setStartDate(newDate);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    // רק מעדכנים את הערך המוצג
    setEndDate(newDate);
  };

  // בדיקת תקינות כשיוצאים מהשדה
  const handleDateBlur = (isStart: boolean) => (e: React.FocusEvent<HTMLInputElement>) => {
    debugger;
    const dateValue = e.target.value;
    
    if (validateDateInput(dateValue)) {
      if (isStart) {
        onChange(dateValue ? new Date(dateValue) : null, endDate ? new Date(endDate) : null);
      } else {
        if (startDate && dateValue && new Date(dateValue) < new Date(startDate)) {
          alert('תאריך סיום חייב להיות אחרי תאריך התחלה');
          setEndDate('');
          return;
        }
        onChange(startDate ? new Date(startDate) : null, dateValue ? new Date(dateValue) : null);
      }
    } else {
      // אם הוולידציה נכשלה, מנקים את השדה
      if (isStart) {
        setStartDate('');
      } else {
        setEndDate('');
      }
    }
  };

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
            onBlur={handleDateBlur(true)}
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
            onBlur={handleDateBlur(false)}
            min={startDate}
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