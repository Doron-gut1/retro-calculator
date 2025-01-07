import React from 'react';

export interface ChargeTypesSelectProps {
  selected: string[];
  onChange: (types: string[]) => void;
}

export const ChargeTypesSelect: React.FC<ChargeTypesSelectProps> = ({ selected, onChange }) => {
  const handleChange = (type: string) => {
    if (selected.includes(type)) {
      onChange(selected.filter(t => t !== type));
    } else {
      onChange([...selected, type]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">סוגי חיוב</label>
      <div className="border rounded p-2 space-y-2">
        {[{id: '1010', name: 'ארנונה'}, 
          {id: '1020', name: 'מים'}, 
          {id: '1030', name: 'ביוב'}, 
          {id: '1040', name: 'שמירה'}].map((type) => (
          <label key={type.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              className="form-checkbox"
              checked={selected.includes(type.id)}
              onChange={() => handleChange(type.id)}
            />
            <span>{type.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
};