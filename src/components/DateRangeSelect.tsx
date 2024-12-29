import React from 'react';
import { Calendar } from 'lucide-react';
import { useCalculationStore } from '../stores/calculationStore';

export const DateRangeSelect: React.FC = () => {
  const { period, setPeriod } = useCalculationStore();

  const handleStartDateChange = (date: string) => {
    if (!period) return;
    setPeriod({
      ...period,
      startDate: new Date(date)
    });
  };

  const handleEndDateChange = (date: string) => {
    if (!period) return;
    setPeriod({
      ...period,
      endDate: new Date(date)
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium">תאריך התחלה</label>
        <div className="flex gap-2">
          <input 
            type="date" 
            className="flex-1 p-2 border rounded"
            value={period?.startDate.toISOString().split('T')[0] || ''}
            onChange={(e) => handleStartDateChange(e.target.value)}
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
            value={period?.endDate.toISOString().split('T')[0] || ''}
            onChange={(e) => handleEndDateChange(e.target.value)}
          />
          <button className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200">
            <Calendar size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
