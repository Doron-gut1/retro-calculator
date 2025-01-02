import React from 'react';
import { useRetroStore } from '@/store';

export const PayerInfo: React.FC = () => {
  const { property } = useRetroStore();

  if (!property) return null;

  return (
    <div className="p-4 border rounded bg-blue-50">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="font-medium">פרטי משלם</h4>
          <button className="text-blue-600 hover:text-blue-800 text-sm">
            החלף משלם
          </button>
        </div>
        <div className="space-y-2">
          <div>
            <label className="block text-sm text-gray-600">מספר משלם</label>
            <input
              type="text"
              className="w-full p-1 border rounded"
              value={property.payerId}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">שם משלם</label>
            <input
              type="text"
              className="w-full p-1 border rounded"
              value={property.payerName}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
};