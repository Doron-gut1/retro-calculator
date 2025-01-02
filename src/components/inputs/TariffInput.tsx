import React from 'react';
import { TariffSelector } from './TariffSelector/TariffSelector';
import { Tariff } from '../../types';

interface TariffInputProps {
  tariffCode: string;
  tariffName: string;
  tariffAmount: string;
  onTariffSelect: (tariff: Tariff) => void;
  onTariffCodeChange: (code: string) => void;
}

export const TariffInput: React.FC<TariffInputProps> = ({
  tariffCode,
  tariffName,
  tariffAmount,
  onTariffSelect,
  onTariffCodeChange
}) => {
  return (
    <div className="flex gap-2">
      <div className="flex-1">
        <TariffSelector
          currentTariff={{
            kod: tariffCode,
            name: tariffName,
            amount: Number(tariffAmount)
          }}
          onSelect={onTariffSelect}
          onTariffCodeChange={onTariffCodeChange}
        />
      </div>
      <input 
        type="text" 
        className="w-full p-1 border rounded bg-gray-50" 
        value={tariffName}
        readOnly
      />
      <input 
        type="text" 
        className="w-24 p-1 border rounded bg-gray-50" 
        value={`₪${tariffAmount}`}
        readOnly
      />
    </div>
  );
};
