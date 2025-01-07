import React from 'react';

interface ChargeType {
  id: number;
  name: string;
}

interface ChargeTypeSelectorProps {
  types: ChargeType[];
  selected: number[];
  onChange: (selected: number[]) => void;
}

export const ChargeTypeSelector: React.FC<ChargeTypeSelectorProps> = ({ types, selected, onChange }) => {
  const handleChange = (typeId: number) => {
    if (selected.includes(typeId)) {
      onChange(selected.filter(id => id !== typeId));
    } else {
      onChange([...selected, typeId]);
    }
  };

  return (
    <div className="border rounded p-2 space-y-2">
      {types.map((type) => (
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
  );
};
