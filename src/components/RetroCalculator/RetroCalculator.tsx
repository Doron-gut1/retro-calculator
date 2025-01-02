import React, { useState, useCallback } from 'react';
import { Search, Calendar, Calculator, Check, AlertCircle } from 'lucide-react';
import { Size, ValidationError } from '../../types';
import { useValidation } from '../../hooks/useValidation';
import { SizesAndTariffs } from '../property/SizesAndTariffs';
import { Alert, AlertDescription } from '@/components/ui/alert';

type ChargeType = 'ארנונה' | 'מים' | 'ביוב' | 'שמירה';

export const RetroCalculator: React.FC = () => {
  // State management
  const [propertyCode, setPropertyCode] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedChargeTypes, setSelectedChargeTypes] = useState<ChargeType[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [sizes, setSizes] = useState<Size[]>([]);

  // Validation hook
  const { errors, validateDates, validateSizes, clearErrors } = useValidation();

  // Calculate handler
  const handleCalculate = useCallback(() => {
    clearErrors();
    
    const isValid = validateDates(startDate, endDate) && 
                    validateSizes(sizes) &&
                    selectedChargeTypes.length > 0;

    if (isValid) {
      setShowResults(true);
      // Here will come the actual calculation
    }
  }, [startDate, endDate, sizes, selectedChargeTypes, validateDates, validateSizes, clearErrors]);

  // Handle property search
  const handlePropertySearch = useCallback(() => {
    if (!propertyCode) return;
    // Here will come the actual property search logic
  }, [propertyCode]);

  return (
    <div dir="rtl" className="flex flex-col bg-gray-50 min-h-screen text-right">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-semibold">חישוב רטרו</h1>
      </div>
      
      <div className="flex flex-col p-4 gap-4">
        {/* Error messages */}
        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside">
                {errors.map((error: ValidationError, index) => (
                  <li key={index}>{error.message}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

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
                    value={propertyCode}
                    onChange={(e) => setPropertyCode(e.target.value)}
                  />
                  <button 
                    className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                    onClick={handlePropertySearch}
                  >
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
                  <input 
                    type="date" 
                    className="flex-1 p-2 border rounded"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)} 
                  />
                  <button className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200">
                    <Calendar size={20} />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">תאריך סיום</label>
                <div className="flex gap-2">
                  <input 
                    type="date" 
                    className="flex-1 p-2 border rounded"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
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
                onClick={handleCalculate}
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

          {/* Sizes and Tariffs Table */}
          <SizesAndTariffs 
            sizes={sizes}
            onSizesChange={setSizes}
          />

          {/* Charge Types */}
          <div className="mt-4 space-y-2">
            <label className="block text-sm font-medium">סוגי חיוב</label>
            <div className="border rounded p-2 space-y-2">
              {['ארנונה', 'מים', 'ביוב', 'שמירה'].map((type) => (
                <label key={type} className="flex items-center gap-2">
                  <input 
                    type="checkbox"
                    className="form-checkbox"
                    checked={selectedChargeTypes.includes(type as ChargeType)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedChargeTypes([...selectedChargeTypes, type as ChargeType]);
                      } else {
                        setSelectedChargeTypes(selectedChargeTypes.filter(t => t !== type));
                      }
                    }}
                  />
                  <span>{type}</span>
                </label>
              ))}
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
