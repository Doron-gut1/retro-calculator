import React from 'react';
import { useRetroStore } from '@/store';
import { useErrorStore } from '@/lib/ErrorManager';

const CHARGE_TYPES = [
  { id: '1010', label: 'ארנונה' },
  { id: '2010', label: 'מים' },
  { id: '3010', label: 'ביוב' },
  { id: '4010', label: 'שמירה' }
];

export const ChargeTypes: React.FC = () => {
  const { selectedChargeTypes, setSelectedChargeTypes } = useRetroStore();
  const { getFieldErrors } = useErrorStore();

  const errors = getFieldErrors('chargeTypes');

  const handleTypeChange = (typeId: string) => {
    const newTypes = selectedChargeTypes.includes(typeId)
      ? selectedChargeTypes.filter(id => id !== typeId)
      : [...selectedChargeTypes, typeId];
    
    setSelectedChargeTypes(newTypes);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">סוגי חיוב</label>
      <div className={`border rounded p-2 space-y-2 ${errors.length > 0 ? 'border-red-500' : ''}`}>
        {CHARGE_TYPES.map((type) => (
          <label key={type.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              className="form-checkbox"
              checked={selectedChargeTypes.includes(type.id)}
              onChange={() => handleTypeChange(type.id)}
            />
            <span>{type.label}</span>
          </label>
        ))}
      </div>
      {errors.length > 0 && (
        <p className="text-sm text-red-500 mt-1">{errors[0].message}</p>
      )}
    </div>
  );
};