import React from 'react';
import { Calendar } from 'lucide-react';
import { useRetroStore } from '../../store/retroStore';

const DateRangeSelector: React.FC = () => {
  const { dateRange, setDateRange } = useRetroStore();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium">תאריך התחלה</label>
        <div className="flex gap-2">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="flex-1 p-2 border rounded"
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
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="flex-1 p-2 border rounded"
          />
          <button className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200">
            <Calendar size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateRangeSelector;