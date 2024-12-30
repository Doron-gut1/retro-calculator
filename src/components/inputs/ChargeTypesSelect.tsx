import React from 'react';
import { useCalculationStore } from '../../store';

export const ChargeTypesSelect = () => {
  const { chargeTypes, toggleChargeType } = useCalculationStore();

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">סוגי חיוב</label>
      <div className="border rounded p-2 space-y-2">
        {chargeTypes.map((type) => (
          <label key={type.sugts} className="flex items-center gap-2">
            <input 
              type="checkbox" 
              className="form-checkbox" 
              checked={type.isSelected}
              onChange={() => toggleChargeType(type.sugts)}
            />
            <span>{type.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
