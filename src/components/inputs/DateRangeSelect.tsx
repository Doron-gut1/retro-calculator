import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

interface DateRangeSelectProps {
  onChange: (startDate: Date | null, endDate: Date | null) => void;
}

const DateRangeSelect: React.FC<DateRangeSelectProps> = ({ onChange }) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const validateDateInput = (dateStr: string): boolean => {
    debugger; // נעצור כאן לבדיקה
    console.log('Validating date:', dateStr);

    if (!dateStr) {
      return false;
    }

    const [year, month, day] = dateStr.split('-').map(Number);
    console.log('Parsed date parts:', { year, month, day });

    // בדיקה שהשנה היא מספר בן 4 ספרות
    if (!year || year.toString().length !== 4) {
      console.log('Invalid year length');
      alert('שנה חייבת להיות בת 4 ספרות');
      return false;
    }

    const today = new Date();
    const inputDate = new Date(year, month - 1, day);
    console.log('Input date:', inputDate);
    console.log('Today:', today);

    // בדיקה שהתאריך לא עתידי
    if (inputDate > today) {
      console.log('Future date detected');
      alert('לא ניתן לבחור תאריך עתידי');
      return false;
    }

    // בדיקה שהיום תקין לחודש
    const isValidDate = inputDate.getDate() === day &&
                       inputDate.getMonth() === month - 1 &&
                       inputDate.getFullYear() === year;

    console.log('Is valid date:', isValidDate);
    if (!isValidDate) {
      alert('תאריך לא תקין');
      return false;
    }

    return true;
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debugger; // נעצור כאן לבדיקה
    const newDate = e.target.value;
    console.log('Start date input changed:', newDate);
    
    if (validateDateInput(newDate)) {
      console.log('Setting new start date:', newDate);
      setStartDate(newDate);
      onChange(new Date(newDate), endDate ? new Date(endDate) : null);
    } else {
      console.log('Invalid start date, not setting');
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debugger; // נעצור כאן לבדיקה
    const newDate = e.target.value;
    console.log('End date input changed:', newDate);

    if (validateDateInput(newDate)) {
      if (startDate && new Date(newDate) < new Date(startDate)) {
        console.log('End date before start date');
        alert('תאריך סיום חייב להיות אחרי תאריך התחלה');
        return;
      }
      console.log('Setting new end date:', newDate);
      setEndDate(newDate);
      onChange(startDate ? new Date(startDate) : null, new Date(newDate));
    } else {
      console.log('Invalid end date, not setting');
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
          />
          <button className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200">
            <Calendar size={20} />
          </button>
        </div>
      </div>

      <div className="text-sm text-blue-600">
        {/* הוספת הצגת הערכים הנוכחיים לדיבוג */}
        <div>ערך התחלה נוכחי: {startDate || 'לא נבחר'}</div>
        <div>ערך סיום נוכחי: {endDate || 'לא נבחר'}</div>
      </div>
    </div>
  );
};

export default DateRangeSelect;