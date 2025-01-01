import React from 'react';
import PropertySearch from './components/PropertySearch';
import SizesAndTariffs from './components/SizesAndTariffs';
import { Property } from './types/property';

function App() {
  return (
    <div dir="rtl" className="flex flex-col bg-gray-50 min-h-screen text-right">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-semibold">חישוב רטרו</h1>
      </div>
      
      <div className="flex flex-col p-4 gap-4">
        {/* Main Form Section */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Property Search Column */}
            <div className="space-y-4">
              <PropertySearch onPropertySelect={(property: Property) => console.log(property)} />
            </div>

            {/* Middle Column - Dates & Charge Types */}
            <div className="space-y-4">
              {/* Date Range */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">תאריך התחלה</label>
                  <input type="date" className="w-full p-2 border rounded" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">תאריך סיום</label>
                  <input type="date" className="w-full p-2 border rounded" />
                </div>
              </div>

              {/* Charge Types */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">סוגי חיוב</label>
                <div className="border rounded p-2 space-y-2">
                  {['ארנונה', 'מים', 'ביוב', 'שמירה'].map((type) => (
                    <label key={type} className="flex items-center gap-2">
                      <input type="checkbox" className="form-checkbox" />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col justify-end gap-2">
              <button className="bg-blue-600 text-white p-3 rounded flex items-center justify-center gap-2 hover:bg-blue-700">
                חשב
              </button>
              <button className="bg-green-600 text-white p-3 rounded flex items-center justify-center gap-2 hover:bg-green-700">
                אשר
              </button>
            </div>
          </div>

          {/* Sizes and Tariffs Table */}
          <div className="mt-6">
            <SizesAndTariffs />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;