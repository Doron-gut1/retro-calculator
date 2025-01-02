import { useRetroStore } from '../../store';

interface ChargeType {
  id: string;
  name: string;
}

const chargeTypes: ChargeType[] = [
  { id: '1010', name: 'ארנונה' },
  { id: '1020', name: 'מים' },
  { id: '1030', name: 'ביוב' },
  { id: '1040', name: 'שמירה' },
];

const ChargeTypesSelect = () => {
  const { selectedChargeTypes, setSelectedChargeTypes } = useRetroStore();

  const handleTypeChange = (typeId: string) => {
    if (selectedChargeTypes.includes(typeId)) {
      setSelectedChargeTypes(selectedChargeTypes.filter(id => id !== typeId));
    } else {
      setSelectedChargeTypes([...selectedChargeTypes, typeId]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">סוגי חיוב</label>
      <div className="border rounded p-2 space-y-2">
        {chargeTypes.map((type) => (
          <label key={type.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              className="form-checkbox"
              checked={selectedChargeTypes.includes(type.id)}
              onChange={() => handleTypeChange(type.id)}
            />
            <span>{type.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ChargeTypesSelect;
