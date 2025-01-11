import React, { useState, useEffect } from 'react';
import { Property } from '../../types';
import { Trash2, Edit, Save, X } from 'lucide-react';
import { useTariffStore } from '../../store';

interface SizesTableProps {
  property: Property;
  odbcName?: string;
  onDeleteSize?: (index: number) => void;
  onAddSize?: () => void;
  onUpdateSize?: (index: number, newSize: number) => void;
  onUpdateTariff?: (index: number, tariffKodln: string, tariffName: string) => void;
}

interface SizeRow {
  index: number;
  size: number;
  code: number;
  name: string | null;
}

export const SizesTable: React.FC<SizesTableProps> = ({ 
  property, 
  odbcName,
  onDeleteSize, 
  onAddSize, 
  onUpdateSize,
  onUpdateTariff
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<number | string>('');
  
  // הוספת שימוש בstore של התעריפים
  const { tariffs, isLoading: tariffsLoading, fetchTariffs } = useTariffStore();

  // טעינת התעריפים בעת טעינת הקומפוננטה
  useEffect(() => {
    if (odbcName) {
      fetchTariffs(odbcName);
    }
  }, [odbcName, fetchTariffs]);

  const sizes: SizeRow[] = [
    { index: 1, size: property.godel || 0, code: property.mas || 0, name: property.masName || null },
    { index: 2, size: property.gdl2 || 0, code: property.mas2 || 0, name: property.mas2Name || null },
    { index: 3, size: property.gdl3 || 0, code: property.mas3 || 0, name: property.mas3Name || null },
    { index: 4, size: property.gdl4 || 0, code: property.mas4 || 0, name: property.mas4Name || null },
    { index: 5, size: property.gdl5 || 0, code: property.mas5 || 0, name: property.mas5Name || null },
    { index: 6, size: property.gdl6 || 0, code: property.mas6 || 0, name: property.mas6Name || null },
    { index: 7, size: property.gdl7 || 0, code: property.mas7 || 0, name: property.mas7Name || null },
    { index: 8, size: property.gdl8 || 0, code: property.mas8 || 0, name: property.mas8Name || null },
  ].filter(row => row.size > 0);

  const totalSize = sizes.reduce((sum, row) => sum + row.size, 0);

  const handleEditStart = (index: number, currentSize: number) => {
    setEditingIndex(index);
    setEditValue(currentSize);
  };

  const handleEditCancel = () => {
    setEditingIndex(null);
    setEditValue('');
  };

  const handleEditSave = () => {
    if (editingIndex !== null) {
      const numValue = Number(editValue);
      if (!isNaN(numValue) && onUpdateSize) {
        onUpdateSize(editingIndex, numValue);
      }
      handleEditCancel();
    }
  };

  const handleTariffChange = (index: number, tariffKodln: string) => {
    const selectedTariff = tariffs.find(t => t.kodln === tariffKodln);
    if (selectedTariff && onUpdateTariff) {
      onUpdateTariff(index, selectedTariff.kodln, selectedTariff.teur);
    }
  };

  if (tariffsLoading) {
    return <div className="text-center p-4">טוען תעריפים...</div>;
  }

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
                  {editingIndex === row.index ? (
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        className="w-20 p-1 border rounded" 
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        autoFocus
                      />
                      <button 
                        onClick={handleEditSave} 
                        className="text-green-600 hover:text-green-800"
                      >
                        <Save size={16} />
                      </button>
                      <button 
                        onClick={handleEditCancel} 
                        className="text-red-600 hover:text-red-800"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        className="w-20 p-1 border rounded" 
                        value={row.size}
                        readOnly
                      />
                      <button 
                        onClick={() => handleEditStart(row.index, row.size)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={16} />
                      </button>
                    </div>
                  )}
                </td>
                <td className="p-2">
                  <select
                    className="w-24 p-1 border rounded"
                    value={row.code.toString()}
                    onChange={(e) => handleTariffChange(row.index, e.target.value)}
                  >
                    <option value="">בחר תעריף</option>
                    {tariffs.map((tariff) => (
                      <option key={tariff.kodln} value={tariff.kodln}>
                        {tariff.kodln}
                      </option>
                    ))}
                  </select>
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