import React from 'react';
import { useRetroStore } from '../store';
import { PayerSelector } from './PayerSelector';
import { Home } from 'lucide-react';

export const PayerInfo: React.FC = () => {
  const { property } = useRetroStore();

  if (!property) {
    return null;
  }

  return (
    <div className="space-y-4">      
      {/* פרטי נכס */}
      <div className="overflow-hidden bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="px-6 py-4">
          <div className="flex items-center space-x-2 mb-4">
            <Home className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-800">פרטי נכס</h3>
          </div>
          
          <div className="pt-2">
            <label className="block text-sm font-medium text-gray-600 mb-2">כתובת</label>
            <div className="p-3 bg-gray-50 rounded-md text-gray-700">
              {property.ktovet}
            </div>
          </div>
        </div>
      </div>

      {/* קומפוננטת בחירת משלם */}
      <PayerSelector />
    </div>
  );
};

export default PayerInfo;