import type { Tariff } from '../../types';

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

  // Rest of the component...
};

export default SizesAndTariffs;