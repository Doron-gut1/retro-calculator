import React from 'react';
import { useRetroStore } from '@/store';

export const SizesTable: React.FC = () => {
  const { property } = useRetroStore();

  if (!property) return null;

  return (
    <div className="mt-6 space-y-4">
      <div className="flex justify-between items-center">
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
            {/* TODO: Add real data */}
            <tr className="hover:bg-gray-50">
              <td className="p-2">1</td>
              <td className="p-2">
                <input
                  type="number"
                  className="w-20 p-1 border rounded"
                  defaultValue="80"
                />
              </td>
              <td className="p-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="w-20 p-1 border rounded"
                    defaultValue="101"
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
                  defaultValue="מגורים רגיל"
                  readOnly
                />
              </td>
              <td className="p-2">
                <input
                  type="text"
                  className="w-24 p-1 border rounded bg-gray-50"
                  defaultValue="₪100"
                  readOnly
                />
              </td>
              <td className="p-2">
                <button className="text-red-600 hover:text-red-800">
                  מחק
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="text-sm bg-gray-50 p-2 rounded flex justify-between">
        <span>סה"כ שטח:</span>
        <span className="font-medium">80 מ"ר</span>
      </div>
    </div>
  );
};
