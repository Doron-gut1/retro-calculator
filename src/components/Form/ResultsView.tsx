import React from 'react';
import { FileText, X } from 'lucide-react';
import { useRetroStore } from '@/store';

export const ResultsView: React.FC = () => {
  const { results } = useRetroStore();

  const mockData = [
    { id: 1, period: '01/2024', type: 'ארנונה', amount: 1500, discount: -150, total: 1350 },
    { id: 2, period: '01/2024', type: 'מים', amount: 800, discount: -80, total: 720 },
    { id: 3, period: '01/2024', type: 'ביוב', amount: 400, discount: -40, total: 360 }
  ];

  const totalAmount = mockData.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">תוצאות החישוב</h2>
        <div className="flex gap-2">
          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
            <FileText size={20} />
          </button>
          <button className="p-2 text-red-600 hover:bg-red-50 rounded">
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
            </tr>
          </thead>
          <tbody className="divide-y">
            {mockData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="p-2">{row.period}</td>
                <td className="p-2">{row.type}</td>
                <td className="p-2">₪{row.amount.toLocaleString()}</td>
                <td className="p-2 text-red-600">-₪{Math.abs(row.discount).toLocaleString()}</td>
                <td className="p-2 font-medium">₪{row.total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50 font-medium">
            <tr>
              <td colSpan={4} className="p-2">סה"כ</td>
              <td className="p-2">₪{totalAmount.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};