import React from 'react';
import { useRetroStore } from '../../store/retroStore';

const SizesAndTariffs: React.FC = () => {
  const { property } = useRetroStore();

  if (!property) return null;

  // הכנת הנתונים לטבלה - ממיר את המבנה לפורמט מתאים לתצוגה
  const rows = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    size: property.sizes[`gdl${i + 1}` as keyof typeof property.sizes] || 0,
    tariffCode: property.tariffs[`trf${i + 1}` as keyof typeof property.tariffs] || 0,
  })).filter(row => row.size > 0 || row.tariffCode > 0);

  const totalSize = rows.reduce((sum, row) => sum + row.size, 0);

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
              <th className="p-2 text-right border-b">מס'</th>
              <th className="p-2 text-right border-b">גודל</th>
              <th className="p-2 text-right border-b">קוד תעריף</th>
              <th className="p-2 text-right border-b">שם תעריף</th>
              <th className="p-2 text-right border-b">תעריף</th>
              <th className="p-2 text-right border-b">פעולות</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="p-2">{row.id}</td>
                <td className="p-2">
                  <input 
                    type="number" 
                    className="w-20 p-1 border rounded" 
                    value={row.size}
                    onChange={(e) => {
                      // TODO: Implement size update logic
                      console.log('Size updated:', e.target.value);
                    }}
                  />
                </td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      className="w-20 p-1 border rounded" 
                      value={row.tariffCode}
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
                    value="" // TODO: Get tariff name from Access
                    readOnly
                  />
                </td>
                <td className="p-2">
                  <input 
                    type="text" 
                    className="w-24 p-1 border rounded bg-gray-50" 
                    value="" // TODO: Get tariff amount from Access
                    readOnly
                  />
                </td>
                <td className="p-2">
                  <button 
                    className="text-red-600 hover:text-red-800"
                    onClick={() => {
                      // TODO: Implement delete logic
                      console.log('Delete row:', row.id);
                    }}
                  >
                    מחק
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          {rows.length < 8 && (
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={6} className="p-2">
                  <button 
                    className="text-sm text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      // TODO: Implement add row logic
                      console.log('Add new row');
                    }}
                  >
                    + הוסף גודל חדש
                  </button>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      <div className="text-sm bg-gray-50 p-2 rounded flex justify-between">
        <span>סה"כ שטח:</span>
        <span className="font-medium">{totalSize} מ"ר</span>
      </div>
    </div>
  );
};

export default SizesAndTariffs;