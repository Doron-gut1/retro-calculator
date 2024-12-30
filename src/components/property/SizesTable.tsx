import React, { useState } from 'react';
import { PropertySize } from '../../types/property.types';

export const SizesTable: React.FC = () => {
  const [sizes, setSizes] = useState<PropertySize[]>([]);

  const handleSizeChange = (index: number, newSize: number) => {
    setSizes(
      sizes.map((size) =>
        size.index === index ? { ...size, size: newSize } : size
      )
    );
  };

  const handleTariffSelect = async (index: number) => {
    // TODO: Implement tariff selection dialog
    console.log('Select tariff for size', index);
  };

  const handleDeleteSize = (index: number) => {
    setSizes(sizes.filter((size) => size.index !== index));
  };

  const addNewSize = () => {
    const newIndex = sizes.length > 0 ? Math.max(...sizes.map((s) => s.index)) + 1 : 1;
    setSizes([
      ...sizes,
      {
        index: newIndex,
        size: 0,
        tariffCode: 0,
        tariffName: '',
        price: 0
      }
    ]);
  };

  const totalSize = sizes.reduce((sum, size) => sum + size.size, 0);

  return (
    <div className="mt-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">גדלים ותעריפים</h3>
        <button 
          className="text-sm text-blue-600 hover:text-blue-800"
          onClick={() => console.log('Bulk edit')}
        >
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
                    onChange={(e) => handleSizeChange(size.index, parseFloat(e.target.value) || 0)}
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
                    <button 
                      className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                      onClick={() => handleTariffSelect(size.index)}
                    >
                      בחר
                    </button>
                  </div>
                </td>
                <td className="p-2">
                  <input 
                    type="text" 
                    className="w-full p-1 border rounded bg-gray-50" 
                    value={size.tariffName}
                    readOnly
                  />
                </td>
                <td className="p-2">
                  <input 
                    type="text" 
                    className="w-24 p-1 border rounded bg-gray-50" 
                    value={`₪${size.tariffCode || 0}`}
                    readOnly
                  />
                </td>
                <td className="p-2">
                  <button 
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDeleteSize(size.index)}
                  >
                    מחק
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td colSpan={6} className="p-2">
                <button 
                  className="text-sm text-blue-600 hover:text-blue-800"
                  onClick={addNewSize}
                >
                  + הוסף גודל חדש
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="text-sm bg-gray-50 p-2 rounded flex justify-between">
        <span>סה"כ שטח:</span>
        <span className="font-medium">{totalSize} מ"ר</span>
      </div>
    </div>
  );
};
