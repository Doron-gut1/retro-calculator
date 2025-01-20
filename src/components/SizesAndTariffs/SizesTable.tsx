import React, { useState, useEffect } from 'react';
import { Property } from '../../types';
import { Trash2 } from 'lucide-react';
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
  const { tariffs, isLoading: tariffsLoading, fetchTariffs } = useTariffStore();

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
  ].filter(row => row.size != null);

  const totalSize = sizes.reduce((sum, row) => sum + row.size, 0);

  const handleSizeChange = (index: number, newValue: string) => {
    const numValue = Number(newValue);
    if (!isNaN(numValue) && onUpdateSize) {
      onUpdateSize(index, numValue);
    }
  };

  const handleTariffChange = (index: number, tariffKodln: string) => {
    console.log('Tariff Change Called:', { index, tariffKodln });
    console.log('Available Tariffs:', tariffs);
    
    // נוודא שיש לנו מספר בשביל ההשוואה
    const tariffCode = parseInt(tariffKodln, 10);
    console.log('Parsed Tariff Code:', tariffCode);
    
    const selectedTariff = tariffs.find(t => {
      // נוודא שאנחנו משווים מספרים
      const tKodln = typeof t.kodln === 'string' ? parseInt(t.kodln, 10) : t.kodln;
      return tKodln === tariffCode;
    });
    
    console.log('Selected Tariff:', selectedTariff);
    
    if (selectedTariff && onUpdateTariff) {
      console.log('Calling onUpdateTariff with:', {
        index,
        kodln: selectedTariff.kodln,
        teur: selectedTariff.teur
      });
      onUpdateTariff(index, selectedTariff.kodln.toString(), selectedTariff.teur);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="bg-blue-500 text-white p-4 rounded-t">
        <h3 className="font-bold">גדלים ותעריפים</h3>
        <button 
          onClick={() => onAddSize?.()} 
          className="text-white hover:bg-blue-600 text-sm flex items-center gap-1">
          + הוסף גודל חדש
        </button>
      </div>
      
      <table className="w-full text-sm">
        <thead className="bg-blue-100 text-blue-800">
          <tr>
            <th className="p-2 text-right border-b">מס׳</th>
            <th className="p-2 text-right border-b">גודל</th>
            <th className="p-2 text-right border-b">קוד תעריף ושם תעריף</th>
            <th className="p-2 text-right border-b">פעולות</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {sizes.map((row) => (
            <tr key={row.index} className="hover:bg-blue-50">
              <td className="p-2">{row.index}</td>
              <td className="p-2">
                <input 
                  type="number" 
                  className="w-20 p-2 border rounded" 
                  value={row.size}
                  onChange={(e) => handleSizeChange(row.index, e.target.value)}
                />
              </td>
              <td className="p-2">
                <select
                  className="w-full p-2 border rounded"
                  value={row.code ? row.code.toString() : ""}
                  onChange={(e) => handleTariffChange(row.index, e.target.value)}
                >
                  <option value="">בחר תעריף</option>
                  {tariffs.map((tariff) => {
                    // המרה בטוחה לstring
                    const displayValue = tariff.kodln.toString();
                    return (
                      <option key={displayValue} value={displayValue}>
                        {`${displayValue} - ${tariff.teur}`}
                      </option>
                    );
                  })}
                </select>
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

      <div className="bg-blue-100 p-3 rounded-b flex justify-between items-center">
        <span>סה"כ שטח:</span>
        <span className="font-medium text-blue-800">{totalSize} מ"ר</span>
      </div>
    </div>
  );
};