import React from 'react';
import TariffSelector from './TariffSelector/TariffSelector';
import type { Tariff } from '../../types';

interface TariffInputProps {
  value: Tariff | null;
  onChange: (tariff: Tariff) => void;
}

const TariffInput: React.FC<TariffInputProps> = ({ value, onChange }) => {
  return (
    <div className="flex gap-2">
      <input 
        type="text" 
        className="w-20 p-1 border rounded" 
        value={value?.code || ''}
        readOnly
      />
      <TariffSelector onSelect={onChange} />
    </div>
  );
};

export default TariffInput;