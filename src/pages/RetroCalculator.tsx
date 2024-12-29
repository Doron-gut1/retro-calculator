import React, { useState } from 'react';
import { Search, Calendar, FileText, Calculator, Check, X } from 'lucide-react';

export const RetroCalculator = () => {
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
            {/* Right Column - Property & Payer Info */}
            <div className="space-y-4">
              {/* Property Search */}
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

              {/* Payer Information */}
              <div className="p-4 border rounded bg-blue-50">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">פרטי משלם</h4>
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      החלף משלם
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm text-gray-600">מספר משלם</label>
                      <input type="text" className="w-full p-1 border rounded" value="12345" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">שם משלם</label>
                      <input type="text" className="w-full p-1 border rounded" value="ישראל ישראלי" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Column - Dates & Charge Types */}
            <div className="space-y-4">
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
                <div className="space-y-2">
                  <label className="block text-sm font-medium">תאריך סיום</label>
                  <div className="flex gap-2">
                    <input type="date" className="flex-1 p-2 border rounded" />
                    <button className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200">
                      <Calendar size={20} />
                    </button>
                  </div>
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

          {/* Sizes and Tariffs Table - Full Width */}
          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">גדלים ותעריפים</h3>
              <button className="text-sm text-blue-600 hover:text-blue-800">
                עריכה מרוכזת
              </button>
            </div>
            
            <div className="border rounded">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="p-2 text-right border-b">מס׳</th>
                    <th className="p-2 text-right border-b">גודל</th>
                    <th className="p-2 text-right border-b">קוד תעריף</th>
                    <th className="p-2 text-right border-b">שם תעריף</th>
                    <th className="p-2 text-right border-b">תעריף</th>
                    <th className="p-2 text-right border-b">פעולות</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    { id: 1, size: 80, tariffCode: '101', tariffName: 'מגורים רגיל', tariffAmount: '100' },
                    { id: 2, size: 20, tariffCode: '102', tariffName: 'מרפסת', tariffAmount: '80' },
                    { id: 3, size: 15, tariffCode: '103', tariffName: 'מחסן', tariffAmount: '50' }
                  ].filter(row => row.size > 0).map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="p-2">{row.id}</td>
                      <td className="p-2">
                        <input 
                          type="number" 
                          className="w-20 p-1 border rounded" 
                          value={row.size}
                        />
                      </td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            className="w-20 p-1 border rounded" 
                            value={row.tariffCode}
                            readOnly
                          />
                          <button className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200">
                            בחר
                          </button>
                        </div>
                      </td>
                      <td className="p-2">
                        <input 
                          type="text" 
                          className="w-full p-1 border rounded bg-gray-50" 
                          value={row.tariffName}
                          readOnly
                        />
                      </td>
                      <td className="p-2">
                        <input 
                          type="text" 
                          className="w-24 p-1 border rounded bg-gray-50" 
                          value={`₪${row.tariffAmount}`}
                          readOnly
                        />
                      </td>
                      <td className="p-2">
                        <button className="text-red-600 hover:text-red-800">
                          מחק
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={6} className="p-2">
                      <button className="text-sm text-blue-600 hover:text-blue-800">
                        + הוסף גודל חדש
                      </button>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="text-sm bg-gray-50 p-2 rounded flex justify-between">
              <span>סה"כ שטח:</span>
              <span className="font-medium">115 מ"ר</span>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {showResults && (
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">תוצאות החישוב</h2>
              <div className="flex gap-2">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                  <FileText size={20} />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                  <X size={20} />
                </button>
              </div>
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
              <tfoot className="bg-gray-50 font-medium">
                <tr>
                  <td colSpan={4} className="p-2">סה"כ</td>
                  <td className="p-2">₪4,050</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RetroCalculator;