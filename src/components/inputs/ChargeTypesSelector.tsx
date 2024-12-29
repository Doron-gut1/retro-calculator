import React from 'react';

const ChargeTypesSelector: React.FC = () => {
  const chargeTypes = [
    { id: 1010, name: 'ארנונה' },
    { id: 2010, name: 'מים' },
    { id: 3010, name: 'ביוב' },
    { id: 4010, name: 'שמירה' }
  ];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">סוגי חיוב</label>
      <div className="border rounded p-2 space-y-2">
        {chargeTypes.map((type) => (
          <label key={type.id} className="flex items-center gap-2">
            <input type="checkbox" className="form-checkbox" />
            <span>{type.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ChargeTypesSelector;
