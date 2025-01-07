import React from 'react';
import { useRetroStore } from '@/store';

export const SizesTable: React.FC = () => {
  const { property } = useRetroStore();

  if (!property?.sizes) return null;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">גדלים ותעריפים</h3>
        <button className="text-sm text-blue-600 hover:text-blue-800">
          עריכה מרוכזת
        </button>
      </div>

      <table className="w-full border-collapse">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 text-right border">מס׳</th>
            <th className="p-2 text-right border">גודל</th>
            <th className="p-2 text-right border">קוד תעריף</th>
            <th className="p-2 text-right border">שם תעריף</th>
            <th className="p-2 text-right border">תעריף</th>
            <th className="p-2 text-right border">פעולות</th>
          </tr>
        </thead>
        <tbody>
          {property.sizes.map((size, index) => (
            <tr key={size.id} className="hover:bg-gray-50">
              <td className="p-2 border">{index + 1}</td>
              <td className="p-2 border">{size.size}</td>
              <td className="p-2 border">{size.tariff.code}</td>
              <td className="p-2 border">{size.tariff.name}</td>
              <td className="p-2 border">{size.tariff.amount}</td>
              <td className="p-2 border">
                <button className="text-red-600 hover:text-red-800">
                  מחק
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-sm bg-gray-50 p-2 rounded flex justify-between">
        <span>סה"כ שטח:</span>
        <span className="font-medium">
          {property.sizes.reduce((sum, size) => sum + size.size, 0)} מ"ר
        </span>
      </div>
    </div>
  );
};

export default SizesTable;