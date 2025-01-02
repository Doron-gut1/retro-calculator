import { FileText, X } from 'lucide-react';
import type { CalculationResult } from '../../types';
import { useRetroStore } from '../../store';

interface CalculationResultsProps {
  onClose?: () => void;
}

const CalculationResults: React.FC<CalculationResultsProps> = ({ onClose }) => {
  const results = useRetroStore(state => state.results);
  
  const totalSum = results.reduce((sum, row) => sum + row.total, 0);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">תוצאות החישוב</h2>
        <div className="flex gap-2">
          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
            <FileText size={20} />
          </button>
          <button 
            className="p-2 text-red-600 hover:bg-red-50 rounded"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
      </div>
      
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 text-right">תקופה</th>
            <th className="p-2 text-right">סוג חיוב</th>
            <th className="p-2 text-right">סכום</th>
            <th className="p-2 text-right">הנחה</th>
            <th className="p-2 text-right">סה"כ</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {results.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="p-2">{row.period}</td>
              <td className="p-2">{row.chargeType}</td>
              <td className="p-2">₪{row.amount.toLocaleString()}</td>
              <td className="p-2 text-red-600">-₪{row.discount.toLocaleString()}</td>
              <td className="p-2 font-medium">₪{row.total.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-50 font-medium">
          <tr>
            <td colSpan={4} className="p-2">סה"כ</td>
            <td className="p-2">₪{totalSum.toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default CalculationResults;