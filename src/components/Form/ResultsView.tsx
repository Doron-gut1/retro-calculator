import React from 'react';
import { FileText, X } from 'lucide-react';
import { useRetroStore } from '@/store';
import { formatCurrency, formatDate } from '@/lib/formatters';

export const ResultsView: React.FC = () => {
  const { results, setResults } = useRetroStore();

  const handleClose = () => {
    setResults([]);
  };

  // סיכום התוצאות
  const total = results.reduce((sum, row) => sum + parseFloat(row.paysum || '0'), 0);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">תוצאות החישוב</h2>
        <div className="flex gap-2">
          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
            <FileText size={20} />
          </button>
          <button 
            className="p-2 text-red-600 hover:bg-red-50 rounded"
            onClick={handleClose}
          >
            <X size={20} />
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-right">תקופה</th>
              <th className="p-2 text-right">סוג חיוב</th>
              <th className="p-2 text-right">סכום</th>
              <th className="p-2 text-right">הנחה</th>
              <th className="p-2 text-right">סה"כ</th>
              <th className="p-2 text-right">תאריך גביה</th>
              <th className="p-2 text-right">תאריך ערך</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {results.map((row, index) => {
              const paysum = parseFloat(row.paysum || '0');
              const sumhk = parseFloat(row.sumhk || '0');
              
              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-2">{row.mnt_display}</td>
                  <td className="p-2">{row.sugtsname}</td>
                  <td className="p-2">{formatCurrency(paysum)}</td>
                  <td className="p-2 text-red-600">
                    {sumhk ? `-${formatCurrency(sumhk)}` : ''}
                  </td>
                  <td className="p-2 font-medium">
                    {formatCurrency(paysum - sumhk)}
                  </td>
                  <td className="p-2">{formatDate(row.dtgv)}</td>
                  <td className="p-2">{formatDate(row.dtval)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-gray-50 font-medium">
            <tr>
              <td colSpan={4} className="p-2">סה"כ</td>
              <td className="p-2">{formatCurrency(total)}</td>
              <td colSpan={2}></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
