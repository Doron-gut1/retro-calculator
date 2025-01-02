import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

interface DateRangeSelectProps {
  onChange: (startDate: Date | null, endDate: Date | null) => void;
}

const DateRangeSelect: React.FC<DateRangeSelectProps> = ({ onChange }) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const validateDate = (dateStr: string) => {
    console.log('Validating date:', dateStr);
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log('Parsed date:', date);
    console.log('Is valid date?', !isNaN(date.getTime()));

    // בדיקת תאריך תקין
    if (isNaN(date.getTime())) {
      console.log('Invalid date format');
      alert('תאריך לא תקין');
      return false;
    }

    // בדיקת שנה בת 4 ספרות
    const year = date.getFullYear();
    console.log('Year:', year);
    if (year.toString().length !== 4) {
      console.log('Invalid year length');
      alert('שנה חייבת להיות בת 4 ספרות');
      return false;
    }

    // בדיקה שהתאריך לא עתידי
    console.log('Comparing with today:', today);
    if (date > today) {
      console.log('Future date detected');
      alert('לא ניתן להזין תאריך עתידי');
      return false;
    }

    return true;
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Start date changed:', e.target.value);
    const newDate = e.target.value;
    if (validateDate(newDate)) {
      setStartDate(newDate);
      onChange(new Date(newDate), endDate ? new Date(endDate) : null);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('End date changed:', e.target.value);
    const newDate = e.target.value;
    if (validateDate(newDate)) {
      if (startDate && new Date(newDate) < new Date(startDate)) {
        console.log('End date before start date');
        alert('תאריך סיום חייב להיות אחרי תאריך התחלה');
        return;
      }
      setEndDate(newDate);
      onChange(startDate ? new Date(startDate) : null, new Date(newDate));
    }
  };

  // הגבלת ערכים מקסימליים לתאריך
  const today = new Date().toISOString().split('T')[0];
  console.log('Max date:', today);

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