import React from 'react';
import type { Tariff } from '../../types';
import SizesTable from './SizesTable';

export interface Size {
  index: number;
  size: number;
  tariff: Tariff;
}

interface SizesAndTariffsProps {
  sizes: Size[];
  onSizeChange: (sizes: Size[]) => void;
}

const SizesAndTariffs: React.FC<SizesAndTariffsProps> = ({ sizes, onSizeChange }) => {
  const handleTariffChange = (index: number, tariff: Tariff) => {
    const newSizes = [...sizes];
    newSizes[index].tariff = {
      code: tariff.code,
      name: tariff.name,
      price: tariff.price
    };
    onSizeChange(newSizes);
  };

  return (
    <div className="space-y-4">
      <SizesTable 
        sizes={sizes}
        onSizeChange={(index, size) => {
          const newSizes = [...sizes];
          newSizes[index].size = size;
          onSizeChange(newSizes);
        }}
        onTariffChange={handleTariffChange}
        onDelete={(index) => {
          const newSizes = sizes.filter((_, i) => i !== index);
          onSizeChange(newSizes);
        }}
        onAdd={() => {
          onSizeChange([
            ...sizes,
            {
              index: sizes.length,
              size: 0,
              tariff: {
                code: '',
                name: '',
                price: 0
              }
            }
          ]);
        }}
      />
    </div>
  );
};

export default SizesAndTariffs;