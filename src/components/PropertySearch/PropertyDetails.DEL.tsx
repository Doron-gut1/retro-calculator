/* import React from 'react';
import { Property } from '../../types/property';

interface PropertyDetailsProps {
  property: Property;
  onPayerChange: () => void;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property, onPayerChange }) => {
  return (
    <div className="p-4 border rounded bg-blue-50">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="font-medium">פרטי משלם</h4>
          <button 
            className="text-blue-600 hover:text-blue-800 text-sm"
            onClick={onPayerChange}
          >
            החלף משלם
          </button>
        </div>
        <div className="space-y-2">
          <div>
            <label className="block text-sm text-gray-600">מספר משלם</label>
            <input 
              type="text" 
              className="w-full p-1 border rounded" 
              value={property.maintz} 
              readOnly 
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">שם משלם</label>
            <input 
              type="text" 
              className="w-full p-1 border rounded" 
              value={property.fullname} 
              readOnly 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails; */