import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { useRetroStore } from '../../store';

const DateRangeSelect = () => {
  const { startDate, setStartDate, endDate, setEndDate } = useRetroStore();
  const [validationError, setValidationError] = useState('');

  // וולידציה לטווח תאריכים הגיוני
  const validateDates = (start: Date | null, end: Date | null) => {
    if (!start || !end) return;

    const today = new Date();
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(today.getFullYear() + 1);

    if (start > end) {
      setValidationError('תאריך התחלה חייב להיות לפני תאריך סיום');
      return false;
    }
    if (end > oneYearFromNow) {
      setValidationError('תאריך סיום לא יכול להיות מעבר לשנה מהיום');
      return false;
    }
    setValidationError('');
    return true;
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value ? new Date(e.target.value) : null;
    if (validateDates(newDate, endDate)) {
      setStartDate(newDate);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value ? new Date(e.target.value) : null;
    if (validateDates(startDate, newDate)) {
      setEndDate(newDate);
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
            value={startDate?.toISOString().split('T')[0] || ''}
            onChange={handleStartDateChange}
            max={endDate?.toISOString().split('T')[0]}
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
            value={endDate?.toISOString().split('T')[0] || ''}
            onChange={handleEndDateChange}
            min={startDate?.toISOString().split('T')[0]}
          />
          <button className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200">
            <Calendar size={20} />
          </button>
        </div>
      </div>

      {validationError && (
        <div className="text-red-500 text-sm">{validationError}</div>
      )}
    </div>
  );
};

export default DateRangeSelect;