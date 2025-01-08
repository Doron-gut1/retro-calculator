import React from 'react';
import { Property } from '../../types';

interface SizesTableProps {
  property: Property;
}

const SizesTable: React.FC<SizesTableProps> = ({ property }) => {
  // המרת הגדלים לפורמט טבלה
  const sizes = [
    { index: 1, size: property.godel, tariffCode: property.mas },
    { index: 2, size: property.gdl2, tariffCode: property.mas2 },
    { index: 3, size: property.gdl3, tariffCode: property.mas3 },
    { index: 4, size: property.gdl4, tariffCode: property.mas4 },
    { index: 5, size: property.gdl5, tariffCode: property.mas5 },
    { index: 6, size: property.gdl6, tariffCode: property.mas6 },
    { index: 7, size: property.gdl7, tariffCode: property.mas7 },
    { index: 8, size: property.gdl8, tariffCode: property.mas8 },
  ].filter(row => row.size && row.size > 0);

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">גדלים ותעריפים</h3>
        <button className="text-sm text-blue-600 hover:text-blue-800">
          עריכה מרוכזת
        </button>
      </div>
      
      <div className="border rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-2 text-right border-b">מס׳</th>
              <th className="p-2 text-right border-b">גודל</th>
              <th className="p-2 text-right border-b">קוד תעריף</th>
              <th className="p-2 text-right border-b">שם תעריף</th>
              <th className="p-2 text-right border-b">תעריף</th>
              <th className="p-2 text-right border-b">פעולות</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {sizes.map((size) => (
              <tr key={size.index} className="hover:bg-gray-50">
                <td className="p-2">{size.index}</td>
                <td className="p-2">
                  <input 
                    type="number" 
                    className="w-20 p-1 border rounded"
                    value={size.size}
                    readOnly
                  />
                </td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      className="w-20 p-1 border rounded"
                      value={size.tariffCode}
                      readOnly
                    />
                    <button className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200">
                      בחר
                    </button>
                  </div>
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    className="w-full p-1 border rounded bg-gray-50"
                    value=""
                    readOnly
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    className="w-24 p-1 border rounded bg-gray-50"
                    value=""
                    readOnly
                  />
                </td>
                <td className="p-2">
                  <button className="text-red-600 hover:text-red-800">
                    מחק
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td colSpan={6} className="p-2">
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  + הוסף גודל חדש
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="text-sm bg-gray-50 p-2 rounded flex justify-between mt-2">
        <span>סה"כ שטח:</span>
        <span className="font-medium">
          {sizes.reduce((sum, size) => sum + (size.size || 0), 0)} מ"ר
        </span>
      </div>
    </div>
  );
};

export default SizesTable;