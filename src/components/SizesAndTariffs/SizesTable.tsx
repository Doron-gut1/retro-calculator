import React from 'react';
import { Property } from '../../types';
import { Trash2 } from 'lucide-react';

interface SizesTableProps {
  property: Property;
  onDeleteSize?: (index: number) => void;
  onAddSize?: () => void;
}

interface SizeRow {
  index: number;
  size: number;
  code: number;
  name: string | undefined;
}

export const SizesTable: React.FC<SizesTableProps> = ({ property, onDeleteSize, onAddSize }) => {
  const sizes: SizeRow[] = [
    { index: 1, size: property.godel || 0, code: property.mas || 0, name: property.masName },
    { index: 2, size: property.gdl2 || 0, code: property.mas2 || 0, name: property.mas2Name },
    { index: 3, size: property.gdl3 || 0, code: property.mas3 || 0, name: property.mas3Name },
    { index: 4, size: property.gdl4 || 0, code: property.mas4 || 0, name: property.mas4Name },
    { index: 5, size: property.gdl5 || 0, code: property.mas5 || 0, name: property.mas5Name },
    { index: 6, size: property.gdl6 || 0, code: property.mas6 || 0, name: property.mas6Name },
    { index: 7, size: property.gdl7 || 0, code: property.mas7 || 0, name: property.mas7Name },
    { index: 8, size: property.gdl8 || 0, code: property.mas8 || 0, name: property.mas8Name },
  ].filter(row => row.size > 0);

  const totalSize = sizes.reduce((sum, row) => sum + row.size, 0);

  return (
    <div className="mt-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">גדלים ותעריפים</h3>
        <button 
          onClick={() => onAddSize?.()} 
          className="text-sm text-blue-600 hover:text-blue-800">
          + הוסף גודל חדש
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
              <th className="p-2 text-right border-b">פעולות</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {sizes.map((row) => (
              <tr key={row.index} className="hover:bg-gray-50">
                <td className="p-2">{row.index}</td>
                <td className="p-2">
                  <input 
                    type="number" 
                    className="w-20 p-1 border rounded" 
                    value={row.size}
                    readOnly
                  />
                </td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      className="w-20 p-1 border rounded" 
                      value={row.code}
                      readOnly
                    />
                  </div>
                </td>
                <td className="p-2">
                  <input 
                    type="text" 
                    className="w-full p-1 border rounded bg-gray-50" 
                    value={row.name || ''}
                    readOnly
                  />
                </td>
                <td className="p-2">
                  <button 
                    onClick={() => onDeleteSize?.(row.index)}
                    className="text-red-600 hover:text-red-800 flex items-center gap-1">
                    <Trash2 size={16} />
                    מחק
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-sm bg-gray-50 p-2 rounded flex justify-between">
        <span>סה"כ שטח:</span>
        <span className="font-medium">{totalSize} מ"ר</span>
      </div>
    </div>
  );
};
