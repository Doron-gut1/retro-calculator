import { Calendar } from 'lucide-react';
import { useRetroStore } from '../../store';

const DateRangeSelect = () => {
  const { 
    startDate, 
    setStartDate, 
    endDate, 
    setEndDate,
    errors 
  } = useRetroStore();

  const dateErrors = errors.filter(error => error.field === 'dates');

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium">תאריך התחלה</label>
        <div className="flex gap-2">
          <input 
            type="date" 
            className="flex-1 p-2 border rounded" 
            value={startDate?.toISOString().split('T')[0] || ''}
            onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
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
            onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
            min={startDate?.toISOString().split('T')[0]}
          />
          <button className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200">
            <Calendar size={20} />
          </button>
        </div>
      </div>

      {dateErrors.map((error, index) => (
        <div key={index} className="text-red-500 text-sm">
          {error.message}
        </div>
      ))}
    </div>
  );
};

export default DateRangeSelect;