import React, { useEffect } from 'react';
import { useCalculationStore } from '../stores/calculationStore';
import { OdbcService } from '../services/odbcService';

export const ChargeTypesSelect: React.FC = () => {
  const { chargeTypes, setChargeTypes, toggleChargeType } = useCalculationStore();

  useEffect(() => {
    const loadChargeTypes = async () => {
      const odbcService = new OdbcService();
      try {
        await odbcService.connect(process.env.REACT_APP_ODBC_CONNECTION_STRING || '');
        const types = await odbcService.getAvailableChargeTypes();
        setChargeTypes(types.map(type => ({ ...type, isSelected: false })));
      } catch (error) {
        console.error('Failed to load charge types:', error);
      } finally {
        await odbcService.disconnect();
      }
    };

    loadChargeTypes();
  }, [setChargeTypes]);

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
