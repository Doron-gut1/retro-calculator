import React, { useEffect, useState } from 'react';
import { useRetroStore } from '../store';
import type { SingleValue } from 'react-select';
import Select from 'react-select';
import { User, CreditCard } from 'lucide-react';

interface OptionType {
  value: number;
  label: string;
}

export const PayerSelector: React.FC = () => {
  const { 
    availablePayers, 
    fetchPayers, 
    changePayer, 
    property,
    sessionParams,
    isLoading 
  } = useRetroStore();

  const [options, setOptions] = useState<OptionType[]>([]);

  useEffect(() => {
    if (sessionParams.odbcName) {
      fetchPayers();
    }
  }, [sessionParams.odbcName, fetchPayers]);

  useEffect(() => {
    const mappedOptions = availablePayers.map(payer => ({
      value: payer.mspKod,
      label: `${payer.maintz} - ${payer.fullName}`
    }));
    setOptions(mappedOptions);
  }, [availablePayers]);

  const handleChange = (selected: SingleValue<OptionType>) => {
    if (selected) {
      changePayer(selected.value);
    }
  };

  const currentValue = property ? {
    value: property.mspkod,
    label: property.maintz
  } : null;

  if (!property) return null;

  return (
    <div className="overflow-hidden transition-all duration-300 ease-in-out bg-white rounded-lg shadow-md hover:shadow-lg">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium text-gray-800">פרטי משלם</h4>
          <button className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50 transition-colors duration-200">
            החלף משלם
          </button>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <label className="flex items-center mb-2 text-sm font-medium text-gray-600">
              <CreditCard className="w-4 h-4 ml-2" />
              מספר משלם
            </label>
            <div className="relative">
              <Select<OptionType>
                value={currentValue}
                onChange={handleChange}
                options={options}
                isLoading={isLoading}
                placeholder="בחר משלם..."
                className="text-right"
                classNamePrefix="select"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: '0.5rem',
                    border: '1px solid #e2e8f0',
                    '&:hover': {
                      borderColor: '#3b82f6'
                    }
                  }),
                  menu: (base) => ({
                    ...base,
                    borderRadius: '0.5rem',
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0'
                  })
                }}
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center mb-2 text-sm font-medium text-gray-600">
              <User className="w-4 h-4 ml-2" />
              שם משלם
            </label>
            <div className="p-3 text-gray-700 bg-gray-50 rounded-md">
              {property.fullname}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayerSelector;