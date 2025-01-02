import React, { useState } from 'react';
import { TariffInput } from '../inputs/TariffInput';

interface Size {
  id: number;
  size: number;
  tariffCode: string;
  tariffName: string;
  tariffAmount: string;
}

interface SizesAndTariffsProps {
  sizes: Size[];
  onSizesChange: (sizes: Size[]) => void;
}

export const SizesAndTariffs: React.FC<SizesAndTariffsProps> = ({ sizes, onSizesChange }) => {
  const handleSizeChange = (id: number, value: number) => {
    onSizesChange(sizes.map(size => 
      size.id === id ? { ...size, size: value } : size
    ));
  };

  const handleTariffCodeChange = (id: number, code: string) => {
    onSizesChange(sizes.map(size => 
      size.id === id ? { ...size, tariffCode: code } : size
    ));
  };

  const handleTariffSelect = (id: number, tariff: { kod: string; name: string; amount: number }) => {
    onSizesChange(sizes.map(size => 
      size.id === id 
        ? { 
            ...size, 
            tariffCode: tariff.kod,
            tariffName: tariff.name,
            tariffAmount: tariff.amount.toString()
          } 
        : size
    ));
  };

  const addNewSize = () => {
    const newId = sizes.length > 0 ? Math.max(...sizes.map(s => s.id)) + 1 : 1;
    onSizesChange([...sizes, {
      id: newId,
      size: 0,
      tariffCode: '',
      tariffName: '',
      tariffAmount: '0'
    }]);
  };

  const deleteSize = (id: number) => {
    onSizesChange(sizes.filter(size => size.id !== id));
  };

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
            {sizes.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="p-2">{row.id}</td>
                <td className="p-2">
                  <input 
                    type="number" 
                    className="w-20 p-1 border rounded" 
                    value={row.size}
                    onChange={(e) => handleSizeChange(row.id, Number(e.target.value))}
                  />
                </td>
                <td className="p-2">
                  <TariffInput
                    tariffCode={row.tariffCode}
                    tariffName={row.tariffName}
                    tariffAmount={row.tariffAmount}
                    onTariffSelect={(tariff) => handleTariffSelect(row.id, tariff)}
                    onTariffCodeChange={(code) => handleTariffCodeChange(row.id, code)}
                  />
                </td>
                <td className="p-2">
                  <input 
                    type="text" 
                    className="w-full p-1 border rounded bg-gray-50" 
                    value={row.tariffName}
                    readOnly
                  />
                </td>
                <td className="p-2">
                  <input 
                    type="text" 
                    className="w-24 p-1 border rounded bg-gray-50" 
                    value={`₪${row.tariffAmount}`}
                    readOnly
                  />
                </td>
                <td className="p-2">
                  <button 
                    className="text-red-600 hover:text-red-800"
                    onClick={() => deleteSize(row.id)}
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
