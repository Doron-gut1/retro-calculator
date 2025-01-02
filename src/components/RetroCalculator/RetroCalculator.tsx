import React, { useState, useCallback } from 'react';
import { Search, Calendar, Calculator, Check, AlertCircle } from 'lucide-react';
import { Size, CalculationResultRow } from '../../types';
import { useValidation } from '../../hooks/useValidation';
import { SizesAndTariffs } from '../property/SizesAndTariffs';
import { CalculationResults } from '../results/CalculationResults';
import { Alert, AlertDescription } from '@/components/ui/alert';

type ChargeType = 'ארנונה' | 'מים' | 'ביוב' | 'שמירה';

const DEFAULT_SIZES: Size[] = [
  { id: 1, size: 80, tariffCode: '101', tariffName: 'מגורים רגיל', tariffAmount: '100' },
  { id: 2, size: 20, tariffCode: '102', tariffName: 'מרפסת', tariffAmount: '80' },
  { id: 3, size: 15, tariffCode: '103', tariffName: 'מחסן', tariffAmount: '50' }
];

export const RetroCalculator: React.FC = () => {
  // [Previous state and handlers remain the same...]

  return (
    <div dir="rtl" className="flex flex-col bg-gray-50 min-h-screen text-right">
      <div className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-semibold">חישוב רטרו</h1>
      </div>
      
      <div className="flex flex-col p-4 gap-4">
        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index}>{error.message}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

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
                  <input 
                    type="date" 
                    className="flex-1 p-2 border rounded"
                    value={startDate}
                    min="1900-01-01"
                    max="2100-12-31"
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
                    min="1900-01-01"
                    max="2100-12-31"
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
                className="bg-blue-600 text-white p-3 rounded flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50"
                onClick={handleCalculate}
                disabled={isCalculating}
              >
                <Calculator size={20} />
                {isCalculating ? 'מחשב...' : 'חשב'}
              </button>
              <button 
                className="bg-green-600 text-white p-3 rounded flex items-center justify-center gap-2 hover:bg-green-700 disabled:opacity-50"
                disabled={results.length === 0}
              >
                <Check size={20} />
                אשר
              </button>
            </div>
          </div>

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

          {/* Sizes Table */}
          <SizesAndTariffs 
            sizes={sizes}
            onSizesChange={setSizes}
          />
        </div>

        {/* Results Section */}
        {results.length > 0 && (
          <CalculationResults 
            results={results}
            onClose={() => setResults([])}
          />
        )}
      </div>
    </div>
  );
};
