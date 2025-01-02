import React from 'react';
import { Calendar } from 'lucide-react';
import { useRetroStore } from '@/store';
import { useErrorStore } from '@/lib/ErrorManager';

export const DateRange: React.FC = () => {
  const { startDate, endDate, setStartDate, setEndDate } = useRetroStore();
  const { getFieldErrors } = useErrorStore();

  const startErrors = getFieldErrors('startDate');
  const endErrors = getFieldErrors('endDate');

  return (
    <div className="space-y-4">
      {/* Start Date */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">תאריך התחלה</label>
        <div className="flex gap-2">
          <input
            type="date"
            className={`flex-1 p-2 border rounded ${startErrors.length > 0 ? 'border-red-500' : ''}`}
            value={startDate ? startDate.toISOString().split('T')[0] : ''}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <button className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200">
            <Calendar size={20} />
          </button>
        </div>
        {startErrors.length > 0 && (
          <p className="text-sm text-red-500 mt-1">{startErrors[0].message}</p>
        )}
      </div>

      {/* End Date */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">תאריך סיום</label>
        <div className="flex gap-2">
          <input
            type="date"
            className={`flex-1 p-2 border rounded ${endErrors.length > 0 ? 'border-red-500' : ''}`}
            value={endDate ? endDate.toISOString().split('T')[0] : ''}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200">
            <Calendar size={20} />
          </button>
        </div>
        {endErrors.length > 0 && (
          <p className="text-sm text-red-500 mt-1">{endErrors[0].message}</p>
        )}
      </div>
    </div>
  );
};