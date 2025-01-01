import React, { useState } from 'react';
import PropertySearch from './components/PropertySearch';
import { Property } from './types/property';

function App() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
  };

  return (
    <div dir="rtl" className="flex flex-col bg-gray-50 min-h-screen text-right">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-semibold">חישוב רטרו</h1>
      </div>
      
      <div className="flex flex-col p-4 gap-4">
        {/* Main Form Section */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-3 gap-6">
            {/* Property Search Column */}
            <div className="space-y-4">
              <PropertySearch onPropertySelect={handlePropertySelect} />
            </div>

            {/* TODO: Add other columns */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;