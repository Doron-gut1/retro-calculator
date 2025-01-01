import React, { useState } from 'react';
import { Search, Calendar, Calculator, Check } from 'lucide-react';

export const RetroCalculator: React.FC = () => {
  const [showResults, setShowResults] = useState(false);

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
            {/* Property Search */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">קוד נכס</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="הזן קוד נכס..."
                  />
                  <button className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200">
                    <Search size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">תאריך התחלה</label>
                <div className="flex gap-2">
                  <input type="date" className="flex-1 p-2 border rounded" />
                  <button className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200">
                    <Calendar size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col justify-end gap-2">
              <button 
                className="bg-blue-600 text-white p-3 rounded flex items-center justify-center gap-2 hover:bg-blue-700"
                onClick={() => setShowResults(true)}
              >
                <Calculator size={20} />
                חשב
              </button>
              <button className="bg-green-600 text-white p-3 rounded flex items-center justify-center gap-2 hover:bg-green-700">
                <Check size={20} />
                אשר
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {showResults && (
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">תוצאות החישוב</h2>
            </div>
            
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 text-right">תקופה</th>
                  <th className="p-2 text-right">סוג חיוב</th>
                  <th className="p-2 text-right">סכום</th>
                  <th className="p-2 text-right">הנחה</th>
                  <th className="p-2 text-right">סה"כ</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[1,2,3].map((row) => (
                  <tr key={row} className="hover:bg-gray-50">
                    <td className="p-2">01/2024</td>
                    <td className="p-2">ארנונה</td>
                    <td className="p-2">₪1,500</td>
                    <td className="p-2 text-red-600">-₪150</td>
                    <td className="p-2 font-medium">₪1,350</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};