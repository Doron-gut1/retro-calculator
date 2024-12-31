import React from 'react';
import { FileText, X } from 'lucide-react';

interface ResultsTableProps {
  results: {
    success: boolean;
    results?: any[];
    totals?: {
      totalAmount: number;
      totalDiscount: number;
      finalAmount: number;
    };
    error?: string;
  };
  onClose?: () => void;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ results, onClose }) => {
  if (!results.success || !results.results) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-red-600">שגיאה בחישוב</h2>
          <button onClick={onClose} className="p-2 text-red-600 hover:bg-red-50 rounded">
            <X size={20} />
          </button>
        </div>
        <p>{results.error || 'אירעה שגיאה בלתי צפויה'}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">תוצאות החישוב</h2>
        <div className="flex gap-2">
          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
            <FileText size={20} />
          </button>
          <button onClick={onClose} className="p-2 text-red-600 hover:bg-red-50 rounded">
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
          {results.results.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="p-2">{row.period}</td>
              <td className="p-2">{row.chargeType}</td>
              <td className="p-2">₪{row.amount.toFixed(2)}</td>
              <td className="p-2 text-red-600">-₪{row.discount.toFixed(2)}</td>
              <td className="p-2 font-medium">₪{row.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        {results.totals && (
          <tfoot className="bg-gray-50 font-medium">
            <tr>
              <td colSpan={4} className="p-2">סה"כ</td>
              <td className="p-2">₪{results.totals.finalAmount.toFixed(2)}</td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};