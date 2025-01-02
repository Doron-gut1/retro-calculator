import React from 'react';
import { Size } from './Size';

interface SizesTableProps {
  sizes: Size[];
  onSizeChange: (index: number, value: number) => void;
  onDelete: (index: number) => void;
  onAdd: () => void;
}

const SizesTable: React.FC<SizesTableProps> = ({ 
  sizes, 
  onSizeChange,
  onDelete,
  onAdd 
}) => {
  const totalSize = sizes.reduce((sum, size) => sum + size.size, 0);

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
            {sizes.map((size, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">
                  <input 
                    type="number" 
                    className="w-20 p-1 border rounded" 
                    value={size.size}
                    onChange={(e) => onSizeChange(index, Number(e.target.value))}
                  />
                </td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      className="w-20 p-1 border rounded" 
                      value={size.code}
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
                    value={size.name}
                    readOnly
                  />
                </td>
                <td className="p-2">
                  <input 
                    type="text" 
                    className="w-24 p-1 border rounded bg-gray-50" 
                    value={`₪${size.price}`}
                    readOnly
                  />
                </td>
                <td className="p-2">
                  <button 
                    className="text-red-600 hover:text-red-800"
                    onClick={() => onDelete(index)}
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
                  onClick={onAdd}
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

export default SizesTable;