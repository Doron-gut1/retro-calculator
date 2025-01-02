import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

interface DateRangeSelectProps {
  onChange: (startDate: Date | null, endDate: Date | null) => void;
}

const DateRangeSelect: React.FC<DateRangeSelectProps> = ({ onChange }) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const validateDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // בדיקת תאריך תקין
    if (isNaN(date.getTime())) {
      alert('תאריך לא תקין');
      return false;
    }

    // בדיקת שנה בת 4 ספרות
    const year = date.getFullYear();
    if (year.toString().length !== 4) {
      alert('שנה חייבת להיות בת 4 ספרות');
      return false;
    }

    // בדיקה שהתאריך לא עתידי
    if (date > today) {
      alert('לא ניתן להזין תאריך עתידי');
      return false;
    }

    return true;
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    if (validateDate(newDate)) {
      setStartDate(newDate);
      onChange(new Date(newDate), endDate ? new Date(endDate) : null);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    if (validateDate(newDate)) {
      if (startDate && new Date(newDate) < new Date(startDate)) {
        alert('תאריך סיום חייב להיות אחרי תאריך התחלה');
        return;
      }
      setEndDate(newDate);
      onChange(startDate ? new Date(startDate) : null, new Date(newDate));
    }
  };

  // הגבלת ערכים מקסימליים לתאריך
  const today = new Date().toISOString().split('T')[0];

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
            max={today}
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
            max={today}
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