import React from 'react';
import { useRetroStore } from '../../store/retroStore';

const CHARGE_TYPES = [
  { id: 1010, name: 'ארנונה' },
  { id: 1020, name: 'מים' },
  { id: 1030, name: 'ביוב' },
  { id: 1040, name: 'שמירה' }
];

const ChargeTypesSelector: React.FC = () => {
  const { selectedChargeTypes, setChargeTypes } = useRetroStore();

  const handleChange = (typeId: number) => {
    const newTypes = selectedChargeTypes.includes(typeId)
      ? selectedChargeTypes.filter(id => id !== typeId)
      : [...selectedChargeTypes, typeId];
    
    setChargeTypes(newTypes);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">סוגי חיוב</label>
      <div className="border rounded p-2 space-y-2">
        {CHARGE_TYPES.map((type) => (
          <label key={type.id} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedChargeTypes.includes(type.id)}
              onChange={() => handleChange(type.id)}
              className="form-checkbox"
            />
            <span>{type.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ChargeTypesSelector;